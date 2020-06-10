import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import TextArea from '../TextArea'

const WindowContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
`
const StyledTextArea = styled(TextArea)`
	margin-bottom: 7px;
`
const StyledConsole = styled.textarea`
	font-family: 'Cousine', monospace;
	background: #ffffff;
	border: 1px solid ${({ boxcolor }) => boxcolor && boxcolor};
	box-sizing: border-box;
	border-radius: 5px;
	word-break: break-all;
	height: 100%;
	transition: 0.3s all;
	padding: 10px;
	resize: none;
	&:hover {
		border: none;
		border: 1px solid ${({ boxcolor }) => boxcolor && boxcolor};
		${({ disabled }) =>
			!disabled && 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);'}
	}
	&:focus {
		outline: none;
		border: 1px solid ${({ boxcolor }) => boxcolor && boxcolor};
		${({ disabled }) =>
			!disabled && 'box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);'}
	}
	${({ disabled }) =>
		disabled &&
		`
		cursor: default;
		
	`}
`

export const ConsoleWindow = ({
	value = '',
	onChange,
	onClick,
	title,
	error,
	lock,
}) => {
	return (
		<WindowContainer>
			<StyledTextArea fontSize={12} color={error ? '#CF2C00' : '#999999'}>
				{title}
			</StyledTextArea>
			<StyledConsole
				onClick={(e) => onClick && onClick(e)}
				disabled={lock}
				boxcolor={error ? '#CF2C00' : 'rgba(0, 0, 0, 0.2)'}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</WindowContainer>
	)
}

ConsoleWindow.propTypes = {
	value: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	onClick: PropTypes.func,
	error: PropTypes.bool,
	lock: PropTypes.bool,
}
