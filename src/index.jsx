import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
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
  </React.StrictMode>,
)
