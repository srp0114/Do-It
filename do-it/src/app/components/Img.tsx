import Image from "next/image";
import styles from "@/app/components/Img.module.css";

const Img:React.FC = () => {
    return (
        <>
        <div className = {styles.container} >
            <Image alt="icon" src={"/ic/img.svg"} width={64} height={64}/>

            <button className={styles.addBtn} type="button">
                <Image alt="plusImage" src={"/ic/largePlus.svg"} width={24} height={24} />
            </button>
        </div>

        </>
    )
}

export default Img;