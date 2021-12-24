import React from 'react'
import './App.css';
import {TaskType} from '../api/todolists-api'
import AppBar from '@mui/material/AppBar/AppBar';
import Toolbar from '@mui/material/Toolbar/Toolbar';
import IconButton from '@mui/material/IconButton/IconButton';
import Typography from '@mui/material/Typography/Typography';
import Button from '@mui/material/Button/Button';
import Container from '@mui/material/Container/Container';
import { Menu } from '@mui/icons-material';
import { TodolistsList } from '../Features/Todolists/TodolistsList';

export type TasksStateType = {
  [key: string]: Array<TaskType>
}

function App() {
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
        </AppBar>
        <Container fixed>
         <TodolistsList/>
        </Container>
      </div>
  );
}



export default App;
