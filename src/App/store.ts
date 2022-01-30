import { tasksReducer } from '../Features/Todolists/tasks-reducer';
import { todolistsReducer } from '../Features/Todolists/todolists-reducer';
import {applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import {appReducer} from "./app-reducer";
import {authReducer} from "../Features/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

//export const store = createStore(rootReducer, applyMiddleware(thunk));

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
})

export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;
