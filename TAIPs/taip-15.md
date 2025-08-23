---
taip: 15
title: Agent Connection Protocol
status: Review
type: Standard
author: Pelle Braendgaard <pelle@notabene.id>
created: 2024-03-21
updated: 2025-08-23
description: Establishes a protocol for creating secure, authorized connections between TAP agents with predefined transaction constraints and OAuth-style authorization flows. Enables persistent B2B integrations with transaction limits, purpose restrictions, and user control mechanisms for ongoing business relationships while maintaining robust risk management.
requires: [2, 4, 6, 9, 13]
---

## Simple Summary

A standard protocol for establishing secure, authorized connections between agents in the Transaction Authorization Protocol ecosystem, with support for OAuth-style authorization flows and transaction constraints.

## Abstract

This TAIP defines a protocol for agents to establish secure, authorized connections with each other, particularly for ongoing business relationships like agentic initiated transaction workflows as well as recurring and metered billing. It builds on [TAIP-2] messaging, [TAIP-9] relationship proofs, and [TAIP-13] purpose codes to provide a standardized way for agents to request and authorize connections with transaction constraints. The protocol includes OAuth-style authorization flows, allowing interactive user consent when needed, and supports defining transaction limits and allowed purposes upfront.

## Motivation

The Transaction Authorization Protocol enables secure communication between different agents (AI Agents, VASPs, wallets, custodians, etc.). However, for ongoing business relationships, agents need a way to establish persistent, authorized connections with predefined constraints. Current implementations often rely on ad-hoc methods or require repeated authorizations. This TAIP addresses several key needs:

1. **AI Agent Transactions:** Autonomous AI agents executing trades, payments, or financial operations within user-defined limits and purposes (e.g., trading bot with $10k daily limit for crypto arbitrage).
2. **Subscription & Recurring Payments:** SaaS platforms, streaming services, and membership organizations collecting recurring fees (e.g., monthly Netflix subscription, annual software licenses, usage-based cloud billing).
3. **Self-Onboarding Services:** Entities directly onboarding with service providers where the agent and principal are the same party (e.g., a merchant directly connecting to a payment processor's API, a business self-registering with a financial platform).

4. **Corporate Treasury Management:** CFO tools and treasury platforms managing cash flows, vendor payments, and payroll on behalf of businesses (e.g., automated supplier payments, cross-border payroll processing).
5. **Expense Management Systems:** Corporate payment wallet programs and expense platforms processing employee reimbursements and vendor payments (e.g., Expensify submitting reimbursements, Ramp processing corporate card settlements).
6. **Marketplace & Platform Payouts:** E-commerce platforms, gig economy apps, and creator platforms distributing earnings (e.g., Shopify merchant payouts, Uber driver payments, YouTube creator revenue sharing).
7. **Automated Compliance & Reporting:** RegTech solutions performing automated transaction monitoring, tax withholding, and regulatory reporting (e.g., automatic tax payments, AML transaction screening).
8. **Cross-Border Payment Services:** International payment providers and remittance services executing FX conversions and transfers (e.g., Wise business accounts, payroll providers handling multi-currency payments).
9. **DeFi Protocol Integration:** Decentralized protocols performing automated yield farming, liquidity provision, or collateral management (e.g., auto-compounding vaults, algorithmic trading strategies).

By standardizing these connection aspects, we enable secure B2B integrations while maintaining user control and risk management. Each connection enforces specific constraints including transaction limits, allowed purposes, and time boundaries.

## Specification

### Message Types

All messages implement [TAIP-2] and are sent between [TAIP-5 Agents][TAIP-5]. Each message type has specific requirements for its body object. The principal-agent relationship follows the model defined in [TAIP-6], where agents act on behalf of real-world parties.

### Parties and Agent Roles

The Agent Connection Protocol involves two distinct parties and their respective agents:

**Requester Party**: The party that initiates the connection request. This is typically a service provider, merchant, or other entity seeking permission to perform transactions on behalf of or with another party. The requester party is represented by one or more agents that handle the technical aspects of the connection process.

**Principal Party**: The party that the requester wants to establish a connection with, and on whose behalf future transactions may be performed. This is typically a customer, user, or business entity that will authorize the connection and set transaction constraints. The principal party may have their own agents (such as wallet providers or custodial services) that act on their behalf.

**Agent Relationships**: 
- The requester's agent initiates the Connect message and must be included in the `agents` array with a `for` attribute pointing to the requester's DID
- The principal's agent(s) may be added during the connection process using AddAgent messages as replies to the Connect thread
- Each agent clearly identifies which party it represents through the `for` attribute as defined in [TAIP-5]
- Multiple agents can represent the same party for different capabilities (e.g., compliance, wallet services, settlement)

This separation allows for complex B2B relationships where a service provider (requester) wants to act on behalf of their customer (principal) while maintaining clear accountability and authorization chains.

### Transaction Constraints

Transaction constraints are a fundamental security mechanism in the Agent Connection Protocol that define the boundaries and permissions for transactions performed through an established connection. These constraints serve multiple critical purposes:

**Security and Risk Management**: Constraints act as guardrails that prevent unauthorized or excessive transactions, protecting both parties from potential fraud, errors, or misuse of the connection. They establish clear limits on transaction amounts, frequencies, and purposes.

**Compliance and Governance**: Many organizations require specific controls over automated transactions to meet regulatory requirements, internal policies, or audit standards. Constraints provide a standardized way to encode these requirements into the connection itself.

**User Control and Transparency**: By clearly defining what actions can be performed through a connection, constraints give users visibility and control over how their funds or assets may be used by authorized agents.

**Automated Decision Making**: Constraints enable receiving agents to automatically approve transactions that fall within established parameters while flagging or rejecting those that exceed the agreed-upon limits.

#### Constraint Enforcement

Agents MUST enforce all specified constraints when processing transactions through an established connection. Failure to respect constraints constitutes a violation of the connection agreement and may result in:
- Transaction rejection
- Connection termination
- Loss of trust between parties
- Potential legal or regulatory consequences

#### Types of Constraints

The Agent Connection Protocol supports several categories of transaction constraints:

**Purpose Constraints**: Define what types of transactions are permitted through the connection.
- `purposes` - Specific [TAIP-13] purpose codes that are allowed
- `categoryPurposes` - Broader [TAIP-13] category purpose codes that encompass multiple specific purposes

**Financial Limits**: Set monetary boundaries on transaction amounts and frequencies.
- `per_transaction` - Maximum amount for any single transaction
- `per_day`, `per_week`, `per_month`, `per_year` - Cumulative limits over time periods
- `currency` - The currency in which all limits are expressed

**Party Restrictions**: Control which entities can participate in transactions.
- `allowedBeneficiaries` - Specific [TAIP-6] parties that can receive payments through this connection
- This enables scenarios like approved vendor lists or restricted recipient sets

**Technical Restrictions**: Define technical parameters for transaction execution.
- `allowedSettlementAddresses` - Specific [CAIP-10] blockchain addresses permitted for settlement
- `allowedAssets` - Specific [CAIP-19] assets that can be transacted through this connection
- These constraints enable precise control over which tokens and addresses can be used

Constraints work together to create a comprehensive authorization framework. For example, a connection might allow monthly subscription payments (`purposes: ["SUBS"]`) up to $100 per month (`limits: {"per_month": "100.00", "currency": "USD"}`) only to a specific merchant (`allowedBeneficiaries: [{"@id": "did:web:saas-provider.example"}]`) using only USDC tokens (`allowedAssets: ["eip155:1/erc20:0xA0b86a33E6441b7178bb7094b2c4b6e5066d68B7"]`).

### Connect Message

A message sent by an agent requesting connection to another agent:

- `@context` - REQUIRED the JSON-LD context `https://tap.rsvp/schema/1.0`
- `@type` - REQUIRED the JSON-LD type `https://tap.rsvp/schema/1.0#Connect`
- `requester` - REQUIRED [TAIP-6] Party object representing the party requesting the connection:
  - `@id` - REQUIRED string DID or IRI of the requesting party
  - Additional attributes MAY be included as defined in [TAIP-6], such as country code, merchant category code, or other party metadata
- `principal` - REQUIRED [TAIP-6] Party object representing the party the requesting agent acts on behalf of:
  - `@id` - REQUIRED string DID or IRI of the principal party
  - Additional attributes MAY be included as defined in [TAIP-6], such as country code, merchant category code, or other party metadata
- `agents` - REQUIRED array of agent objects representing agents involved in the connection process. Each agent object follows [TAIP-5] specification. At minimum, there MUST be one agent in this array whose `@id` matches the `from` field of the surrounding DIDComm message and has a `for` attribute set to the `requester` DID
- `constraints` - REQUIRED object specifying the requested transaction constraints:
  - `purposes` - OPTIONAL array of [TAIP-13] purpose codes
  - `categoryPurposes` - OPTIONAL array of [TAIP-13] category purpose codes
  - `limits` - OPTIONAL object containing transaction limits:
    - `per_transaction` - OPTIONAL string decimal amount
    - `per_day` - OPTIONAL string decimal amount
    - `per_week` - OPTIONAL string decimal amount
    - `per_month` - OPTIONAL string decimal amount
    - `per_year` - OPTIONAL string decimal amount
    - `currency` - REQUIRED string ISO 4217 currency code if limits are specified
  - `allowedBeneficiaries` - OPTIONAL array of [TAIP-6] Party objects representing parties that can receive payments through this connection
  - `allowedSettlementAddresses` - OPTIONAL array of [CAIP-10] addresses that are permitted for settlement through this connection
  - `allowedAssets` - OPTIONAL array of [CAIP-19] asset identifiers that can be transacted through this connection
- `agreement` - OPTIONAL string URL pointing to terms of service or agreement between the principal and requesting agent
- `expiry` - OPTIONAL timestamp in ISO 8601 format indicating when the connection request expires. After this time, if no authorization has occurred, the connection request should be considered invalid. This is distinct from the technical message expiry handled by the DIDComm `expires_time` header.
- `attachments` - OPTIONAL array of [TAIP-2] message attachments containing transaction messages (such as [TAIP-3] Transfer or [TAIP-14] Payment messages) that should be authorized in the same context as the Connect request. When attachments are present, authorization of the Connect request also authorizes the attached transaction messages. This enables use cases like establishing recurring billing connections with an immediate first payment, or setting up trading permissions with an initial transaction. All attached transaction messages MUST respect the connection's defined constraints.

### AuthorizationRequired Message

A message sent in response to a Connect request when interactive authorization is needed. This message follows the specification defined in [TAIP-4] for interactive authorization flows.

- `@context` - REQUIRED the JSON-LD context `https://tap.rsvp/schema/1.0`
- `@type` - REQUIRED the JSON-LD type `https://tap.rsvp/schema/1.0#AuthorizationRequired`
- `authorizationUrl` - REQUIRED string URL where the user can authorize the connection
- `expires` - REQUIRED string ISO 8601 timestamp when the authorization URL expires
- `from` - OPTIONAL the party type (e.g., `customer`, `principal`, or `originator`) that is required to open the URL

For the complete specification of this message type, see [TAIP-4].

### Authorize Message

A message sent to approve a connection request:

- `@context` - REQUIRED the JSON-LD context `https://tap.rsvp/schema/1.0`
- `@type` - REQUIRED the JSON-LD type `https://tap.rsvp/schema/1.0#Authorize`

### Reject Message

A message sent to reject a connection request:

- `@context` - REQUIRED the JSON-LD context `https://tap.rsvp/schema/1.0`
- `@type` - REQUIRED the JSON-LD type `https://tap.rsvp/schema/1.0#Reject`
- `reason` - OPTIONAL string human-readable reason for rejection

### Cancel Message

A message sent by principal to terminate an existing connection:

- `@context` - REQUIRED the JSON-LD context `https://tap.rsvp/schema/1.0`
- `@type` - REQUIRED the JSON-LD type `https://tap.rsvp/schema/1.0#Cancel`
- `by` - REQUIRED should be `principal`
- `reason` - OPTIONAL string human-readable reason for cancellation

### AddAgents Message

A message sent to add additional agents to the connection process as defined in [TAIP-5]. This is particularly useful for adding the principal's agent after the initial Connect request:

- `@context` - REQUIRED the JSON-LD context `https://tap.rsvp/schema/1.0`
- `@type` - REQUIRED the JSON-LD type `https://tap.rsvp/schema/1.0#AddAgents`
- `agents` - REQUIRED an array of agent objects to add to the connection. Each agent object follows [TAIP-5] specification

For complete specification of this message type, see [TAIP-5].

### Connection Flow

1. Agent A sends Connect message to Agent B with:
   - The requesting party's identity
   - The principal party they represent
   - Agent identities and endpoints in the agents array
   - Desired transaction constraints
   - Optionally, transaction messages (Transfer, Payment, etc.) as attachments for immediate authorization

2. Agent B chooses an authorization method:
   - Option 1: Out-of-band Authorization
     - Notifies customer through existing channels
     - Customer logs into VASP's service to review
   - Option 2: Authorization URL
     - Returns AuthorizationRequired with URL
     - Customer opens URL to review and authenticate

3. Customer reviews and decides:
   - Views connection details and constraints
   - Reviews any attached transaction messages for immediate execution
   - Approves or denies through chosen interface

4. Agent B sends final response:
   - Authorize message if approved (automatically authorizes any attached transactions)
   - Reject message if denied

5. Agent addition (if needed):
   - Additional agents may be added using AddAgent messages as replies to the Connect thread
   - This allows the principal's agent to be included if not initially present

6. Once authorized:
   - Connection is established with a unique identifier
   - Future transactions must respect the agreed constraints
   - Either party can Cancel the connection

### Out-of-Band Initiation

To initiate a connection with a party that hasn't communicated before, agents MUST support [Out-of-Band Messages](https://identity.foundation/didcomm-messaging/spec/v2.1/#out-of-band-messages). The OOB message allows sharing the Connect request through URLs or QR codes.

OOB messages for Connect requests:

1. MUST use the `https://didcomm.org/out-of-band/2.0` protocol
2. MUST include the goal_code `tap.connect`
3. SHOULD be shared as URLs according to the [Out-of-Band message spec](https://identity.foundation/didcomm-messaging/spec/v2.1/#out-of-band-messages)
4. MUST include the Connect message as a signed DIDComm message in the attachment

Example Out-of-Band message with Connect request:

```json
{
  "type": "https://didcomm.org/out-of-band/2.0/invitation",
  "id": "2e9e257c-2839-4fae-b0c4-dcd4e2159f4e",
  "from": "did:example:b2b-service",
  "body": {
    "goal_code": "tap.connect",
    "goal": "Establish agent connection",
    "accept": ["didcomm/v2"]
  },
  "attachments": [{
    "id": "connect-request-1",
    "mime_type": "application/didcomm-signed+json",
    "data": {
      "json": {
        "type": "https://tap.rsvp/schema/1.0#Connect",
        "id": "599f7220-6149-4c45-adbb-86d96c8e0608",
        "from": "did:example:b2b-service",
        "body": {
          "@context": "https://tap.rsvp/schema/1.0",
          "@type": "https://tap.rsvp/schema/1.0#Connect",
          "requester": {
            "@id": "did:example:b2b-service"
          },
          "principal": {
            "@id": "did:example:business-customer"
          },
          "agents": [
            {
              "@id": "did:example:b2b-service",
              "name": "B2B Payment Service",
              "for": "did:example:b2b-service"
            }
          ],
          "constraints": {
            "purposes": ["BEXP", "SUPP"]
          },
          "agreement": "https://b2b-service.com/terms"
        },
        "attachments": [],
        "created_time": 1516269022
      }
    }
  }]
}
```

The corresponding URL format would be either:
```
https://example.com/path?_oob=eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9...
```

Or using the shorter `_oobid` parameter that references a previously published Out-of-Band message:
```
https://example.com/path?_oobid=2e9e257c-2839-4fae-b0c4-dcd4e2159f4e
```

Where the `_oob` parameter contains the base64url-encoded Out-of-Band message, or the `_oobid` parameter contains a unique identifier that can be resolved to retrieve the full Out-of-Band message.

### Connection Flow Diagrams

#### Basic Connection Flow with Direct Authorization

```mermaid
sequenceDiagram
    participant PSP as PSP Agent
    participant CustomerWallet as Customer Wallet Agent
    participant Customer

    PSP->>CustomerWallet: Connect [requester: Merchant, principal: Customer, agents: [PSP]]
    CustomerWallet->>Customer: Out-of-band notification
    Customer->>CustomerWallet: Review & Authorize
    CustomerWallet->>PSP: Authorize
    Note over PSP,CustomerWallet: Connection Established
```

#### Connection Flow with Interactive Authorization

```mermaid
sequenceDiagram
    participant PSP as PSP Agent
    participant CustomerWallet as Customer Wallet Agent
    participant Customer

    PSP->>CustomerWallet: Connect [requester: Merchant, principal: Customer, agents: [PSP]]
    CustomerWallet->>PSP: AuthorizationRequired [URL]
    PSP->>Customer: Redirect to authorization URL
    Customer->>CustomerWallet: Authenticate & Review
    Customer->>CustomerWallet: Approve
    CustomerWallet->>PSP: Authorize
    Note over PSP,CustomerWallet: Connection Established
```

#### Connection State Machine

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Requested: Connect
    Requested --> PendingAuthorization: AuthorizationRequired
    Requested --> Authorized: Authorize
    Requested --> Rejected: Reject
    PendingAuthorization --> Authorized: Authorize
    PendingAuthorization --> Rejected: Reject
    Authorized --> Cancelled: Cancel
    Authorized --> [*]
    Rejected --> [*]
    Cancelled --> [*]
```

#### Connection Flow with AddAgents

The following diagram shows how a customer's wallet agent can join the connection using AddAgents:

```mermaid
sequenceDiagram
    participant PSP as PSP Agent
    participant Customer
    participant CustomerWallet as Customer Wallet Agent

    PSP->>Customer: Connect [requester: Merchant, principal: Customer, agents: [PSP]]
    Note over Customer: Customer receives connection request
    Customer->>CustomerWallet: Open/select preferred wallet
    CustomerWallet->>PSP: AddAgents [agents: [CustomerWallet]]
    Note over PSP,CustomerWallet: PSP now knows customer's wallet agent
    Customer->>CustomerWallet: Review & Authorize connection
    CustomerWallet->>PSP: Authorize
    Note over PSP,CustomerWallet: Connection Established with all agents
```

### Transaction Flow Using Connection

The following diagram shows how an established connection is used for subsequent transactions:

```mermaid
sequenceDiagram
    participant PSP as PSP Agent
    participant CustomerWallet as Customer Wallet Agent
    participant Blockchain

    Note over PSP,CustomerWallet: Connection already established
    PSP->>CustomerWallet: Payment [pthid: connection_id]
    activate CustomerWallet
    CustomerWallet->>CustomerWallet: Validate against constraints
    CustomerWallet->>PSP: Authorize [settlementAddress]
    deactivate CustomerWallet
    CustomerWallet->>Blockchain: Submit transaction
    CustomerWallet->>PSP: Settle [settlementId]
```

### Connection Security

- All messages MUST be encrypted using [TAIP-2] message encryption
- Agents MUST verify DIDs and signatures before accepting connections
- Authorization MUST be performed through secure, authenticated channels
- Authorization URLs MUST use HTTPS and include CSRF protection
- Connection identifiers should be unique and unpredictable
- When using `serviceUrl` in the agent object:
  - The URL MUST use HTTPS for security
  - Agents MUST prioritize DIDComm service endpoints from the DID document over the `serviceUrl` field
  - The `serviceUrl` SHOULD only be used when no valid DIDComm service endpoint is resolvable from the DID document
  - Agents SHOULD validate that the `serviceUrl` actually belongs to the DID holder through appropriate verification mechanisms

## Rationale

The design choices in this specification aim to balance security, usability, and flexibility:

- **Flexible Authorization:** Supports both out-of-band and URL-based flows
- **Purpose Codes:** Uses [TAIP-13] for standardized transaction types
- **Transaction Limits:** Provides clear constraints for risk management
- **Connection Identifiers:** Enable tracking and management of approved connections
- **State Management:** Receiving agents track connection status

## Security Considerations

- **Authorization Flow:** Must use secure authentication channels
- **Authorization URLs:** Must prevent CSRF and phishing attacks
- **Connection Identifiers:** Must be unique and unpredictable
- **Transaction Limits:** Must be enforced server-side
- **Connection State:** Must be securely maintained

## Privacy Considerations

- **Minimal Disclosure:** Only exchange necessary information
- **User Consent:** Clear authorization UI showing permissions
- **Connection Isolation:** Unique identifiers per connection
- **Data Retention:** Clear connection data when terminated
- **Audit Logs:** Balance logging with privacy

## Test Cases

The following are example plaintext messages. See [TAIP-2] for how to sign the messages.

### Connect

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "type": "https://tap.rsvp/schema/1.0#Connect",
  "from": "did:example:b2b-service",
  "to": ["did:example:vasp"],
  "created_time": 1516269022,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Connect",
    "requester": {
      "@id": "did:example:b2b-service"
    },
    "principal": {
      "@id": "did:example:business-customer"
    },
    "agents": [
      {
        "@id": "did:example:b2b-service",
        "name": "B2B Payment Service",
        "serviceUrl": "https://b2b-service/did-comm",
        "for": "did:example:b2b-service"
      }
    ],
    "constraints": {
      "purposes": ["BEXP", "SUPP"],
      "categoryPurposes": ["CASH", "CCRD"],
      "limits": {
        "per_transaction": "10000.00",
        "per_day": "50000.00",
        "currency": "USD"
      },
      "allowedBeneficiaries": [
        {
          "@id": "did:example:vendor-1",
          "name": "Approved Vendor 1"
        },
        {
          "@id": "did:example:vendor-2", 
          "name": "Approved Vendor 2"
        }
      ],
      "allowedSettlementAddresses": [
        "eip155:1:0x742d35Cc6e4dfE2eDFaD2C0b91A8b0780EDAEb58",
        "eip155:1:0x89abcdefabcdefabcdefabcdefabcdefabcdef12"
      ],
      "allowedAssets": [
        "eip155:1/slip44:60",
        "eip155:1/erc20:0xA0b86a33E6441b7178bb7094b2c4b6e5066d68B7"
      ]
    },
    "agreement": "https://b2b-service.com/terms/api-agreement",
    "expiry": "2024-03-22T15:00:00Z"
  }
}
```

### AuthorizationRequired

```json
{
  "id": "98765432-e89b-12d3-a456-426614174001",
  "type": "https://tap.rsvp/schema/1.0#AuthorizationRequired",
  "from": "did:example:vasp",
  "to": ["did:example:b2b-service"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "created_time": 1516269023,
  "expires_time": 1516385931,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#AuthorizationRequired",
    "authorizationUrl": "https://vasp.com/authorize?request=abc123",
    "expires": "2024-03-22T15:00:00Z"
  }
}
```

### Authorize

```json
{
  "id": "abcdef12-e89b-12d3-a456-426614174002",
  "type": "https://tap.rsvp/schema/1.0#Authorize",
  "from": "did:example:vasp",
  "to": ["did:example:b2b-service"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "created_time": 1516269024,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Authorize"
  }
}
```

### Reject

```json
{
  "id": "76543210-e89b-12d3-a456-426614174003",
  "type": "https://tap.rsvp/schema/1.0#Reject",
  "from": "did:example:vasp",
  "to": ["did:example:b2b-service"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "created_time": 1516269024,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Reject",
    "reason": "unauthorized"
  }
}
```

### Cancel

```json
{
  "id": "fedcba98-e89b-12d3-a456-426614174004",
  "type": "https://tap.rsvp/schema/1.0#Cancel",
  "from": "did:example:vasp",
  "to": ["did:example:b2b-service"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "created_time": 1516269025,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Cancel",
    "reason": "user_requested"
  }
}
```

### Self-Onboarding Example

The following example shows a merchant directly onboarding with a payment processor where the agent and principal are the same entity:

```json
{
  "id": "789abcde-e89b-12d3-a456-426614174006",
  "type": "https://tap.rsvp/schema/1.0#Connect",
  "from": "did:example:merchant",
  "to": ["did:example:payment-processor"],
  "created_time": 1516269027,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Connect",
    "requester": {
      "@id": "did:example:merchant"
    },
    "principal": {
      "@id": "did:example:merchant",
      "name": "Example Merchant Inc.",
      "countryCode": "US",
      "merchantCategoryCode": "5411"
    },
    "agents": [
      {
        "@id": "did:example:merchant",
        "name": "Example Merchant",
        "for": "did:example:merchant"
      }
    ],
    "constraints": {
      "purposes": ["SALA", "GDDS"],
      "limits": {
        "per_transaction": "5000.00",
        "per_day": "25000.00",
        "currency": "USD"
      }
    },
    "agreement": "https://payment-processor.com/merchant-agreement",
    "expiry": "2024-03-25T00:00:00Z"
  }
}
```

In this self-onboarding case:
- The `requester.@id` and `principal.@id` are the same DID (`did:example:merchant`)
- The agent's `@id` in the `agents` array matches the `from` field of the DIDComm message
- The merchant is acting as both the requesting party and the business principal
- There is one agent representing the merchant in the `agents` array
- The `agreement` field points to the merchant agreement terms

## Using Connections for Transactions

Once a connection is established, the connecting agent can perform transactions on behalf of the customer. All transactions related to a connection MUST include the connection's `id` as the `pthid` (parent thread ID) in the message header. This allows receiving agents to validate the transaction against the connection's constraints.

### Example Transfer Using Connection

The following example shows a [TAIP-3] Transfer message sent by a B2B service using their authorized connection to initiate a transfer on behalf of their customer:

```json
{
  "id": "456789ab-e89b-12d3-a456-426614174005",
  "type": "https://tap.rsvp/schema/1.0#Transfer",
  "from": "did:example:b2b-service",
  "to": ["did:example:vasp"],
  "pthid": "123e4567-e89b-12d3-a456-426614174000",
  "created_time": 1516269026,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Transfer",
    "asset": "eip155:1/slip44:60",
    "amount": "1.23",
    "originator": {
      "@id": "did:example:business-customer"
    },
    "beneficiary": {
      "@id": "did:example:merchant"
    },
    "agents": [
      {
        "@id": "did:example:b2b-service",
        "principal": {
          "@id": "did:example:business-customer"
        }
      },
      {
        "@id": "did:example:vasp",
        "principal": {
          "@id": "did:example:merchant"
        },
        "role": "BeneficiaryVASP"
      }
    ]
  }
}
```

The receiving agent MUST:
1. Verify the connection ID in `pthid` exists and is active
2. Validate that the transaction complies with the connection's constraints:
   - Check that the purpose (if specified) is allowed
   - Verify the amount is within the per-transaction and daily limits
   - Confirm the originator's `@id` matches the connection's `principal.@id` value
   - Verify the agent has permission to act for the specified principal
   - If `allowedBeneficiaries` is specified, confirm the beneficiary is in the approved list
   - If `allowedSettlementAddresses` is specified, confirm the settlement address is in the approved list
   - If `allowedAssets` is specified, confirm the transaction asset is in the approved list
3. Process the transaction according to [TAIP-4] if all checks pass

### Example Connect with Attached Payment for Recurring Billing

The following example shows a Connect message with an attached Payment message for establishing recurring billing with an immediate first payment:

```json
{
  "id": "recurring-connect-001",
  "type": "https://tap.rsvp/schema/1.0#Connect",
  "from": "did:web:saas-provider.example",
  "to": ["did:web:customer.wallet"],
  "created_time": 1516269030,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Connect",
    "requester": {
      "@id": "did:web:saas-provider.example",
      "name": "SaaS Platform Inc"
    },
    "principal": {
      "@id": "did:example:customer",
      "name": "Enterprise Customer"
    },
    "agents": [
      {
        "@id": "did:web:saas-provider.example",
        "name": "SaaS Payment Service",
        "for": "did:web:saas-provider.example"
      }
    ],
    "constraints": {
      "purposes": ["SUBS"],
      "limits": {
        "per_transaction": "999.99",
        "per_month": "999.99",
        "currency": "USD"
      }
    },
    "agreement": "https://saas-provider.example/subscription-terms",
    "expiry": "2024-04-01T00:00:00Z"
  },
  "attachments": [
    {
      "id": "first-payment-001",
      "media_type": "application/didcomm-signed+json",
      "data": {
        "json": {
          "id": "payment-001",
          "type": "https://tap.rsvp/schema/1.0#Payment",
          "from": "did:web:saas-provider.example",
          "to": ["did:web:customer.wallet"],
          "body": {
            "@context": "https://tap.rsvp/schema/1.0",
            "@type": "https://tap.rsvp/schema/1.0#Payment",
            "currency": "USD",
            "amount": "99.99",
            "merchant": {
              "@id": "did:web:saas-provider.example",
              "name": "SaaS Platform Inc",
              "mcc": "5734"
            },
            "agents": [
              {
                "@id": "did:web:saas-provider.example",
                "for": "did:web:saas-provider.example"
              }
            ],
            "expiry": "2024-04-01T00:00:00Z"
          }
        }
      }
    }
  ]
}
```

In this example:
- The Connect message establishes a recurring billing relationship with monthly subscription limits
- The attached Payment message requests immediate payment for the first billing cycle
- Authorization of the Connect automatically authorizes the attached Payment
- Future recurring payments can reference this connection via `pthid`
- The attached Payment respects the connection's constraints (amount within limits, correct purpose)


## References

* [TAIP-2] TAP Messaging
* [TAIP-4] Transaction Authorization Protocol
* [TAIP-6] Transaction Parties
* [TAIP-9] Proof of Relationship
* [TAIP-13] Purpose Codes
* [CAIP-10] Account ID Specification
* [CAIP-19] Asset Type and Asset ID Specification

[TAIP-2]: ./taip-2 "TAP Messaging"
[TAIP-4]: ./taip-4 "Transaction Authorization Protocol"
[TAIP-6]: ./taip-6 "Transaction Parties"
[TAIP-9]: ./taip-9 "Proof of Relationship"
[TAIP-13]: ./taip-13 "Purpose Codes"
[CAIP-10]: https://chainagnostic.org/CAIPs/caip-10 "Account ID Specification"
[CAIP-19]: https://chainagnostic.org/CAIPs/caip-19 "Asset Type and Asset ID Specification"

## Copyright

Copyright and related rights waived via [CC0].
