export type TodoItem = {
  id: number;
  text: string;
  done: boolean;
};

export interface TodoTable {
  items: TodoItem[];
  filter: string;
  onToggle: (id: number) => void;
  onEdit: (id: number, text: string) => void;
  onDelete: (id: number) => void;
  setFilter: (filter: string) => void;
}

export interface TodoList {
  items: TodoItem[];
  input: string;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: (e: React.ChangeEvent<HTMLFormElement>) => void;
  onToggle: (id: number) => void;
  onEdit: (id: number, text: string) => void;
  onDelete: (id: number) => void;
}
