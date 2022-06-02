import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { SettingsProvider } from './Settings'
import { speciesList, INITIAL_SAME_YEAR } from './config'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <SettingsProvider
      initial={{
        highlightedSpecies: null,
        activeSpeciesList: speciesList.map(species => species.name),
        sameYear: INITIAL_SAME_YEAR,
        speed: 3,
      }}
    >
      <App />
    </SettingsProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
