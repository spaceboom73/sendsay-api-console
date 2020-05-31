import { LOADED, LOADING, LOGIN_ERROR } from './types'
import { combineReducers } from 'redux'

export const loginButtonLoadingReducer = (state = false, action) => {
	if (action.type === LOADING) {
		return true
	} else if (action.type === LOADED) {
		return false
	}
	return state
}

export const loginErrorReducer = (state = null, action) => {
	if (action.type === LOGIN_ERROR) {
		return action.payload
	}
	return state
}

export const rootReducer = combineReducers({
	loginButton: loginButtonLoadingReducer,
	loginError: loginErrorReducer,
})
