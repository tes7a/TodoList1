import {TasksStateType} from '../../App/App';
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistActionType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "../../App/store";
import {AppErrorType, AppSetStatusType, setAppErrorAC, setAppStatusAC} from "../../App/app-reducer";

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)};
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [...state[action.task.todoListId], action.task]};
        case 'UPDATE-TASK':
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.todolistId];
            return copyState;
        }
        case "SET-TODOLIST": {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = [];
            })
            return copyState
        }
        case 'SET-TASKS': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks
            return stateCopy
        }

        default:
            return state;
    }
}

// action
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId, todolistId: todolistId} as const);

export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const);

export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', todolistId, model, taskId} as const);

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const);

// thunk

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId));
            dispatch(setAppStatusAC('succeeded'));
        })
}


export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    todolistsAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            dispatch(removeTaskAC(taskId, todolistId));
            dispatch(setAppStatusAC('succeeded'));
        })
}

export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if(res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item));
                dispatch(setAppStatusAC('succeeded'));
            }else {
                if(res.data.messages.length){
                    dispatch(setAppErrorAC(res.data.messages[0]));
                }else{
                    dispatch(setAppErrorAC("Some error occurred"));
                }
                dispatch(setAppStatusAC('failed'));
            }

        })
}

export const changeTaskStatusTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC('loading'));

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
                dispatch(updateTaskAC(taskId, domainModel, todolistId));
                dispatch(setAppStatusAC('succeeded'));
            })
    }

export const changeTaskTitleTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC('loading'));

        const state = getState();
        const task = state.tasks[todolistId].find(t => t.id === taskId);

        if (!task) {
            throw new Error('Task not found!')
        }

        const apiModel: UpdateTaskModelType = {
            title: task.title,
            status: task.status,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            ...domainModel
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                dispatch(updateTaskAC(taskId, domainModel, todolistId));
                dispatch(setAppStatusAC('succeeded'));
            })
    }

// types
type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistActionType
    | ReturnType<typeof setTasksAC>
    | AppSetStatusType
    | AppErrorType

const initialState: TasksStateType = {}

type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}