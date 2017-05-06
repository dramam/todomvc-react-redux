import * as types from '../constants/ActionTypes'

export const addTodo = text => ({ type: types.ADD_TODO, text })
export const addTodoDone = text => ({ type: types.ADD_TODO_DONE, todo })
export const deleteTodo = id => ({ type: types.DELETE_TODO, id })
export const deleteTodoDone = id => ({ type: types.DELETE_TODO_DONE, id })
export const editTodo = (id, text) => ({ type: types.EDIT_TODO, id, text })
export const uddateTodoDone = (id, text) => ({ type: types.UPDATE_TODO_DONE, todo })
export const completeTodo = id => ({ type: types.COMPLETE_TODO, id })
export const completeAll = () => ({ type: types.COMPLETE_ALL })
export const clearCompleted = () => ({ type: types.CLEAR_COMPLETED })