import React from 'react'
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'
import Auth from './pages/Auth'
import Console from './pages/Console'

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/auth">
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
