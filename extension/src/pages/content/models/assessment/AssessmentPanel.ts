import { CSSProperties } from 'react'
import { createBackground } from './elements/createBackground'
import { createACRPanel } from './elements/createACRPanel'
import { HandleAssessmentSubmit } from './AssessmentController'

export class AssessmentPanel {
  private rootElement: HTMLDivElement | null = null

  public init = async (handleSubmit: HandleAssessmentSubmit) => {
    await this.create(handleSubmit)
  }

  public show = () => {
    if (this.rootElement) {
      this.rootElement.style.display = 'flex'
      document.body.style.overflowY = 'hidden'
    }
  }

  public hide = () => {
    if (this.rootElement) {
      this.rootElement.style.display = 'none'
      document.body.style.overflowY = 'scroll'
    }
  }

  private create = async (handleSubmit: HandleAssessmentSubmit) => {
    this.rootElement = createBackground()
    const acrPanel = await createACRPanel(handleSubmit)

    this.rootElement.appendChild(acrPanel)
    document.body.insertBefore(this.rootElement, document.body.firstChild)
  }
}
