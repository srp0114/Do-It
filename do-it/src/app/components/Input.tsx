import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Item } from '@/app/types/types';
import { createItem } from '@/app/api/items';
import Button from '@/app/components/Button';
import PlusIcon from '@/app/components/PlusIcon';
import styles from '@/app/styles/Input.module.css';

interface TodoInputProps {
    tenantId: string;
    onAddItem: (item: Item) => void;
}

// Input 컴포넌트
const Input: React.FC<TodoInputProps> = ({ tenantId, onAddItem }) => {
    const [name, setName] = useState<string>(''); // input 필드값
    const [response, setResponse] = useState<Item | null>(null);
    const [isComposing, setIsComposing] = useState<boolean>(false); // 엔터 관리를 위해 현재 입력 여부 판단

    // 아이템 추가 핸들러
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

    // 키보드 입력시 호출되는 함수
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Enter 키가 눌리고, 현재 입력 중이지 않을 때 아이템 추가
        if (e.key === 'Enter' && !isComposing) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className={styles.inputParent}>
                <input type="text" value={name} className={styles.input} placeholder="할 일을 입력하세요"
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={() => setIsComposing(true)} // 입력 시작 시 상태 업데이트
                    onCompositionEnd={() => setIsComposing(false)} // 입력 끝난 경우 상태 업데이트   
                />
                <div className={styles.inputChild} />
            </div>
            <Button onClick={handleSubmit} text="추가하기"
                Icon={name.trim() ? <Image src="/ic/plus.svg" alt="plus" width={16} height={16} /> : <PlusIcon />}
                variant={name.trim() ? 'addActive' : 'add'}
            />
        </form>
    );
};

export default Input;
