import React from 'react';
import styles from '@/app/styles/PlusIcon.module.css';

interface PlusIconProps {
    className?: string; 
}

const PlusIcon: React.FC<PlusIconProps> = ({ className, ...props }) => (
    <svg
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${styles.icon} ${className}`} 
        {...props}
    >
        <path d="M2 8L14 8" className={styles.path} />
        <path d="M8 14L8 2" className={styles.path} />
    </svg>
);

export default PlusIcon;
