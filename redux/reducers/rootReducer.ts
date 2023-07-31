import { combineReducers } from 'redux'
import authReducer from './authReducer';
import countryReducer from './countryReducer';
import toppicMenuReducer from './toppicMenuReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    country: countryReducer,
    toppic_menu: toppicMenuReducer
})

export default rootReducer;