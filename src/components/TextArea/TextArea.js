import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Text = styled.span`
	${({ color, fontSize, whiteSpace }) =>
		`color: ${color};
		font-size: ${fontSize}px;
		white-space: ${whiteSpace};
		@media (max-width: 800px) {
			font-size: ${fontSize - 1}px;
		}
		@media (max-width: 750px) {
			font-size: ${fontSize - 2}px;
		}
		@media (max-width: 700px) {
			font-size: ${fontSize - 3}px;
		}
		@media (max-width: 650px) {
			font-size: ${fontSize - 4}px;
		}
	`}
`

export const TextArea = ({
	color = '#0D0D0D',
	fontSize = 16,
	whiteSpace = 'break-space',
	children,
}) => {
	return (
		<Text color={color} whiteSpace={whiteSpace} fontSize={fontSize}>
			{children}
		</Text>
	)
}

TextArea.propTypes = {
	color: PropTypes.string,
	fontSize: PropTypes.number,
	whiteSpace: PropTypes.string,
	children: PropTypes.string.isRequired,
}
