import {TasksStateType} from '../../App/App';
import {addTodolistAC, AddTodolistActionType, removeTodolistAC, RemoveTodolistActionType, SetTodolistActionType, setTodolistsAC} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, TodolistType, UpdateTaskModelType} from '../../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "../../App/store";
import {AppErrorType, AppSetStatusType, RequestStatusType, setAppErrorAC, setAppStatusAC} from "../../App/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'todolist',
    initialState: initialState,
    reducers:{
        removeTaskAC(state, action: PayloadAction<{taskId: string, todolistId: string}>){
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if(index > -1) {
                tasks.splice(index, 1)
            }
        },
        addTaskAC(state, action: PayloadAction<{task: TaskType}>){
            const todolist = state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTaskAC(state, action: PayloadAction<{taskId: string,
            model: UpdateDomainTaskModelType, todolistId: string}>){
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if(index > -1){
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        setTasksAC(state, action: PayloadAction<{tasks: Array<TaskType>, todolistId: string}>){
            state[action.payload.todolistId] = action.payload.tasks
        },
    },
    extraReducers: (builder) =>{
       builder.addCase(addTodolistAC, (state, action) => {
           state[action.payload.todolist.id] = [];
       });
       builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todolistId]
       });
       builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach(tl => {
                state[tl.id] = []
            })
       });
    }
})

export const tasksReducer = slice.reducer;
export const {removeTaskAC,addTaskAC,updateTaskAC,setTasksAC} = slice.actions;

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC({tasks: res.data.items, todolistId: todolistId}));
            dispatch(setAppStatusAC({status: 'succeeded'}));
        })
        .catch((error) => {
            handleServerNetworkError(error.message, dispatch);
        })
}


export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    todolistsAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC({taskId, todolistId}));
                dispatch(setAppStatusAC({status: 'succeeded'}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error.message, dispatch);
        })
}

export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC({task: res.data.data.item}));
                dispatch(setAppStatusAC({status: 'succeeded'}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error.message, dispatch);
        })
}

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC({status: 'loading'}));

        const state = getState();
        const task = state.tasks[todolistId].find(t => t.id === taskId);

        if (!task) {
            throw new Error('Task not found!');
        }

        const apiModel: UpdateTaskModelType = {
            title: task.title,
            status: task.status,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            ...domainModel,
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC({taskId: taskId, model: domainModel, todolistId: todolistId}));
                    dispatch(setAppStatusAC({status: 'succeeded'}));
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((error) => {
                handleServerNetworkError(error.message, dispatch);
            })
    }

// types
type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}