import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const ButtonStyled = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	border: none;
	padding: 5px 20px;
	flex-basis: 90px;
	${({ styleType, disabled }) =>
		styleType === 'submit' &&
		`
			font-size: 16px;
			color: white;
			background: linear-gradient(180deg, #45A6FF 0%, #0055FB 100%), #C4C4C4;
			border-radius: 5px;
			${
				disabled
					? `
						background: linear-gradient(0deg, #C4C4C4, #C4C4C4), linear-gradient(180deg, #45A6FF 0%, #0055FB 100%);
					`
					: `
						&:focus {
							background: linear-gradient(180deg, #45A6FF 0%, #0055FB 100%), #C4C4C4;
							outline: none;
						}
						&:hover {
							background: linear-gradient(0deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)), linear-gradient(180deg, #45A6FF 0%, #0055FB 100%), #C4C4C4;
						}
						&:active {
							background: linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), linear-gradient(180deg, #45A6FF 0%, #0055FB 100%), #C4C4C4;
						}
					`
			}
		`}
`

export const Button = (params) => {
	const { children } = params
	return <ButtonStyled {...params}>{children}</ButtonStyled>
}

Button.propTypes = {
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
		.isRequired,
	styleType: PropTypes.string,
	disabled: PropTypes.bool,
}
