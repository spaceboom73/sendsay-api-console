import React from 'react'
import styled from 'styled-components'
import Sendsay from 'sendsay-api'
import { useDispatch } from 'react-redux'
import Logo from '../../components/Logo'
import LoginForm from '../../components/LoginForm'
import {
	loginDataLoaded,
	loginDataLoading,
	onLoginError,
} from '../../redux/actions'

const AuthContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	height: 100vh;
	width: 100vw;
	background-color: #f7f7f7;
`

export const Auth = () => {
	const dispatch = useDispatch()
	const onLogin = () => {
		dispatch(onLoginError(null))
	}
	const onAuth = ({ login, password, sublogin }) => {
		dispatch(loginDataLoading())
		const sendsayApi = new Sendsay()
		sendsayApi
			.login({
				login,
				password,
			})
			.then(() => sendsayApi.request({ action: 'pong' }))
			.then((data) =>
				sublogin
					? sendsayApi.login({
							login,
							password,
							sublogin: data.sublogin,
					  })
					: onLogin()
			)
			.then(() => onLogin())
			.catch((err) => dispatch(onLoginError(err)))
			.finally(() => dispatch(loginDataLoaded()))
	}

	return (
		<AuthContainer>
			<Logo />
			<LoginForm onSubmit={onAuth} />
		</AuthContainer>
	)
}
