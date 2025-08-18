# @taprsvp/types

TypeScript types and interfaces for the Transaction Authorization Protocol (TAP).

[![npm version](https://badge.fury.io/js/%40taprsvp%2Ftypes.svg)](https://badge.fury.io/js/%40taprsvp%2Ftypes)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

This package provides comprehensive TypeScript type definitions for the Transaction Authorization Protocol (TAP), a standardized protocol for multi-party transaction authorization before blockchain settlement. It serves as the official TypeScript SDK for TAP implementations.

## Features

- **🎯 Type Safety**: Comprehensive TypeScript interfaces for all TAP message types
- **🔗 JSON-LD Compatible**: Full support for JSON-LD contexts and type identifiers
- **🔐 DIDComm Integration**: Built on DIDComm messaging for secure agent communication
- **⛓️ Chain Agnostic**: Multi-blockchain support via CAIP standards (CAIP-10, CAIP-19)
- **📋 Compliance Ready**: IVMS101 integration for travel rule compliance
- **🏦 Traditional Banking**: RFC 8905 PayTo URI support for IBAN, SEPA, and other systems

## Installation

```bash
npm install @taprsvp/types
```

## Quick Start

```typescript
import { Transfer, TransferMessage, Person, Agent } from '@taprsvp/types';

// Define participants
const originator: Person = {
  "@id": "did:example:alice",
  "@type": "https://schema.org/Person",
  name: "Alice Smith"
};

const agent: Agent = {
  "@id": "did:example:agent",
  for: "did:example:alice",
  role: "WalletProvider"
};

// Create a transfer request
const transfer: Transfer = {
  "@context": "https://tap.rsvp/schema/1.0",
  "@type": "Transfer",
  asset: "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
  amount: "100.00",
  originator,
  agents: [agent],
  settlementAddress: "eip155:1:0x742d35Cc6234C4532BC44b7532C4524532BC44b7"
};

// Wrap in DIDComm message
const message: TransferMessage = {
  id: "01234567-89ab-cdef-0123-456789abcdef",
  type: "https://tap.rsvp/schema/1.0#Transfer",
  from: "did:example:sender",
  to: ["did:example:receiver"],
  created_time: Date.now(),
  body: transfer
};
```

## Core Types

### Message Types

The package includes TypeScript interfaces for all TAP message types:

| Message Type | Description | TAIP Reference |
|--------------|-------------|----------------|
| `Transfer` | Asset transfer requests | [TAIP-3](https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-3.md) |
| `Payment` | Merchant payment requests | [TAIP-14](https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-14.md) |
| `Escrow` | Conditional asset holding | [TAIP-15](https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-15.md) |
| `Authorize` | Transaction authorization | [TAIP-4](https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md) |
| `Connect` | Agent connection establishment | [TAIP-2](https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md) |
| `Settle` | Settlement confirmation | [TAIP-4](https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md) |
| `Cancel`, `Reject`, `Revert` | Response messages | [TAIP-4](https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md) |

### Address Types

```typescript
// Blockchain addresses (CAIP-10 format)
const cryptoAddress: CAIP10 = "eip155:1:0x742d35Cc6234C4532BC44b7532C4524532BC44b7";

// Traditional banking (RFC 8905 PayTo URIs)  
const ibanAddress: PayToURI = "payto://iban/DE75512108001245126199";
const sepaAddress: PayToURI = "payto://sepa/DE75512108001245126199";

// Union type supporting both
const settlementAddress: SettlementAddress = cryptoAddress; // or ibanAddress
```

### Asset Types

```typescript
// Blockchain assets (CAIP-19 format)
const daiToken: CAIP19 = "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f";
const bitcoin: CAIP19 = "bip122:000000000019d6689c085ae165831e93/slip44:0";

// Fiat currencies (ISO 4217)
const usd: IsoCurrency = "USD";
const eur: IsoCurrency = "EUR";

// Union type for either
const asset: Asset = daiToken; // or "USD"
```

### Participant Types

```typescript
// Natural person 
const person: Person = {
  "@id": "did:example:alice",
  "@type": "https://schema.org/Person",
  name: "Alice Smith",
  email: "alice@example.com"
};

// Legal entity/organization
const organization: Organization = {
  "@id": "did:web:example.com",
  "@type": "https://schema.org/Organization", 
  name: "Example Corp",
  url: "https://example.com",
  leiCode: "969500KN90DZLPGW6898"
};

// Party union type (Person or Organization)
const party: Party = person; // or organization

// Software agent acting on behalf of a party
const agent: Agent = {
  "@id": "did:example:wallet",
  for: "did:example:alice",
  role: "WalletProvider",
  name: "Wallet Service"
};
```

## Advanced Usage

### Selective Disclosure Policies

```typescript
import { RequirePresentation, Policy } from '@taprsvp/types';

const kycPolicy: Policy<RequirePresentation> = {
  "@type": "RequirePresentation",
  "@id": "https://example.com/policies/kyc",
  name: "KYC Verification Required",
  presentation_definition: {
    // Presentation Exchange definition
    id: "kyc-check",
    input_descriptors: [...]
  }
};
```

### Invoice Integration

```typescript
import { Invoice, InvoiceMessage } from '@taprsvp/types';

const invoice: Invoice = {
  "@context": "https://tap.rsvp/schema/1.0",
  "@type": "Invoice", 
  currency: "USD",
  amount: "50.00",
  description: "Monthly subscription"
};

const invoiceMessage: InvoiceMessage = {
  id: "01234567-89ab-cdef-0123-456789abcdef",
  type: "https://tap.rsvp/schema/1.0#Invoice",
  from: "did:example:merchant",
  to: ["did:example:customer"],
  created_time: Date.now(),
  body: invoice
};
```

### Travel Rule Compliance

```typescript
import { Transfer, Person, generateNameHash } from '@taprsvp/types';

// Travel rule compliant transfer with privacy-preserving name matching
const complianceTransfer: Transfer = {
  "@context": "https://tap.rsvp/schema/1.0",
  "@type": "Transfer",
  asset: "eip155:1/erc20:0xa0b86a33e6776a6f7e25d896b0f62c9c8b4d8d8d",
  amount: "1000.00", // Above threshold
  originator: {
    "@id": "did:example:originator",
    "@type": "https://schema.org/Person",
    // Privacy-preserving name hash for matching (TAIP-12)
    nameHash: await generateNameHash("John Doe"),
    // IVMS101 structured name data
    name: [{
      primaryIdentifier: "John",
      secondaryIdentifier: "Doe", 
      nameIdentifierType: "LEGL"
    }],
    // Geographic address for compliance
    geographicAddress: [{
      addressType: "HOME",
      streetName: "123 Main Street",
      buildingNumber: "123",
      postCode: "12345", 
      townName: "Anytown",
      country: "US"
    }],
    // National identification
    nationalIdentifier: {
      nationalIdentifier: "123456789",
      nationalIdentifierType: "PASS", // Passport
      countryOfIssue: "US"
    },
    // Date and place of birth
    dateAndPlaceOfBirth: {
      dateOfBirth: "1985-06-15",
      placeOfBirth: "New York, NY, US"
    },
    countryOfResidence: "US"
  },
  agents: [
    // ... agent details
  ]
};

// Example nameHash generation for privacy-preserving matching
const customerNameHash = await generateNameHash("Alice Johnson"); 
// Returns: "b117f44426c9670da91b563db728cd0bc8bafa7d1a6bb5e764d1aad2ca25032e"

// Customer record with nameHash for screening
const customer: Person = {
  "@id": "did:example:alice",
  "@type": "https://schema.org/Person", 
  nameHash: customerNameHash,
  // Full PII can be selectively disclosed when needed
  name: "Alice Johnson",
  customerIdentification: "CUST-789012"
};
```

## API Reference

### Core Interfaces

- **`DID`** - Decentralized identifier (`did:method:identifier`)
- **`CAIP10`** - Blockchain account address (`namespace:reference:account_address`)
- **`CAIP19`** - Blockchain asset identifier (`namespace:reference/asset_namespace:asset_reference`)
- **`PayToURI`** - RFC 8905 payment URI (`payto://method/address`)
- **`SettlementAddress`** - Union of `CAIP10 | PayToURI`
- **`Amount`** - Decimal string representation of monetary amounts

### Participant Interfaces

- **`Participant`** - Base interface with `@id`, contact info
- **`Person`** - Natural person extending Participant with IVMS101 compliance data
- **`Organization`** - Legal entity extending Participant with business info
- **`Party`** - Union type of `Person | Organization`
- **`Agent`** - Software acting on behalf of parties with roles and policies

### Message Interfaces

All message types follow this pattern:
- **`MessageName`** - The message body interface
- **`MessageNameMessage`** - DIDComm wrapper for direct messages
- **`MessageNameReply`** - DIDComm wrapper for reply messages

### Utility Types

- **`TAPMessage`** - Union of all TAP message types
- **`Party`** - Union of `Person | Organization`
- **`Participant`** - Base interface for all participants
- **`Asset`** - Union of `CAIP19 | IsoCurrency`

## Development

### Prerequisites

- Node.js 18+
- TypeScript 5.9+

### Setup

```bash
# Clone repository
git clone https://github.com/TransactionAuthorizationProtocol/TAIPs.git
cd TAIPs/packages/typescript

# Install dependencies
npm install

# Build package
npm run build

# Type check
npm run type-check

# Run tests
npm test
```

### Project Structure

```
src/
├── index.ts          # Main exports
├── tap.ts           # Core TAP message types
├── currencies.ts    # ISO 4217 currency codes
├── invoice.ts       # Invoice-related types
├── purpose_codes.ts # ISO 20022 purpose codes
└── nameHash.ts      # Utility functions
```

## Standards Compliance

This package implements types for the following standards:

- **TAIPs**: Transaction Authorization Improvement Proposals
- **CAIP-10**: Account ID Specification
- **CAIP-19**: Asset Type and Asset ID Specification
- **RFC 8905**: PayTo URI Scheme
- **IVMS101**: Inter-VASP Messaging Standard
- **ISO 4217**: Currency codes
- **ISO 20022**: Universal Financial Industry Message Scheme
- **JSON-LD**: JSON for Linking Data
- **DIDComm**: DID Communication

## Contributing

Contributions are welcome! Please see the [contributing guidelines](../../CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.

## Links

- [TAP Protocol Documentation](https://tap.rsvp)
- [TAIP Specifications](https://github.com/TransactionAuthorizationProtocol/TAIPs)
- [NPM Package](https://www.npmjs.com/package/@taprsvp/types)
- [TypeScript Documentation](https://www.typescriptlang.org/)