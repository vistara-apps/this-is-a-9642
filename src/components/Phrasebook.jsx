import React, { useState, useEffect } from 'react'
import { MessageSquare, Copy, Play, Lock, Globe, Search } from 'lucide-react'

const Phrasebook = ({ user, onUpgradeNeeded }) => {
  const [scripts, setScripts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('traffic')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedScript, setCopiedScript] = useState(null)

  // Mock scripts data
  const scriptData = {
    traffic: {
      en: [
        {
          id: 1,
          scenario: 'Traffic Stop - Initial Response',
          scriptText: 'Good [morning/afternoon/evening], officer. I am exercising my right to remain silent. I do not consent to any searches.',
          premium: false
        },
        {
          id: 2,
          scenario: 'Providing Required Documents',
          scriptText: 'Here is my driver\'s license, registration, and proof of insurance. I am exercising my right to remain silent beyond providing these documents.',
          premium: false
        },
        {
          id: 3,
          scenario: 'Refusing Vehicle Search',
          scriptText: 'Officer, I do not consent to any searches of my vehicle. I am exercising my constitutional rights.',
          premium: true
        }
      ],
      es: [
        {
          id: 4,
          scenario: 'Parada de Tráfico - Respuesta Inicial',
          scriptText: 'Buenos [días/tardes/noches], oficial. Estoy ejerciendo mi derecho a permanecer en silencio. No consiento a ninguna búsqueda.',
          premium: true
        }
      ]
    },
    street: {
      en: [
        {
          id: 5,
          scenario: 'Street Encounter - Questioning Rights',
          scriptText: 'Am I free to leave? I am exercising my right to remain silent. I do not consent to any searches.',
          premium: false
        },
        {
          id: 6,
          scenario: 'Requesting Officer Information',
          scriptText: 'May I please have your name and badge number? I would like to document this interaction.',
          premium: true
        }
      ],
      es: [
        {
          id: 7,
          scenario: 'Encuentro en la Calle - Derechos de Interrogatorio',
          scriptText: '¿Soy libre de irme? Estoy ejerciendo mi derecho a permanecer en silencio. No consiento a ninguna búsqueda.',
          premium: true
        }
      ]
    },
    home: {
      en: [
        {
          id: 8,
          scenario: 'Police at Door - Warrant Request',
          scriptText: 'I am speaking to you through the door. Do you have a warrant? I do not consent to entry without a warrant.',
          premium: true
        },
        {
          id: 9,
          scenario: 'Requesting to See Warrant',
          scriptText: 'If you have a warrant, please slide it under the door or hold it up to the window so I can read it.',
          premium: true
        }
      ]
    }
  }

  const categories = [
    { key: 'traffic', label: 'Traffic Stops', icon: '🚗' },
    { key: 'street', label: 'Street Encounters', icon: '🚶' },
    { key: 'home', label: 'Home Visits', icon: '🏠' }
  ]

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ]

  useEffect(() => {
    const categoryScripts = scriptData[selectedCategory]?.[selectedLanguage] || []
    setScripts(categoryScripts)
  }, [selectedCategory, selectedLanguage])

  const isPremiumScript = (script) => {
    return script.premium && user.subscriptionStatus !== 'premium'
  }

  const handleCopyScript = async (script) => {
    if (isPremiumScript(script)) {
      onUpgradeNeeded()
      return
    }

    try {
      await navigator.clipboard.writeText(script.scriptText)
      setCopiedScript(script.id)
      setTimeout(() => setCopiedScript(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handlePlayScript = (script) => {
    if (isPremiumScript(script)) {
      onUpgradeNeeded()
      return
    }

    // Text-to-speech functionality
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(script.scriptText)
      utterance.lang = selectedLanguage === 'es' ? 'es-ES' : 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  const filteredScripts = scripts.filter(script =>
    script.scenario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    script.scriptText.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-textPrimary mb-4">
          Legal Phrasebook & Scripts
        </h1>
        <p className="text-lg text-textSecondary max-w-3xl mx-auto">
          Pre-written phrases and scripts for common police encounter scenarios. 
          Communicate clearly and confidently while protecting your rights.
        </p>
      </div>

      {/* Controls */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Scenario Category
            </label>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`w-full text-left p-3 rounded-md border transition-all ${
                    selectedCategory === category.key
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              <Globe className="h-4 w-4 inline mr-1" />
              Language
            </label>
            <div className="space-y-2">
              {languages.map(language => (
                <button
                  key={language.code}
                  onClick={() => setSelectedLanguage(language.code)}
                  className={`w-full text-left p-3 rounded-md border transition-all ${
                    selectedLanguage === language.code
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  } ${language.code !== 'en' && user.subscriptionStatus !== 'premium' ? 'opacity-60' : ''}`}
                  disabled={language.code !== 'en' && user.subscriptionStatus !== 'premium'}
                >
                  <span className="mr-2">{language.flag}</span>
                  {language.label}
                  {language.code !== 'en' && user.subscriptionStatus !== 'premium' && (
                    <Lock className="h-4 w-4 inline ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Search Scripts
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-textSecondary" />
              <input
                type="text"
                placeholder="Search scenarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scripts List */}
      <div className="space-y-4">
        {filteredScripts.length > 0 ? (
          filteredScripts.map(script => (
            <div
              key={script.id}
              className={`card hover:shadow-modal transition-all ${
                isPremiumScript(script) ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-textPrimary mb-2 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {script.scenario}
                    {isPremiumScript(script) && (
                      <Lock className="h-4 w-4 text-textSecondary" />
                    )}
                  </h3>
                  <div className={`bg-gray-50 rounded-md p-4 ${isPremiumScript(script) ? 'relative' : ''}`}>
                    <p className="text-textPrimary leading-relaxed">
                      {isPremiumScript(script) ? script.scriptText.substring(0, 50) + '...' : script.scriptText}
                    </p>
                    {isPremiumScript(script) && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md">
                        <button
                          onClick={() => onUpgradeNeeded()}
                          className="btn-primary flex items-center gap-2"
                        >
                          <Lock className="h-4 w-4" />
                          Upgrade to View
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyScript(script)}
                  disabled={isPremiumScript(script)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    isPremiumScript(script)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : copiedScript === script.id
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-textPrimary hover:bg-gray-200'
                  }`}
                >
                  <Copy className="h-4 w-4" />
                  {copiedScript === script.id ? 'Copied!' : 'Copy'}
                </button>

                <button
                  onClick={() => handlePlayScript(script)}
                  disabled={isPremiumScript(script)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    isPremiumScript(script)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:opacity-90'
                  }`}
                >
                  <Play className="h-4 w-4" />
                  Play
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <MessageSquare className="h-16 w-16 text-textSecondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-textPrimary mb-2">
              No Scripts Found
            </h3>
            <p className="text-textSecondary">
              Try adjusting your search terms or selecting a different category.
            </p>
          </div>
        )}
      </div>

      {/* Premium Upsell */}
      {user.subscriptionStatus === 'free' && (
        <div className="mt-12 card bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-textPrimary mb-4">
              Unlock All Languages & Advanced Scripts
            </h3>
            <p className="text-textSecondary mb-6">
              Premium users get access to scripts in multiple languages, state-specific variations, 
              and advanced scenario coverage.
            </p>
            <button
              onClick={onUpgradeNeeded}
              className="btn-primary"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Phrasebook