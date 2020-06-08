import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import TextArea from '../TextArea'
import Input from 'antd/lib/input/TextArea'

const WindowContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
`
const StyledTextArea = styled(TextArea)`
	margin-bottom: 7px;
`
const StyledConsole = styled(Input)`
	background: #ffffff !important;
	border: 1px solid ${({ boxcolor }) => boxcolor && boxcolor};
	box-sizing: border-box;
	border-radius: 5px;
	resize: none;
	height: 100% !important;
	&:hover {
		border: 1px solid ${({ boxcolor }) => boxcolor && boxcolor};
		${({ disabled }) =>
			!disabled && 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);'}
	}
	&:focus {
		border: 1px solid ${({ boxcolor }) => boxcolor && boxcolor};
		${({ disabled }) =>
			!disabled && 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);'}
	}
	${({ disabled }) =>
		disabled &&
		`
		cursor: default !important;
		
	`}
`

export const ConsoleWindow = ({ title, error, lock }) => {
	return (
		<WindowContainer>
			<StyledTextArea fontSize={12} color={error ? '#CF2C00' : '#999999'}>
				{title}
			</StyledTextArea>
			<StyledConsole
				disabled={lock}
				boxcolor={error ? '#CF2C00' : 'rgba(0, 0, 0, 0.2)'}
			/>
		</WindowContainer>
	)
}

ConsoleWindow.propTypes = {
	title: PropTypes.string.isRequired,
	error: PropTypes.bool,
	lock: PropTypes.bool,
}
