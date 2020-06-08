import { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

export const useEventListener = (event, handler, callback, dependency = []) => {
	const scrollListenerToggle = useCallback(
		(isToggle) => {
			if (handler.current) {
				isToggle
					? handler.current.addEventListener('scroll', callback)
					: handler.current.removeEventListener('scroll', callback)
			}
		},
		[handler, callback]
	)
	useEffect(() => {
		scrollListenerToggle(true)
		return () => scrollListenerToggle(false)
	}, [dependency, scrollListenerToggle])
}

useEventListener.propTypes = {
	event: PropTypes.string.isRequired,
	handler: PropTypes.object.isRequired,
	callback: PropTypes.func.isRequired,
	dependency: PropTypes.array.isRequired,
}
