import { combineReducers } from 'redux';

export default reducer => {
  if (typeof reducer === 'object') {
    return combineReducers(reducer);
  } else if (typeof reducer === 'function') {
    return reducer;
  } else {
    throw '传入的reducer类型不对，它应该属于object或者function中的一种';
  }
};
