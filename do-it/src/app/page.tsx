'use client';
import { useState, useEffect, useCallback } from 'react';
import { useInfiniteQuery } from 'react-query';
import { Item } from '@/app/types/types';
import { getItems, updateItem } from '@/app/api/items';
import Input from '@/app/components/Input';
import TodoList from '@/app/components/TodoList';
import styles from '@/app/styles/Home.module.css';

// 할 일 목록 페이지
const Home: React.FC = () => {
    const [tenantId, setTenantId] = useState<string>('');
    const [localItems, setLocalItems] = useState<Item[]>([]);

    // tenantId localStorage에서 생성/가져오기
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

    // react-query를 사용해 아이템 목록을 가져오기
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
                return lastPage.length > 0 ? allPages.length + 1 : undefined;
            },
            onSuccess: (data) => {
                const newItems = data.pages.flat();
                setLocalItems(prevItems => {
                    const existingIds = new Set(prevItems.map(item => item.id));
                    return [...prevItems, ...newItems.filter(item => !existingIds.has(item.id))];
                });
            },
        }
    );

    // 스크롤 이벤트 핸들러 - 하단에 도달시 다음 페이지 가져오기
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
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    // 할 일 상태 변경 핸들러
    const handleToggle = async (itemId: number) => {
        try {
            const itemToUpdate = localItems.find(item => item.id === itemId);
            if (!itemToUpdate) return;

            if (itemToUpdate.name.trim() === '') {
                throw new Error('Item name cannot be empty');
            }

            const updatedItem = await updateItem(tenantId, itemId.toString(), {
                name: itemToUpdate.name,
                isCompleted: !itemToUpdate.isCompleted
            });

            setLocalItems(prevItems =>
                prevItems.map(item => item.id === itemId ? updatedItem : item)
            );
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    // 할 일 추가 핸들러
    const handleAddItem = (item: Item) => {
        setLocalItems(prevItems => [item, ...prevItems]); // 추가된 아이템 목록의 맨 위에 추가
    };

    const todoItems = localItems.filter(item => !item.isCompleted);
    const doneItems = localItems.filter(item => item.isCompleted);

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

export default Home;
