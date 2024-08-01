import React, { useState, useRef } from 'react';
import styles from './TodoInput.module.css';
import InputButton from '@/app/components/InputButton';
import { TodoInputProps, TodoItem } from '@/app/components/types';

const TodoInput: React.FC<TodoInputProps> = ({ tenantId, onAddItem }) => {
    const [name, setName] = useState<string>('');
    const [response, setResponse] = useState<TodoItem | null>(null);
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

    // Enter 키 입력 시 기본 동작 방지 및 중복 제출 방지
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 

            if (!enterPressedRef.current) {
                enterPressedRef.current = true; 
                setTimeout(() => {
                    enterPressedRef.current = false;
                }, 500);
            }
        }
    };

    return (
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.inputParent}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="할 일을 입력하세요"
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown} 
                    value={name}
                />
                <div className={styles.inputChild} />
            </div>
            <InputButton onClick={handleSubmit} /> 
            {response && <div>Response: {JSON.stringify(response)}</div>}
        </form>
    );
};

export default TodoInput;
