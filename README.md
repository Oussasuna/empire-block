# Empire Blocks - Frontend

A decentralized strategy game built on Solana where players mint territories, form empires, and battle for dominance.

## 🧪 Beta Testing

This project is currently in **beta testing** on Solana devnet.

### For Beta Testers

#### Quick Start

1. **Get Devnet SOL**: Visit [https://faucet.solana.com](https://faucet.solana.com) to get free devnet SOL
2. **Access Beta Site**: Connect your Solana wallet (Phantom or Solflare recommended)
3. **Read the Guide**: Visit `/beta-guide` on the site for detailed testing instructions
4. **Start Testing**: Mint territories, battle players, and use the marketplace

#### Beta Rewards

All beta testers will receive when we launch on mainnet:
- **2,500 $EMPIRE tokens** (base reward)
- **+10 $EMPIRE** per territory tested (activity bonus)
- **2 free territory mints**
- **Exclusive Beta Tester badge**
- **10% marketplace discount** (forever)

### Running Beta Locally

```bash
# Install dependencies
npm install

# Run in beta mode (devnet)
npm run dev:beta

# Build for beta
npm run build:beta

# Start production beta server
npm run start:beta
```

The beta scripts automatically configure the app to use Solana devnet.

## 🚀 Development

### Prerequisites

- Node.js 18+ and npm
- A Solana wallet (Phantom or Solflare)
- For beta testing: Devnet SOL from [Solana Faucet](https://faucet.solana.com)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd empire-blocks-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your configuration
# See Environment Variables section below
```

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Beta Testing Mode
NEXT_PUBLIC_IS_BETA=true

# Solana Network Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Smart Contract (Devnet)
NEXT_PUBLIC_PROGRAM_ID=YOUR_DEVNET_PROGRAM_ID_HERE

# Token (Devnet)
NEXT_PUBLIC_EMPIRE_TOKEN_MINT=YOUR_DEVNET_TOKEN_MINT_HERE

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Important:** Replace placeholder values with your actual devnet program IDs before testing.

### Available Scripts

```bash
# Development
npm run dev              # Run on mainnet (default)
npm run dev:beta         # Run on devnet (beta testing)

# Production Build
npm run build            # Build for mainnet
npm run build:beta       # Build for devnet

# Production Server
npm run start            # Start mainnet server
npm run start:beta       # Start devnet server

# Linting
npm run lint             # Run ESLint
```

## 🎮 Features

- **Territory Minting**: Mint unique territories on the Solana blockchain
- **Empire Building**: Group territories to form powerful empires
- **Battle System**: Challenge other players in strategic battles
- **Marketplace**: Buy and sell territories with other players
- **Real-time Dashboard**: Track your stats, territories, and battles
- **3D Grid Visualization**: Interactive map of all territories

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Blockchain**: Solana (Anchor framework)
- **Wallet Integration**: Solana Wallet Adapter
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: React Three Fiber
- **State Management**: Zustand
- **API Client**: Axios

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── beta-guide/        # Beta testing guide page
│   ├── battles/           # Battle system pages
│   ├── leaderboard/       # Leaderboard page
│   └── marketplace/       # Marketplace page
├── components/            # React components
│   ├── Beta/             # Beta testing components
│   ├── Dashboard/        # Player dashboard components
│   ├── Grid/             # 3D grid visualization
│   ├── Layout/           # Layout components (Header, Footer)
│   ├── Marketplace/      # Marketplace components
│   └── Territory/        # Territory components
├── hooks/                # Custom React hooks
├── lib/                  # Library configurations
│   └── solana/          # Solana wallet setup
├── store/               # Zustand state stores
└── utils/               # Utility functions
    ├── analytics.ts     # Beta event tracking
    └── beta.ts          # Beta mode helpers
```

## 🔐 Security

- **Beta Testing**: All beta testing occurs on Solana devnet with fake SOL
- **No Real Money**: Beta mode cannot access mainnet or real funds
- **Rate Limiting**: Client-side rate limiting prevents transaction spam
- **Network Indicators**: Clear visual indicators show when using devnet

## 🐛 Reporting Issues

If you encounter bugs during beta testing:

1. Note the exact steps to reproduce the issue
2. Take screenshots if applicable
3. Check browser console for error messages
4. Document your wallet address and transaction signatures

## 📄 License

[Your License Here]

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📞 Support

- **Beta Guide**: Visit `/beta-guide` on the site
- **Documentation**: [Link to docs]
- **Community**: [Link to community]

---

**Note**: This is beta software running on Solana devnet. Do not use real money or expect production-level stability.
