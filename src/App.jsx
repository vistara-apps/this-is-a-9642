import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import StateGuides from './components/StateGuides'
import Phrasebook from './components/Phrasebook'
import IncidentRecorder from './components/IncidentRecorder'
import ShareableCards from './components/ShareableCards'
import SubscriptionModal from './components/SubscriptionModal'

function App() {
  const [currentSection, setCurrentSection] = useState('home')
  const [user, setUser] = useState({
    userId: null,
    subscriptionStatus: 'free', // 'free' or 'premium'
    preferredLanguage: 'en',
    currentState: 'CA'
  })
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [incidents, setIncidents] = useState([])

  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('knowmyrights-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Save user data to localStorage
  useEffect(() => {
    localStorage.setItem('knowmyrights-user', JSON.stringify(user))
  }, [user])

  const upgradeToPremium = () => {
    setUser(prev => ({ ...prev, subscriptionStatus: 'premium' }))
    setShowSubscriptionModal(false)
  }

  const addIncident = (incident) => {
    const newIncident = {
      recordId: Date.now().toString(),
      userId: user.userId,
      timestamp: new Date().toISOString(),
      ...incident
    }
    setIncidents(prev => [newIncident, ...prev])
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header 
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        user={user}
        setUser={setUser}
      />
      
      <main className="relative">
        {currentSection === 'home' && (
          <Hero setCurrentSection={setCurrentSection} />
        )}
        
        {currentSection === 'guides' && (
          <StateGuides 
            user={user}
            setUser={setUser}
            onUpgradeNeeded={() => setShowSubscriptionModal(true)}
          />
        )}
        
        {currentSection === 'phrasebook' && (
          <Phrasebook 
            user={user}
            onUpgradeNeeded={() => setShowSubscriptionModal(true)}
          />
        )}
        
        {currentSection === 'record' && (
          <IncidentRecorder 
            user={user}
            onIncidentRecorded={addIncident}
          />
        )}
        
        {currentSection === 'cards' && (
          <ShareableCards 
            incidents={incidents}
            user={user}
          />
        )}
      </main>

      {showSubscriptionModal && (
        <SubscriptionModal 
          onClose={() => setShowSubscriptionModal(false)}
          onUpgrade={upgradeToPremium}
        />
      )}
    </div>
  )
}

export default App