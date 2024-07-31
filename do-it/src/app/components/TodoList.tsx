// components/TodoList.tsx
import React from 'react';
import styles from './TodoList.module.css';

interface TodoListProps {
    todos: string[];
    title: string;
}

const TodoList: React.FC<TodoListProps> = ({ todos, title }) => {
    return (
        <div className={styles.todoList}>
            <h2 className={styles.title}>{title}</h2>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index} className={styles.todoItem}>
                        {todo}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
