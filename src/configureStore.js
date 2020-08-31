// configure redux-first routeing
// see:  https://blog.logrocket.com/why-you-dont-need-to-mix-routing-state-with-redux/


// configureStore.js
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { connectRoutes } from 'redux-first-router'
import queryString from 'query-string'

import {routesMap, pageReducer}  from './model/pageReducer'
import modelReducer from './model/reducer'

//import createHistory from 'history/createBrowserHistory'
import createHistory from "rudy-history/createBrowserHistory";


//const history = createHistory()
//const history = createHistory()

// -- serialize state reducer
const reducers =(state, action ) => {
  var out = modelReducer(state, action)
  if (out === state) {
    out = pageReducer(state, action) 
  }

  return out
}


export default function configureStore(preloadedState) {
  const { reducer, middleware, enhancer } = connectRoutes( routesMap,  
    { querySerializer: queryString}//, createHistory}
  )

  const rootReducer = combineReducers({ app:reducers, location: reducer })
  const middlewares = applyMiddleware(middleware)
  const enhancers = compose(enhancer, middlewares)

  const store = createStore(rootReducer, preloadedState, enhancers)

  return store
}

