import {setTodolistsAC} from "./todolists-reducer";
import {setTasksAC, tasksReducer} from "./tasks-reducer";

test('empty arrays should ne added when we set todolists', () => {
    const action = setTodolistsAC([
        {id: "1", title: 'title 1', order: 0, addedDate: ''},
        {id: "2", title: 'title 2', order: 0, addedDate: ''}
    ])

    const endState = tasksReducer({}, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['1']).toStrictEqual([])
    expect(endState['2']).toStrictEqual([])
})

test('tasks should be added for todolist', () => {
    const action = setTasksAC(startState["todolistId1"], "todolistId1")

    const endState = tasksReducer({
        "todolistId2" : [],
        "todolistId1" : [],
    }, action)



    expect(endState["todolistId1"].length).toBe(3)
    expect(endState["todolistId2"].length).toBe(0)
})