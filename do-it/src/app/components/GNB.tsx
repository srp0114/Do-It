'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/GNB.module.css';

const GNB: React.FC = () => {
    const router = useRouter();
    
    //로고 클릭 시 '/'으로 이동
    const handleLogoClick = () => {
        router.push('/');
    };

    return (
        <nav className={styles.nav}>
        <div className={styles.logo} onClick={handleLogoClick}/>
        </nav>
    );
};

export default GNB;
