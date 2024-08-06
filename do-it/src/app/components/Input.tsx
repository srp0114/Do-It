import React, { useState, useRef } from 'react';
import Image from 'next/image';
import styles from '@/app/styles/Input.module.css'
import Button from '@/app/components/Button';
import { TodoInputProps, TodoItem } from '@/app/types/types';
import PlusIcon from './PlusIcon';

const Input: React.FC<TodoInputProps> = ({ tenantId, onAddItem }) => {
    const [name, setName] = useState<string>('');
    const [response, setResponse] = useState<TodoItem | null>(null);
    const [isComposing, setIsComposing] = useState<boolean>(false);
    const enterPressedRef = useRef<boolean>(false);

    const handleSubmit = async () => {
        if (!name.trim()) return;

        try {
            const url = `https://assignment-todolist-api.vercel.app/api/${tenantId}/items`;

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }

            const data = await res.json();
            setResponse(data);
            setName('');
            onAddItem(data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isComposing) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className={styles.inputParent}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="할 일을 입력하세요"
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    value={name}
                />
                <div className={styles.inputChild} />
            </div>
            <Button
                onClick={handleSubmit}
                text="추가하기"
                Icon={name.trim() ? <Image src="/ic/plus.svg" alt="plus" width={16} height={16} /> : <PlusIcon />}
                variant={name.trim() ? 'addActive' : 'add'}
            />
        </form>
    );
};

export default Input;
