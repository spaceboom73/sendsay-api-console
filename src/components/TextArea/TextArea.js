import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Text = styled.span`
	${({ color, fontSize, whiteSpace }) =>
		`color: ${color};
		font-size: ${fontSize}px;
		white-space: ${whiteSpace};`}
`

export const TextArea = ({
	color = '#0D0D0D',
	fontSize = 16,
	whiteSpace = 'break-space',
	children,
}) => {
	return (
		<Text color={color} fontSize={fontSize}>
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
