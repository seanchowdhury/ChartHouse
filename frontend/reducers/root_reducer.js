import { combineReducers } from 'redux';
import SessionReducer from './session_reducer';
import CoursesReducer from './courses_reducer';

const rootReducer = combineReducers({
  courses: CoursesReducer,
  session: SessionReducer
});

export default rootReducer;
