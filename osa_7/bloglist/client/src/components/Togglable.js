import { useState, useImperativeHandle, forwardRef } from 'react'
import { Button } from '@mui/material'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(props.showAtFirst)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  const buttonId = props.idForButton
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={hideWhenVisible}>
        <Button
          variant='contained'
          color='primary'
          onClick={toggleVisibility}
          id={buttonId}
        >
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button
          variant='contained'
          color='primary'
          onClick={toggleVisibility}
          id='cancel'
        >
          cancel
        </Button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable
