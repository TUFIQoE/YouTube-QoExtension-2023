import { DateTime } from 'luxon'
import { api } from '../../../API/api'
import { VariablesStorage } from '../../../utils/storage/ChromeStorage'
import { CustomMouseEventType } from '../../../types/mouseEvent.type'

export class MouseTracker {
  private static instance: MouseTracker | null = null
  private leftButtonPressed: boolean = false
  private experimentID: number | null = null

  public static getInstance = () => {
    if (!MouseTracker.instance) {
      MouseTracker.instance = new MouseTracker()
    }
    return MouseTracker.instance
  }

  public init = async () => {
    this.experimentID = await VariablesStorage.getItem('experimentID')

    window.onmousedown = this.handleMousePressed.bind(this)
    window.onmouseup = this.handleMousePressed.bind(this)
    window.onmousemove = this.handleMouseMove.bind(this)
    window.onscroll = this.handleScroll.bind(this)
  }

  private handleMousePressed = (e: MouseEvent) => {
    if (e.type === 'mousedown' && e.button === 0) {
      this.leftButtonPressed = true
      this.handleMouseEvent(e, 'mousedown')
    } else if (e.type === 'mouseup' && e.button === 0) {
      this.leftButtonPressed = false
      this.handleMouseEvent(e, 'mouseup')
    }
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (this.leftButtonPressed === true) {
      this.handleMouseEvent(e, 'mousedrag')
    } else {
      // this.handleMouseEvent(e, 'mousemove'); // <-- not sending mousemove update due to high load
    }
  }

  private handleScroll = (e: Event) => {
    const body = {
      experimentID: this.experimentID,
      timestamp: DateTime.now().toISO(),
      source: 'subject',
      type: 'scroll',
      location: window.location.href,
      details: {
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      },
    }
    api.event.post(body)
  }

  private handleMouseEvent = async (e: MouseEvent, type: CustomMouseEventType) => {
    const target = e.target as HTMLElement
    const body = {
      experimentID: this.experimentID,
      timestamp: DateTime.now().toISO(),
      source: 'subject',
      type: type, // <-- not e.type because dragging is custom type
      location: window.location.href,
      details: {
        pageX: e.pageX,
        pageY: e.pageY,
        screenX: e.screenX,
        screenY: e.screenY,
        offsetX: e.offsetX,
        offsetY: e.offsetY,
        clientX: e.clientX,
        clientY: e.clientY,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        element: {
          className: target.className,
          innerText: target.innerText.substring(0, 25),
          tag: target.tagName,
          id: target.id,
          baseURI: target.baseURI,
        },
      },
    }
    try {
      api.event.post(body)
    } catch (err) {
      console.log('Error sending mouse data!')
    }
  }
}
