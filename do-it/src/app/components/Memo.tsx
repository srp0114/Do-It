import React, { useState } from 'react';
import styles from '@/app/styles/Memo.module.css'

interface MemoProps {
    initialMemo: string | null;
    onMemoChange: (newMemo: string) => void;
}

const Memo: React.FC<MemoProps> = ({ initialMemo, onMemoChange }) => {
    const [memo, setMemo] = useState<string>(initialMemo || '');

    const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newMemo = e.target.value;
        setMemo(newMemo);
        onMemoChange(newMemo);
    };

    return (
        <div className={styles.memoContainer}>
            <p className={styles.title}>Memo</p>
            <div className={styles.textContainer}>
                <textarea 
                    value={memo}
                    onChange={handleMemoChange}
                    className={styles.text}
                />
            </div>
        </div>
    );
};

export default Memo;
