import React, { useState, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import styles from '@/app/components/Img.module.css';

interface ItemImage {
    imageUrl: string | null;
    tenantId: string;
    onImageUrlChange: (url: string) => void; 
}

const Img: React.FC<ItemImage> = ({ imageUrl, tenantId, onImageUrlChange }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedImage = e.target.files[0];
            setUploading(true);

            const formData = new FormData();
            formData.append('image', selectedImage);

            try {
                const response = await fetch(`https://assignment-todolist-api.vercel.app/api/${tenantId}/images/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Image upload failed');
                }

                const data = await response.json();
                onImageUrlChange(data.url);
                console.log(data.url)
            } catch (error) {
                console.error('Error uploading image:', error);
            } finally {
                setUploading(false);
            }
        }
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className={`${styles.container} ${imageUrl ? styles.imgContainer : ''}`}>
             {imageUrl ? (
                <Image
                src={imageUrl}
                alt="Uploaded Image"
                fill
                className={styles.image}         
             />
            ) : (
                <Image
                src="/ic/img.svg"
                alt="Placeholder Image"
                width={64}
                height={64}
                />
            )}
            <button className={imageUrl ? styles.editImg : styles.addImg} type="button" onClick={handleButtonClick} disabled={uploading}>
                <Image
                    alt={imageUrl ? 'editImage' : 'addImage'}
                    src={imageUrl ? '/ic/edit.svg' : '/ic/largePlus.svg'}
                    width={24}
                    height={24}
                />
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="fileInput"
            />
        </div>
    );
};

export default Img;
