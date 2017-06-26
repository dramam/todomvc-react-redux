import { ADD_TODO_DONE, 
         DELETE_TODO_DONE, 
         UPDATE_TODO_DONE,
         COMPLETE_ALL_DONE, 
         GET_TODOS_DONE,
         CLEAR_COMPLETED } from '../constants/ActionTypes'

const initialState = [];

export default function todos(state = initialState, action) {
  switch (action.type) {

    case GET_TODOS_DONE: 
      return action.todos;
      
    case ADD_TODO_DONE:
      return [action.todo, ...state]

    case DELETE_TODO_DONE:
      return state.filter(todo =>
        todo.id !== action.todo.id
      )

    case UPDATE_TODO_DONE:
      return state.map(todo =>
        todo.id === action.todo.id ? action.todo : todo
      )

    case COMPLETE_ALL_DONE:
      const areAllMarked = state.every(todo => todo.completed)
      return state.map(todo => ({
        ...todo,
        completed: !areAllMarked
      }))

    case CLEAR_COMPLETED:
      return state.filter(todo => todo.completed === false)
  
    default:
      return state
  }
}
