// API service layer for KnowMyRights.ai
// Handles all external API integrations

class APIService {
  constructor() {
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY
    this.pinataApiKey = import.meta.env.VITE_PINATA_API_KEY
    this.pinataSecretKey = import.meta.env.VITE_PINATA_SECRET_KEY
    this.stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  }

  // OpenAI API Integration
  async generateScript(scenario, language = 'en', stateCode = null) {
    if (!this.openaiApiKey) {
      console.warn('OpenAI API key not configured, using fallback')
      return this.getFallbackScript(scenario, language)
    }

    try {
      const prompt = this.buildScriptPrompt(scenario, language, stateCode)
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a legal rights assistant helping people communicate clearly during police encounters. Provide concise, respectful, and legally sound phrases.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.3
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return {
        scriptText: data.choices[0].message.content.trim(),
        generated: true,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error generating script:', error)
      return this.getFallbackScript(scenario, language)
    }
  }

  buildScriptPrompt(scenario, language, stateCode) {
    const stateInfo = stateCode ? ` in ${stateCode}` : ''
    const langInfo = language === 'es' ? ' Respond in Spanish.' : ''
    
    return `Generate a clear, respectful script for this police encounter scenario${stateInfo}: "${scenario}". 
    Include 2-3 key phrases that assert rights while remaining cooperative. 
    Keep it under 150 words and focus on de-escalation.${langInfo}`
  }

  getFallbackScript(scenario, language) {
    const fallbackScripts = {
      'traffic-stop': {
        en: "I understand you've stopped me. I'm going to remain silent and would like to speak with a lawyer. I do not consent to any searches. Here are my license and registration.",
        es: "Entiendo que me ha detenido. Voy a permanecer en silencio y me gustaría hablar con un abogado. No consiento ningún registro. Aquí están mi licencia y registro."
      },
      'street-encounter': {
        en: "Am I free to leave? I'm exercising my right to remain silent. I do not consent to any searches. I would like to speak with a lawyer.",
        es: "¿Soy libre de irme? Estoy ejerciendo mi derecho a permanecer en silencio. No consiento ningún registro. Me gustaría hablar con un abogado."
      },
      'home-visit': {
        en: "I see you're at my door. Do you have a warrant? I'm exercising my right to remain silent and would like to speak with a lawyer. I do not consent to entry or searches.",
        es: "Veo que están en mi puerta. ¿Tienen una orden judicial? Estoy ejerciendo mi derecho a permanecer en silencio y me gustaría hablar con un abogado. No consiento la entrada o registros."
      }
    }

    const script = fallbackScripts[scenario]?.[language] || fallbackScripts['street-encounter'][language]
    return {
      scriptText: script,
      generated: false,
      timestamp: new Date().toISOString()
    }
  }

  // Generate incident summary for shareable cards
  async generateIncidentSummary(incidentData) {
    if (!this.openaiApiKey) {
      return this.getFallbackSummary(incidentData)
    }

    try {
      const prompt = `Summarize this police encounter incident for a shareable card. Keep it factual, concise (under 100 words), and include key details:
      
      Time: ${incidentData.timestamp}
      Location: ${incidentData.location ? `${incidentData.location.latitude}, ${incidentData.location.longitude}` : 'Not recorded'}
      Type: ${incidentData.eventType}
      Notes: ${incidentData.userNotes || 'No additional notes'}
      
      Format as a brief, professional summary suitable for legal documentation.`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a legal documentation assistant. Create clear, factual summaries of police encounters for documentation purposes.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 150,
          temperature: 0.1
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content.trim()
    } catch (error) {
      console.error('Error generating summary:', error)
      return this.getFallbackSummary(incidentData)
    }
  }

  getFallbackSummary(incidentData) {
    const date = new Date(incidentData.timestamp).toLocaleDateString()
    const time = new Date(incidentData.timestamp).toLocaleTimeString()
    
    return `Police encounter documented on ${date} at ${time}. Event type: ${incidentData.eventType}. ${incidentData.userNotes ? `Notes: ${incidentData.userNotes.substring(0, 100)}...` : 'No additional details recorded.'}`
  }

  // Pinata IPFS Integration
  async uploadToIPFS(file, metadata = {}) {
    if (!this.pinataApiKey || !this.pinataSecretKey) {
      console.warn('Pinata API keys not configured, using local storage fallback')
      return this.createLocalFileUrl(file)
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const pinataMetadata = JSON.stringify({
        name: metadata.name || `incident-${Date.now()}`,
        keyvalues: {
          type: metadata.type || 'incident-recording',
          timestamp: new Date().toISOString(),
          ...metadata
        }
      })
      formData.append('pinataMetadata', pinataMetadata)

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Pinata API error: ${response.status}`)
      }

      const data = await response.json()
      return {
        ipfsHash: data.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
        pinSize: data.PinSize,
        timestamp: data.Timestamp
      }
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      return this.createLocalFileUrl(file)
    }
  }

  createLocalFileUrl(file) {
    const url = URL.createObjectURL(file)
    return {
      ipfsHash: null,
      url: url,
      pinSize: file.size,
      timestamp: new Date().toISOString(),
      local: true
    }
  }

  // Stripe Integration (Client-side)
  async createPaymentIntent(amount, currency = 'usd') {
    // In a real implementation, this would call your backend
    // which would create the payment intent server-side
    console.warn('Stripe integration requires backend implementation')
    
    // Mock response for demo purposes
    return {
      clientSecret: 'pi_mock_client_secret',
      amount: amount,
      currency: currency,
      status: 'requires_payment_method'
    }
  }

  // State-specific legal data
  async getStateGuide(stateCode) {
    // In a real implementation, this would fetch from a legal database
    // For now, return enhanced mock data
    const guides = await this.loadStateGuides()
    return guides[stateCode] || guides['DEFAULT']
  }

  async loadStateGuides() {
    // This would typically come from a legal database or CMS
    // Enhanced with more comprehensive state-specific information
    return {
      'CA': {
        stateCode: 'CA',
        stateName: 'California',
        lastUpdated: '2024-01-15',
        guideContent: {
          title: 'Know Your Rights in California',
          sections: [
            {
              title: 'During a Traffic Stop',
              content: [
                'You have the right to remain silent under the 5th Amendment.',
                'You must provide your driver\'s license, registration, and proof of insurance if requested.',
                'You do not have to consent to a vehicle search without a warrant.',
                'If arrested, clearly state: "I want to speak with a lawyer."',
                'Stay calm, keep hands visible, and avoid sudden movements.',
                'California law requires you to exit the vehicle if ordered by police.',
                'You can record the interaction if it doesn\'t interfere with the stop.'
              ]
            },
            {
              title: 'Police Encounters on Foot',
              content: [
                'You have the right to remain silent.',
                'Ask clearly: "Am I free to leave?" If yes, you can walk away calmly.',
                'You do not have to consent to a search of your person or belongings.',
                'Never physically resist, even if you believe the stop is unlawful.',
                'Ask for identification if the officer is not in uniform.',
                'California allows you to record police in public spaces.',
                'You don\'t have to answer questions about your immigration status.'
              ]
            },
            {
              title: 'At Your Home',
              content: [
                'Police generally need a warrant to enter your home.',
                'You do not have to let them in without a warrant.',
                'You can speak to them through the door or step outside.',
                'If they claim to have a warrant, ask to see it before allowing entry.',
                'You have the right to remain silent even in your own home.',
                'California has strong privacy protections for your residence.',
                'Emergency exceptions exist but are limited in scope.'
              ]
            },
            {
              title: 'California-Specific Laws',
              content: [
                'California Penal Code 148(g) protects your right to record police.',
                'The state has "sanctuary" laws limiting cooperation with federal immigration.',
                'California requires police to identify themselves when requested.',
                'Body cameras are required for many law enforcement agencies.',
                'You have the right to an interpreter if needed.'
              ]
            }
          ]
        }
      },
      'DEFAULT': {
        stateCode: 'US',
        stateName: 'United States (General)',
        lastUpdated: '2024-01-15',
        guideContent: {
          title: 'Know Your Constitutional Rights',
          sections: [
            {
              title: 'Universal Rights During Police Encounters',
              content: [
                'You have the right to remain silent (5th Amendment).',
                'You have the right to an attorney (6th Amendment).',
                'You are protected from unreasonable searches (4th Amendment).',
                'You do not have to consent to searches without a warrant.',
                'You have the right to record police in public spaces.',
                'Never physically resist, even if you believe your rights are violated.',
                'Clearly state your rights: "I am exercising my right to remain silent."'
              ]
            }
          ]
        }
      }
    }
  }

  // Emergency contact management
  async sendEmergencyAlert(contacts, location, message) {
    // In a real implementation, this would integrate with SMS/messaging APIs
    console.log('Emergency alert would be sent to:', contacts)
    console.log('Location:', location)
    console.log('Message:', message)
    
    // Mock successful response
    return {
      success: true,
      sentTo: contacts.length,
      timestamp: new Date().toISOString()
    }
  }
}

export default new APIService()
