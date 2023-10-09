import { CSSProperties } from 'react'

const style: CSSProperties = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  backgroundColor: 'rgba(34,34,34,1)',
  zIndex: 10000,
  display: 'none',
  justifyContent: 'center',
  alignItems: 'center',
}

export const createBackground = () => {
  const background = document.createElement('div')
  Object.assign(background.style, style)
  return background
}
