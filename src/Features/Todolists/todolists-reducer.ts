import {Dispatch} from 'redux';
import {v1} from 'uuid';
import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {fetchTasksTC} from "./tasks-reducer";
import {AppRootStateType} from "../../App/store";
import {AppErrorType, AppSetStatusType, RequestStatusType, setAppErrorAC, setAppStatusAC} from "../../App/app-reducer";

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todolistId)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case "SET-TODOLIST":
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)
        default:
            return state;
    }
}

// action
export const removeTodolistAC = (todolistId: string) =>
    ({type: 'REMOVE-TODOLIST', todolistId} as const);

export const addTodolistAC = (todolist: TodolistType) =>
    ({type: 'ADD-TODOLIST', todolist} as const);

export const changeTodolistTitleAC = (id: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const);

export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', id, filter} as const);

export const setTodolistsAC = (todolists: TodolistType[]) =>
    ({type: 'SET-TODOLIST', todolists} as const);

export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) =>
    ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, entityStatus} as const);

// thunk
export const fetchTodolistsTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    todolistsAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res.data));
            dispatch(setAppStatusAC('succeeded'));
        })
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    todolistsAPI.deleteTodolist(todolistId)
        .then(res => {
            dispatch(removeTodolistAC(todolistId));
            dispatch(setAppStatusAC('succeeded'));
        })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch<ActionsType | AppErrorType>) => {
    dispatch(setAppStatusAC('loading'));
    todolistsAPI.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item));
                dispatch(setAppStatusAC('succeeded'));
            } else {
                if (res.data.messages.length) {
                    dispatch(setAppErrorAC(res.data.messages[0]));
                } else {
                    dispatch(setAppErrorAC("Some error occurred"));
                }
                dispatch(setAppStatusAC('failed'));
            }

        })
}

export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    todolistsAPI.updateTodolist(todolistId, title)
        .then(res => {
            dispatch(changeTodolistTitleAC(todolistId, title));
            dispatch(setAppStatusAC('succeeded'));
        })
}

export const changeTodolistFilterTC = (todolistId: string, filter: FilterValuesType) =>
    (dispatch: Dispatch<ActionsType | AppErrorType>, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC('loading'));
    const state = getState();
    const todolist = state.todolists.find(tl => tl.id === todolistId);
    if (!todolist) {
        throw new Error("todolist not found")
    }

    todolistsAPI.updateTodolist(todolistId, todolist.title)
        .then(res => {
            dispatch(changeTodolistFilterAC(todolistId, filter));
            dispatch(setAppStatusAC('succeeded'));
        })
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistActionType = ReturnType<typeof setTodolistsAC>;

type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistActionType
    | AppSetStatusType
    | ReturnType<typeof changeTodolistEntityStatusAC>

const initialState: Array<TodolistDomainType> = []

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}