import { LOADED, LOADING, LOGIN_ERROR, IS_AUTHICATED } from './types'

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
export function changeAuthicatedStatus(payload) {
	return {
		type: IS_AUTHICATED,
		payload,
	}
}
