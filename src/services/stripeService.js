// Stripe integration service for KnowMyRights.ai
// Handles subscription payments and billing

class StripeService {
  constructor() {
    this.stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    this.stripe = null
    this.initialized = false
  }

  async initialize() {
    if (this.initialized) return this.stripe

    if (!this.stripePublishableKey) {
      console.warn('Stripe publishable key not configured')
      return null
    }

    try {
      // Load Stripe.js dynamically
      if (!window.Stripe) {
        await this.loadStripeScript()
      }

      this.stripe = window.Stripe(this.stripePublishableKey)
      this.initialized = true
      return this.stripe
    } catch (error) {
      console.error('Error initializing Stripe:', error)
      return null
    }
  }

  async loadStripeScript() {
    return new Promise((resolve, reject) => {
      if (window.Stripe) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  // Subscription Plans
  getSubscriptionPlans() {
    return {
      premium: {
        id: 'premium',
        name: 'Premium',
        price: 4.99,
        currency: 'usd',
        interval: 'month',
        features: [
          'All state-specific guides',
          'Multi-language scripts (English & Spanish)',
          'Real-time emergency alerts',
          'Enhanced documentation features',
          'IPFS storage for recordings',
          'Priority support'
        ],
        stripePriceId: 'price_premium_monthly' // This would be your actual Stripe Price ID
      }
    }
  }

  // Create Checkout Session (requires backend)
  async createCheckoutSession(planId, userId, successUrl, cancelUrl) {
    const plan = this.getSubscriptionPlans()[planId]
    if (!plan) {
      throw new Error('Invalid subscription plan')
    }

    // In a real implementation, this would call your backend API
    // which would create the checkout session server-side
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          userId: userId,
          successUrl: successUrl,
          cancelUrl: cancelUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const session = await response.json()
      return session
    } catch (error) {
      console.error('Error creating checkout session:', error)
      
      // Mock response for demo purposes
      return {
        id: 'cs_mock_checkout_session',
        url: '#mock-checkout',
        mock: true
      }
    }
  }

  // Redirect to Checkout
  async redirectToCheckout(sessionId) {
    const stripe = await this.initialize()
    if (!stripe) {
      throw new Error('Stripe not initialized')
    }

    if (sessionId === 'cs_mock_checkout_session') {
      // Mock checkout flow for demo
      console.log('Mock checkout flow - would redirect to Stripe')
      return { error: null, mock: true }
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionId
    })

    if (error) {
      console.error('Stripe checkout error:', error)
    }

    return { error }
  }

  // Handle successful subscription
  async handleSuccessfulSubscription(sessionId, userId) {
    try {
      // In a real implementation, this would verify the session with your backend
      const response = await fetch('/api/verify-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          userId: userId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to verify subscription')
      }

      const subscription = await response.json()
      return subscription
    } catch (error) {
      console.error('Error verifying subscription:', error)
      
      // Mock successful subscription for demo
      return {
        id: 'sub_mock_subscription',
        status: 'active',
        current_period_end: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
        plan: this.getSubscriptionPlans().premium,
        mock: true
      }
    }
  }

  // Customer Portal (for managing subscriptions)
  async createCustomerPortalSession(customerId, returnUrl) {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customerId,
          returnUrl: returnUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const session = await response.json()
      return session
    } catch (error) {
      console.error('Error creating portal session:', error)
      
      // Mock portal session for demo
      return {
        url: '#mock-portal',
        mock: true
      }
    }
  }

  // Subscription Status Check
  async getSubscriptionStatus(userId) {
    try {
      const response = await fetch(`/api/subscription-status/${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to get subscription status')
      }

      const status = await response.json()
      return status
    } catch (error) {
      console.error('Error getting subscription status:', error)
      
      // Return free status as fallback
      return {
        status: 'free',
        subscription: null
      }
    }
  }

  // Cancel Subscription
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscriptionId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw error
    }
  }

  // Update Payment Method
  async updatePaymentMethod(customerId) {
    const stripe = await this.initialize()
    if (!stripe) {
      throw new Error('Stripe not initialized')
    }

    try {
      const { setupIntent, error } = await stripe.confirmSetup({
        // Setup intent would be created by your backend
        confirmParams: {
          return_url: window.location.origin + '/account'
        }
      })

      if (error) {
        throw error
      }

      return setupIntent
    } catch (error) {
      console.error('Error updating payment method:', error)
      throw error
    }
  }

  // Webhook Verification (backend only)
  // This is just for reference - webhooks must be handled server-side
  static verifyWebhookSignature(payload, signature, endpointSecret) {
    // This would be implemented in your backend
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    // return stripe.webhooks.constructEvent(payload, signature, endpointSecret)
    throw new Error('Webhook verification must be done server-side')
  }

  // Utility Methods
  formatPrice(amount, currency = 'usd') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  isSubscriptionActive(subscription) {
    if (!subscription) return false
    
    const now = Date.now() / 1000 // Stripe uses seconds
    return subscription.status === 'active' && 
           subscription.current_period_end > now
  }

  getDaysUntilRenewal(subscription) {
    if (!subscription || !subscription.current_period_end) return 0
    
    const now = Date.now() / 1000
    const secondsUntilRenewal = subscription.current_period_end - now
    return Math.ceil(secondsUntilRenewal / (24 * 60 * 60))
  }

  // Mock functions for demo purposes
  mockSuccessfulPayment() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          subscriptionId: 'sub_mock_' + Date.now(),
          customerId: 'cus_mock_' + Date.now(),
          status: 'active'
        })
      }, 2000) // Simulate API delay
    })
  }

  mockFailedPayment() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Payment failed: Card declined'))
      }, 2000)
    })
  }
}

export default new StripeService()
