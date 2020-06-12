import {
	LOADED,
	LOADING,
	LOGIN_ERROR,
	IS_AUTHICATED,
	DD_TOGGLED,
	COPY_ANIMATION,
} from './types'

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
export function toggleDropDown(payload) {
	return {
		type: DD_TOGGLED,
		payload,
	}
}
export function inAnimation(payload) {
	return {
		type: COPY_ANIMATION,
		payload,
	}
}
