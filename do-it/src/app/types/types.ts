// 할 일 데이터 타입 정의
export interface Item {
    id: number;
    tenantId: string;
    name: string;
    memo: string | null;
    imageUrl: string | null;
    isCompleted: boolean ;
}

