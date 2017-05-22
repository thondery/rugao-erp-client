import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'

const middlewares = [thunkMiddleware]

if (__DEV__) {
  const createLogger = require('redux-logger')
  middlewares.push(createLogger())
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore)

export default function configureStore(preloadedState) {
  const store = createStoreWithMiddleware(rootReducer, preloadedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
  return store
}