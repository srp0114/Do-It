'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/items/[itemId]/ItemDetail.module.css';
import Image from 'next/image';
import Img from '@/app/components/Img';
import Memo from '@/app/components/Memo';
import Button from '@/app/components/Button';
import { useRouter } from 'next/navigation';

interface ItemDetailProps {
  params: { itemId: string };
}

interface Item {
  id: number;
  name: string;
  memo: string | "";
  isCompleted: boolean;
  imageUrl: string | "";
  tenantId: string;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ params }) => {
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasChanged, setHasChanged] = useState<boolean>(false);
    const router = useRouter();

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (item) {
            const newName = e.target.value;
            setItem(prevItem => ({
                ...prevItem!,
                name: newName
            }));
            setHasChanged(true);
        }
    };

    const handleToggle = async () => {
        if (!item) return;

        const updatedItem = {
            ...item,
            isCompleted: !item.isCompleted
        };

        setItem(updatedItem);
        setHasChanged(true);
    }

    const handleMemoChange = (newMemo: string) => {
        if (item) {
            setItem(prevItem => ({
                ...prevItem!,
                memo: newMemo
            }));
            setHasChanged(true);
        }
    };

  const handleImageUrlChange = async (url: string) => {
        if (item) {
            setItem(prevItem => ({
                ...prevItem!,
                imageUrl: url
            }));
            setHasChanged(true);
        }
  }

  const handleEdit = async () => {
    console.log(item)
    if (item && tenantId) {
        try {
            const response = await fetch(`https://assignment-todolist-api.vercel.app/api/${tenantId}/items/${params.itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: item.name,
                    memo: item.memo,
                    isCompleted: item.isCompleted,
                    imageUrl: item.imageUrl,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update item');
            }

            const updatedItem: Item = await response.json();
            setItem(updatedItem);
            router.push('/');  

        } catch (error) {
            console.error('Error updating item:', error);
            alert('Failed to update item. Please try again.');
        }
    }
};

  const handleDelete = async () => {
    if (item && tenantId) {
        try {
            const response = await fetch(`https://assignment-todolist-api.vercel.app/api/${tenantId}/items/${params.itemId}`, {
            method: 'DELETE',
            });

            if (!response.ok) {
            throw new Error('Failed to delete item');
            }
            router.push('/');  

        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item. Please try again.');
        }
    }
  }

  useEffect(() => {
    const storedTenantId = localStorage.getItem('tenantId');
    setTenantId(storedTenantId);
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      if (!tenantId) return;

      try {
        setLoading(true);
        const response = await fetch(`https://assignment-todolist-api.vercel.app/api/${tenantId}/items/${params.itemId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Item | null = await response.json();
        if (data) {
          setItem(data);
        } else {
          console.error('Fetched item is null');
        }
      } catch (error) {
        console.error('Error fetching item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [params.itemId, tenantId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return <div>No item found.</div>;
  }

  return (
    <div className={styles.parentContainer}>
        <div key={item.id} className={`${styles.detailContainer} ${item.isCompleted ? styles.completed : styles.notDone}`}>
        <Image 
          width={32} 
          height={32} 
          src={`/ic/${item.isCompleted ? 'checkedBox' : 'checkBox'}.svg`} 
          alt={item.isCompleted ? "Checked" : "Check"} 
          className={styles.icon}
          onClick={handleToggle}
        />
         <input size={item.name.length *2} type="text" value={item.name} className={`${styles.name} ${item.isCompleted ? styles.completed : ""}`} onChange={handleNameChange}/>
        </div>
        <div className={styles.container}>
        <Img imageUrl={item.imageUrl} tenantId={tenantId!} onImageUrlChange={handleImageUrlChange}/>
        <Memo initialMemo={item.memo} onMemoChange={handleMemoChange} />
        </div>
        <div className={styles.buttonContainer}>
        <Button onClick={handleEdit} text="수정 완료" Icon={<Image src="/ic/check.svg" alt="edit" width={24} height={24} />} variant={hasChanged ? 'editActive' : 'edit'} />
        <Button onClick={handleDelete} text="삭제하기" Icon={<Image src="/ic/X.svg" alt="delete" width={24} height={24} />} variant={'delete'}/>
        </div>
    </div>
  );
};

export default ItemDetail;
