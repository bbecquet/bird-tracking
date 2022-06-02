import React, { createContext, useState, useContext } from 'react'

export const SettingsContext = createContext()

export const SettingsProvider = ({ children, initial = {} }) => {
  const [settings, setSettings] = useState(initial)

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSetting = (key, defaultValue) => {
  const { settings, setSettings } = useContext(SettingsContext)

  return [
    settings[key] || defaultValue,
    value => {
      setSettings({ ...settings, [key]: value })
    },
  ]
}
