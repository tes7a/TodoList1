import {v1} from "uuid";
import {
    addTodolistAC, changeTodolistEntityStatusAC, changeTodolistFilterAC, changeTodolistTitleAC,
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
        {id: todolistId1, title: "What to learn", filter: 'all', addedDate: '', order: 0, entityStatus: 'succeeded'},
        {id: todolistId2, title: "What to buy", filter: 'all', addedDate: '', order: 0, entityStatus: 'succeeded'}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, removeTodolistAC({todolistId: todolistId1}))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);

})

test('correct todolist should be added', () => {
    const newTodolistTitle = {
        id: 'todolistId2',
        title: 'newTodolistTitle',
        addedDate: '',
        order: 0,
        filter: 'all'
    };

    const endState = todolistsReducer(startState, addTodolistAC({todolist: newTodolistTitle}));

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle.title);
    expect(endState[0].filter).toBe('all');
})

test('correct todolist should change its name', () => {
    const newTodolistTitle = "New Todolist";

    const endState = todolistsReducer(startState, changeTodolistTitleAC({id: todolistId1, title: newTodolistTitle}))

    expect(endState[0].title).toBe(newTodolistTitle);
    expect(endState[1].title).toBe("What to buy");
})

test('correct filter of todolist should be changed', () => {
    const endState = todolistsReducer(startState, changeTodolistFilterAC({id: todolistId1, filter: 'active'}));

    expect(endState[0].filter).toBe('active');
    expect(endState[1].filter).toBe('all');
})

test("todoLists should be set to the state", () => {
    const action = setTodolistsAC({todolists: startState})

    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2)
})

test('correct entityStatus of todolist should be changed', () => {
    const endState = todolistsReducer(startState, changeTodolistEntityStatusAC({
        id: todolistId1,
        entityStatus: 'loading'
    }));

    expect(endState[0].entityStatus).toBe('loading');
    expect(endState[1].entityStatus).toBe('succeeded');
})