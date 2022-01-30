import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {setIsLoggedInAC,} from "../Features/Login/auth-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized : boolean
}

const initialState: InitialStateType = {
    status: 'loading' as RequestStatusType,
    error: null ,
    isInitialized: false,
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>){
           state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{error: string | null}>){
            state.error = action.payload.error
        },
        setInitializedAC(state, action: PayloadAction<{initialized: boolean}>) {
            state.isInitialized = action.payload.initialized
        }
    }
})

export const appReducer = slice.reducer;

export const {setAppStatusAC,setInitializedAC,setAppErrorAC} = slice.actions;

// thunks
export const setInitializedTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}));
                dispatch(setAppStatusAC({status: 'succeeded'}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
            dispatch(setInitializedAC({initialized: true}));
        })
        .catch((error) => {
            handleServerNetworkError(error.message, dispatch);
        })
}


export type AppErrorType = ReturnType<typeof setAppErrorAC>;
export type AppSetStatusType = ReturnType<typeof setAppStatusAC>;