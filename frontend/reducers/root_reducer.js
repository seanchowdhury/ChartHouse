import { combineReducers } from 'redux';
import SessionReducer from './session_reducer';

const rootReducer = combineReducers({
  session: SessionReducer
});

export default rootReducer;
