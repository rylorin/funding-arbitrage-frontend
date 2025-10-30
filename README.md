# Funding Arbitrage Frontend

A modern React/Next.js dashboard for cryptocurrency funding rate arbitrage opportunities, built with Shadcn/ui and Tailwind CSS.

## 🚀 Features

- **Real-time Dashboard**: Live funding rates across multiple exchanges
- **modern-style Interface**: Modern, clean UI inspired by trading platforms
- **Top Opportunities Grid**: 4 best arbitrage opportunities displayed prominently
- **Detailed Data Table**: Sortable table with all trading pairs and rates
- **Advanced Filters**: Filter by timeframe and exchanges
- **Web3 Integration**: Ethereum wallet connection ready
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: Shadcn/ui + Radix UI
- **Styling**: Tailwind CSS with custom crypto theme
- **Icons**: Lucide React
- **Web3**: Ethers.js v6 (ready for integration)
- **State Management**: Zustand (planned)
- **WebSocket**: Socket.io-client (planned)
- **Language**: TypeScript

## 🎨 Design System

### Colors

- **Profit**: `#00D9FF` (Cyan) - For positive values
- **Loss**: `#FF6B6B` (Red) - For negative values
- **Neutral**: `#8B949E` (Gray) - For neutral states
- **Background**: Dark theme optimized for trading

### Components

- **Cards**: Hover effects and smooth transitions
- **Tables**: Sortable with color-coded funding rates
- **Filters**: Interactive buttons and tags
- **Navigation**: Clean header with live indicators

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager
- Alchemy API key (for Web3 functionality)

### Installation

1. Install dependencies:

```bash
yarn install
```

2. Set up environment variables:

```bash
cp .env.local.example .env.local
# Edit .env.local with your API keys
```

3. Start the development server:

```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                 # Next.js App Router pages
│   ├── globals.css      # Global styles and Tailwind config
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main dashboard page
├── components/          # React components
│   ├── ui/             # Shadcn/ui base components
│   ├── dashboard/      # Dashboard-specific components
│   └── layout/         # Layout components (navbar, etc.)
├── lib/                # Utilities and configurations
│   ├── utils/          # Utility functions and constants
│   └── web3/          # Web3 configuration
├── types/              # TypeScript type definitions
└── hooks/             # Custom React hooks (planned)
```

## 🎯 Dashboard Components

### Navigation Bar

- **Live Stats**: Shows total pairs (278), max APR (367.0%), last update time
- **Live Indicator**: Animated dot showing real-time status
- **Wallet Connection**: Button for Web3 wallet integration

### Opportunities Grid

- **Top 4 Cards**: Best arbitrage opportunities
- **Exchange Rates**: Color-coded funding rates
- **Strategy Info**: Long/Short exchange combinations
- **APR Display**: Large, prominent profit indicators
- **Confidence Levels**: HIGH/MEDIUM/LOW badges

### Filters Panel

- **Timeframe Selection**: 1h, 1d, 1w, 1y buttons
- **Exchange Toggles**: Select/deselect exchanges
- **Active Filters**: Visual tags with remove buttons

### Detailed Table

- **Sortable Columns**: Click headers to sort by Pair or APR
- **Exchange Columns**: Funding rates for each selected exchange
- **Strategy Column**: Long/Short recommendations
- **APR & Confidence**: Combined display with badges

## 🔧 Configuration

### Tailwind Customization

```css
/* Custom classes available */
.profit-text         /* Profit color text */
/* Profit color text */
/* Profit color text */
/* Profit color text */
.loss-text          /* Loss color text */  
.neutral-text       /* Neutral color text */
.opportunity-card   /* Styled opportunity cards */
.funding-rate-*; /* Colored funding rate badges */
```

### Mock Data

Currently uses mock data in `lib/utils/mockData.ts`:

- **Top Opportunities**: IP, BIO, SYRUP, ZORA with realistic rates
- **Additional Tokens**: 20+ more tokens with generated data
- **Exchange Coverage**: Vest, Extended, Hyperliquid, Woofi

## 🔌 Backend Integration

Ready to connect to the [Funding Arbitrage Backend](https://github.com/rylorin/funding-arbitrage-backend):

### Planned API Endpoints

- `GET /api/exchanges/opportunities` - Funding rate data
- `GET /api/positions` - User positions
- `POST /api/positions` - Create new position
- `PUT /api/positions/:id/auto-close` - Auto-close settings

### WebSocket Events

- `funding-rates-update` - Real-time rate updates
- `position-pnl-update` - Position P&L changes
- `opportunity-alert` - High APR notifications
- `position-closed` - Automatic position closures

## 🎨 Style Reference

The modern and aesthetic interface dedicated to perp DEX tools:

- **Dark theme** with subtle borders and shadows
- **Color-coded data** for immediate visual feedback
- **Clean typography** with proper hierarchy
- **Hover states** for interactive elements
- **Smooth animations** for state changes

## 📱 Responsive Design

- **Mobile-first** approach with Tailwind breakpoints
- **Grid layouts** that adapt to screen size
- **Touch-friendly** buttons and interactions
- **Readable text** at all sizes

## 🔐 Security

- **No hardcoded secrets** - All sensitive data via environment variables
- **Web3 best practices** - Secure wallet connection patterns
- **Type safety** - Full TypeScript coverage
- **Sanitized inputs** - Proper data validation

## 🚧 Next Steps

1. **Connect to real backend** API
2. **Implement WebSocket** real-time updates
3. **Add wallet connection** functionality
4. **Position management** interface
5. **Notifications system** for opportunities
6. **Charts integration** with Recharts

## 📄 License

MIT License
