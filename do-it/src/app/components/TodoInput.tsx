// components/TodoInput.tsx
import React, { useState } from 'react';
import styles from './TodoInput.module.css';
import InputButton from '@/app/components/InputButton';

const TodoInput = () => {
    return (
        <form className = {styles.form}>
            <div className = {styles.inputParent}>
                <input className ={styles.input} placeholder="할 일을 입력하세요"/>
                <div className = {styles.inputChild}/>
            </div>
            <InputButton/>
        </form>
    )
}

export default TodoInput;
