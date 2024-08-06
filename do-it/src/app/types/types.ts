export interface Item {
    id: number;
    tenantId: string;
    name: string;
    memo: string | null;
    imageUrl: string | null;
    isCompleted: boolean ;
}

