import styles from '@/app/components/InputButton.module.css';
import PlusIcon from '@/app/components/PlusIcon';

interface InputButtonProps {
    onClick: () => void;
}

const TodoInput:React.FC<InputButtonProps> = ({onClick}) => {
    return (
        <button className = {styles.button} type="button" onClick={onClick}>
            <div className ={styles.textParent}>
                <PlusIcon className={styles.icon} />
                <div className ={styles.text}>추가하기</div>
            </div>
        <div className = {styles.buttonChild}/>
        </button>
    );
}

export default TodoInput;