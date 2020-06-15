import React from 'react';
import './App.css';
import TodoListTasks from "./TodoListTasks";
import TodoListFooter from "./TodoListFooter";
import TodoListTitle from "./TodoListTitle";
import AddNewItemForm from "./AddNewItemForm";
import {connect} from "react-redux";
import {addTaskAC, deleteTaskAC, deleteTodolistAC, setTasksAC, updateTaskAC} from "./reducer";
import * as axios from "axios";


class TodoList extends React.Component {

    constructor(props) {
        super(props);
        this.newTasksTitileRef = React.createRef();

    }

    componentDidMount() {
        this.restoreState();
    }

    saveState = () => {
        // переводим объект в строку
        let stateAsString = JSON.stringify(this.state);
        // сохраняем нашу строку в localStorage под ключом "our-state"
        localStorage.setItem("our-state-" + this.props.id, stateAsString);
    }

    restoreState = () => {
        axios.get(`https://social-network.samuraijs.com/api/1.1/todo-lists/${this.props.id}/tasks`,
             {
                withCredentials: true,
                headers: {'API-KEY': 'ac8fccc5-a8c4-4791-806b-499cdf48996a'}
            })
            .then(res => {
                this.props.setTasks(res.data.items, this.props.id)
            });
    };
    _restoreState = () => {
        // объявляем наш стейт стартовый
        let state = this.state;
        // считываем сохранённую ранее строку из localStorage
        let stateAsString = localStorage.getItem("our-state-" + this.props.id);
        // а вдруг ещё не было ни одного сохранения?? тогда будет null.
        // если не null, тогда превращаем строку в объект
        if (stateAsString != null) {
            state = JSON.parse(stateAsString);
        }
        // устанавливаем стейт (либо пустой, либо восстановленный) в стейт
        this.setState(state, () => {
            this.state.tasks.forEach(t => {
                if (t.id >= this.nextTaskId) {
                    this.nextTaskId = t.id + 1;
                }
            })
        });
    }

    nextTaskId = 0;

    state = {
        tasks: [],
        filterValue: "All"
    };

    addTask = (newText) => {
        axios.post(`https://social-network.samuraijs.com/api/1.1/todo-lists/${this.props.id}/tasks`,
            {title: newText},
            {
                withCredentials: true,
                headers: {'API-KEY': 'ac8fccc5-a8c4-4791-806b-499cdf48996a'}
            })
            .then(res => {
                    if(res.data.resultCode === 0){
                        this.props.addTask(res.data.data.item, this.props.id);
                    }
            })
    }

    changeFilter = (newFilterValue) => {
        this.setState({
            filterValue: newFilterValue
        }, () => {
            this.saveState();
        });
    }

    changeTask = (newTask) => {
        axios.put(`https://social-network.samuraijs.com/api/1.1/todo-lists/${this.props.id}/tasks/${newTask.id}`,
            newTask,
            {
                withCredentials: true,
                headers: {'API-KEY': 'ac8fccc5-a8c4-4791-806b-499cdf48996a'}
            })
            .then(res => {
                if(res.data.resultCode === 0){
                    this.props.updateTask(res.data.data.item);
                }
            })
    };

    changeStatus = (newTask, status) => {
        this.changeTask({...newTask,status: status === true ? 2 : 0});
    }

    changeTitle = (newTask, title) => {
        this.changeTask({...newTask,title: title});
    }

    deleteTodolist = () => {
        axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/${this.props.id}`,
            {
                withCredentials: true,
                headers: {'API-KEY': 'ac8fccc5-a8c4-4791-806b-499cdf48996a'}
            })
            .then(res => {
                if (res.data.resultCode === 0) {
                    this.props.deleteTodolist(this.props.id);
                }
            })
    };

    deleteTask = (taskId) => {
        axios.delete(`https://social-network.samuraijs.com/api/1.1//todo-lists/${this.props.id}/tasks/${taskId}`,
            {
                withCredentials: true,
                headers: {'API-KEY': 'ac8fccc5-a8c4-4791-806b-499cdf48996a'}
            })
            .then(res => {
                if (res.data.resultCode === 0) {
                    this.props.deleteTask(taskId, this.props.id);
                }
            })
    };

    render = () => {
        let {tasks = []} = this.props
        return (
            <div className="todoList">
                <div className="todoList-header">
                    <TodoListTitle title={this.props.title} onDelete={this.deleteTodolist}/>
                    <AddNewItemForm addItem={this.addTask}/>

                </div>

                <TodoListTasks changeStatus={this.changeStatus}
                               changeTitle={this.changeTitle}
                               deleteTask={this.deleteTask}
                               tasks={tasks.filter(t => {
                                   if (this.state.filterValue === "All") {
                                       return true;
                                   }
                                   if (this.state.filterValue === "Active") {
                                       return t.isDone === false;
                                   }
                                   if (this.state.filterValue === "Completed") {
                                       return t.isDone === true;
                                   }
                               })}/>
                <TodoListFooter changeFilter={this.changeFilter} filterValue={this.state.filterValue}/>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addTask(newTask, todolistId) {

            //const action = addTaskAC(newTask, todolistId);
            dispatch(addTaskAC(newTask, todolistId));
        },
        updateTask(newTask) {
            const action = updateTaskAC(newTask);
            dispatch(action);
        },
        deleteTodolist: (todolistId) => {
            const action = deleteTodolistAC(todolistId);
            dispatch(action)
        },
        deleteTask: (taskId, todolistId) => {
            const action = deleteTaskAC(todolistId, taskId);
            dispatch(action)
        },
        setTasks:(task, todoId) =>{
            const action = setTasksAC(task, todoId);
            dispatch(action)
        }
    }
}

const ConnectedTodolist = connect(null, mapDispatchToProps)(TodoList);

export default ConnectedTodolist;

