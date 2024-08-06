import React, { useState, useRef } from 'react';
import Image from 'next/image';
import styles from '@/app/styles/Input.module.css'
import Button from '@/app/components/Button';
import { Item } from '@/app/types/types';
import PlusIcon from '@/app/components/PlusIcon';
import { createItem } from '@/app/api/items';

interface TodoInputProps {
    tenantId: string;
    onAddItem: (item: Item) => void;
}

const Input: React.FC<TodoInputProps> = ({ tenantId, onAddItem }) => {
    const [name, setName] = useState<string>('');
    const [response, setResponse] = useState<Item | null>(null);
    const [isComposing, setIsComposing] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (!name.trim() || !tenantId) return; 

        try {
            const newItem = await createItem(tenantId, name);
            setResponse(newItem);
            setName('');
            onAddItem(newItem);
        } catch (error) {
            alert('Failed to create item. Please try again.');
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
