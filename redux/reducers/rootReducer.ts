import { combineReducers } from 'redux'
import authReducer from './authReducer';
import countryReducer from './countryReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    country: countryReducer
})

export default rootReducer;