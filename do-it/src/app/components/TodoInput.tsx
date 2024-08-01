import React, { useState, useEffect } from 'react';
import styles from './TodoInput.module.css';
import InputButton from '@/app/components/InputButton';

const generateUniqueId = () => {
    return 'id-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000);
};

const TodoInput = () => {
    const [name, setName] = useState<string>("");
    const [response, setResponse] = useState<any>(null);
    const [tenantId, setTenantId] = useState<string>(); 

    //tenantId localStorage에 저장해서 기억하기
    useEffect(() => {
        const storedTenantId = localStorage.getItem('tenantId');
        if (storedTenantId) {
            setTenantId(storedTenantId);
        } else {
            const newTenantId = generateUniqueId(); 
            localStorage.setItem('tenantId', newTenantId);
            setTenantId(newTenantId);
        }
    }, [])

    const handleSubmit = async (event?: React.FormEvent) => {
        event?.preventDefault(); // 기본 폼 제출 동작 방지

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
            setName("")
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    }

    return (
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.inputParent}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="할 일을 입력하세요"
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyPress}
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
