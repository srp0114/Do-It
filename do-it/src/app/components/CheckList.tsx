import React from 'react';
import Image from "next/image";
import styles from '@/app/components/CheckList.module.css';
import { CheckListProps } from '@/app/components/types';

interface Item {
    id: number;
    name: string;
    isCompleted: boolean;
    tenantId: string;
}

interface ExtendedCheckListProps extends CheckListProps {
    isCompleted: boolean;
    items: Item[];
    onToggleComplete: (itemId: number) => void;
}

const CheckList: React.FC<ExtendedCheckListProps> = ({ items, isCompleted, onToggleComplete }) => {
    // 필터링된 항목 가져오기
    const filteredItems = items.filter(item => item.isCompleted === isCompleted);
    const title = isCompleted ? "done" : "todo";
    const emptyMessage = isCompleted ? "완료된 할 일이 없어요." : "아직 다 한 일이 없어요."; 
    const nextMessage = isCompleted ? "해야 할 일을 체크해보세요!" : "TODO를 새롭게 추가해주세요!";
    
    return (
        <div className={styles.container}>
            <Image width={101} height={36} src={`/images/${title}.svg`} alt={title} className={styles.title}/>
            <div className={styles.itemsContainer}>
                {filteredItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Image 
                            src={`/images/Type=${title}, Size=Large.svg`} 
                            alt="No Items" 
                            width={240} 
                            height={240} 
                            className={styles.emptyImage}
                            priority={true}
                        />
                        <p className={styles.message}>{emptyMessage}</p>
                        <p className={styles.message}>{nextMessage}</p>
                    </div>
                ) : (
                    filteredItems.map((item) => (
                        <div key={item.id} className={styles.itemContainer} onClick={() => onToggleComplete(item.id)}>
                            <Image 
                                width={32} 
                                height={32} 
                                src={`/ic/Property 1=${item.isCompleted ? 'Frame 2610233' : 'Default'}.svg`} 
                                alt={item.isCompleted ? "Checked" : "Check"} 
                                className={`${styles.icon} ${item.isCompleted ? styles.completed : ''}`} 
                            />
                            <div className={styles.name}>{item.name}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CheckList;
