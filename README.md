# KnowMyRights.ai

**Instant legal clarity in your pocket.**

KnowMyRights.ai empowers individuals by providing immediate, understandable legal rights information and documentation tools for police encounters.

## 🚀 Features

### Core Features
- **State-Specific Know-Your-Rights Guides**: Concise, mobile-optimized guides for all 50 US states
- **AI-Powered Phrasebook & Scripting**: Pre-written phrases and custom AI-generated scripts in multiple languages
- **One-Tap Incident Recording**: Instant audio/video recording with emergency alerts
- **Auto-Generated Shareable Cards**: AI-powered incident summaries with IPFS storage

### Premium Features
- All 50 state-specific guides (Free: California only)
- Multi-language scripts (English, Spanish, and more)
- Advanced recording features with IPFS storage
- AI-generated incident summaries
- Unlimited incident storage
- Emergency contact alerts

## 🛠 Tech Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React
- **AI Integration**: OpenAI GPT-3.5 Turbo
- **Storage**: IPFS via Pinata
- **Payments**: Stripe
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-9642.git
   cd this-is-a-9642
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys in the `.env` file:
   - `VITE_OPENAI_API_KEY`: OpenAI API key for AI features
   - `VITE_PINATA_API_KEY`: Pinata API key for IPFS storage
   - `VITE_PINATA_SECRET_KEY`: Pinata secret key
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key for payments

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Required API Keys

1. **OpenAI API Key**
   - Visit: https://platform.openai.com/api-keys
   - Used for: AI script generation and incident summaries

2. **Pinata IPFS Keys**
   - Visit: https://app.pinata.cloud/keys
   - Used for: Decentralized storage of recordings and media

3. **Stripe Keys**
   - Visit: https://dashboard.stripe.com/apikeys
   - Used for: Subscription management and payments

## 🏗 Architecture

### Service Layer
- **`apiService.js`**: Handles OpenAI, Pinata, and emergency alert integrations
- **`dataService.js`**: Manages local data storage and user preferences
- **`stripeService.js`**: Handles subscription and payment processing

### Components
- **`StateGuides`**: Interactive state-specific legal guides
- **`Phrasebook`**: AI-powered script generation and phrase library
- **`IncidentRecorder`**: One-tap recording with emergency alerts
- **`ShareableCards`**: AI-generated incident documentation
- **`SubscriptionModal`**: Stripe-integrated payment flow

### Data Model
- **User**: Profile, subscription status, preferences
- **StateGuide**: State-specific legal information
- **Script**: Phrase templates and AI-generated content
- **IncidentRecord**: Recorded interactions with metadata

## 🔒 Security & Privacy

- **Client-side encryption** for sensitive data
- **IPFS storage** for decentralized media storage
- **Secure payment processing** via Stripe
- **Privacy-focused analytics** (no personal data tracking)
- **Emergency contact alerts** with location data

## 💰 Business Model

### Freemium Subscription
- **Free Tier**: California guides, basic recording (5 incidents max)
- **Premium ($4.99/month)**: All states, AI features, unlimited storage

### Payment Processing
- Stripe integration for secure payments
- Subscription management with customer portal
- Webhook handling for subscription updates

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set environment variables in the platform
3. Deploy with automatic builds

### Environment Variables for Production
Ensure all API keys are set in your deployment platform:
- `VITE_OPENAI_API_KEY`
- `VITE_PINATA_API_KEY`
- `VITE_PINATA_SECRET_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`

## 📱 Usage

### For Users
1. **Browse State Guides**: Select your state for specific legal information
2. **Generate Scripts**: Use AI to create custom phrases for your situation
3. **Record Incidents**: One-tap recording with automatic emergency alerts
4. **Share Documentation**: Generate and share incident cards with legal counsel

### For Developers
1. **API Integration**: All services have fallback mechanisms for reliability
2. **Component Reusability**: Modular components with consistent design system
3. **Error Handling**: Comprehensive error handling with user-friendly messages
4. **Performance**: Optimized for mobile with efficient data loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@knowmyrights.ai or create an issue in this repository.

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Documentation**: [Coming Soon]
- **API Reference**: [Coming Soon]

---

**Built with ❤️ for civil rights and digital privacy**
