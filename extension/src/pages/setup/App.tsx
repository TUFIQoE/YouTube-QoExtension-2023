import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Setup from './views/Setup/Setup'
import { HashRouter } from 'react-router-dom'
import ThemeProvider, { ThemeProviderProps } from '@mui/material/styles/ThemeProvider'
import { createTheme } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { Provider } from 'react-redux'
import './style.module.scss'
import { store } from './redux/store'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function App() {
  return (
    <HashRouter>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Provider store={store}>
          <Routes>
            <Route path='/' element={<Setup />} />
          </Routes>
        </Provider>
      </ThemeProvider>
    </HashRouter>
  )
}

export default App
