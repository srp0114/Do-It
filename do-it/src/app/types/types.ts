export interface TodoItem {
    id: number;
    name: string;
    isCompleted: boolean;
    tenantId: string;
}

export interface TodoInputProps {
    tenantId: string;
    onAddItem: (item: TodoItem) => void;
}

export interface CheckListProps {
    items: TodoItem[];
}
