import React from 'react'
import styled from 'styled-components'
// import Sendsay from 'sendsay-api'
import Logo from '../../components/Logo'
import LoginForm from '../../components/LoginForm'

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
	const onAuth = ({ login, password, sublogin }) => {
		// const sendsayApiConnect = new Sendsay()
		// sendsayApiConnect
		// 	.login({
		// 		login,
		// 		...(sublogin && { sublogin }),
		// 		password,
		// 	})
		// 	.then(() => {
		// 		sendsayApiConnect
		// 			.request({
		// 				action: 'ping',
		// 			})
		// 			.then((response) => console.log(response))
		// 		sendsayApiConnect
		// 			.request({
		// 				action: 'pong',
		// 			})
		// 			.then((response) => console.log(response))
		// 	})
		// sendsayApiConnect
		// 	.request({
		// 		action: 'login',
		// 		login,
		// 		...(sublogin && { sublogin }),
		// 		password,
		// 	})
		// 	.then((data) => console.log(data))
		// .login({
		// 	login,
		// 	...(sublogin && { sublogin }),
		// 	password,
		// })
		// .then(() => {
		// 	console.log('test')
		// const sendsayApi = new Sendsay({
		// 	login,
		// 	...(sublogin && { sublogin }),
		// 	password,
		// })
		// sendsayApi
		// 	.request({ action: 'pong' })
		// 	.then((response) => console.log(response))
		// })
		// sendsayApi
		// 	.login()
		// 	.then((response) => {
		// 		sendsayApi.setSession()
		// 		console.log(sendsayApi.setSessionFromCookie())
		// 		console.log(sendsayApi)
		// 	})
		// 	.catch((err) => {
		// 		console.log('произошла ошибка')
		// 	})
	}

	return (
		<AuthContainer>
			<Logo />
			<LoginForm onSubmit={onAuth} />
		</AuthContainer>
	)
}
