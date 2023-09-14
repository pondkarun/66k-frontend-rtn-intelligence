import { combineReducers } from 'redux'
import authReducer from './authReducer'
import countryReducer from './countryReducer'
import toppicMenuReducer from './toppicMenuReducer'
import configsReducer from './configsReducer'
import commonReducer from './commonReducer'

const initCombine = {
  auth: authReducer,
  country: countryReducer,
  toppic_menu: toppicMenuReducer,
  configs: configsReducer,
  common: commonReducer
}

const rootReducer = combineReducers(initCombine)

export default rootReducer
export type KeyTypestateRedux = typeof initCombine
