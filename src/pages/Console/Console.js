import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Sendsay from 'sendsay-api'
import styled from 'styled-components'

import Logo from '../../components/Logo'
import TextArea from '../../components/TextArea'
import Button from '../../components/Button'

import { ReactComponent as LogoutIcon } from '../../assets/images/logout.svg'
import { ReactComponent as OpenFullscreenIcon } from '../../assets/images/openfullscreen.svg'
import { ReactComponent as CloseFullscreenIcon } from '../../assets/images/closefullscreen.svg'
import { changeAuthicatedStatus } from '../../redux/actions'

const ConsolePageContainer = styled.div`
	display: flex;
	width: 100vw;
	height: 100vh;
`
const ConsoleContainer = styled.div`
	flex: 1 0 400px;
	min-height: 400px;
`
const HeaderContainer = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 10px 15px;
	background-color: #f6f6f6;
`
const LeftSideContainer = styled.div`
	display: flex;
	span {
		margin-left: 20px;
	}
`
const RightSideContainer = styled.div`
	display: flex;
`
const UserInfoStyled = styled.div`
	display: flex;
	padding: 5px 15px;
	margin-right: 26px;
	border: 1px solid rgba(0, 0, 0, 0.2);
	border-radius: 5px;
`
const StyledLogout = styled(LogoutIcon)`
	${({ margin }) => `margin-${margin}: 8px;`}
`
const StyledButton = styled(Button)`
	${({ marginLeft }) => `margin-left: ${marginLeft}px;`}
`

export const Console = () => {
	const isAuthicated = useSelector((state) => state.authicated)
	const dispatch = useDispatch()
	const history = useHistory()
	const [isFullscreen, setFullscreen] = useState(false)
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

	const logout = () => {
		localStorage.removeItem('authData')
		dispatch(changeAuthicatedStatus(false))
		history.push('/auth')
	}
	const toggleFullScreen = () => {
		var doc = document.documentElement,
			state = document.webkitIsFullScreen || document.isFullScreen,
			requestFunc = doc.requestFullscreen || doc.webkitRequestFullScreen,
			cancelFunc = document.cancelFullScreen || document.webkitCancelFullScreen

		!state ? requestFunc.call(doc) : cancelFunc.call(document)
	}
	const fullScreenChange = () => {
		toggleFullScreen()
		setFullscreen((prevState) => !prevState)
	}

	return (
		pageLoaded && (
			<ConsolePageContainer>
				<ConsoleContainer>
					<HeaderContainer>
						<LeftSideContainer>
							<Logo />
							<TextArea fontSize={20} whiteSpace="nowrap">
								API-консолька
							</TextArea>
						</LeftSideContainer>
						<RightSideContainer>
							<UserInfoStyled>
								<TextArea>{userData.login}</TextArea>
								{userData.sublogin && (
									<React.Fragment>
										<TextArea color="rgba(0, 0, 0, 0.2)">
											&nbsp;:&nbsp;
										</TextArea>
										<TextArea>{userData.sublogin}</TextArea>
									</React.Fragment>
								)}
							</UserInfoStyled>
							<Button
								padding="4px 6px"
								styleType="nonBackground"
								onClick={logout}
							>
								Выйти
								<StyledLogout margin="left" />
							</Button>
							<StyledButton
								marginLeft={20}
								padding="7px"
								styleType="nonBackground"
								onClick={fullScreenChange}
							>
								{isFullscreen ? (
									<CloseFullscreenIcon />
								) : (
									<OpenFullscreenIcon />
								)}
							</StyledButton>
						</RightSideContainer>
					</HeaderContainer>
				</ConsoleContainer>
			</ConsolePageContainer>
		)
	)
}
