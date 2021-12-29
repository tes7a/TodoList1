export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null//'Error!😠',
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        default:
            return state
    }
}

// action
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const);
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error}as const);

// type
export type AppSetStatusType = ReturnType<typeof setAppStatusAC>;
export type AppErrorType = ReturnType<typeof setAppErrorAC>;
export type InitialStateType = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
}
type ActionsType =
    | AppSetStatusType
    | AppErrorType