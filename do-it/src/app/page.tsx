'use client';

import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useState, useEffect, useCallback } from 'react';
import Input from '@/app/components/Input';
import TodoList from '@/app/components/TodoList';
import { Item } from '@/app/types/types';
import { getItems, updateItem } from '@/app/api/items';
import styles from '@/app/styles/Home.module.css'

const Home: React.FC = () => {
    const [tenantId, setTenantId] = useState<string>('');
    const [localItems, setLocalItems] = useState<Item[]>([]); 

    useEffect(() => {
        const storedTenantId = localStorage.getItem('tenantId');
        if (storedTenantId) {
            setTenantId(storedTenantId);
        } else {
            const newTenantId = 'id-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000);
            localStorage.setItem('tenantId', newTenantId);
            setTenantId(newTenantId);
        }
    }, []);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteQuery<Item[], Error>(
        ['items', tenantId],
        ({ pageParam = 1 }) => getItems({ pageParam, tenantId }),
        {
            enabled: !!tenantId, 
            getNextPageParam: (lastPage, allPages) => {
                return lastPage.length === 12 ? allPages.length + 1 : undefined;
            },
            onSuccess: (data) => {
                setLocalItems(data.pages.flat());
            },
        }
    );

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 100 >=
            document.documentElement.scrollHeight
        ) {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    useEffect(() => {
        const debouncedHandleScroll = debounce(handleScroll, 200);
        window.addEventListener('scroll', debouncedHandleScroll);
        return () => window.removeEventListener('scroll', debouncedHandleScroll);
    }, [handleScroll]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const todoItems = localItems.filter(item => !item.isCompleted);
    const doneItems = localItems.filter(item => item.isCompleted);

    const handleToggle = async (itemId: number) => {
        try {
            const itemToUpdate = localItems.find(item => item.id === itemId);
            if (!itemToUpdate) return;

            if (itemToUpdate.name.trim() === '') {
                throw new Error('Item name cannot be empty');
            }

            const updatedItem = await updateItem(tenantId, itemId.toString(), {
                name: itemToUpdate.name, // name 필드를 함께 전달
                isCompleted: !itemToUpdate.isCompleted
            });

            setLocalItems(prevItems =>
                prevItems.map(item => item.id === itemId ? updatedItem : item)
            );
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleAddItem = (item: Item) => {
        setLocalItems((prevItems) => [...prevItems, item]);
    };

    return (
        <div>
            <Input tenantId={tenantId} onAddItem={handleAddItem} />
            <div className={styles.checklists}>
                <TodoList items={todoItems} isCompleted={false} onToggle={handleToggle} />
                <TodoList items={doneItems} isCompleted={true} onToggle={handleToggle} />
            </div>
            {isFetchingNextPage && <div>Loading more items...</div>}
        </div>
    );
};

function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export default Home;
