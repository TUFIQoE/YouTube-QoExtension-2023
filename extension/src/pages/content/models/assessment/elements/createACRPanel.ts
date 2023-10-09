import { CSSProperties } from 'react'
import { HandleAssessmentSubmit } from '../AssessmentController'
import { SettingsStorage } from '../../../../../utils/storage/ChromeStorage'

const containerStyle: CSSProperties = {
  width: '40%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
}
const labelStyle: CSSProperties = {
  fontSize: '32px',
  color: '#F39A9D',
  textAlign: 'center',
  width: '100%',
  marginBottom: '20px',
}
const buttonStyle: CSSProperties = {
  outline: 'none',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: 'white',
  fontSize: '18px',
  textAlign: 'left',
  padding: '10px 20px',
  width: '40%',
  cursor: 'pointer',
}

const acr = {
  1: 'Zła',
  2: 'Niska',
  3: 'Przeciętna',
  4: 'Dobra',
  5: 'Doskonała',
}

const handleMouseEnter = (e: MouseEvent) => {
  const button = e.currentTarget as HTMLButtonElement
  button.style.backgroundColor = '#F39A9D'
  button.style.color = 'white'
}
const handleMouseLeave = (e: MouseEvent) => {
  const button = e.currentTarget as HTMLButtonElement
  button.style.backgroundColor = 'whitesmoke'
  button.style.color = 'black'
}

export const createACRPanel = async (handleSubmit: HandleAssessmentSubmit): Promise<HTMLDivElement> => {
  // Wrapper container
  const container = document.createElement('div')
  Object.assign(container.style, containerStyle)

  // Label
  const label = document.createElement('label')
  Object.assign(label.style, labelStyle)
  label.innerText = await SettingsStorage.getItem('assessmentQuestion')

  // Buttons
  const buttons: HTMLButtonElement[] = []
  for (const [key, value] of Object.entries(acr).reverse()) {
    const button = document.createElement('button')
    button.innerText = `${key}. ${value}`
    button.id = `assessment-button-${key}`
    Object.assign(button.style, buttonStyle)

    button.onmouseenter = handleMouseEnter
    button.onmouseleave = handleMouseLeave
    button.onclick = () => handleSubmit(Number(key), value)

    buttons.push(button)
  }

  container.append(label, ...buttons)
  return container
}
