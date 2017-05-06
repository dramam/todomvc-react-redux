import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './containers/App'
import reducer from './reducers'
import 'todomvc-app-css/index.css'
import createSagaMiddleware from 'redux-saga'
import todosSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(todosSaga)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
