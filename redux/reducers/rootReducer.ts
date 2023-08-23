import { combineReducers } from 'redux'
import authReducer from './authReducer'
import countryReducer from './countryReducer'
import toppicMenuReducer from './toppicMenuReducer'
import configsReducer from './configsReducer'

const initCombine = {
  auth: authReducer,
  country: countryReducer,
  toppic_menu: toppicMenuReducer,
  configs: configsReducer,
}

const rootReducer = combineReducers(initCombine)

export default rootReducer
export type KeyTypestateRedux = typeof initCombine
