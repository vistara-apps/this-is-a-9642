// Data service layer for KnowMyRights.ai
// Handles data persistence, user management, and local storage

class DataService {
  constructor() {
    this.storageKeys = {
      user: 'knowmyrights-user',
      incidents: 'knowmyrights-incidents',
      emergencyContacts: 'knowmyrights-emergency-contacts',
      preferences: 'knowmyrights-preferences'
    }
  }

  // User Management
  createUser(userData = {}) {
    const defaultUser = {
      userId: this.generateUUID(),
      email: null,
      subscriptionStatus: 'free',
      preferredLanguage: 'en',
      currentState: 'CA',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const user = { ...defaultUser, ...userData }
    this.saveUser(user)
    return user
  }

  getUser() {
    try {
      const userData = localStorage.getItem(this.storageKeys.user)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error loading user data:', error)
      return null
    }
  }

  saveUser(user) {
    try {
      const updatedUser = {
        ...user,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(this.storageKeys.user, JSON.stringify(updatedUser))
      return updatedUser
    } catch (error) {
      console.error('Error saving user data:', error)
      return user
    }
  }

  updateUser(updates) {
    const currentUser = this.getUser()
    if (!currentUser) {
      return this.createUser(updates)
    }

    const updatedUser = { ...currentUser, ...updates }
    return this.saveUser(updatedUser)
  }

  // Incident Management
  saveIncident(incidentData) {
    const incident = {
      recordId: incidentData.recordId || this.generateUUID(),
      userId: incidentData.userId,
      timestamp: incidentData.timestamp || new Date().toISOString(),
      eventType: incidentData.eventType,
      audioBlobUrl: incidentData.audioBlobUrl || null,
      videoBlobUrl: incidentData.videoBlobUrl || null,
      location: incidentData.location || null,
      userNotes: incidentData.userNotes || '',
      generatedCardUrl: incidentData.generatedCardUrl || null,
      createdAt: new Date().toISOString()
    }

    const incidents = this.getIncidents()
    const updatedIncidents = [incident, ...incidents]
    
    try {
      localStorage.setItem(this.storageKeys.incidents, JSON.stringify(updatedIncidents))
      return incident
    } catch (error) {
      console.error('Error saving incident:', error)
      return null
    }
  }

  getIncidents(userId = null) {
    try {
      const incidents = localStorage.getItem(this.storageKeys.incidents)
      const allIncidents = incidents ? JSON.parse(incidents) : []
      
      if (userId) {
        return allIncidents.filter(incident => incident.userId === userId)
      }
      
      return allIncidents
    } catch (error) {
      console.error('Error loading incidents:', error)
      return []
    }
  }

  getIncident(recordId) {
    const incidents = this.getIncidents()
    return incidents.find(incident => incident.recordId === recordId) || null
  }

  updateIncident(recordId, updates) {
    const incidents = this.getIncidents()
    const incidentIndex = incidents.findIndex(incident => incident.recordId === recordId)
    
    if (incidentIndex === -1) {
      return null
    }

    incidents[incidentIndex] = { ...incidents[incidentIndex], ...updates }
    
    try {
      localStorage.setItem(this.storageKeys.incidents, JSON.stringify(incidents))
      return incidents[incidentIndex]
    } catch (error) {
      console.error('Error updating incident:', error)
      return null
    }
  }

  deleteIncident(recordId) {
    const incidents = this.getIncidents()
    const filteredIncidents = incidents.filter(incident => incident.recordId !== recordId)
    
    try {
      localStorage.setItem(this.storageKeys.incidents, JSON.stringify(filteredIncidents))
      return true
    } catch (error) {
      console.error('Error deleting incident:', error)
      return false
    }
  }

  // Emergency Contacts Management
  getEmergencyContacts() {
    try {
      const contacts = localStorage.getItem(this.storageKeys.emergencyContacts)
      return contacts ? JSON.parse(contacts) : [
        { id: '1', name: 'Emergency Contact', phone: '', email: '' }
      ]
    } catch (error) {
      console.error('Error loading emergency contacts:', error)
      return []
    }
  }

  saveEmergencyContacts(contacts) {
    try {
      const contactsWithIds = contacts.map(contact => ({
        id: contact.id || this.generateUUID(),
        name: contact.name || '',
        phone: contact.phone || '',
        email: contact.email || ''
      }))
      
      localStorage.setItem(this.storageKeys.emergencyContacts, JSON.stringify(contactsWithIds))
      return contactsWithIds
    } catch (error) {
      console.error('Error saving emergency contacts:', error)
      return contacts
    }
  }

  addEmergencyContact(contact) {
    const contacts = this.getEmergencyContacts()
    const newContact = {
      id: this.generateUUID(),
      name: contact.name || '',
      phone: contact.phone || '',
      email: contact.email || ''
    }
    
    const updatedContacts = [...contacts, newContact]
    return this.saveEmergencyContacts(updatedContacts)
  }

  updateEmergencyContact(contactId, updates) {
    const contacts = this.getEmergencyContacts()
    const contactIndex = contacts.findIndex(contact => contact.id === contactId)
    
    if (contactIndex === -1) {
      return contacts
    }

    contacts[contactIndex] = { ...contacts[contactIndex], ...updates }
    return this.saveEmergencyContacts(contacts)
  }

  deleteEmergencyContact(contactId) {
    const contacts = this.getEmergencyContacts()
    const filteredContacts = contacts.filter(contact => contact.id !== contactId)
    return this.saveEmergencyContacts(filteredContacts)
  }

  // User Preferences
  getPreferences() {
    try {
      const preferences = localStorage.getItem(this.storageKeys.preferences)
      return preferences ? JSON.parse(preferences) : {
        notifications: true,
        autoRecord: false,
        defaultRecordingType: 'audio',
        emergencyAlerts: true,
        shareLocation: true,
        language: 'en'
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
      return {}
    }
  }

  savePreferences(preferences) {
    try {
      const currentPrefs = this.getPreferences()
      const updatedPrefs = { ...currentPrefs, ...preferences }
      localStorage.setItem(this.storageKeys.preferences, JSON.stringify(updatedPrefs))
      return updatedPrefs
    } catch (error) {
      console.error('Error saving preferences:', error)
      return preferences
    }
  }

  // Data Export/Import
  exportUserData() {
    const user = this.getUser()
    const incidents = this.getIncidents(user?.userId)
    const emergencyContacts = this.getEmergencyContacts()
    const preferences = this.getPreferences()

    return {
      user,
      incidents,
      emergencyContacts,
      preferences,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
  }

  importUserData(data) {
    try {
      if (data.user) {
        this.saveUser(data.user)
      }
      if (data.incidents) {
        localStorage.setItem(this.storageKeys.incidents, JSON.stringify(data.incidents))
      }
      if (data.emergencyContacts) {
        this.saveEmergencyContacts(data.emergencyContacts)
      }
      if (data.preferences) {
        this.savePreferences(data.preferences)
      }
      return true
    } catch (error) {
      console.error('Error importing user data:', error)
      return false
    }
  }

  // Data Cleanup
  clearAllData() {
    try {
      Object.values(this.storageKeys).forEach(key => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error('Error clearing data:', error)
      return false
    }
  }

  // Analytics and Usage Tracking (Privacy-focused)
  trackUsage(event, data = {}) {
    // In a real implementation, this would send anonymized usage data
    // to help improve the app while respecting user privacy
    console.log('Usage tracked:', event, data)
    
    // Store locally for now
    try {
      const usage = JSON.parse(localStorage.getItem('knowmyrights-usage') || '[]')
      usage.push({
        event,
        data,
        timestamp: new Date().toISOString()
      })
      
      // Keep only last 100 events to prevent storage bloat
      const recentUsage = usage.slice(-100)
      localStorage.setItem('knowmyrights-usage', JSON.stringify(recentUsage))
    } catch (error) {
      console.error('Error tracking usage:', error)
    }
  }

  // Utility Functions
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  // Validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  validatePhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
  }

  // Storage Management
  getStorageUsage() {
    let totalSize = 0
    const usage = {}

    Object.entries(this.storageKeys).forEach(([key, storageKey]) => {
      const data = localStorage.getItem(storageKey)
      const size = data ? new Blob([data]).size : 0
      usage[key] = {
        size,
        formattedSize: this.formatFileSize(size)
      }
      totalSize += size
    })

    return {
      total: {
        size: totalSize,
        formattedSize: this.formatFileSize(totalSize)
      },
      breakdown: usage
    }
  }
}

export default new DataService()
