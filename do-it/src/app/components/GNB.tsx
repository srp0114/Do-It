'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/GNB.module.css'

const GNB: React.FC = () => {
    const router = useRouter();
    const handleLogoClick = () => {
        router.push('/');
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.logo} onClick={handleLogoClick}></div>
        </nav>
    );
};

export default GNB;
