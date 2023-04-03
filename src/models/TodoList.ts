
export interface TodoList {
  id: number;
  name?: string;
  description?: string;
  completed?: boolean;
  deadline?: Date;
}

export interface TodoListREST {
  todoList: TodoList;
}
