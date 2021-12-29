import { tasksReducer } from '../Features/Todolists/tasks-reducer';
import { todolistsReducer } from '../Features/Todolists/todolists-reducer';
import {applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import {appReducer} from "./app-reducer";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;
