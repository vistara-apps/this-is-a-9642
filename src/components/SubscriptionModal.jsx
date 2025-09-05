import React, { useState } from 'react'
import { X, Check, Star, Lock, Loader2, CreditCard } from 'lucide-react'
import stripeService from '../services/stripeService'

const SubscriptionModal = ({ onClose, onUpgrade }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [loading, setLoading] = useState(false)

  const plans = {
    monthly: {
      name: 'Premium Monthly',
      price: '$4.99',
      billing: 'per month',
      features: [
        'All 50 state-specific guides',
        'Multi-language scripts (English, Spanish)',
        'Advanced recording features',
        'Unlimited incident storage',
        'Priority support',
        'Real-time legal updates'
      ]
    },
    annual: {
      name: 'Premium Annual',
      price: '$49.99',
      billing: 'per year',
      savings: 'Save 17%',
      features: [
        'All 50 state-specific guides',
        'Multi-language scripts (English, Spanish)',
        'Advanced recording features',
        'Unlimited incident storage',
        'Priority support',
        'Real-time legal updates',
        '2 months free'
      ]
    }
  }

  const freeFeatures = [
    'California state guide only',
    'English scripts only',
    'Basic recording (5 incidents max)',
    'Limited shareable cards'
  ]

  const handleUpgrade = async () => {
    setLoading(true)
    
    try {
      // Get subscription plans from Stripe service
      const stripePlans = stripeService.getSubscriptionPlans()
      const plan = stripePlans.premium
      
      // Create checkout session
      const session = await stripeService.createCheckoutSession(
        'premium',
        'user-id', // In real app, this would be the actual user ID
        window.location.origin + '/success',
        window.location.origin + '/cancel'
      )

      if (session.mock) {
        // Mock successful payment for demo
        console.log('Mock payment processing for:', plan)
        await new Promise(resolve => setTimeout(resolve, 2000))
        onUpgrade()
      } else {
        // Redirect to Stripe Checkout
        const { error } = await stripeService.redirectToCheckout(session.id)
        if (error) {
          console.error('Stripe error:', error)
          alert('Payment failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-textPrimary mb-2">
                Upgrade to Premium
              </h2>
              <p className="text-textSecondary">
                Unlock all features and protect your rights in every state
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-textSecondary hover:text-textPrimary p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Plan Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Free Plan */}
            <div className="border border-border rounded-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-textPrimary mb-2">
                  Free
                </h3>
                <div className="text-3xl font-bold text-textPrimary mb-1">
                  $0
                </div>
                <p className="text-textSecondary">forever</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                    <span className="text-textSecondary text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full btn-secondary" disabled>
                Current Plan
              </button>
            </div>

            {/* Premium Plans */}
            {Object.entries(plans).map(([key, plan]) => (
              <div
                key={key}
                className={`border rounded-lg p-6 cursor-pointer transition-all ${
                  selectedPlan === key
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${key === 'annual' ? 'ring-2 ring-accent ring-opacity-20' : ''}`}
                onClick={() => setSelectedPlan(key)}
              >
                {key === 'annual' && (
                  <div className="text-center mb-4">
                    <span className="bg-accent text-white text-xs px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-textPrimary mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-bold text-textPrimary mb-1">
                    {plan.price}
                  </div>
                  <p className="text-textSecondary">{plan.billing}</p>
                  {plan.savings && (
                    <p className="text-accent font-medium text-sm mt-1">
                      {plan.savings}
                    </p>
                  )}
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-textPrimary text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center justify-center">
                  {selectedPlan === key && (
                    <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Benefits Highlight */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-textPrimary mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              Why Upgrade to Premium?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-textPrimary">Complete Legal Coverage</p>
                  <p className="text-sm text-textSecondary">Access guides for all 50 states with state-specific laws and procedures</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-textPrimary">Multi-Language Support</p>
                  <p className="text-sm text-textSecondary">Scripts and guides available in Spanish and other languages</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-textPrimary">Advanced Documentation</p>
                  <p className="text-sm text-textSecondary">Unlimited incident recording and professional shareable cards</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-textPrimary">Regular Updates</p>
                  <p className="text-sm text-textSecondary">Stay current with changing laws and legal precedents</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Continue with Free
            </button>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="flex-1 btn-primary relative"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                `Upgrade to ${plans[selectedPlan].name}`
              )}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-textSecondary">
              🔒 Secure payment powered by Stripe. Cancel anytime. 
              No questions asked 30-day money-back guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionModal
