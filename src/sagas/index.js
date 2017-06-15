import { put, call, takeEvery, select } from 'redux-saga/effects';
import { ADD_TODO,
         DELETE_TODO,
         EDIT_TODO,
         COMPLETE_TODO,
         GET_TODOS
        } from '../constants/ActionTypes';
import { addTodoDone,
         deleteTodoDone,
         updateTodoDone,
         getTodosDone } from '../actions';
var fetch = require('isomorphic-fetch');

let config = null;
let todosUrl = null;

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw Error(response.statusText);
}

function filterById(todos, id) {
  return todos.filter(todo => todo.id === id)[0];
}

export function getConfig() {
  try {
    if (config) {
      todosUrl = config.apiUrl;
      return config;
    }
    const location =
      window.location.protocol + '//' + window.location.host + '/';
    return fetch(location + 'appconfig.json')
    .then((res) => res.json())
    .then((data) => {
      todosUrl = data.apiUrl;
      return data;
    });
  } catch (err) {
    console.log(err);
  }
}

function getApi(url) {
  return fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

function postApi(url, body) {
  return fetch(url, {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)});
}

function putApi(url, body) {
  return fetch(url, {
    method: 'PUT', 
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)});
}

function deleteApi(url) {
  return fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

export function addTodoApi(todo) {
  console.log(JSON.stringify(todo));
  return postApi(todosUrl + '/todos', todo)
         .then(checkStatus)
         .then(parseJSON)
         .then(function _success(parsedData) {
           return parsedData;
         }).catch(function _fail(err) {
           console.log('Failed to add todo - ', err);
           throw Error(err)
         });
}

export function updateTodoApi(todo) {
  return putApi(todosUrl + '/todos/' + todo.id.toString(), todo)
         .then(checkStatus)
         .then(parseJSON)
         .then(function _success(parsedData) {
           return parsedData;
         }).catch(function _fail(err) {
           console.log('Failed to update todo - ', err);
           throw Error(err)
         });
}

function getTodosApi() {
  return getApi(todosUrl + '/todos')
         .then(checkStatus)
         .then(parseJSON)
         .then(function _success(parsedData) {
           return parsedData.data ? parsedData.data : [];
         }).catch(function _fail(err) {
           console.log('Failed to get todos - ', err);
           throw Error(err)
         });
}

function deleteTodoApi(id) {
    return deleteApi(todosUrl + '/todos/' + id.toString())
           .then(checkStatus)
           .then(parseJSON)
           .then(function _success(parsedData) {
             return parsedData;
           }).catch(function _fail(err) {
             console.log('Failed to delete todo - ', err);
             throw Error(err)
           });
}

// worker Saga: will be fired on ADD_TODO action
export function* addTodo(action) {
  try {
    config = yield call(getConfig);
    const todo = {completed: false, text: action.text};
    const response = yield call(addTodoApi, todo);
    yield put(addTodoDone(response));
  } catch (err) {
    console.log(err);
  }
}

// worker Saga: will be fired on EDIT_TODO action
export function* editTodo(action) {
  try {
    config = yield call(getConfig);
    const {todos} = yield select(); // Get state
    console.log(todos);
    const todo = filterById(todos, action.id);
    const response = yield call(
        updateTodoApi, {...todo, text: action.text });
    yield put(updateTodoDone(response));
  } catch (err) {
    console.log(err);
  }
}

// worker Saga: will be fired on EDIT_TODO action
export function* completeTodo(action) {
  try {
    config = yield call(getConfig);
    const {todos} = yield select(); // Get state
    console.log(todos);
    const todo = filterById(todos, action.id);
    const response = yield call(
        updateTodoApi, {...todo, completed: !todo.completed});
    yield put(updateTodoDone(response));
  } catch (err) {
    console.log(err);
  }
}

// worker Saga : will be fired on DELETE_PROJECT action
function* deleteTodo(action) {
  try {
    config = yield call(getConfig);
    const response = yield call(deleteTodoApi, action.id);
    yield put(deleteTodoDone(response));
  } catch (err) {
    console.log(err);
  }
}

function* getTodos(action) {
  try {
    config = yield call(getConfig);
    const todos = yield call(getTodosApi);
    yield put(getTodosDone(todos));
  } catch (err) {
    console.log('Could not get todos - ' + err);
  }
}

// watcher Saga: spawn a new addTodo task on each ADD_TODO
export function* watchAddTodo() {
  yield takeEvery(ADD_TODO, addTodo);
}

// watcher Saga: spawn a new editTodo task on each EDIT_TODO
export function* watchEditTodo()  {
  yield takeEvery(EDIT_TODO, editTodo);
}

// watcher Saga: spawn a new completeTodo task on each COMPLETE_TODO
export function* watchCompleteTodo()  {
  yield takeEvery(COMPLETE_TODO, completeTodo);
}

// watcher Saga: spawn a new getTodos task on each GET_TODOS
export function* watchGetTodos()  {
  yield takeEvery(GET_TODOS, getTodos);
}

// watcher Saga: spawn a new deleteTodo task on each DELETE_TODO
export function* watchDeleteTodo()  {
  yield takeEvery(DELETE_TODO, deleteTodo);
}

function* todosSaga() {
  yield [
    watchAddTodo(),
    watchEditTodo(),
    watchCompleteTodo(),
    watchGetTodos(),
    watchDeleteTodo()
  ];
}

export default todosSaga;
