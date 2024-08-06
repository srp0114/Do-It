import React from 'react';
import styles from '@/app/styles/Button.module.css';

interface ButtonProps {
    onClick: () => void;
    text: string; 
    Icon: React.ReactNode; 
    variant?: 'edit' | 'add' | 'delete' | 'editActive' | 'addActive'; // 각 버튼의 색상을 적용하기 위해 변수 추가
}

const Button: React.FC<ButtonProps> = ({ onClick, text, Icon, variant='edit' }) => {
    // variant 별로 클래스 이름 생성
    const buttonParentClass =`${styles.button} ${styles[`${variant}Parent`]}`
    const buttonClass = `${styles.text} ${styles[`${variant}Text`]}`;
    const buttonChildClass = `${styles.buttonChild} ${styles[`${variant}Child`]}`

    return (
        <button className={buttonParentClass} type="button" onClick={onClick}>
            <div className={styles.textParent}>
                {Icon}
                <div className={buttonClass}>{text}</div>
            </div>
            <div className={buttonChildClass} />
        </button>
    );
}

export default Button;
