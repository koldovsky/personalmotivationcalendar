import { useState, useEffect } from 'react'
import SetupForm from './components/SetupForm'
import CalendarGrid from './components/CalendarGrid'
import { UserData } from './types'
import './App.css'

function App() {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const savedData = localStorage.getItem('userData')
    if (savedData) {
      setUserData(JSON.parse(savedData))
    }
  }, [])

  const handleSetupSubmit = (data: UserData) => {
    setUserData(data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!userData ? (
        <div className="container mx-auto py-8">
          <SetupForm onSubmit={handleSetupSubmit} />
        </div>
      ) : (
        <CalendarGrid userData={userData} />
      )}
    </div>
  )
}

export default App
