import { LOADED, LOADING, LOGIN_ERROR } from './types'

export function loginDataLoaded() {
	return {
		type: LOADED,
	}
}
export function loginDataLoading() {
	return {
		type: LOADING,
	}
}
export function onLoginError(payload) {
	return {
		type: LOGIN_ERROR,
		payload,
	}
}
