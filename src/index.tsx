import React, { createContext, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './view/App'
import './index.css'

const getDeviceType = (): DeviceType => {
  const width = window.innerWidth
  if (width < 680) return 'mobile'
  else return 'pc'
}

export type DeviceType = 'mobile' | 'pc'
export const DeviceContext = createContext<DeviceType>(getDeviceType())

const Index: React.FC = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>(getDeviceType())

  useEffect(() => {
    const onResize = (): void => {
      setDeviceType(getDeviceType())
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <DeviceContext.Provider value={deviceType}>
      <App />
    </DeviceContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Index />
)
