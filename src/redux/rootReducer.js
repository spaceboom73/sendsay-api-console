import { LOADED, LOADING, LOGIN_ERROR, IS_AUTHICATED } from './types'
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

export const authicatedReducer = (state = false, action) => {
	if (action.type === IS_AUTHICATED) {
		return action.payload
	}
	return state
}

export const rootReducer = combineReducers({
	loginButton: loginButtonLoadingReducer,
	loginError: loginErrorReducer,
	authicated: authicatedReducer,
})
