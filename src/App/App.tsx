import React from 'react'
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
import {LinearProgress} from "@mui/material";
import {useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {RequestStatusType} from "./app-reducer";
import {ErrorSnackbar} from "../Components/ErrorSnackbar/ErrorSnackbar";
import { Login } from '../Features/Login/Login';
import {Navigate, Route, Routes} from 'react-router-dom';

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status);

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
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status === "loading" && <LinearProgress color="secondary"/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path="/" element={<TodolistsList />}/>
                    <Route path="login" element={<Login />}/>
                    <Route path="/404" element={<h1 style={{textAlign: "center" }}>404. Page not found</h1>}/>
                    <Route path="*" element={<Navigate to='/404'/>}/>
                </Routes>
            </Container>
        </div>
    );
}

export default App;
