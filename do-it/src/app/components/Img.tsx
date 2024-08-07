import React, { useState, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import styles from '@/app/styles/Img.module.css';
import { uploadImage } from '../api/items';

interface ItemImage {
    imageUrl: string | null;
    tenantId: string;
    onImageUrlChange: (url: string) => void; 
}

// 할 일 상세 페이지 이미지 컴포넌트
const Img: React.FC<ItemImage> = ({ imageUrl, tenantId, onImageUrlChange }) => {
    const [uploading, setUploading] = useState(false); // 이미지 업로드 
    const fileInputRef = useRef<HTMLInputElement | null>(null); // 파일입력 참조

    // 파일 선택된 경우 호출되는 핸들러
    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedImage = e.target.files[0];
            setUploading(true);

            try {
                const imageUrl = await uploadImage(tenantId, selectedImage);
                onImageUrlChange(imageUrl);
            } catch (error) {
                alert('Error uploading image');
            } finally {
                setUploading(false);
            }
        }
    };

    // 이미지 버튼 클릭 시 파일 입력 요소 클릭
    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className={`${styles.container} ${imageUrl ? styles.imgContainer : ''}`}>
            {imageUrl ? (
                <Image src={imageUrl} alt="Uploaded Image" fill className={styles.image} sizes="auto"/>
            ) : (
                <Image src="/ic/img.svg" alt="Placeholder Image" width={64} height={64} />
            )}
            <button className={imageUrl ? styles.editImg : styles.addImg} type="button" onClick={handleButtonClick} disabled={uploading}>
                <Image alt={imageUrl ? 'editImage' : 'addImage'} src={imageUrl ? '/ic/edit.svg' : '/ic/largePlus.svg'} width={24} height={24}/>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className={styles.fileInput} id="fileInput" />
        </div>
    );
};

export default Img;
