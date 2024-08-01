import React from 'react';
import styles from './Icon.module.css'; // CSS 모듈 파일 경로

// Props 타입 정의
interface PlusIconProps {
    className?: string; // className은 선택적 속성으로 string 타입
}

const PlusIcon: React.FC<PlusIconProps> = ({ className, ...props }) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${styles.icon} ${className}`} // CSS 모듈 클래스와 추가 클래스를 적용
        {...props}
    >
        <path d="M2 8L14 8" className={styles.path} />
        <path d="M8 14L8 2" className={styles.path} />
    </svg>
);

export default PlusIcon;
