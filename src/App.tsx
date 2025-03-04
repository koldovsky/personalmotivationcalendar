import { useState, useEffect } from 'react'
import SetupForm from './components/SetupForm'
import CalendarGrid from './components/CalendarGrid'
import { UserData } from './types'
import { ThemeProvider } from './contexts/ThemeContext'
import './App.css'

function App() {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const savedData = localStorage.getItem('userData')
    if (savedData) {
      const data = JSON.parse(savedData)
      setUserData({
        ...data,
        birthDate: new Date(data.birthDate)
      })
    }
  }, [])

  const handleSubmit = (data: UserData) => {
    localStorage.setItem('userData', JSON.stringify(data))
    setUserData(data)
  }

  const handleReset = () => {
    localStorage.removeItem('userData')
    setUserData(null)
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-900 dark:bg-gray-100">
        {userData ? (
          <CalendarGrid userData={userData} onReset={handleReset} />
        ) : (
          <SetupForm onSubmit={handleSubmit} />
        )}
      </div>
    </ThemeProvider>
  )
}

export default App
