import React from 'react';
import { useRouter } from 'next/navigation';
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
    onToggle: (itemId: number) => void;
}

const CheckList: React.FC<ExtendedCheckListProps> = ({ items, isCompleted, onToggle }) => {
    const router = useRouter();
    const handleClick = (itemId: number) => {
        router.push(`/items/${itemId}`);
    };
    
    // 필터링된 항목 가져오기
    const filteredItems = items.filter(item => item.isCompleted === isCompleted);
    const title = isCompleted ? "done" : "todo";
    const emptyMessage = isCompleted ? "아직 다 한 일이 없어요." : "할 일이 없어요."; 
    const nextMessage = isCompleted ? "해야 할 일을 체크해보세요!" : "TODO를 새롭게 추가해주세요!";
    
    return (
        <div className={styles.container}>
            <Image width={101} height={36} src={`/images/${title}Title.svg`} alt={title} className={styles.title}/>
            <div className={styles.itemsContainer}>
                {filteredItems.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Image 
                            src={`/images/${title}.svg`} 
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
                    filteredItems.map((item, index) => (
                        <div key={index} className={`${styles.itemContainer} ${item.isCompleted ? styles.completed : styles.notDone}`} onClick={() => handleClick(item.id)}>
                            <Image 
                                width={32} 
                                height={32} 
                                src={`/ic/${item.isCompleted ? 'checkedBox' : 'checkBox'}.svg`} 
                                alt={item.isCompleted ? "Checked" : "Check"} 
                                className={styles.icon}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggle(item.id)
                                }}
                            />
                            <div className={`${styles.name} ${item.isCompleted ? styles.completed : ""}`}>{item.name}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CheckList;