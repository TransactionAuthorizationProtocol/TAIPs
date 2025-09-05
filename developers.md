---
layout: default
title: Developer Resources
permalink: /developers/
---

# Developer Resources

This guide provides developers with quick access to TAP implementation resources, including TypeScript types, JSON schemas, and usage examples.

## Quick Start

### TypeScript/JavaScript

Install the official TAP types package:

```bash
npm install @taprsvp/types
```

Basic usage:

```typescript
import { Transfer, DIDCommMessage } from '@taprsvp/types';

// Create a transfer message
const transfer: Transfer = {
  "@context": "https://tap.rsvp/schema/1.0",
  "@type": "Transfer",
  asset: "eip155:1/erc20:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC on Ethereum
  amount: "1000.00",
  settlementAddress: "eip155:1:0x1234567890123456789012345678901234567890",
  originator: {
    "@type": "Party",
    name: "Alice Smith"
  },
  agents: [
    {
      "@type": "Agent",
      did: "did:web:example.com",
      role: "originator"
    }
  ]
};

// Wrap in DIDComm envelope
const message: DIDCommMessage<Transfer> = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  type: "https://tap.rsvp/schema/1.0#Transfer",
  from: "did:web:originator.com",
  to: ["did:web:beneficiary.com"],
  created_time: Date.now(),
  body: transfer
};
```

## JSON Schema Validation

### Using with JavaScript

```javascript
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Initialize validator
const ajv = new Ajv();
addFormats(ajv);

// Fetch and compile schema
async function validateTransfer(transferMessage) {
  const response = await fetch('https://taips.tap.rsvp/schemas/messages/transfer.json');
  const schema = await response.json();
  
  const validate = ajv.compile(schema);
  const valid = validate(transferMessage);
  
  if (!valid) {
    console.error('Validation errors:', validate.errors);
    return false;
  }
  return true;
}
```

### Direct Schema URLs

All schemas are available at `https://taips.tap.rsvp/schemas/`:

#### Message Schemas
- Transfer: https://taips.tap.rsvp/schemas/messages/transfer.json
- Payment: https://taips.tap.rsvp/schemas/messages/payment.json
- Authorize: https://taips.tap.rsvp/schemas/messages/authorize.json
- Settle: https://taips.tap.rsvp/schemas/messages/settle.json
- [View all message schemas](./schemas/messages/)

#### Data Structure Schemas
- Party: https://taips.tap.rsvp/schemas/data-structures/party.json
- Agent: https://taips.tap.rsvp/schemas/data-structures/agent.json
- Policy: https://taips.tap.rsvp/schemas/data-structures/policy.json
- Invoice: https://taips.tap.rsvp/schemas/data-structures/invoice.json

#### Common Type Schemas
- Base Types: https://taips.tap.rsvp/schemas/common/base-types.json
- CAIP Types: https://taips.tap.rsvp/schemas/common/caip-types.json
- DIDComm Base: https://taips.tap.rsvp/schemas/common/didcomm-base.json

## Message Types Reference

### Transaction Messages

#### Transfer
Initiates a virtual asset transfer between parties.

```typescript
import { Transfer } from '@taprsvp/types';

const transfer: Transfer = {
  "@context": "https://tap.rsvp/schema/1.0",
  "@type": "Transfer",
  asset: "eip155:1/erc20:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  amount: "1000.00",
  originator: { "@type": "Party", name: "Alice" },
  beneficiary: { "@type": "Party", name: "Bob" },
  agents: [/* agent details */]
};
```

#### Payment
Requests payment with optional invoice details and flexible asset pricing support.

```typescript
import { Payment, SupportedAssetPricing } from '@taprsvp/types';

const payment: Payment = {
  "@context": "https://tap.rsvp/schema/1.0",
  "@type": "Payment",
  amount: "99.99",
  currency: "USD",
  // Enhanced supportedAssets with pricing objects for non-1:1 rates
  supportedAssets: [
    "eip155:1/erc20:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC 1:1
    {
      asset: "EUR", // ISO-4217 currency code
      amount: "92.50", // Specific exchange rate
      expires: "2025-09-05T15:30:00Z" // Rate expiration
    },
    {
      asset: "eip155:1/erc20:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC
      amount: "0.0025", // Volatile asset pricing
      expires: "2025-09-05T15:15:00Z"
    }
  ],
  fallbackSettlementAddresses: [
    "payto://iban/DE75512108001245126199" // Traditional banking
  ],
  merchant: { "@type": "Party", name: "Example Store" },
  agents: [/* agent details */]
};
```

### Authorization Flow Messages

- **Authorize**: Approves a transaction
- **Settle**: Confirms on-chain settlement
- **Reject**: Rejects a transaction with reason
- **Cancel**: Cancels an ongoing transaction
- **Revert**: Requests transaction reversal

### Agent Management Messages

- **UpdateAgent**: Updates agent information
- **UpdateParty**: Updates party information
- **AddAgents**: Adds new agents to transaction
- **ReplaceAgent**: Replaces an existing agent
- **RemoveAgent**: Removes an agent

### Connection Messages

- **Connect**: Establishes agent connection
- **AuthorizationRequired**: Requests authorization for connection
- **ConfirmRelationship**: Confirms party-agent relationship
- **UpdatePolicies**: Updates agent policies

## Common Patterns

### Creating DIDComm Messages

All TAP messages follow the DIDComm v2 format:

```typescript
import { DIDCommMessage, Transfer } from '@taprsvp/types';

function createDIDCommMessage<T>(
  body: T,
  type: string,
  from: string,
  to: string[]
): DIDCommMessage<T> {
  return {
    id: crypto.randomUUID(),
    type,
    from,
    to,
    created_time: Date.now(),
    body
  };
}

// Usage
const transfer: Transfer = { /* transfer details */ };
const message = createDIDCommMessage(
  transfer,
  "https://tap.rsvp/schema/1.0#Transfer",
  "did:web:sender.com",
  ["did:web:receiver.com"]
);
```

### Working with CAIP Identifiers

TAP uses [Chain Agnostic Improvement Proposals (CAIPs)](https://github.com/ChainAgnostic/CAIPs) for blockchain-agnostic identifiers:

```typescript
import { CAIP2, CAIP10, CAIP19 } from '@taprsvp/types';

// Blockchain identifier (CAIP-2)
const ethereum: CAIP2 = "eip155:1"; // Ethereum mainnet
const bitcoin: CAIP2 = "bip122:000000000019d6689c085ae165831e93"; // Bitcoin mainnet

// Account identifier (CAIP-10)
const ethAccount: CAIP10 = "eip155:1:0x1234567890123456789012345678901234567890";
const btcAccount: CAIP10 = "bip122:000000000019d6689c085ae165831e93:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";

// Asset identifier (CAIP-19)
const usdc: CAIP19 = "eip155:1/erc20:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const nft: CAIP19 = "eip155:1/erc721:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d";
```

### Policy Examples

```typescript
import { RequirePresentation, RequirePurpose } from '@taprsvp/types';

// Require KYC credential presentation
const kycPolicy: RequirePresentation = {
  "@type": "RequirePresentation",
  credentialType: "KYCCredential",
  from: "originator"
};

// Require transaction purpose
const purposePolicy: RequirePurpose = {
  "@type": "RequirePurpose",
  required: ["purpose", "categoryPurpose"]
};
```

### Enhanced Payment Asset Pricing

The `supportedAssets` field in Payment messages supports both simple asset identifiers and pricing objects for complex scenarios:

```typescript
import { Payment, SupportedAssetPricing } from '@taprsvp/types';

// Simple asset support (backward compatible)
const basicPayment: Payment = {
  "@context": "https://tap.rsvp/schema/1.0",
  "@type": "Payment",
  currency: "USD",
  amount: "100.00",
  supportedAssets: [
    "eip155:1/erc20:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" // USDC 1:1
  ],
  merchant: { /* merchant details */ },
  agents: [/* agent details */]
};

// Enhanced pricing with specific rates and expiration
const enhancedPayment: Payment = {
  "@context": "https://tap.rsvp/schema/1.0", 
  "@type": "Payment",
  currency: "USD",
  amount: "100.00",
  supportedAssets: [
    // Simple 1:1 asset
    "eip155:1/erc20:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    // Cross-currency pricing with IBAN settlement
    {
      asset: "EUR", // ISO-4217 currency code
      amount: "92.50", // Specific USD to EUR rate
      expires: "2025-09-05T15:30:00Z" // Rate expires in 30 minutes
    },
    // Volatile crypto asset pricing
    {
      asset: "eip155:1/erc20:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC
      amount: "0.00234", // Current BTC equivalent 
      expires: "2025-09-05T15:05:00Z" // Short expiration for volatile assets
    },
    // DTI identifier with specific pricing
    {
      asset: "dti:1:0x123...abc", // DTI token
      amount: "850.75",
      expires: "2025-09-05T16:00:00Z"
    }
  ],
  fallbackSettlementAddresses: [
    "payto://iban/DE75512108001245126199" // Traditional banking fallback
  ],
  merchant: { /* merchant details */ },
  agents: [/* agent details */]
};

// The SupportedAssetPricing interface
interface SupportedAssetPricing {
  asset: string; // CAIP-19, DTI, or ISO-4217 currency code
  amount: string; // Decimal string representing required amount
  expires?: string; // Optional ISO 8601 expiration timestamp
}
```

This enhanced format enables:
- **Cross-currency payments**: USD invoice accepting EUR at specific rates
- **Volatile asset pricing**: Real-time crypto exchange rates with expiration
- **Traditional banking integration**: Fiat settlements via IBAN/SEPA
- **Backward compatibility**: Simple string format still supported

## Testing and Validation

### Validate Against Test Vectors

Clone the TAIPs repository and run the validation script:

```bash
git clone https://github.com/TransactionAuthorizationProtocol/TAIPs.git
cd TAIPs/schemas
npm install
npm run validate
```

### Create Your Own Test Vectors

```javascript
const fs = require('fs');

// Create a test vector
const testVector = {
  id: "test-001",
  type: "https://tap.rsvp/schema/1.0#Transfer",
  from: "did:web:test.com",
  to: ["did:web:recipient.com"],
  created_time: 1234567890,
  body: {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "Transfer",
    asset: "eip155:1/erc20:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    amount: "100.00",
    agents: [{
      "@type": "Agent",
      did: "did:web:test.com",
      role: "originator"
    }]
  }
};

// Save test vector
fs.writeFileSync('test-transfer.json', JSON.stringify(testVector, null, 2));
```

## Implementation Libraries

### Rust Implementation
A Rust implementation of TAP is available for systems programming and high-performance applications:
- **Repository**: [tap-rs](https://github.com/TransactionAuthorizationProtocol/tap-rs)
- **Features**: Full TAP protocol implementation in Rust

### IVMS101 TypeScript Types
TypeScript definitions for IVMS101 (InterVASP Messaging Standard) used in Travel Rule compliance:
- **Repository**: [ivms101](https://github.com/TransactionAuthorizationProtocol/ivms101)
- **NPM Package**: `@notabene/ivms101`
- **Usage**: Required for TAIP-10 Travel Rule implementation

Example usage with Travel Rule data:
```typescript
import { NaturalPerson } from '@notabene/ivms101';
import { Party } from '@taprsvp/types';

const originator: Party = {
  "@type": "Party",
  name: "Alice Smith",
  ivms101: {
    naturalPerson: {
      name: {
        nameIdentifier: [
          {
            primaryIdentifier: "Smith",
            secondaryIdentifier: "Alice",
            nameIdentifierType: "LEGL"
          }
        ]
      },
      nationalIdentification: {
        nationalIdentifier: "123456789",
        nationalIdentifierType: "DRLC", // Driver's License
        countryOfIssue: "US"
      }
    } as NaturalPerson
  }
};
```

### ISO 20022 External Code Sets
TypeScript definitions for ISO 20022 purpose codes used in TAP transactions:
- **Repository**: [iso20022-external-code-sets](https://github.com/TransactionAuthorizationProtocol/iso20022-external-code-sets)
- **NPM Package**: `@taprsvp/iso20022_external_codes`
- **Usage**: Required for TAIP-13 Transaction Purpose Codes

Example usage with purpose codes:
```typescript
import { Purpose, CategoryPurpose } from '@taprsvp/iso20022_external_codes';
import { Transfer } from '@taprsvp/types';

const transfer: Transfer = {
  "@context": "https://tap.rsvp/schema/1.0",
  "@type": "Transfer",
  asset: "eip155:1/erc20:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  amount: "1000.00",
  purpose: Purpose.CASH, // Cash Management Transfer
  categoryPurpose: CategoryPurpose.CASH, // Cash Transaction
  // ... other fields
};
```

## Additional Resources

- **TAP Specification**: [TAIPs Documentation](./index.html)
- **Message Reference**: [Message Types and Data Structures](./messages.html)
- **GitHub Repository**: [TransactionAuthorizationProtocol/TAIPs](https://github.com/TransactionAuthorizationProtocol/TAIPs)
- **NPM Package**: [@taprsvp/types](https://www.npmjs.com/package/@taprsvp/types)
- **TAP Website**: [tap.rsvp](https://tap.rsvp)

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/TransactionAuthorizationProtocol/TAIPs/issues)
- **Discussions**: [GitHub Discussions](https://github.com/TransactionAuthorizationProtocol/TAIPs/discussions)
- **Email**: [Contact Notabene](https://notabene.id/contact)