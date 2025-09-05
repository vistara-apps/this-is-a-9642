import React from 'react'
import { Shield, Book, Mic, Share2, ArrowRight, Star } from 'lucide-react'

const Hero = ({ setCurrentSection }) => {
  const features = [
    {
      icon: Shield,
      title: 'Know Your Rights',
      description: 'State-specific guides for police encounters',
      action: () => setCurrentSection('guides')
    },
    {
      icon: Book,
      title: 'Phrasebook',
      description: 'Pre-written scripts in multiple languages',
      action: () => setCurrentSection('phrasebook')
    },
    {
      icon: Mic,
      title: 'Record Incidents',
      description: 'One-tap recording with location alerts',
      action: () => setCurrentSection('record')
    },
    {
      icon: Share2,
      title: 'Shareable Cards',
      description: 'Auto-generated documentation for sharing',
      action: () => setCurrentSection('cards')
    }
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl sm:text-6xl font-bold text-textPrimary mb-6">
              Know Your Rights.<br />
              <span className="text-primary">Protect Yourself.</span>
            </h1>
            <p className="text-lg sm:text-xl text-textSecondary max-w-3xl mx-auto mb-8">
              Instant legal clarity in your pocket. Empowering individuals with immediate, 
              understandable legal rights information and documentation tools for police encounters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentSection('guides')}
                className="btn-primary flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentSection('phrasebook')}
                className="btn-secondary"
              >
                View Phrasebook
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-textPrimary mb-4">
            Everything you need to know your rights
          </h2>
          <p className="text-lg text-textSecondary max-w-2xl mx-auto">
            Comprehensive tools designed to help you navigate police encounters with confidence and knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card hover:shadow-modal transition-all duration-300 cursor-pointer group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={feature.action}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-textPrimary mb-2">
                  {feature.title}
                </h3>
                <p className="text-textSecondary">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-surface py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-textPrimary mb-6">
                Why KnowMyRights.ai?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-1">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-textPrimary mb-1">State-Specific Accuracy</h3>
                    <p className="text-textSecondary">Laws vary by state. Our guides are tailored to your specific location for maximum accuracy.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-1">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-textPrimary mb-1">Instant Access</h3>
                    <p className="text-textSecondary">No time to research in stressful situations. Get the information you need instantly.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-1">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-textPrimary mb-1">Evidence Collection</h3>
                    <p className="text-textSecondary">Built-in recording and documentation tools to protect yourself legally.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-textPrimary mb-4">Start Free Today</h3>
              <p className="text-textSecondary mb-6">
                Basic guides and scripts available for free. Upgrade to Premium for complete state coverage and advanced features.
              </p>
              <button
                onClick={() => setCurrentSection('guides')}
                className="btn-primary w-full"
              >
                Explore Free Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero