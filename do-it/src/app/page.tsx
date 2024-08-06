'use client';

import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useState, useEffect, useCallback } from 'react';
import TodoInput from '@/app/components/TodoInput';
import CheckList from '@/app/components/CheckList';
import { TodoItem } from '@/app/components/types';
import styles from './Home.module.css'; // CSS 모듈 import

const PAGE_SIZE = 12;

const fetchItems = async ({ pageParam = 1, tenantId }: { pageParam?: number; tenantId: string }) => {
    if (!tenantId) {
        throw new Error('Tenant ID is missing');
    }
    const response = await fetch(`https://assignment-todolist-api.vercel.app/api/${tenantId}/items?page=${pageParam}&pageSize=${PAGE_SIZE}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
};

const Home: React.FC = () => {
    const [tenantId, setTenantId] = useState<string>('');
    const [localItems, setLocalItems] = useState<TodoItem[]>([]); 

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

    const queryClient = useQueryClient();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteQuery<TodoItem[], Error>(
        ['items', tenantId],
        ({ pageParam = 1 }) => fetchItems({ pageParam, tenantId }),
        {
            enabled: !!tenantId, // tenantId가 설정된 후에만 쿼리 실행
            getNextPageParam: (lastPage, allPages) => {
                return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
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
                console.log('Fetching next page...');
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
        const itemIndex = localItems.findIndex(item => item.id === itemId);
        const item = localItems[itemIndex];
        if (!item) return;

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
                const updatedItems = [...localItems];
                updatedItems[itemIndex] = updatedItem;
                setLocalItems(updatedItems);
            } else {
                console.error('Failed to update item');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const handleAddItem = (item: TodoItem) => {
        setLocalItems((prevItems) => [...prevItems, item]);
    };

    return (
        <div>
            <TodoInput tenantId={tenantId} onAddItem={handleAddItem} />
            <div className={styles.checklists}>
                <CheckList items={todoItems} isCompleted={false} onToggle={handleToggle} />
                <CheckList items={doneItems} isCompleted={true} onToggle={handleToggle} />
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
