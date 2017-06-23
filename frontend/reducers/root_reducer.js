import { combineReducers } from 'redux';
import SessionReducer from './session_reducer';
import CoursesReducer from './courses_reducer';
import ErrorsReducer from './errors_reducer';

const rootReducer = combineReducers({
  courses: CoursesReducer,
  session: SessionReducer,
  errors: ErrorsReducer
});

export default rootReducer;
