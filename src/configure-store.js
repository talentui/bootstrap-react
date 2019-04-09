import { createStore, applyMiddleware } from 'redux';
import composeReducer from './compose-reducers';

const configureStore = config => {
  let {
    middlewares = [],
    initialState = {},
    afterCreateStore,
    reducer
  } = config;

  let store = createStore(
    composeReducer(reducer),
    initialState,
    applyMiddleware(...middlewares)
  );
  afterCreateStore && afterCreateStore(store);
  return store;
};

export default configureStore;
