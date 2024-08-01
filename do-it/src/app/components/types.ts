export interface TodoItem {
    id: number;
    name: string;
    isCompleted: boolean;
}

export interface TodoInputProps {
    tenantId: string;
    onAddItem: (item: TodoItem) => void;
}

export interface CheckListProps {
    items: TodoItem[];
}
