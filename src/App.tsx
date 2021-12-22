import React, {useCallback} from 'react'
import './App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from './Component/AddItemForm';
import {
  addTodolistAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  FilterValuesType,
  removeTodolistAC,
  TodolistDomainType
} from './store/todolists-reducer'
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from './store/tasks-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './store/store';
import {TaskStatuses, TaskType} from './api/todolists-api'
import AppBar from '@mui/material/AppBar/AppBar';
import Toolbar from '@mui/material/Toolbar/Toolbar';
import IconButton from '@mui/material/IconButton/IconButton';
import Menu from '@mui/material/Menu/Menu';
import Typography from '@mui/material/Typography/Typography';
import Button from '@mui/material/Button/Button';
import Container from '@mui/material/Container/Container';
import Grid from '@mui/material/Grid/Grid';
import Paper from '@mui/material/Paper/Paper';


export type TasksStateType = {
  [key: string]: Array<TaskType>
}


function App() {

  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  const dispatch = useDispatch();

  const removeTask = useCallback(function (id: string, todolistId: string) {
    const action = removeTaskAC(id, todolistId);
    dispatch(action);
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    const action = addTaskAC(title, todolistId);
    dispatch(action);
  }, []);

  const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
    const action = changeTaskStatusAC(id, status, todolistId);
    dispatch(action);
  }, []);

  const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
    const action = changeTaskTitleAC(id, newTitle, todolistId);
    dispatch(action);
  }, []);

  const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
    const action = changeTodolistFilterAC(todolistId, value);
    dispatch(action);
  }, []);

  const removeTodolist = useCallback(function (id: string) {
    const action = removeTodolistAC(id);
    dispatch(action);
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    const action = changeTodolistTitleAC(id, title);
    dispatch(action);
  }, []);

  const addTodolist = useCallback((title: string) => {
    const action = addTodolistAC(title);
    dispatch(action);
  }, [dispatch]);

  return (
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              {/*<Menu/>*/}
            </IconButton>
            <Typography variant="h6">
              News
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
        <Container fixed>
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
        </Container>
      </div>
  );
}

export default App;
