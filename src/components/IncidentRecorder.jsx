import React, { useState, useRef, useEffect } from 'react'
import { Mic, Video, Square, MapPin, Clock, AlertTriangle, Send, Upload, Loader2 } from 'lucide-react'
import apiService from '../services/api'
import dataService from '../services/dataService'

const IncidentRecorder = ({ user, onIncidentRecorded }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingType, setRecordingType] = useState('audio') // 'audio' or 'video'
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaStream, setMediaStream] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [recordedData, setRecordedData] = useState([])
  const [location, setLocation] = useState(null)
  const [notes, setNotes] = useState('')
  const [emergencyContacts, setEmergencyContacts] = useState([])
  const [alertSent, setAlertSent] = useState(false)
  const [uploadingToIPFS, setUploadingToIPFS] = useState(false)
  const [ipfsUrl, setIpfsUrl] = useState(null)

  const videoRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString()
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }

    // Load emergency contacts
    const contacts = dataService.getEmergencyContacts()
    setEmergencyContacts(contacts)

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const constraints = recordingType === 'video' 
        ? { video: true, audio: true }
        : { audio: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setMediaStream(stream)

      if (recordingType === 'video' && videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const recorder = new MediaRecorder(stream)
      const chunks = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { 
          type: recordingType === 'video' ? 'video/webm' : 'audio/webm' 
        })
        const url = URL.createObjectURL(blob)
        setRecordedData(prev => [...prev, { type: recordingType, blob, url }])
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access camera/microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
    }
    
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
      setMediaStream(null)
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setIsRecording(false)
  }

  const sendAlert = async () => {
    if (alertSent || emergencyContacts.length === 0) return

    const alertMessage = `🚨 POLICE ENCOUNTER ALERT 🚨
Location: ${location ? `${location.latitude}, ${location.longitude}` : 'Unknown'}
Time: ${new Date().toLocaleString()}
Status: Currently recording interaction
Please monitor this situation.

This is an automated alert from KnowMyRights.ai`

    try {
      await apiService.sendEmergencyAlert(emergencyContacts, location, alertMessage)
      setAlertSent(true)
      setTimeout(() => setAlertSent(false), 30000) // Reset after 30 seconds
    } catch (error) {
      console.error('Error sending alert:', error)
      // Could add toast notification here
    }
  }

  const uploadToIPFS = async (blob, type) => {
    if (!blob) return null

    setUploadingToIPFS(true)
    try {
      const file = new File([blob], `incident-${Date.now()}.${type === 'video' ? 'webm' : 'wav'}`, {
        type: blob.type
      })

      const result = await apiService.uploadToIPFS(file, {
        type: 'incident-recording',
        recordingType: type,
        userId: user.userId,
        location: location
      })

      setIpfsUrl(result.url)
      return result
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      return null
    } finally {
      setUploadingToIPFS(false)
    }
  }

  const saveIncident = async () => {
    let ipfsResult = null
    
    // Upload recording to IPFS if available
    if (recordedData.length > 0 && user.subscriptionStatus === 'premium') {
      const blob = new Blob(recordedData, { 
        type: recordingType === 'video' ? 'video/webm' : 'audio/wav' 
      })
      ipfsResult = await uploadToIPFS(blob, recordingType)
    }

    const incident = {
      eventType: 'police_encounter',
      timestamp: new Date().toISOString(),
      recordingType,
      duration: recordingTime,
      location,
      userNotes: notes,
      recordedData: recordedData.length > 0 ? recordedData : null,
      alertSent,
      ipfsUrl: ipfsResult?.url || null,
      ipfsHash: ipfsResult?.ipfsHash || null
    }

    // Save to data service
    const savedIncident = dataService.saveIncident({
      ...incident,
      userId: user.userId
    })

    if (savedIncident) {
      onIncidentRecorded(savedIncident)
      
      // Reset form
      setRecordedData([])
      setNotes('')
      setRecordingTime(0)
      setAlertSent(false)
      setIpfsUrl(null)
      
      alert('Incident recorded successfully!')
    } else {
      alert('Error saving incident. Please try again.')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-textPrimary mb-4">
          Incident Recorder
        </h1>
        <p className="text-lg text-textSecondary max-w-3xl mx-auto">
          One-tap recording for police encounters. Document interactions and alert trusted contacts for your safety.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recording Interface */}
        <div className="card">
          <h3 className="text-xl font-semibold text-textPrimary mb-6">
            Record Interaction
          </h3>

          {/* Recording Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Recording Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setRecordingType('audio')}
                disabled={isRecording}
                className={`flex-1 p-3 rounded-md border transition-all ${
                  recordingType === 'audio'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Mic className="h-5 w-5 mx-auto mb-1" />
                Audio Only
              </button>
              <button
                onClick={() => setRecordingType('video')}
                disabled={isRecording}
                className={`flex-1 p-3 rounded-md border transition-all ${
                  recordingType === 'video'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Video className="h-5 w-5 mx-auto mb-1" />
                Video + Audio
              </button>
            </div>
          </div>

          {/* Video Preview */}
          {recordingType === 'video' && (
            <div className="mb-6">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-48 bg-black rounded-md"
              />
            </div>
          )}

          {/* Recording Controls */}
          <div className="text-center mb-6">
            {isRecording && (
              <div className="mb-4">
                <div className="text-2xl font-mono text-red-600 mb-2">
                  <Clock className="h-5 w-5 inline mr-2" />
                  {formatTime(recordingTime)}
                </div>
                <div className="flex items-center justify-center text-red-600">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse mr-2"></div>
                  Recording in progress...
                </div>
              </div>
            )}

            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-primary hover:opacity-90 text-white'
              }`}
            >
              {isRecording ? (
                <Square className="h-8 w-8" />
              ) : recordingType === 'video' ? (
                <Video className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </button>
          </div>

          {/* Emergency Alert */}
          <div className="border-t border-border pt-6">
            <button
              onClick={sendAlert}
              disabled={alertSent}
              className={`w-full p-4 rounded-md font-medium transition-all ${
                alertSent
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <AlertTriangle className="h-5 w-5 inline mr-2" />
              {alertSent ? 'Alert Sent!' : 'Send Emergency Alert'}
            </button>
            <p className="text-sm text-textSecondary mt-2 text-center">
              Sends your location and situation to emergency contacts
            </p>
          </div>
        </div>

        {/* Incident Details */}
        <div className="space-y-6">
          {/* Location Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-textPrimary mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Time
            </h3>
            {location ? (
              <div className="space-y-2 text-sm">
                <p><strong>Latitude:</strong> {location.latitude}</p>
                <p><strong>Longitude:</strong> {location.longitude}</p>
                <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-textSecondary text-sm">Getting location...</p>
            )}
          </div>

          {/* Notes */}
          <div className="card">
            <h3 className="text-lg font-semibold text-textPrimary mb-4">
              Incident Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe what happened, officer details, badge numbers, etc..."
              rows={6}
              className="input resize-none"
            />
          </div>

          {/* Emergency Contacts */}
          <div className="card">
            <h3 className="text-lg font-semibold text-textPrimary mb-4">
              Emergency Contacts
            </h3>
            <div className="space-y-2">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-textSecondary">{contact.phone}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 text-sm text-primary hover:underline">
              + Add Contact
            </button>
          </div>

          {/* Save Incident */}
          {(recordedData.length > 0 || notes.trim()) && (
            <button
              onClick={saveIncident}
              className="btn-primary w-full"
            >
              Save Incident Record
            </button>
          )}
        </div>
      </div>

      {/* Recorded Files */}
      {recordedData.length > 0 && (
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">
            Recorded Files
          </h3>
          <div className="space-y-4">
            {recordedData.map((recording, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  {recording.type === 'video' ? (
                    <Video className="h-5 w-5 text-primary" />
                  ) : (
                    <Mic className="h-5 w-5 text-primary" />
                  )}
                  <span className="font-medium">
                    {recording.type === 'video' ? 'Video Recording' : 'Audio Recording'}
                  </span>
                </div>
                <a
                  href={recording.url}
                  download={`incident-${recording.type}-${Date.now()}.webm`}
                  className="text-primary hover:underline text-sm"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default IncidentRecorder
