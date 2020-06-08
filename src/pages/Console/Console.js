import React, { useEffect, useState, useRef } from 'react'
import ReactDOMServer from 'react-dom/server'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Sendsay from 'sendsay-api'
import styled from 'styled-components'
import Split from 'react-split'

import Logo from '../../components/Logo'
import TextArea from '../../components/TextArea'
import Button from '../../components/Button'
import HistoryItem from '../../components/HistoryItem'
import useEventListener from '../../hooks/useEventListener'

import { ReactComponent as LogoutIcon } from '../../assets/images/logout.svg'
import { ReactComponent as OpenFullscreenIcon } from '../../assets/images/openfullscreen.svg'
import { ReactComponent as CloseFullscreenIcon } from '../../assets/images/closefullscreen.svg'
import { ReactComponent as DeleteHistoryIcon } from '../../assets/images/deleteHistory.svg'
import { ReactComponent as DragNDropIcon } from '../../assets/images/dragdrop.svg'
import { ReactComponent as FormatIcon } from '../../assets/images/format.svg'
import { changeAuthicatedStatus, toggleDropDown } from '../../redux/actions'
import { ConsoleWindow } from '../../components/ConsoleWindow/ConsoleWindow'

const ConsolePageContainer = styled.div`
	display: flex;
`
const ConsoleContainer = styled.div`
	flex: 1 0 640px;
	min-height: 520px;
`
const HeaderContainer = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 10px 15px;
	background-color: #f6f6f6;
`
const LeftSideContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex: 0 1 271px;
	margin-right: 10px;
`
const RightSideContainer = styled.div`
	display: flex;
`
const UserInfoStyled = styled.div`
	display: flex;
	align-items: center;
	padding: 5px 15px;
	margin-right: 26px;
	border: 1px solid rgba(0, 0, 0, 0.2);
	border-radius: 5px;
`
const HistoryContainer = styled.div`
	display: flex;
	background-color: #f6f6f6;
	border-top: 1px solid rgba(0, 0, 0, 0.2);
	border-bottom: 1px solid rgba(0, 0, 0, 0.2);
	height: 50px;
	max-width: 100vw;
	min-width: 640px;
`
const HistoryList = styled.div`
	flex: 1 1 1374px;
	display: flex;
	padding: 10px 0 10px 15px;
	white-space: nowrap;
	width: 100%;
	overflow-x: ${({ scrollBlock }) => (scrollBlock ? 'hidden' : 'auto')};
	overflow-y: hidden;
	scrollbar-width: none;
	&::-webkit-scrollbar {
		width: 0;
		height: 0;
	}
`
const StyledLogoutIcon = styled(LogoutIcon)`
	margin-left: 8px;
`
const StyledFullscreen = styled(Button)`
	${({ marginLeft }) => `margin-left: ${marginLeft}px;`}
`
const StyledDeleteButton = styled(Button)`
	background-color: #f6f6f6;
	border-radius: 0;
	border: none;
	border-left: 1px solid #c4c4c4;
	&:focus {
		color: #c4c4c4;
		border-color: #c4c4c4;
	}
`
const GradientEffect = styled.div`
	position: relative;
	width: 15px;
	margin-right: -15px;
	height: 48px;
	left: -29px;
	background: linear-gradient(
		269.98deg,
		#f6f6f6 0.06%,
		rgba(246, 246, 246, 0) 99.93%
	);
	pointer-events: none;
`
const StyledSplit = styled(Split)`
	display: flex;
	align-items: center;
	padding: 10px 15px 15px;
	height: calc(100% - 70px);
`
const StyledDragIcon = styled(DragNDropIcon)`
	min-width: 4px;
	margin: 0 3px;
	cursor: pointer;
	&:hover circle {
		fill-opacity: 0.4;
	}
	&:active {
		cursor: col-resize;
	}
`
const FooterContainer = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 15px;
	border-top: 1px solid rgba(0, 0, 0, 0.2);
`
const StyledFormatIcon = styled(FormatIcon)`
	margin-right: 8px;
`

const historyItems = [
	{
		success: true,
		query: 'pong',
	},
	{
		success: false,
		query: 'pong',
	},
	{
		success: true,
		query: 'pong',
	},
	{
		success: true,
		query: 'pong',
	},
	{
		success: false,
		query: 'pong',
	},
	{
		success: true,
		query: 'pong',
	},
	{
		success: true,
		query: 'pong',
	},
	{
		success: false,
		query: 'pong',
	},
	{
		success: true,
		query: 'pong',
	},
	{
		success: true,
		query: 'pong',
	},
	{
		success: false,
		query: 'pong',
	},
	{
		success: true,
		query: 'pong',
	},
	{
		success: true,
		query: 'pong',
	},
	{
		success: false,
		query: 'pong',
	},
	{
		success: true,
		query: 'pong',
	},
	{
		success: true,
		query: 'pong',
	},
	{
		success: false,
		query: 'pong',
	},
]

let isDispatching = false
export const Console = () => {
	const isAuthicated = useSelector((state) => state.authicated)
	const toggledId = useSelector((state) => state.dropDownToggle)
	const inCopyAnimation = useSelector((state) => state.inCopyAnimation)
	const dispatch = useDispatch()
	const history = useHistory()
	const [isFullscreen, setFullscreen] = useState(false)
	const [apiConnection, setConnection] = useState(null)
	const [pageLoaded, updateLoaded] = useState(false)
	const [userData, setUserData] = useState({
		login: '',
		sublogin: '',
	})
	const historyList = useRef()
	useEffect(() => {
		if (!isAuthicated) history.push('/auth')
	}, [isAuthicated, history])

	useEffect(() => {
		document.onfullscreenchange = () => setFullscreen((prevState) => !prevState)
		const data = JSON.parse(localStorage.getItem('authData'))
		setConnection(
			new Sendsay({
				auth: {
					...data,
				},
			})
		)
		return () => {
			document.onfullscreenchange = () => {}
		}
	}, [])
	useEventListener(
		'scroll',
		historyList,
		() => {
			if (toggledId !== -1 && !isDispatching) {
				isDispatching = true
				dispatch(toggleDropDown(-1))
				setTimeout(() => (isDispatching = false))
			}
		},
		[toggledId]
	)
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
		const doc = document.documentElement,
			state =
				document.webkitIsFullScreen ||
				document.isFullScreen ||
				document.fullscreen,
			requestFunc = doc.requestFullscreen || doc.webkitRequestFullScreen,
			cancelFunc =
				document.cancelFullScreen ||
				document.webkitCancelFullScreen ||
				document.exitFullscreen
		!state ? requestFunc.call(doc) : cancelFunc.call(document)
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
								<TextArea>Выйти</TextArea>
								<StyledLogoutIcon />
							</Button>
							<StyledFullscreen
								marginLeft={20}
								padding="7px"
								styleType="nonBackground"
								onClick={toggleFullScreen}
							>
								{isFullscreen ? (
									<CloseFullscreenIcon />
								) : (
									<OpenFullscreenIcon />
								)}
							</StyledFullscreen>
						</RightSideContainer>
					</HeaderContainer>
					<HistoryContainer>
						<HistoryList ref={historyList} scrollBlock={inCopyAnimation}>
							{historyItems.map(({ success, query }, id) => (
								<HistoryItem id={id} key={id} success={success} query={query} />
							))}
						</HistoryList>
						<StyledDeleteButton styleType="nonBackground" padding="0 13px">
							<GradientEffect />
							<DeleteHistoryIcon />
						</StyledDeleteButton>
					</HistoryContainer>
					<StyledSplit
						sizes={[50, 50]}
						gutterAlign="center"
						gutter={() => {
							const div = document.createElement('div')
							div.innerHTML = ReactDOMServer.renderToStaticMarkup(
								<StyledDragIcon />
							)
							return div.firstChild
						}}
						cursor="col-resize"
					>
						<ConsoleWindow title="Запрос:" lock={false} error={true} />
						<ConsoleWindow title="Ответ:" lock={true} error={false} />
					</StyledSplit>
					<FooterContainer>
						<Button padding="5px 18px" styleType="submit">
							<TextArea color="#FFFFFF">Отправить</TextArea>
						</Button>
						<Button padding="6px 4px" styleType="nonBackground">
							<StyledFormatIcon />
							<TextArea>Форматировать</TextArea>
						</Button>
					</FooterContainer>
				</ConsoleContainer>
			</ConsolePageContainer>
		)
	)
}
