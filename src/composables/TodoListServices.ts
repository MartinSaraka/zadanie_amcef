/* eslint-disable @typescript-eslint/no-explicit-any */
import { TodoList } from 'src/models/TodoList'
import {
  baseUrl as baseUrlCS,
  useCreateData,
  useDeleteData,
  useGetResponseData,
  useUpdateData
} from './CommonServices'

const baseUrl = baseUrlCS + '/tasks'

export function useGetItems () {
  console.log(baseUrl)
  return useGetResponseData(baseUrl, 'todoItems')
}

export function useUpdateCompleteItemById (todoListItem: TodoList) {
  const url = baseUrl + '/' + todoListItem.id
  todoListItem.completed = true
  return useUpdateData(url, todoListItem, 'TodoList', 'todoList')
}
export function useCreateTodoListItem (todoList: TodoList) {
  return useCreateData(baseUrl, todoList, 'Todolist', 'todoList')
}
export function useUpdateActiveItemById (todoListItem: TodoList) {
  const url = baseUrl + '/' + todoListItem.id
  todoListItem.completed = false
  return useUpdateData(url, todoListItem, 'Todolist', 'todoList')
}
export function useDeleteItem (todoListItem: TodoList) {
  const url = baseUrl + '/' + todoListItem.id
  console.log(url)
  return useDeleteData(url, {}, 'Todolist', todoListItem.id)
}
