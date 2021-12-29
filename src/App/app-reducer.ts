import {Dispatch} from "redux";
import {todolistsAPI} from "../api/todolists-api";
import {setTodolistsAC} from "../Features/Todolists/todolists-reducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        default:
            return state
    }
}

// action
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const);

// type
export type AppSetStatusType = ReturnType<typeof setAppStatusAC>;
type InitialStateType = typeof initialState
type ActionsType = AppSetStatusType