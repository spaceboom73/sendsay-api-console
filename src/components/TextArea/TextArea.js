import React, { forwardRef } from 'react'
import styled from 'styled-components'

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

const TextArea = (
	{
		color = '#0D0D0D',
		fontSize = 16,
		whiteSpace = 'inherit',
		children,
		...props
	},
	ref
) => {
	return (
		<Text
			ref={ref}
			color={color}
			whiteSpace={whiteSpace}
			fontSize={fontSize}
			{...props}
		>
			{children}
		</Text>
	)
}

export default forwardRef(TextArea)
