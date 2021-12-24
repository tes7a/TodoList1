import { v1 } from "uuid";
import {
    addTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC,
    removeTodolistAC,
    setTodolistsAC,
    TodolistDomainType,
    todolistsReducer
} from "./todolists-reducer";

let todolistId1: string
let todolistId2: string
let startState: TodolistDomainType[] = []

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()
    startState = [
        {id: todolistId1, title: "What to learn", filter: 'all', addedDate: '', order: 0},
        {id: todolistId2, title: "What to buy", filter: 'all', addedDate: '', order: 0}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, removeTodolistAC(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);

})

test('correct todolist should be added', () => {
    const newTodolistTitle =  'New Todolist';

    const endState = todolistsReducer(startState, addTodolistAC(newTodolistTitle));

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
    expect(endState[0].filter).toBe('all');
})

test('correct todolist should change its name', () => {
    const newTodolistTitle = "New Todolist";

    const endState = todolistsReducer(startState, changeTodolistTitleAC(todolistId1, newTodolistTitle))

    expect(endState[0].title).toBe(newTodolistTitle);
    expect(endState[1].title).toBe("What to buy");
})

test('correct filter of todolist should be changed', () => {
    const endState = todolistsReducer(startState,changeTodolistFilterAC(todolistId1, 'active'));

    expect(endState[0].filter).toBe('active');
    expect(endState[1].filter).toBe('all');
})

test("todoLists should be set to the state", () => {
    const action = setTodolistsAC(startState)

    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2)
})