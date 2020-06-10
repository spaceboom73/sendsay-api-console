import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import TextArea from '../TextArea'

import { ReactComponent as DragDropIcon } from '../../assets/images/dragdrop.svg'
import { useSelector, useDispatch } from 'react-redux'
import { toggleDropDown, inAnimation } from '../../redux/actions'
import Button from '../Button'

const ItemContainer = styled.div`
	display: flex;
	align-items: center;
	background-color: #ffffff;
	box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	padding: 0 10px;
	cursor: pointer;
	height: 30px;
	margin-right: 10px;
	&:hover {
		box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
	}
`

const StatusStyled = styled.div`
	width: 10px;
	height: 10px;
	border-radius: 50px;
	background-color: ${({ success }) => (success ? '#30B800' : '#CF2C00')};
	border: 1px solid rgba(0, 0, 0, 0.2);
	margin-right: 5px;
`
const StyledDropIcon = styled(DragDropIcon)`
	margin-left: 8px;
	width: 8px;
	&:hover circle {
		fill-opacity: 0.4;
	}
`

const StyledDropDown = styled.div`
	position: absolute;
	width: 131px;
	padding: 5px 0px;
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	border-radius: 3px;
	box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
	${({ coordinate }) => `
        top: ${coordinate.y}px;
        left: ${coordinate.x}px;
	`}
	z-index: 10000;
`
const StyledButton = styled(Button)`
	padding: 10px 15px;
	justify-content: flex-start;
	line-height: 20px;
	border: none;
	border-radius: 0px;
	&:hover {
		background-color: ${({ destirutive }) =>
			destirutive ? '#CF2C00' : '#0055fb'};
		color: white;
	}
`
const StyledLine = styled.div`
	margin: 5px 0;
	width: 100%;
	height: 1px;
	background-color: rgba(0, 0, 0, 0.2);
`
const StyledTextArea = styled(TextArea)`
	background-color: #f6f6f6;
	padding: 0 5px;
	line-height: 20px;
	border-radius: 5px;
	display: block;
	position: relative;
	z-index: 1;
	animation: 1.8s hidder;
	@keyframes hidder {
		from {
			margin-top: 0;
			opacity: 1;
		}
		to {
			margin-top: -50px;
			opacity: 0.2;
		}
	}
`
const AbsoluteTextArea = styled(TextArea)`
	position: ${({ inCopy }) => (inCopy ? 'absolute' : 'initial')};
	z-index: 0;
	${({ position }) => `
        top: ${position.top}px;
        left: ${position.left}px;
    `}
`
const TextAreaContainer = styled(TextArea)`
	display: flex;
	align-items: center;
	overflow: hidden;
	height: 100%;
`

export const HistoryItem = ({
	id,
	success,
	query,
	queryBody,
	onDelete,
	onExecute,
	...props
}) => {
	const [dropDown, updateDropDown] = useState({
		open: false,
		coordinate: {
			x: 0,
			y: 0,
		},
	})

	const [copy, setCopy] = useState({
		state: false,
		position: {
			top: 0,
			left: 0,
		},
	})
	const item = useRef()
	const queryText = useRef()
	const toggledId = useSelector((state) => state.dropDownToggle)
	const dispatch = useDispatch()

	useEffect(() => {
		if (toggledId !== id && dropDown.open) {
			updateDropDown((prevState) => ({
				...prevState,
				open: !prevState.open,
			}))
		}
	}, [toggledId, id, dropDown.open])

	const dropDownToggle = (e) => {
		e.preventDefault()
		e.stopPropagation()
		const coordinateInfo = item.current.getBoundingClientRect()
		const coordinate = {
			x: Math.floor(coordinateInfo.left),
			y: Math.floor(coordinateInfo.top + coordinateInfo.height),
		}
		updateDropDown((prevState) => ({
			...prevState,
			open: !prevState.open,
			coordinate,
		}))
		if (toggledId === id) {
			dispatch(toggleDropDown(-1))
		} else {
			dispatch(toggleDropDown(id))
		}
	}
	const dropDownClick = (e, operation) => {
		if (e) {
			e.stopPropagation()
			e.preventDefault()
		}
		dispatch(toggleDropDown(-1))
		switch (operation) {
			case 'execute': {
				onExecute(id)
				break
			}
			case 'copy': {
				navigator.clipboard.writeText(queryBody).then(() => {
					const containerCoord = queryText.current.getBoundingClientRect()
					setCopy((prevState) => ({
						...prevState,
						position: {
							top: containerCoord.top,
							left: containerCoord.left,
						},
						state: true,
					}))
					dispatch(inAnimation(true))
					setTimeout(() => {
						setCopy((prevState) => ({ ...prevState, state: false }))
						dispatch(inAnimation(false))
					}, 1000)
				})
				break
			}
			case 'delete': {
				onDelete(id)
				break
			}
			default: {
				break
			}
		}
	}

	return (
		<ItemContainer ref={item} onClick={() => dropDownClick(null, 'execute')}>
			<StatusStyled success={success} />
			<TextAreaContainer>
				{copy.state && (
					<StyledTextArea fontSize={12}>Скопировано</StyledTextArea>
				)}
				<AbsoluteTextArea
					ref={queryText}
					inCopy={copy.state}
					position={copy.position}
				>
					{query}
				</AbsoluteTextArea>
			</TextAreaContainer>
			<StyledDropIcon onClick={dropDownToggle} />
			{dropDown.open && (
				<StyledDropDown coordinate={dropDown.coordinate}>
					<StyledButton
						styleType="nonBackground"
						onClick={(e) => dropDownClick(e, 'execute')}
					>
						Выполнить
					</StyledButton>
					<StyledButton
						styleType="nonBackground"
						onClick={(e) => dropDownClick(e, 'copy')}
					>
						Скопировать
					</StyledButton>
					<StyledLine />
					<StyledButton
						destirutive
						styleType="nonBackground"
						onClick={(e) => dropDownClick(e, 'delete')}
					>
						Удалить
					</StyledButton>
				</StyledDropDown>
			)}
		</ItemContainer>
	)
}

HistoryItem.propTypes = {
	id: PropTypes.number.isRequired,
	success: PropTypes.bool.isRequired,
	query: PropTypes.string.isRequired,
	queryBody: PropTypes.string.isRequired,
	onDelete: PropTypes.func.isRequired,
	onExecute: PropTypes.func.isRequired,
}
