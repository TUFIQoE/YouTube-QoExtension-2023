import { CSSProperties } from 'react'

export interface Style {
  [key: string]: CSSProperties
}

export const fullViewport: CSSProperties = {
  width: '100%',
  minHeight: '100vh',
  margin: 0,
}
