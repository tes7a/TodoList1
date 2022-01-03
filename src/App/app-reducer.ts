import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {setIsLoggedInAC, SetIsLoggedInType} from "../Features/Login/auth-reducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null,
    isInitialized: false,
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        case "APP/SET-IS-INITIALIZED":
            return {...state, isInitialized: action.initialized}
        default:
            return state
    }
}

// action
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const);
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error}as const);
export const setInitializedAC = (initialized: boolean) => ({type: 'APP/SET-IS-INITIALIZED', initialized}as const);

// thunk
export const setInitializedTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true));
                dispatch(setAppStatusAC('succeeded'));
            } else {
                handleServerAppError(res.data, dispatch);
            }
            dispatch(setInitializedAC(true));
        })
        .catch((error) => {
            handleServerNetworkError(error.message, dispatch);
        })
}

// type
export type AppSetStatusType = ReturnType<typeof setAppStatusAC>;
export type AppErrorType = ReturnType<typeof setAppErrorAC>;
export type SetIsInitializedType = ReturnType<typeof setInitializedAC>;
export type InitialStateType = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
    isInitialized: boolean,
}
type ActionsType =
    | AppSetStatusType
    | AppErrorType
    | SetIsInitializedType
    | SetIsLoggedInType