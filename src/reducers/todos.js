import { ADD_TODO, DELETE_TODO, EDIT_TODO, COMPLETE_TODO, COMPLETE_ALL, CLEAR_COMPLETED } from '../constants/ActionTypes'

const initialState = [
  {
    text: 'Use Redux',
    completed: false,
    id: 0
  }
]

export default function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO_DONE:
      return [action.todo, ...state]

    case DELETE_TODO_DONE:
      return state.filter(todo =>
        todo.id !== action.id
      )

    case UPDATE_TODO_DONE:
      return state.map(todo =>
        todo.id === action.todo.id ?
          { ...todo, action.todo } : todo
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
