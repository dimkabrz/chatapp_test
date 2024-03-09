import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FilterType, Todo} from "./types.ts";

type InitialState = {
    todos: Todo[],
    filter: FilterType
}

const initialState: InitialState = {
    todos: [],
    filter: null
}

const TodoSlice = createSlice({
    name: 'appSlice',
    initialState,
    reducers: {
        addNewTodo(state, {payload}: PayloadAction<Todo>) {
            state.todos = [...state.todos, payload]
        },
        updateOldTodo(state, {payload}: PayloadAction<Todo>) {
            const index = state.todos.findIndex(el => el.id === payload.id);
            state.todos[index] = payload;
        },
        deleteOneTodo(state, {payload}: PayloadAction<Todo>) {
            state.todos = state.todos.filter(todo => todo.id !== payload.id)
        },
        updateFilter(state, {payload}: PayloadAction<FilterType>) {
            state.filter = payload
        },
        updateTodoList(state, {payload}: PayloadAction<Todo[]>) {
            state.todos = payload
        }
    },
});

export default TodoSlice.reducer;
export const {
    addNewTodo, updateOldTodo, deleteOneTodo, updateFilter, updateTodoList
} = TodoSlice.actions;