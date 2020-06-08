import {
	LOADED,
	LOADING,
	LOGIN_ERROR,
	IS_AUTHICATED,
	DD_TOGGLED,
	COPY_ANIMATION,
} from './types'
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

export const dropDownToggleReducer = (state = -1, action) => {
	if (action.type === DD_TOGGLED) {
		return action.payload
	}
	return state
}

export const inCopyAnimationReducer = (state = false, action) => {
	if (action.type === COPY_ANIMATION) {
		return action.payload
	}
	return state
}

export const rootReducer = combineReducers({
	loginButton: loginButtonLoadingReducer,
	loginError: loginErrorReducer,
	authicated: authicatedReducer,
	dropDownToggle: dropDownToggleReducer,
	inCopyAnimation: inCopyAnimationReducer,
})
