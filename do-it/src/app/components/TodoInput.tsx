// components/TodoInput.tsx
import React, { useState } from 'react';
import styles from './TodoInput.module.css';

const TodoInput = () => {
    return (
        <form className = {styles.form}>
            <input className ={styles.input} placeholder="할 일을 입력하세요"/>
            <button className = {styles.button}/>
        </form>
    )
}

export default TodoInput;
