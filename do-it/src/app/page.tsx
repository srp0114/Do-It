'use client';

import React, { useState, useEffect } from 'react';
import TodoInput from '@/app/components/TodoInput';
import CheckList from '@/app/components/CheckList';
import { TodoItem } from '@/app/components/types'; // 인터페이스 임포트
import styles from './Home.module.css'; // CSS 모듈 import

const Home: React.FC = () => {
    const [items, setItems] = useState<TodoItem[]>([]);
    const [tenantId, setTenantId] = useState<string>('');

    const generateUniqueId = () => {
        return 'id-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000);
    };

    const handleAddItem = (item: TodoItem) => {
        setItems((prevItems) => [...prevItems, item]);
    };

    useEffect(() => {
        const storedTenantId = localStorage.getItem('tenantId');
        if (storedTenantId) {
            setTenantId(storedTenantId);
        } else {
            const newTenantId = generateUniqueId();
            localStorage.setItem('tenantId', newTenantId);
            setTenantId(newTenantId);
        }
    }, []);

    useEffect(() => {
        const fetchItems = async () => {
            if (!tenantId) return;

            try {
                const response = await fetch(`https://assignment-todolist-api.vercel.app/api/${tenantId}/items`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: TodoItem[] = await response.json();
                const sortedData = data.sort((a, b) => a.id - b.id);
                setItems(sortedData);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, [tenantId]); 
    
    const handleToggle = async (itemId: number) => {
        const itemIndex = items.findIndex(item => item.id === itemId);
        const item = items[itemIndex];

        try {
            const response = await fetch(`https://assignment-todolist-api.vercel.app/api/${tenantId}/items/${item.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isCompleted: !item.isCompleted }),
            });

            if (response.ok) {
                const updatedItem = await response.json();
                const updatedItems = [...items];
                updatedItems[itemIndex] = updatedItem;
                setItems(updatedItems);
            } else {
                console.error('Failed to update item');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
            <div >
                <TodoInput tenantId={tenantId} onAddItem={handleAddItem} />
                <div className={styles.checklists}>
                    <CheckList items={items} isCompleted={false} onToggle={handleToggle} />
                    <CheckList items={items} isCompleted={true} onToggle={handleToggle}/>
                </div>
            </div>
    );
};

export default Home;
