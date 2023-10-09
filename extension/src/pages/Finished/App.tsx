import React from 'react'
import { HashRouter } from 'react-router-dom'
import ThemeProvider, { ThemeProviderProps } from '@mui/material/styles/ThemeProvider'
import { createTheme } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { Provider } from 'react-redux'
import './style.module.scss'
import { Container, Box } from '@mui/material'
import { style } from './style'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <span style={style.text}>Eksperyment zakończony. Proszę zawiadomić osobę nadzorującą eksperyment</span>
          <span style={style.text}>Experiment finished. Contact experiment supervisor.</span>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
