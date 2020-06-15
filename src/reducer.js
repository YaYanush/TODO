export const ADD_TODOLIST = "TodoList/Reducer/ADD-TODOLIST";
export const DELETE_TODOLIST = "TodoList/Reducer/DELETE-TODOLIST";
export const DELETE_TASK = "TodoList/Reducer/DELETE-TASK";
export const ADD_TASK = "TodoList/Reducer/ADD-TASK";
export const UPDATE_TASK = "TodoList/Reducer/UPDATE-TASK";
export const SET_TODOLIST = "TodoList/Reducer/SET-TODOLIST";
export const SET_TASKS = "SET_TASKS";

const initialState = {
    "todolists": [

    ]
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TODOLIST:
            return {
                ...state,
                todolists: [...state.todolists, action.newTodolist]
            }
        case DELETE_TODOLIST:
            return {
                ...state,
                todolists: state.todolists.filter(tl => tl.id != action.todolistId)
            }
        case DELETE_TASK:
            return {
                ...state,
                todolists: state.todolists.map(tl => {
                    if (tl.id === action.todolistId) {
                        return {
                            ...tl,
                            tasks: tl.tasks.filter(t => t.id != action.taskId)
                        }
                    } else {
                        return tl
                    }
                })
            }
        case ADD_TASK:
            return {
                ...state,
                todolists: state.todolists.map(tl => {
                    if (tl.id === action.todolistId) {
                        return {...tl, tasks: [...tl.tasks, action.newTask]}
                    } else {
                        return tl
                    }
                })
            }
        case UPDATE_TASK:
            return {
                ...state,
                todolists: state.todolists.map(tl => {
                    if (tl.id === action.newTask.todoListId) {
                        return {
                            ...tl,
                            tasks: tl.tasks.map(t => {
                                if (t.id !== action.newTask.id) {
                                    return t;
                                } else {
                                    return action.newTask;
                                }
                            })
                        }
                    } else {
                        return tl
                    }
                })
            }
        case SET_TODOLIST:
            debugger
            return {
                ...state,
                todolists: action.todolist.map(tl => ({...tl, tasks: []}))
            }
        case SET_TASKS:
            debugger
            return {
                ...state,
                todolists: state.todolists.map(tl => {
                    if (tl.id === action.todoId) {
                        return {
                            ...tl,
                            tasks: [...tl.tasks,...action.task]
                        }
                    } else {
                        return tl
                    }
                })
            }

    }
    console.log("reducer: ", action);
    return state;
}

export const updateTaskAC = (newTask) => {
    return { type: UPDATE_TASK,newTask};
}
export const deleteTodolistAC = (todolistId) => {
    return {
        type: DELETE_TODOLIST,
        todolistId: todolistId
    };
}
export const deleteTaskAC = (todolistId, taskId) => {
    return {
        type: DELETE_TASK,
        todolistId,
        taskId
    };
}
export const addTaskAC = (newTask, todolistId) => {
    return { type: ADD_TASK, newTask, todolistId };
}
export const addTodolistAC = (newTodolist) => {
    return {
        type: ADD_TODOLIST,
        newTodolist: newTodolist
    }
}
export const setTodolistAC = (todolist) => {
    return {
        type: SET_TODOLIST,
        todolist: todolist
    }
}
export const setTasksAC = (task, todoId) =>{
    return {
        type: SET_TASKS,
        task: task,
        todoId:todoId
    }
}

export default reducer;
