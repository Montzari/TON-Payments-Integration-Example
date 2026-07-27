# TON Payments Integration Example

## Overview

This project demonstrates a simple web application for accepting and verifying The Open Network (TON) payments using TON Connect and Node.js. It serves as an educational example and should not be used in production without proper security enhancements.

## Key Features

- **Secure Wallet Connection:** Uses the `@tonconnect/ui` library for secure connection to TON wallets.
- **Native TON Transactions:** Supports triggering native Mainnet transactions directly from the web interface (minimum transaction amount: 0.0001 TON).
- **Blockchain Verification:** The backend verifies transactions using the Toncenter public API before awarding points.
- **Points System:** An in-memory ledger awards 10 points for each successful payment.

## Technology Stack

### Backend
- Node.js
- Express.js
- `@ton/core`

### Frontend
- HTML
- CSS
- Vanilla JavaScript

### Blockchain Integration
- TON Connect UI (`@tonconnect/ui`)
- Toncenter API for transaction verification

## Getting Started

### Prerequisites
1. Install [Node.js](https://nodejs.org/) on your machine.
2. Have a TON wallet (e.g., [Tonkeeper](https://tonkeeper.com/)) with a small amount of Mainnet TON for testing.

### Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://codeberg.org/user404/TonPayments.git
   cd TonPayments
   ```

2. **Install project dependencies:**
   ```bash
   npm install express @ton/core
   ```

3. **Start the server:**
   ```bash
   node server.js
   ```

## Project Structure

```
├── server.js                        # Express backend with API endpoints for transaction verification
├── public/
│   ├── index.html                  # Frontend UI with TON Connect integration
│   └── tonconnect-manifest.json     # App manifest required by TON wallets
```

### `tonconnect-manifest.json`

The manifest file is required for TON wallet integration:
```json
{
  "url": "",                                     // Your app's homepage URL (REQUIRED, cannot be empty)
  "name": "TonPayments",                         // Display name shown in the wallet's connection prompt
  "iconUrl": "https://ton.org/download/ton_symbol.png", // Icon shown next to your app name in the wallet UI
  "termsOfUseUrl": "https://ton.org/terms",         // Optional — link to your app's terms of use
  "privacyPolicyUrl": "https://ton.org/privacy"    // Optional — link to your app's privacy policy
}
```
