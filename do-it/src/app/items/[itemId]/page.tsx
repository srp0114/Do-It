'use client';

import React, { useEffect, useState } from 'react';

interface ItemDetailProps {
    params: { itemId: string };
}

interface Item {
    id: number;
    name: string;
    memo: string;
    isCompleted: boolean;
    imageUrl: string;
    tenantId: string;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ params }) => {
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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
                const data: Item = await response.json();
                setItem(data);
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
        <div>
            
        </div>
    );
};

export default ItemDetail;
