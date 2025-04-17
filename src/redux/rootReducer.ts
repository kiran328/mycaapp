import { combineReducers } from '@reduxjs/toolkit';
import appReducer from './actions';
// Import other slice reducers as needed

const rootReducer = combineReducers({
  app: appReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
