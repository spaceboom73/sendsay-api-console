import React, { useState } from 'react'
import { Form, Input } from 'antd'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Button from '../../components/Button'
import { useSelector } from 'react-redux'
import { ReactComponent as PokerFaceIcon } from '../../assets/images/pokerface.svg'
import TextArea from '../TextArea'

const StyledForm = styled(Form)`
	display: flex;
	justify-content: center;
	align-items: flex-start;
	flex-direction: column;
	width: 520px;
	max-width: 100%;
	padding: 40px 30px;
	background-color: #fff;
	border-radius: 5px;
	box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
	margin: 20px 10px 0;
	& h1 {
		margin: 0;
	}
`
const FormItemStyled = styled(Form.Item)`
	display: flex;
	flex-direction: column;
	width: 100%;
	margin: 20px 0 0 0;
	span,
	input {
		transition: all 0.7s;
	}
	${({ validated, name }) =>
		validated &&
		name &&
		(validated[name].status === 'clear' ||
			validated[name].status === 'invalid') &&
		`
		& input { 
			border-color: red;
		}
	`}
	${({ validated, name }) =>
		validated &&
		name &&
		validated[name].status === 'clear' &&
		`
		& span:first-child {
			color: red;
		}
	`}
`
const MoreTitleStyled = styled.span`
	display: flex;
	justify-content: space-between;
`
const InputStyled = styled(Input)`
	font-size: 18px;
	${({ type }) => type === 'password' && 'letter-spacing: 0.1em;'}
`
const NoValidateStyled = styled.p`
	font-size: 11px;
	color: red;
`
const ErrorBounderStyled = styled.div`
	display: flex;
	flex-direction: column;
	padding: 10px;
	width: 100%;
	background: rgba(207, 44, 0, 0.1);
	border-radius: 5px;
	span {
		opacity: 0.5;
		font-size: 12px;
		margin: 0 0 0 34px;
	}
	div {
		display: flex;
		align-items: center;
		span {
			margin: 0 0 0 10px;
			font-size: 18px;
			opacity: 1;
		}
	}
`

export const LoginForm = ({ onSubmit }) => {
	const [validated, setValidate] = useState({
		login: {
			status: 'success',
		},
		password: {
			status: 'success',
		},
	})

	const [buttonLoading, loginError] = useSelector((state) => [
		state.loginButton,
		state.loginError,
	])

	const formValidate = (items) => {
		const validator = (value, regExp, text) => {
			if (!value) {
				return {
					status: 'clear',
				}
			}
			const validate = new RegExp(regExp)
			return validate.test(value)
				? {
						status: 'success',
				  }
				: {
						status: 'invalid',
						text,
				  }
		}
		const loginValidation = validator(
			items.login,
			/^\w{1,40}$/,
			`* Поле не валидно. Логин может состоять из латинских букв, 
		цифр, нижнего подчёркивания и быть не больше 40 символов. 
		Вы можете использовать email, в качестве логина`
		)
		const emailValidation = validator(
			items.login,
			/^[\w.-]{1,}@\w{1,}[.][a-z]{1,}$/,
			`* Поле не валидно. Логин может состоять из латинских букв, 
		цифр, нижнего подчёркивания и быть не больше 40 символов. 
		Вы можете использовать email, в качестве логина`
		)
		let login = loginValidation
		if (emailValidation.status === 'success') login = emailValidation
		return {
			login,
			password: validator(
				items.password,
				/^[^а-яА-Я]{6,40}$/,
				`* Поле не валидно. Пароль может состоять
			из любых символов, кроме кириллицы и быть не меньше 6 и не более 40 сиволов`
			),
		}
	}

	const dataNoValidation = (items, noValidationItems) => {
		let returnData
		for (const key of Object.keys(items)) {
			if (noValidationItems.indexOf(key) === -1) {
				returnData = {
					...returnData,
					[key]: items[key],
				}
			}
		}
		return returnData
	}

	const stopValidationOnInput = (item) => {
		setValidate((prevState) => ({
			...prevState,
			[item]: {
				status: 'success',
			},
		}))
	}

	const isValidate = (validated) => {
		const length = Object.keys(validated).length
		let count = 0
		for (const item of Object.keys(validated))
			validated[item].status === 'success' && count++
		return length === count
	}

	const toTextFormat = (object) =>
		JSON.stringify(object)
			.replace(/"([\w$]{1,})":/gm, '$1: ')
			.replace(/(",)/gm, '$1 ')

	return (
		<div>
			<StyledForm
				onFinish={(e) => {
					const validateData = dataNoValidation(e, ['sublogin'])
					const validatedValues = formValidate(validateData)
					setValidate(validatedValues)
					if (isValidate(validatedValues)) {
						onSubmit(e)
					}
				}}
			>
				<h1>API-консолька</h1>
				{loginError && (
					<ErrorBounderStyled>
						<div>
							<PokerFaceIcon />
							<TextArea color="#cf2c00">Вход не вышел</TextArea>
						</div>
						<TextArea color="#cf2c00">{toTextFormat(loginError)}</TextArea>
					</ErrorBounderStyled>
				)}
				<FormItemStyled name="login" validated={validated}>
					<div>
						<TextArea>Логин</TextArea>
						<InputStyled onClick={() => stopValidationOnInput('login')} />
						{validated.login.status === 'invalid' && (
							<NoValidateStyled>{validated.login.text}</NoValidateStyled>
						)}
					</div>
				</FormItemStyled>
				<FormItemStyled name="sublogin">
					<div>
						<MoreTitleStyled>
							<TextArea>Сублогин</TextArea>
							<TextArea color="#999999">Опционально</TextArea>
						</MoreTitleStyled>
						<InputStyled />
					</div>
				</FormItemStyled>
				<FormItemStyled name="password" validated={validated}>
					<div>
						<TextArea>Пароль</TextArea>
						<InputStyled
							type="password"
							onClick={() => stopValidationOnInput('password')}
						/>
						{validated.password.status === 'invalid' && (
							<NoValidateStyled>{validated.password.text}</NoValidateStyled>
						)}
					</div>
				</FormItemStyled>
				<Form.Item style={{ margin: '20px 0 0 0' }}>
					<Button
						styleType="submit"
						htmlType="submit"
						loading={buttonLoading.toString()}
						disabled={!isValidate(validated)}
					>
						<TextArea color="#FFFFFF">Войти</TextArea>
					</Button>
				</Form.Item>
			</StyledForm>
		</div>
	)
}
LoginForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
}
