import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import TextArea from '../TextArea'
import rocketImages from '../../assets/images/rocket.png'

const StyledLink = styled(TextArea)`
	cursor: pointer;
	trainsition: 0.2s all;
	user-select: none;
	&:hover {
		text-decoration: underline;
		opacity: 0.8;
	}
`
const RocketStyled = styled.div`
	position: absolute;
	${({ position }) =>
		`top: ${position.top}px;
        left: ${position.left}px;
        @keyframes move {
            from {
                top: ${position.top}px;
            }
            to {
                top: -120px;
            }
        }`}
	width: 100px;
	height: 120px;
	background: url(${rocketImages}) no-repeat center;
	background-size: 120px 120px;
	${({ visible }) => `
        display: ${visible ? 'block' : 'none'};
    `}
	${({ hider, move }) =>
		`animation: ${move ? '2s' : '.5s'} ${
			hider && !move ? 'hider' : move ? 'move' : 'visible'
		} ${move ? 'cubic-bezier(0.6, -0.01, 0.75, 0.72)' : 'ease-in-out'}`};
	@keyframes hider {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
	@keyframes visible {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
`
let timeoutHider = null

export const GitLink = ({ title, link, ...props }) => {
	const containerRef = useRef()
	const [rocketMove, setMove] = useState(false)
	const [rocketHider, setHider] = useState(false)
	const [rocketVisible, setVisible] = useState(false)
	const [rocketPosition, updatePosition] = useState({
		top: 0,
		left: 0,
	})

	return (
		<React.Fragment>
			<StyledLink
				onMouseEnter={() => {
					if (containerRef.current) {
						const containerCoord = containerRef.current.getBoundingClientRect()
						updatePosition({
							top: Math.floor(containerCoord.top - 95),
							left: Math.floor(containerCoord.left + containerCoord.width - 10),
						})
					}
					if (!timeoutHider) {
						setVisible(true)
					} else {
						clearTimeout(timeoutHider)
						timeoutHider = null
						setHider(false)
					}
				}}
				onMouseLeave={() => {
					if (!rocketMove) {
						setHider(true)
						timeoutHider = setTimeout(() => {
							setVisible(false)
							setHider(false)
							timeoutHider = null
						}, 500)
					}
				}}
				onClick={() => {
					if (!rocketMove) {
						setMove(true)
						setTimeout(() => {
							setVisible(false)
							setHider(false)
							setMove(false)
							window.open(link)
						}, 1800)
					}
				}}
				oncolor="#999999"
				padding="0"
				ref={containerRef}
				{...props}
			>
				{title}
			</StyledLink>
			<RocketStyled
				move={rocketMove}
				hider={rocketHider}
				visible={rocketVisible}
				position={rocketPosition}
			/>
		</React.Fragment>
	)
}

GitLink.propTypes = {
	title: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
}
