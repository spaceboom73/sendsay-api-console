import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Sendsay from 'sendsay-api'

export const Console = () => {
	const isAuthicated = useSelector((state) => state.authicated)
	const history = useHistory()
	const [apiConnection, setConnection] = useState(null)
	const [pageLoaded, updateLoaded] = useState(false)
	const [userData, setUserData] = useState({
		login: '',
		sublogin: '',
	})
	useEffect(() => {
		if (!isAuthicated) history.push('/auth')
	}, [isAuthicated, history])

	useEffect(() => {
		const data = JSON.parse(localStorage.getItem('authData'))
		setConnection(
			new Sendsay({
				auth: {
					...data,
				},
			})
		)
	}, [])
	useEffect(() => {
		apiConnection &&
			apiConnection
				.request({
					action: 'pong',
				})
				.then((res) => {
					const { sublogin } = JSON.parse(localStorage.getItem('authData'))
					updateLoaded(true)
					setUserData({
						login: res.account,
						...(sublogin && { sublogin: res.sublogin }),
					})
				})
	}, [apiConnection])

	return (
		pageLoaded && (
			<div>
				{userData.login}
				{userData.sublogin ? `: ${userData.sublogin}` : ''}
			</div>
		)
	)
}
