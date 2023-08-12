import { combineReducers } from 'redux'
import authReducer from './authReducer';
import countryReducer from './countryReducer';
import toppicMenuReducer from './toppicMenuReducer';
import configsReducer from './configsReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    country: countryReducer,
    toppic_menu: toppicMenuReducer,
    configs: configsReducer
})

export default rootReducer;