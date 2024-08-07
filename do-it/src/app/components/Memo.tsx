import React, { useState } from 'react';
import styles from '@/app/styles/Memo.module.css';

interface MemoProps {
    initialMemo: string | null;
    onMemoChange: (newMemo: string) => void;
}

// 할 일 상세 페이지 메모 컴포넌트
const Memo: React.FC<MemoProps> = ({ initialMemo, onMemoChange }) => {
    const [memo, setMemo] = useState<string>(initialMemo || '');

    // 메모 내용 변경 핸들러
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
