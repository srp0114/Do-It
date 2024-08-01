import React, { useState } from 'react';
import Image from "next/image";
import styles from '@/app/components/CheckList.module.css';
import { CheckListProps } from '@/app/components/types';

const CheckList: React.FC<CheckListProps> = ({ items }) => {
    const [active, setActive] = useState<boolean>(false);

    const handleClick = () => {
        setActive(!active);
    };

    return (
        <div className={styles.container}>
            <Image width={101} height={36} src={"/images/todo.svg"} alt={"ToDo"} className={styles.title}/>
            <div className={styles.itemsContainer}>
                {items.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Image 
                            src="/images/Type=Todo, Size=Large.svg" 
                            alt="No Items" 
                            width={240} 
                            height={240} 
                            className={styles.emptyImage}
                        />
                        <p className={styles.message}>할 일이 없어요.</p>
                        <p className={styles.message}>TODO를 새롭게 추가해주세요!</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className={styles.itemContainer}>
                            <Image width={32} height={32} src={"/ic/Property 1=Default.svg"} alt={"Check"} className={`${styles.icon} ${active ? styles.active : ''}`}/>
                            <div className={styles.name}>{item.name}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CheckList;
