import React, { useEffect } from 'react'
import styled from 'styled-components'
import Sendsay from 'sendsay-api'
import { useDispatch, useSelector } from 'react-redux'
import Logo from '../../components/Logo'
import LoginForm from '../../components/LoginForm'
import {
	loginDataLoaded,
	loginDataLoading,
	onLoginError,
	changeAuthicatedStatus,
} from '../../redux/actions'
import { useHistory } from 'react-router-dom'

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
	const browserUrl = useHistory()
	const isAuthicated = useSelector((state) => state.authicated)

	const onAuth = ({ login, password, sublogin }) => {
		dispatch(loginDataLoading())
		const sendsayApi = new Sendsay()
		const authData = {
			login,
			...(sublogin && { sublogin }),
			password,
		}
		sendsayApi
			.login(authData)
			.then(() => {
				dispatch(onLoginError(null))
				dispatch(changeAuthicatedStatus(true))
				localStorage.setItem('authData', JSON.stringify(authData))
				browserUrl.push('/console')
			})
			.catch((err) => dispatch(onLoginError(err)))
			.finally(() => dispatch(loginDataLoaded()))
	}

	useEffect(() => {
		if (isAuthicated) browserUrl.push('/console')
	}, [isAuthicated, browserUrl])
	return (
		<AuthContainer>
			<Logo />
			<LoginForm onSubmit={onAuth} />
		</AuthContainer>
	)
}
