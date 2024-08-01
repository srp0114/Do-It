import styles from '@/app/components/InputButton.module.css';
import PlusIcon from '@/app/components/PlusIcon';

const TodoInput = () => {
    return (
        <button className = {styles.button}>
            <div className ={styles.textParent}>
                <PlusIcon className={styles.icon} />
                <div className ={styles.text}>추가하기</div>
            </div>
        <div className = {styles.buttonChild}/>
        </button>
    );
}

export default TodoInput;