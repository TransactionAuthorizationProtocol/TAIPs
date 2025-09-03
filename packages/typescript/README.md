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
- **📎 DIDComm Attachments**: Full v2.1 attachments support for supplementary documents (v1.8.0+)
- **🤝 Out-of-Band Invitations**: Connection bootstrapping without pre-existing relationships (v1.8.0+)
- **🔏 Verifiable Presentations**: TAIP-8 selective disclosure support (v1.8.0+)
- **⛓️ Chain Agnostic**: Multi-blockchain support via CAIP standards (CAIP-10, CAIP-19)
- **📋 Compliance Ready**: IVMS101 integration for travel rule compliance
- **🏦 Traditional Banking**: RFC 8905 PayTo URI support for IBAN, SEPA, and other systems
- **✅ Runtime Validation**: Zod v4 schemas for message validation and parsing
- **🧪 Property-Based Testing**: Fast-check arbitraries for comprehensive test coverage

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

## Message Validation

The package includes comprehensive Zod v4 schemas for runtime validation of TAP messages:

```typescript
import { 
  validateTAPMessage, 
  parseTAPMessage, 
  isTAPMessage,
  validateTransferMessage,
  TransferMessageSchema
} from '@taprsvp/types/validator';

// Safe validation with detailed error information
const result = validateTAPMessage(someUnknownData);
if (result.success) {
  console.log('Valid TAP message:', result.data);
} else {
  console.log('Validation errors:', result.error.issues);
}

// Parse and validate (throws on error)
try {
  const validMessage = parseTAPMessage(incomingMessage);
  // validMessage is now type-safe and validated
} catch (error) {
  console.log('Invalid message:', error.message);
}

// Type guard for checking if data is a valid TAP message
if (isTAPMessage(data)) {
  // data is now typed as a valid TAPMessage
  console.log('Message type:', data.type);
}

// Validate specific message types
const transferResult = validateTransferMessage(data);
if (transferResult.success) {
  // transferResult.data is typed as TransferMessage
  console.log('Transfer amount:', transferResult.data.body.amount);
}

// Direct schema usage
const isValidTransfer = TransferMessageSchema.safeParse(data).success;
```

## Property-Based Testing

This package includes comprehensive [fast-check](https://fast-check.dev/) arbitraries for generating realistic TAP message data for property-based testing. These arbitraries are perfect for testing your TAP implementations with diverse, edge-case-rich data.

### Installation

The arbitraries are included with the package. You'll also need fast-check as a dev dependency:

```bash
npm install --save-dev fast-check
```

### Basic Usage

```typescript
import * as fc from 'fast-check';
import { arbitraries } from '@taprsvp/types/arbitraries';
import { TransferSchema } from '@taprsvp/types/validator';

// Test that all generated transfers pass validation
fc.assert(
  fc.property(arbitraries.messageBodies.transfer(), (transfer) => {
    expect(TransferSchema.safeParse(transfer).success).toBe(true);
  })
);

// Generate sample data for manual inspection
const sampleTransfers = fc.sample(arbitraries.messageBodies.transfer(), 5);
console.log('Sample transfers:', sampleTransfers);
```

### Available Arbitraries

The arbitraries are organized into logical groups:

#### Fundamental Types
```typescript
import { arbitraries } from '@taprsvp/types/arbitraries';

// Generate DIDs, addresses, amounts, etc.
const did = arbitraries.fundamental.did();           // "did:web:example.com"
const address = arbitraries.fundamental.caip10();    // "eip155:1:0x742d35..."
const amount = arbitraries.fundamental.amount();     // "123.45"
const currency = arbitraries.fundamental.isoCurrency(); // "USD"
```

#### Participants
```typescript
// Generate realistic participants
const person = arbitraries.participants.person();
const organization = arbitraries.participants.organization();
const agent = arbitraries.participants.agent();

// Example generated person:
// {
//   "@id": "did:web:alice.example.com",
//   "@type": "https://schema.org/Person", 
//   "name": "Alice Smith",
//   "email": "alice@example.com"
// }
```

#### Message Bodies
```typescript
// Generate complete TAP message bodies
const transfer = arbitraries.messageBodies.transfer();
const payment = arbitraries.messageBodies.payment();
const exchange = arbitraries.messageBodies.exchange();
const quote = arbitraries.messageBodies.quote();
const escrow = arbitraries.messageBodies.escrow();

// All message types available:
// transfer, payment, exchange, quote, escrow, capture,
// authorize, connect, settle, reject, cancel, revert
```

#### DIDComm Message Wrappers  
```typescript
// Generate complete DIDComm-wrapped messages
const transferMessage = arbitraries.messages.transferMessage();
const paymentMessage = arbitraries.messages.paymentMessage();
const tapMessage = arbitraries.messages.tapMessage(); // Union of all types

// Example generated message:
// {
//   "id": "550e8400-e29b-41d4-a716-446655440000",
//   "type": "https://tap.rsvp/schema/1.0#Transfer",
//   "from": "did:web:sender.example.com",
//   "to": ["did:web:receiver.example.com"],
//   "created_time": 1640995200000,
//   "body": { /* Transfer message body */ }
// }
```

### Testing Patterns

#### Round-Trip Testing
```typescript
import { validateTAPMessage, parseTAPMessage } from '@taprsvp/types/validator';

// Test that generated messages survive serialization/parsing
fc.assert(
  fc.property(arbitraries.messages.tapMessage(), (originalMessage) => {
    // Serialize to JSON and back
    const json = JSON.stringify(originalMessage);
    const parsed = JSON.parse(json);
    
    // Should still validate
    const result = validateTAPMessage(parsed);
    expect(result.success).toBe(true);
    
    if (result.success) {
      // Critical fields should match
      expect(result.data.id).toBe(originalMessage.id);
      expect(result.data.type).toBe(originalMessage.type);
    }
  })
);
```

#### Business Logic Testing
```typescript
// Test your business logic with diverse inputs
function calculateTransactionFee(transfer: Transfer): number {
  // Your fee calculation logic
  const amount = parseFloat(transfer.amount);
  return amount > 1000 ? amount * 0.001 : 0.5; // 0.1% or flat fee
}

fc.assert(
  fc.property(arbitraries.messageBodies.transfer(), (transfer) => {
    const fee = calculateTransactionFee(transfer);
    
    // Fee should always be non-negative
    expect(fee).toBeGreaterThanOrEqual(0);
    
    // Fee should be reasonable (less than 10% of transfer)
    const transferAmount = parseFloat(transfer.amount);
    expect(fee).toBeLessThan(transferAmount * 0.1);
  })
);
```

#### Edge Case Discovery
```typescript
// Property-based testing excels at finding edge cases
function validateTransactionLimits(transfer: Transfer): boolean {
  const amount = parseFloat(transfer.amount);
  const isHighValue = amount >= 10000;
  
  // High-value transfers must have additional compliance data
  if (isHighValue) {
    return transfer.originator?.nationalIdentifier != null;
  }
  return true;
}

fc.assert(
  fc.property(arbitraries.messageBodies.transfer(), (transfer) => {
    // This test will find transfers that violate your compliance rules
    const isValid = validateTransactionLimits(transfer);
    
    if (!isValid) {
      console.log('Found non-compliant transfer:', {
        amount: transfer.amount,
        hasNationalId: !!transfer.originator?.nationalIdentifier
      });
    }
    
    expect(isValid).toBe(true);
  })
);
```

#### Integration Testing
```typescript
// Test your API endpoints with generated data
async function testTransferAPI() {
  await fc.assert(
    fc.asyncProperty(
      arbitraries.messages.transferMessage(),
      async (transferMessage) => {
        // Post to your API
        const response = await fetch('/api/transfers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transferMessage)
        });
        
        // Should accept valid messages
        if (validateTAPMessage(transferMessage).success) {
          expect(response.status).toBe(200);
        }
      }
    )
  );
}
```

### Custom Arbitraries

You can create custom arbitraries for your specific use cases:

```typescript
import * as fc from 'fast-check';
import { arbitraries } from '@taprsvp/types/arbitraries';

// Custom arbitrary for high-value transfers
const highValueTransfer = () => 
  arbitraries.messageBodies.transfer()
    .filter(transfer => parseFloat(transfer.amount) >= 10000)
    .map(transfer => ({
      ...transfer,
      // Ensure high-value transfers have required compliance data
      originator: {
        ...transfer.originator,
        nationalIdentifier: {
          nationalIdentifier: "123456789",
          nationalIdentifierType: "PASS",
          countryOfIssue: "US"
        }
      }
    }));

// Use your custom arbitrary
fc.assert(
  fc.property(highValueTransfer(), (transfer) => {
    expect(parseFloat(transfer.amount)).toBeGreaterThanOrEqual(10000);
    expect(transfer.originator?.nationalIdentifier).toBeDefined();
  })
);
```

### Performance Testing

```typescript
// Generate large datasets for performance testing
const performanceTest = async () => {
  const messages = fc.sample(arbitraries.messages.tapMessage(), 10000);
  
  const start = Date.now();
  let validCount = 0;
  
  for (const message of messages) {
    if (validateTAPMessage(message).success) {
      validCount++;
    }
  }
  
  const duration = Date.now() - start;
  console.log(`Validated ${validCount}/${messages.length} messages in ${duration}ms`);
  console.log(`Average: ${duration / messages.length}ms per message`);
};
```

### Available Validators

| Function | Description |
|----------|-------------|
| `validateTAPMessage(data)` | Validates any TAP message type |
| `parseTAPMessage(data)` | Parse and validate (throws on error) |
| `isTAPMessage(data)` | Type guard function |
| `validateTransferMessage(data)` | Validate Transfer messages |
| `validatePaymentMessage(data)` | Validate Payment messages |
| `validateAuthorizeMessage(data)` | Validate Authorization messages |
| `validateConnectMessage(data)` | Validate Connect messages |
| `validateSettleMessage(data)` | Validate Settlement messages |
| `validateRejectMessage(data)` | Validate Reject messages |
| `validateCancelMessage(data)` | Validate Cancel messages |
| `validateRevertMessage(data)` | Validate Revert messages |

### Available Schemas

All Zod schemas are exported for direct use:

- `TAPMessageSchema` - Union of all TAP message types
- `TransferMessageSchema` - Transfer message wrapper
- `PaymentMessageSchema` - Payment message wrapper
- `AuthorizeMessageSchema` - Authorization reply wrapper
- `DIDCommMessageSchema` - Base DIDComm message
- `DIDCommReplySchema` - Base DIDComm reply
- And many more foundational schemas (DID, CAIP-10, CAIP-19, etc.)

## Core Types

### Message Types

The package includes TypeScript interfaces for all TAP message types:

| Message Type | Description | TAIP Reference |
|--------------|-------------|----------------|
| `Transfer` | Asset transfer requests | [TAIP-3](https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-3.md) |
| `Payment` | Merchant payment requests | [TAIP-14](https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-14.md) |
| `Escrow` | Conditional asset holding | [TAIP-17](https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-17.md) |
| `Authorize` | Transaction authorization | [TAIP-4](https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md) |
| `Connect` | Agent connection establishment | [TAIP-15](https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-15.md) |
| `Settle` | Settlement confirmation | [TAIP-4](https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md) |
| `Presentation` | Verifiable credential presentations | [TAIP-8](https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-8.md) |
| `OutOfBandInvitation` | Connection bootstrapping | [DIDComm Out-of-Band](https://identity.foundation/didcomm-messaging/spec/v2.1/#out-of-band-messages) |
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

### DIDComm Attachments

The package includes full support for DIDComm v2.1 attachments, enabling inclusion of supplementary documents:

```typescript
import { Attachment, TransferMessage } from '@taprsvp/types';

// Create attachments for KYC documents
const kycAttachment: Attachment = {
  id: "kyc-doc-1",
  description: "KYC verification documents",
  media_type: "application/pdf",
  data: {
    base64: "JVBERi0xLjMKJcTl8uXrp..." // Base64 encoded PDF
  }
};

// Attachment with external link and integrity check
const largeFileAttachment: Attachment = {
  id: "transaction-history",
  description: "Transaction history CSV",
  media_type: "text/csv",
  byte_count: 1048576,
  data: {
    links: ["https://example.com/files/history.csv"],
    hash: "sha256:2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae"
  }
};

// Add attachments to any DIDComm message
const messageWithAttachments: TransferMessage = {
  id: "msg-123",
  type: "https://tap.rsvp/schema/1.0#Transfer",
  from: "did:example:sender",
  to: ["did:example:receiver"],
  created_time: Date.now(),
  body: { /* transfer details */ },
  attachments: [kycAttachment, largeFileAttachment]
};
```

### Out-of-Band Invitations

Bootstrap connections without pre-existing relationships using Out-of-Band invitations:

```typescript
import { OutOfBandInvitation, OutOfBandGoal } from '@taprsvp/types';

const invitation: OutOfBandInvitation = {
  id: "invitation-456",
  type: "https://didcomm.org/out-of-band/2.0/invitation",
  from: "did:web:inviter.example.com",
  to: [], // Broadcast invitation
  created_time: Date.now(),
  body: {
    goal_code: "tap.connect",
    goal: "Establish TAP connection for transaction authorization",
    accept: ["didcomm/v2"]
  },
  attachments: [
    {
      id: "initial-request",
      media_type: "application/json",
      data: {
        json: {
          "@type": "https://tap.rsvp/schema/1.0#Connect",
          principal: { /* principal details */ },
          constraints: { /* transaction constraints */ }
        }
      }
    }
  ]
};

// Share invitation via QR code, URL, or email
const invitationUrl = `https://example.com/invite?c_i=${encodeURIComponent(JSON.stringify(invitation))}`;
```

### Verifiable Credential Presentations

Support for TAIP-8 selective disclosure using verifiable presentations:

```typescript
import { PresentationMessage, Attachment } from '@taprsvp/types';

const presentationMessage: PresentationMessage = {
  id: "presentation-789",
  type: "https://didcomm.org/present-proof/3.0/presentation",
  from: "did:web:holder.example.com",
  to: ["did:web:verifier.example.com"],
  thid: "transaction-thread-id", // Links to original transaction
  created_time: Date.now(),
  body: {}, // Always empty per WACI spec
  attachments: [
    {
      id: "vp-1",
      media_type: "application/json",
      format: "dif/presentation-exchange/submission@v1.0",
      data: {
        json: {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://identity.foundation/presentation-exchange/submission/v1"
          ],
          type: ["VerifiablePresentation", "PresentationSubmission"],
          presentation_submission: {
            id: "submission-123",
            definition_id: "kyc-check",
            descriptor_map: [
              {
                id: "credential-1",
                format: "jwt_vc",
                path: "$.verifiableCredential[0]"
              }
            ]
          },
          verifiableCredential: [
            // JWT or JSON-LD credentials
          ]
        }
      }
    }
  ]
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
├── validator.ts     # Zod v4 validation schemas
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