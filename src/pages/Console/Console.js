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
import { ReactComponent as LoadingIcon } from '../../assets/images/loader.svg'
import { changeAuthicatedStatus, toggleDropDown } from '../../redux/actions'
import { ConsoleWindow } from '../../components/ConsoleWindow/ConsoleWindow'
import { GitLink } from '../../components/GitLink/GitLink'
import { useCookies } from 'react-cookie'

const ConsolePageContainer = styled.div`
	display: flex;
	height: 100vh;
	min-height: 520px;
`
const ConsoleContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1 0 640px;
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
	min-height: 50px;
	max-width: 100vw;
	min-width: 640px;
`
const HistoryList = styled.div`
	flex: 1 1 1374px;
	display: flex;
	align-items: center;
	padding-left: 15px;
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
	margin-left: 20px;
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
	height: 47px;
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
	align-items: center;
	padding: 15px;
	border-top: 1px solid rgba(0, 0, 0, 0.2);
`
const StyledFormatIcon = styled(FormatIcon)`
	margin-right: 8px;
`
const LoadingContainer = styled.div`
	height: 100vh;
	width: 100vw;
	display: flex;
	align-items: center;
	justify-content: center;
	svg {
		height: 35px;
		width: 35px;
		animation: 0.8s infinite linear rotate;
		@keyframes rotate {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}
		path {
			stroke: black;
		}
	}
`

let isDispatching = false
export const Console = () => {
	const isAuthicated = useSelector((state) => state.authicated)
	const toggledId = useSelector((state) => state.dropDownToggle)
	const inCopyAnimation = useSelector((state) => state.inCopyAnimation)
	const dispatch = useDispatch()
	const history = useHistory()
	const [cookies, , removeCookie] = useCookies(['name'])
	const [isFullscreen, setFullscreen] = useState(false)
	const [apiConnection, setConnection] = useState(null)
	const [pageLoaded, updatePageLoaded] = useState(false)
	const [userData, setUserData] = useState({
		login: '',
		sublogin: '',
	})
	const [queryJSON, setQueryJSON] = useState('{"action":"pong"}')
	const [responseJSON, setResponseJSON] = useState('')
	const [errorsWindows, setErrorsWindows] = useState({
		query: false,
		response: false,
	})
	const [historyItems, setHistoryItems] = useState([])
	const [windowsProportion, updateProportion] = useState([])
	const [loadingButtonState, setButtonLoading] = useState('false')

	const historyList = useRef()
	useEffect(() => {
		if (!isAuthicated) history.push('/auth')
	}, [isAuthicated, history])

	useEffect(() => {
		document.onfullscreenchange = () => setFullscreen((prevState) => !prevState)
		setConnection(
			new Sendsay({
				auth: {
					...cookies.authData,
				},
			})
		)
		return () => {
			document.onfullscreenchange = () => {}
		}
	}, [cookies])
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
					const { sublogin } = cookies.authData
					updatePageLoaded(true)
					setUserData({
						login: res.account,
						...(sublogin && { sublogin: res.sublogin }),
					})
					const historyOfStorage = localStorage.getItem('history')
					const proportionOfStorage = localStorage.getItem('proportion')
					setHistoryItems(historyOfStorage ? JSON.parse(historyOfStorage) : [])
					updateProportion(
						proportionOfStorage ? JSON.parse(proportionOfStorage) : [50, 50]
					)
				})
	}, [apiConnection, history, cookies])

	useEffect(() => console.log(historyItems), [historyItems])

	const logout = () => {
		removeCookie('authData')
		dispatch(changeAuthicatedStatus(false))
		arrayToStorage('history', [])
		arrayToStorage('proportion', [])
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
		!state
			? requestFunc && requestFunc.call(doc)
			: cancelFunc && cancelFunc.call(document)
	}
	const isValidJSON = (text) => {
		try {
			JSON.parse(text)
		} catch (e) {
			return false
		}
		return true
	}
	const arrayToStorage = (storageKey, array) =>
		array.length
			? localStorage.setItem(storageKey, JSON.stringify(array))
			: localStorage.removeItem(storageKey)

	const queryGo = (json) => {
		setResponseJSON('')
		setButtonLoading('true')
		const request = JSON.parse(json)
		const historyData = request['action']
		let success = null
		let errorJSON = null
		apiConnection &&
			apiConnection
				.request(request)
				.then((res) => {
					setResponseJSON(JSON.stringify(res))
					setErrorsWindows((prevState) => ({ ...prevState, response: false }))
					success = true
				})
				.catch((err) => {
					errorJSON = JSON.stringify(err)
					setResponseJSON(errorJSON)
					setErrorsWindows((prevState) => ({ ...prevState, response: true }))
					success = false
				})
				.finally(() => {
					setButtonLoading('false')
					setHistoryItems((prevState) => {
						const queryArray = prevState.map((item) => item.queryName)
						if (queryArray.indexOf(historyData) !== -1)
							prevState.splice(queryArray.indexOf(historyData), 1)

						const historyArray = [
							{
								success,
								queryName: historyData,
								queryBody: json,
								...(!success && { errorJSON }),
							},
							...prevState,
						]

						if (historyArray.length > 15) historyArray.pop()
						arrayToStorage('history', historyArray)
						return historyArray
					})
				})
	}
	const formatWindows = () => {
		setQueryJSON((prevState) => {
			if (isValidJSON(prevState))
				return JSON.stringify(JSON.parse(prevState), null, 4)
			setErrorsWindows((prevState) => ({
				...prevState,
				query: true,
			}))
			return prevState
		})
		setResponseJSON((prevState) =>
			prevState.length
				? JSON.stringify(JSON.parse(prevState), null, 4)
				: prevState
		)
	}
	const clearHistory = () => {
		historyItems.length && setHistoryItems([])
		arrayToStorage('history', [])
	}
	const removeHistoryItem = (id) =>
		setHistoryItems((prevState) => {
			prevState.splice(id, 1)
			arrayToStorage('history', prevState)
			return prevState
		})

	return pageLoaded ? (
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
									<TextArea color="rgba(0, 0, 0, 0.2)">&nbsp;:&nbsp;</TextArea>
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
							padding="7px"
							styleType="nonBackground"
							onClick={toggleFullScreen}
						>
							{isFullscreen ? <CloseFullscreenIcon /> : <OpenFullscreenIcon />}
						</StyledFullscreen>
					</RightSideContainer>
				</HeaderContainer>
				<HistoryContainer>
					<HistoryList ref={historyList} scrollBlock={inCopyAnimation}>
						{historyItems.map(({ success, queryName, queryBody }, id) => (
							<HistoryItem
								onDelete={removeHistoryItem}
								onExecute={(id) => {
									const executeJSON = historyItems[id].queryBody
									setQueryJSON(JSON.stringify(JSON.parse(executeJSON), null, 4))
									queryGo(executeJSON)
								}}
								id={id}
								key={id}
								success={success}
								query={queryName}
								queryBody={queryBody}
							/>
						))}
					</HistoryList>
					<StyledDeleteButton styleType="nonBackground" padding="0 13px">
						<GradientEffect />
						<DeleteHistoryIcon onClick={clearHistory} />
					</StyledDeleteButton>
				</HistoryContainer>
				<StyledSplit
					sizes={windowsProportion}
					onDragEnd={(e) => {
						updateProportion(e)
						arrayToStorage('proportion', e)
					}}
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
					<ConsoleWindow
						onClick={() =>
							errorsWindows.query &&
							setErrorsWindows((prevState) => ({
								...prevState,
								query: false,
							}))
						}
						value={queryJSON}
						onChange={(value) => setQueryJSON(value)}
						title="Запрос:"
						lock={false}
						error={errorsWindows.query}
					/>
					<ConsoleWindow
						value={responseJSON}
						title="Ответ:"
						lock={true}
						error={errorsWindows.response}
					/>
				</StyledSplit>
				<FooterContainer>
					<Button
						padding="8px 18px"
						styleType="submit"
						loading={loadingButtonState}
						onClick={() =>
							isValidJSON(queryJSON)
								? queryGo(queryJSON)
								: setErrorsWindows((prevState) => ({
										...prevState,
										query: true,
								  }))
						}
					>
						<TextArea color="#FFFFFF">Отправить</TextArea>
					</Button>
					<GitLink
						title="@spaceboom73/sendsay-api-console"
						link="https://github.com/spaceboom73/sendsay-api-console"
					/>
					<Button
						padding="6px 4px"
						styleType="nonBackground"
						onClick={formatWindows}
					>
						<StyledFormatIcon />
						<TextArea>Форматировать</TextArea>
					</Button>
				</FooterContainer>
			</ConsoleContainer>
		</ConsolePageContainer>
	) : (
		<LoadingContainer>
			<LoadingIcon />
		</LoadingContainer>
	)
}
