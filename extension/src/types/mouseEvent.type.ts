export interface MouseEventData {
  pageX: number
  pageY: number
  screenX: number
  screenY: number
  offsetX: number
  offsetY: number
  clientX: number
  clientY: number

  scrollX: number
  scrollY: number

  type: CustomMouseEventType
  url: string
  timestamp: string

  element: {
    className: string
    tag: string
    id: string
    baseURI: string
  }
}
export interface ScrollEventData {
  experimentID: number
  scrollX: number
  scrollY: number
  url: string
  timestamp: string
}
export type CustomMouseEventType = 'mousedown' | 'mouseup' | 'mousemove' | 'mousedrag'
