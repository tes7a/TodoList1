import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../App/store";
import {
    FilterValuesType,
    fetchTodolistsTC,
    TodolistDomainType, removeTodolistTC, addTodolistTC, changeTodolistTitleTC, changeTodolistFilterTC
} from "./todolists-reducer";
import React, {useCallback, useEffect} from "react";
import {
    addTaskTC,
    updateTaskAC,
    changeTaskStatusTC,
    changeTaskTitleTC,
    removeTaskTC
} from "./tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import Grid from "@mui/material/Grid/Grid";
import {AddItemForm} from "../../Components/AddItemForm/AddItemForm";
import Paper from "@mui/material/Paper/Paper";
import {Todolist} from "./Todolist/Todolist";
import {TasksStateType} from "../../App/App";

export const TodolistsList = () => {

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTodolistsTC());
    }, [])

    const removeTask = useCallback(function (id: string, todolistId: string) {
        dispatch(removeTaskTC(id, todolistId));
    }, []);

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(addTaskTC(title,todolistId));
    }, []);

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(changeTaskStatusTC(id, {status}, todolistId));
    }, []);

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        dispatch(changeTaskTitleTC(id,{title: newTitle},todolistId));
    }, []);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        dispatch(changeTodolistFilterTC(todolistId, value));
    }, []);

    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodolistTC(id));
    }, []);

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(changeTodolistTitleTC(id, title));
    }, []);

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title));
    }, [dispatch]);

    return(
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map(tl => {
                        let allTodolistTasks = tasks[tl.id];

                        return <Grid item key={tl.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist
                                    id={tl.id}
                                    title={tl.title}
                                    tasks={allTodolistTasks}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    filter={tl.filter}
                                    removeTodolist={removeTodolist}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>
        </>
    )
}