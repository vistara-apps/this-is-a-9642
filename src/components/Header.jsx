import React, { useState } from 'react'
import { Menu, X, User, Settings } from 'lucide-react'

const Header = ({ currentSection, setCurrentSection, user, setUser }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', key: 'home' },
    { name: 'Know Your Rights', key: 'guides' },
    { name: 'Phrasebook', key: 'phrasebook' },
    { name: 'Record Incident', key: 'record' },
    { name: 'My Cards', key: 'cards' },
  ]

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setCurrentSection('home')}
              className="text-xl font-bold text-primary hover:opacity-80 transition-opacity"
            >
              KnowMyRights.ai
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentSection(item.key)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currentSection === item.key
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* User Menu & State Selector */}
          <div className="hidden md:flex items-center space-x-4">
            {/* State Selector */}
            <select
              value={user.currentState}
              onChange={(e) => setUser(prev => ({ ...prev, currentState: e.target.value }))}
              className="text-sm border border-border rounded-md px-3 py-1 bg-surface"
            >
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            {/* Subscription Status */}
            <span className={`text-xs px-2 py-1 rounded-full ${
              user.subscriptionStatus === 'premium' 
                ? 'bg-accent text-white' 
                : 'bg-gray-200 text-textSecondary'
            }`}>
              {user.subscriptionStatus === 'premium' ? 'Premium' : 'Free'}
            </span>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 text-textSecondary hover:text-textPrimary transition-colors"
              >
                <User className="h-5 w-5" />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-md shadow-modal z-10">
                  <div className="p-4 border-b border-border">
                    <p className="text-sm text-textSecondary">Status: {user.subscriptionStatus}</p>
                    <p className="text-sm text-textSecondary">State: {user.currentState}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-textSecondary hover:bg-gray-50 rounded">
                      Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-textSecondary hover:text-textPrimary"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setCurrentSection(item.key)
                  setMobileMenuOpen(false)
                }}
                className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  currentSection === item.key
                    ? 'text-primary bg-primary/10'
                    : 'text-textSecondary hover:text-textPrimary hover:bg-gray-50'
                }`}
              >
                {item.name}
              </button>
            ))}
            
            {/* Mobile State Selector */}
            <div className="px-3 py-2">
              <label className="block text-sm text-textSecondary mb-1">State:</label>
              <select
                value={user.currentState}
                onChange={(e) => setUser(prev => ({ ...prev, currentState: e.target.value }))}
                className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface"
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            {/* Mobile Subscription Status */}
            <div className="px-3 py-2">
              <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                user.subscriptionStatus === 'premium' 
                  ? 'bg-accent text-white' 
                  : 'bg-gray-200 text-textSecondary'
              }`}>
                {user.subscriptionStatus === 'premium' ? 'Premium' : 'Free'}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header