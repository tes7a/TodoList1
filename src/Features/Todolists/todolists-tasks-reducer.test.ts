import {TasksStateType} from "../../App/App";
import {addTodolistAC, removeTodolistAC, TodolistDomainType, todolistsReducer} from "./todolists-reducer";
import {TodolistType} from "../../api/todolists-api";
import {tasksReducer} from "./tasks-reducer";

test('ids should be equals', () => {
    const startTaskState: TasksStateType = {};
    const startTodolistState: TodolistDomainType[] = [];

    let todolist: TodolistDomainType = {
        title: 'new todolist',
        filter: 'all',
        id: 'any id',
        addedDate: '',
        order: 0,
        entityStatus: 'succeeded',
    }


    const action = addTodolistAC({todolist: todolist});

    const endTasksState = tasksReducer(startTaskState, action);
    const endTodolistState = todolistsReducer(startTodolistState, action);

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolist = endTodolistState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolist).toBe(action.payload.todolist.id);
})

test('property with todolistId should be deleted', () => {
    const TestTodolist = [
        {id: "todolistId1", title: 'What to learn', filter: 'all', addedDate: '', order: 0},
        {id: "todolistId2", title: 'What to buy', filter: 'all', addedDate: '', order: 0},
    ] as TodolistDomainType[]

    const action = removeTodolistAC({todolistId: "todolistId2"});

    const endState = todolistsReducer(TestTodolist, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState[1]).not.toBeDefined();
});