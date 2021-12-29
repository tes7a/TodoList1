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

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status);

    return (
        <div className="App">
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
                <TodolistsList/>
            </Container>
        </div>
    );
}

export default App;
