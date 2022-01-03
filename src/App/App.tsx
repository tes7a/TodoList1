import React, {useCallback, useEffect} from 'react'
import './App.css';
import {TaskType} from '../api/todolists-api'
import AppBar from '@mui/material/AppBar/AppBar';
import Toolbar from '@mui/material/Toolbar/Toolbar';
import IconButton from '@mui/material/IconButton/IconButton';
import Typography from '@mui/material/Typography/Typography';
import Button from '@mui/material/Button/Button';
import Container from '@mui/material/Container/Container';
import {Menu} from '@mui/icons-material';
import {TodolistsList} from '../Features/Todolists/TodolistsList';
import {CircularProgress, LinearProgress} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {RequestStatusType, setInitializedTC} from "./app-reducer";
import {ErrorSnackbar} from "../Components/ErrorSnackbar/ErrorSnackbar";
import {Login} from '../Features/Login/Login';
import {Navigate, Route, Routes} from 'react-router-dom';
import {logoutTC} from "../Features/Login/auth-reducer";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setInitializedTC());
    }, [])

    const logOut = useCallback(() => {
        dispatch(logoutTC())
    },[]);

    if (!isInitialized) {
        return <div style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress color="secondary"/>
        </div>
    }


    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logOut}
                                           style={{position: 'fixed', left: '90%', fontWeight: 'bold'}}>Log
                        out</Button>}
                </Toolbar>
                {status === "loading" && <LinearProgress color="secondary"/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path="/" element={<TodolistsList/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/404" element={<h1 style={{textAlign: "center"}}>404. Page not found</h1>}/>
                    <Route path="*" element={<Navigate to='/404'/>}/>
                </Routes>
            </Container>
        </div>
    );
}

export default App;
