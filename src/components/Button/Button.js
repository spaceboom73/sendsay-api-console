import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ReactComponent as IconLoading } from '../../assets/images/loader.svg'

const ButtonStyled = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	border: none;
	line-height: 24px;
	${({ loading }) => loading && `overflow: hidden;`}
	padding: ${({ padding }) => (padding ? padding : '5px 32px')};
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
	${({ styleType }) =>
		styleType === 'nonBackground' &&
		`background-color: transparent;
		color: #0D0D0D;
		border-radius: 7px;
		border: 2px solid transparent;
		&:hover, &:focus {
			color: #0055FB;
			outline: none;
			span {
				color: #0055FB;
			}
			svg path {
				stroke: #0055FB;
			}
		}
		&:focus {
			border-color: #45A5FF;
		}
		`}
`

const Loader = styled(IconLoading)`
	width: ${({ width }) => width}px;
	animation: 0.7s infinite linear rotate;
	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
`
export const Button = (params) => {
	const { children } = params

	const loading = useRef(params.loading)
	const [buttonWidth, setWidth] = useState(0)
	const button = useRef()

	useEffect(() => {
		if (button.current && loading.current !== undefined) {
			setWidth(() => button.current.children[0].getBoundingClientRect().width)
		}
	}, [button])

	return (
		<ButtonStyled ref={button} {...params}>
			{params.loading === 'true' ? <Loader width={buttonWidth} /> : children}
		</ButtonStyled>
	)
}

Button.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.array,
		PropTypes.object,
	]).isRequired,
	styleType: PropTypes.string,
	padding: PropTypes.string,
	disabled: PropTypes.bool,
	loading: PropTypes.string,
}
