import React, { useEffect } from 'react'
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { changeAuthicatedStatus } from './redux/actions'
import { useCookies } from 'react-cookie'
import Auth from './pages/Auth'
import Console from './pages/Console'

function App() {
	const dispatch = useDispatch()
	const [cookies] = useCookies(['authData'])

	useEffect(() => {
		if (cookies.authData) {
			dispatch(changeAuthicatedStatus(true))
		} else {
			dispatch(changeAuthicatedStatus(false))
		}
	}, [dispatch, cookies])

	return (
		<BrowserRouter>
			<Switch>
				<Route path="/auth">
					<Auth />
				</Route>
				<Route path="/console">
					<Console />
				</Route>
				<Route path="*">
					<Redirect to="/auth" />
				</Route>
			</Switch>
		</BrowserRouter>
	)
}

export default App
