import { combineReducers } from 'redux';
import SessionReducer from './session_reducer';
import CoursesReducer from './courses_reducer';
import ErrorsReducer from './errors_reducer';
import ChartsReducer from './charts_reducer';

const rootReducer = combineReducers({
  courses: CoursesReducer,
  session: SessionReducer,
  errors: ErrorsReducer,
  charts: ChartsReducer
});

export default rootReducer;
