import React, { useState, useEffect } from 'react'
import { Lock, Book, MapPin, Clock, AlertCircle } from 'lucide-react'

const StateGuides = ({ user, setUser, onUpgradeNeeded }) => {
  const [guides, setGuides] = useState({})
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock state guides data
  const stateGuides = {
    CA: {
      stateCode: 'CA',
      stateName: 'California',
      lastUpdated: '2024-01-15',
      guideContent: {
        title: 'Know Your Rights in California',
        sections: [
          {
            title: 'During a Traffic Stop',
            content: [
              'You have the right to remain silent.',
              'You must provide your driver\'s license, registration, and proof of insurance if requested.',
              'You do not have to consent to a vehicle search.',
              'If arrested, ask for a lawyer immediately.',
              'Stay calm and keep your hands visible.'
            ]
          },
          {
            title: 'Police Encounters on Foot',
            content: [
              'You have the right to remain silent.',
              'You can ask "Am I free to leave?" If yes, you can walk away.',
              'You do not have to consent to a search of your person or belongings.',
              'Never resist physically, even if you believe the stop is unlawful.',
              'Ask for identification if the officer is not in uniform.'
            ]
          },
          {
            title: 'At Your Home',
            content: [
              'Police need a warrant to enter your home in most cases.',
              'You do not have to let them in without a warrant.',
              'You can speak to them through the door.',
              'If they have a warrant, do not resist but ask to see it.',
              'You have the right to remain silent even in your own home.'
            ]
          }
        ]
      }
    },
    NY: {
      stateCode: 'NY',
      stateName: 'New York',
      lastUpdated: '2024-01-10',
      guideContent: {
        title: 'Know Your Rights in New York',
        sections: [
          {
            title: 'Stop and Frisk',
            content: [
              'Police can stop you if they have reasonable suspicion of criminal activity.',
              'You have the right to ask "Am I free to leave?"',
              'A frisk requires reasonable suspicion that you are armed.',
              'You do not have to consent to a full search.',
              'Ask for the officer\'s name and badge number.'
            ]
          },
          {
            title: 'Police Questioning',
            content: [
              'You have the right to remain silent.',
              'You can ask for a lawyer at any time.',
              'You do not have to answer questions without a lawyer present.',
              'Be polite but firm about exercising your rights.',
              'Never provide false information.'
            ]
          }
        ]
      }
    }
  }

  useEffect(() => {
    // Simulate loading state guides
    setTimeout(() => {
      setGuides(stateGuides)
      setLoading(false)
    }, 1000)
  }, [])

  const isPremiumContent = (stateCode) => {
    return stateCode !== 'CA' && user.subscriptionStatus !== 'premium'
  }

  const handleGuideSelect = (stateCode) => {
    if (isPremiumContent(stateCode)) {
      onUpgradeNeeded()
      return
    }
    setSelectedGuide(guides[stateCode])
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-textSecondary">Loading state guides...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-textPrimary mb-4">
          Know Your Rights by State
        </h1>
        <p className="text-lg text-textSecondary max-w-3xl mx-auto">
          State-specific legal rights information for police encounters. Laws vary by state, 
          so make sure you're viewing the correct guide for your location.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* State Selection */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="text-xl font-semibold text-textPrimary mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Select Your State
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.values(stateGuides).map((guide) => (
                <button
                  key={guide.stateCode}
                  onClick={() => handleGuideSelect(guide.stateCode)}
                  className={`w-full text-left p-3 rounded-md border transition-all ${
                    selectedGuide?.stateCode === guide.stateCode
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-gray-50'
                  } ${isPremiumContent(guide.stateCode) ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {guide.stateName} ({guide.stateCode})
                      </div>
                      <div className="text-sm text-textSecondary">
                        Updated: {new Date(guide.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                    {isPremiumContent(guide.stateCode) && (
                      <Lock className="h-4 w-4 text-textSecondary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {user.subscriptionStatus === 'free' && (
              <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-md">
                <p className="text-sm text-textSecondary mb-2">
                  <Lock className="h-4 w-4 inline mr-1" />
                  Free users get access to California guides only.
                </p>
                <button
                  onClick={onUpgradeNeeded}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Upgrade to Premium for all states →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Guide Content */}
        <div className="lg:col-span-2">
          {selectedGuide ? (
            <div className="card">
              <div className="border-b border-border pb-6 mb-6">
                <h2 className="text-2xl font-bold text-textPrimary mb-2">
                  {selectedGuide.guideContent.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-textSecondary">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedGuide.stateName}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Updated {new Date(selectedGuide.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {selectedGuide.guideContent.sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-semibold text-textPrimary mb-4 flex items-center gap-2">
                      <Book className="h-5 w-5" />
                      {section.title}
                    </h3>
                    <div className="bg-gray-50 rounded-md p-4">
                      <ul className="space-y-3">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <span className="text-textPrimary">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">Important Disclaimer</h4>
                    <p className="text-sm text-amber-700">
                      This information is for educational purposes only and should not be considered legal advice. 
                      Laws can change and vary by jurisdiction. When in doubt, consult with a qualified attorney.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <Book className="h-16 w-16 text-textSecondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-textPrimary mb-2">
                Select a State to View Rights Guide
              </h3>
              <p className="text-textSecondary">
                Choose your state from the list to see specific legal rights information for police encounters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StateGuides