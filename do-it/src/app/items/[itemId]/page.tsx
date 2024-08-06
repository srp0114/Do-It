'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Item } from '@/app/types/types';
import { getDetailItem, updateItem, deleteItem } from '@/app/api/items';
import Img from '@/app/components/Img';
import Memo from '@/app/components/Memo';
import Button from '@/app/components/Button';
import styles from '@/app/styles/Item.module.css'


interface DetailProps {
  params: { itemId: string };
}

const Detail: React.FC<DetailProps> = ({ params }) => {
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasChanged, setHasChanged] = useState<boolean>(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement | null>(null);

    // 로컬스토리지에서 tenantId 가져오기
    useEffect(() => {
      const storedTenantId = localStorage.getItem('tenantId');
      setTenantId(storedTenantId);
    }, []);

    // 상세 항목 가져오기
    useEffect(() => {
      const fetchItemData = async () => {
        if (!tenantId) return;
        try {
            setLoading(true);
            const data = await getDetailItem(tenantId, params.itemId);
            if (data) {
                setItem(data);
            } 
        } catch (error) {
            alert('Error fetching item');
            router.push('/');
        } finally {
            setLoading(false);
        }
      };

      fetchItemData();
    }, [params.itemId, router, tenantId]);

    // input name 입력 시, input 너비 자동 조정
    useEffect(() => {
        const input = inputRef.current;
        if (input) {
            const span = document.createElement('span');
            span.style.fontSize = getComputedStyle(input).fontSize;
            span.style.fontFamily = getComputedStyle(input).fontFamily;
            span.style.visibility = 'hidden';
            span.style.whiteSpace = 'nowrap';
            span.innerText = item?.name || '  ';
            document.body.appendChild(span);
            input.style.width = `${span.offsetWidth + 2}px`; 
            document.body.removeChild(span);
        }
    }, [item?.name]);

    // item 상태 변경 함수
    const updateItemState = (updates: Partial<Item>) => {
        if (item) {
            setItem(prevItem => ({
                ...prevItem!,
                ...updates
            }));
            setHasChanged(true);
        }
    };

    // 이름 변경 핸들러
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        updateItemState({ name: newName });
    };

    // 완료여부 변경 핸들러
    const handleToggle = async () => {
        if (item) {
          const updatedItem = {
              ...item,
              isCompleted: !item.isCompleted
          };
          updateItemState(updatedItem);
        }
    };

    // 메모 변경 핸들러
    const handleMemoChange = (newMemo: string) => {
        updateItemState({ memo: newMemo });
    };

    // 이미지 변경 핸들러
    const handleImageUrlChange = (url: string) => {
        updateItemState({ imageUrl: url });
    };
    
    // 수정 버튼 클릭 핸들러
    const handleEdit = async () => {
        if (item && tenantId) {
            try {
                const body: Partial<Item> = {
                    name: item.name,
                    isCompleted: item.isCompleted,
                    memo: item.memo ?? null, 
                    imageUrl: item.imageUrl ?? null,
                };
                const updatedItem = await updateItem(tenantId, params.itemId, body);
                setItem(updatedItem);
                router.push('/');  
            } catch (error) {
                alert('할 일을 입력해주세요.');
            }
        }
    };

    // 삭제 버튼 클릭 핸들러
    const handleDelete = async () => {
        if (item && tenantId) {
            try {
                await deleteItem(tenantId, params.itemId);
                router.push('/');
            } catch (error) {
                alert('Failed to delete item. Please try again.');
            }
        }
    }
  
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!item) {
        return <div>No item found.</div>;
    }

    return (
        <div className={styles.parentContainer}>
            <div key={item.id} className={`${styles.detailContainer} ${item.isCompleted ? styles.completed : styles.notDone}`}>
                <Image width={32} height={32} src={`/ic/${item.isCompleted ? 'checkedBox' : 'checkBox'}.svg`} 
                    alt={item.isCompleted ? "Checked" : "Check"}  className={styles.icon} onClick={handleToggle}/>
                <input type="text" value={item.name} onChange={handleNameChange} ref={inputRef}
                    className={`${styles.name} ${item.isCompleted ? styles.completed : ""}`}/>
            </div>
            <div className={styles.container}>
                <Img imageUrl={item.imageUrl} tenantId={tenantId!} onImageUrlChange={handleImageUrlChange}/>
                <Memo initialMemo={item.memo} onMemoChange={handleMemoChange} />
            </div>
            <div className={styles.buttonContainer}>
                <Button onClick={handleEdit} text="수정 완료" 
                    Icon={<Image src="/ic/check.svg" alt="edit" width={24} height={24} />} 
                    variant={hasChanged ? 'editActive' : 'edit'}/>
                <Button onClick={handleDelete} text="삭제하기" 
                    Icon={<Image src="/ic/X.svg" alt="delete" width={24} height={24} />} 
                    variant={'delete'}/>
            </div>
        </div>
    );
};

export default Detail;
