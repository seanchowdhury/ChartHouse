import { combineReducers } from 'redux';
import SessionReducer from './session_reducer';
import CoursesReducer from './courses_reducer';

const rootReducer = combineReducers({
  session: SessionReducer,
  courses: CoursesReducer
});

export default rootReducer;
