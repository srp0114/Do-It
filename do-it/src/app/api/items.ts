import { Item } from '@/app/types/types';
const API_BASE_URL = 'https://assignment-todolist-api.vercel.app/api';
const PAGE_SIZE = 12;

// 항목 생성
export async function createItem(
  tenantId: string,
  name: string
): Promise<Item> {
  if (!tenantId || !name.trim()) {
    throw new Error('Tenant ID and item name are required');
  }
  try {
    const response = await fetch(`${API_BASE_URL}/${tenantId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to create item');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// 항목 조회
export async function getItems({
  pageParam = 1,
  tenantId,
}: {
  pageParam?: number;
  tenantId: string;
}): Promise<any> {
  if (!tenantId) {
    throw new Error('Tenant ID is missing');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${tenantId}/items?page=${pageParam}&pageSize=${PAGE_SIZE}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error; 
  }
}

// 항목 상세 정보 조회
export async function getDetailItem(tenantId: string, itemId: string): Promise<Item> {
  try {
    const response = await fetch(`${API_BASE_URL}/${tenantId}/items/${itemId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: Item = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// 항목 수정
export async function updateItem(
  tenantId: string,
  itemId: string,
  item: Partial<Item>
): Promise<Item> {
  if (!tenantId || !itemId) {
    throw new Error('Tenant ID and Item ID are required');
  }

 const requestBody: Partial<Item> = {
    ...(item.name !== undefined && item.name !== '' && { name: item.name }),
    ...(item.memo !== undefined && item.memo !== null && { memo: item.memo }),
    ...(item.imageUrl !== undefined && item.imageUrl !== null && { imageUrl: item.imageUrl }),
    ...(item.isCompleted !== undefined && { isCompleted: item.isCompleted }),
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/${tenantId}/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update item: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
}

//항목 삭제
export async function deleteItem(
  tenantId: string,
  itemId: string
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/${tenantId}/items/${itemId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete item');
    }

  } catch (error) {
    throw error;
  }
}

// 이미지 업로드
export async function uploadImage(
  tenantId: string,
  imageFile: File
): Promise<string> {
  if (!tenantId || !imageFile) {
    throw new Error('Tenant ID and image file are required');
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/${tenantId}/images/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    throw error;
  }
}