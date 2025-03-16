# Transaction Authorization Protocol (TAP) Message Types and Data Structures

## Table of Contents

- [Common DIDComm Message Structure](#common-didcomm-message-structure)
- [Transaction Message](#transaction-message)
  - [Transfer](#transfer)
  - [PaymentRequest](#paymentrequest)
- [Authorization Flow Messages](#authorization-flow-messages)
  - [Authorize](#authorize)
  - [Settle](#settle)
  - [Reject](#reject)
  - [Cancel](#cancel)
  - [Revert](#revert)
- [Participant Management Messages](#participant-management-messages)
  - [UpdateAgent](#updateagent)
  - [UpdateParty](#updateparty)
  - [AddAgents](#addagents)
  - [ReplaceAgent](#replaceagent)
  - [RemoveAgent](#removeagent)
- [Relationship proofs](#relationship-proofs)
  - [ConfirmRelationship](#confirmrelationship)
- [Policy messages](#policy-messages)
  - [UpdatePolicies](#updatepolicies)
- [Data Elements](#data-elements)
  - [Party](#party)
  - [Agent](#agent)
  - [Policy](#policy)
    - [RequirePresentation](#requirepresentation)
    - [RequirePurpose](#requirepurpose)
- [Message Flow Examples](#message-flow-examples)
  - [Basic Transfer Flow](#basic-transfer-flow)
  - [Transfer with LEI and Purpose Code](#transfer-with-lei-and-purpose-code)
  - [Payment Request Flow](#payment-request-flow)

## Introduction

This document defines the message types and data structures used in the Transaction Authorization Protocol (TAP). All messages follow the [DIDComm Messaging](https://identity.foundation/didcomm-messaging/spec/v2.1/) specification and use JSON-LD for data representation. See [TAIP-2].

## Common DIDComm Message Structure

All TAP messages follow the DIDComm v2 message structure with these common attributes:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Unique message identifier (UUIDv4) |
| type | string | Yes | Message type URI in the `https://tap.rsvp/taips/N` namespace |
| from | string | Yes | DID of the sender |
| to | array | Yes | Array of recipient DIDs |
| thid | string | No | Thread identifier (defaults to id if not provided) |
| pthid | string | No | Parent thread identifier |
| body | object | Yes | Message payload as JSON-LD |
| created_time | number | Yes | Unix timestamp of message creation |
| expires_time | number | No | Unix timestamp when message expires |

## Transaction Message

### Transfer
[TAIP-3] - Review

Initiates a virtual asset transfer between parties.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-3]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-3]) | JSON-LD type "https://tap.rsvp/schema/1.0#Transfer" |
| asset | string | Yes | Review ([TAIP-3]) | CAIP-19 identifier of the asset |
| amount | string | Yes | Review ([TAIP-3]) | Decimal amount of the asset |
| originator | [Party](#party) | Yes | Review ([TAIP-3]) | Party for the sender |
| beneficiary | [Party](#party) | No | Review ([TAIP-3]) | Party for the recipient |
| agents | array of [Agent](#agent) | Yes | Review ([TAIP-3]) | Array of Agents |
| settlementId | string | No | Review ([TAIP-3]) | CAIP-220 identifier of settlement transaction |
| memo | string | No | Review ([TAIP-3]) | Human readable message about the transfer |

#### Examples

##### Simple first-party transfer
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "type": "https://tap.rsvp/schema/1.0#Transfer",
  "from": "did:web:originator.vasp",
  "to": ["did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"],
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Transfer",
    "asset": "eip155:1/slip44:60",
    "originator": {
      "@id": "did:web:originator.sample"
    },
    "amount": "1.23",
    "agents": [
      {
        "@id": "did:web:originator.sample"
      },
      {
        "@id": "did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
        "role": "settlementAddress"
      }
    ]
  }
}
```

##### Third-party transfer with LEI
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "type": "https://tap.rsvp/schema/1.0#Transfer",
  "from": "did:web:originator.vasp",
  "to": ["did:web:beneficiary.vasp"],
  "body": {
    "@context": {
      "@vocab": "https://tap.rsvp/schema/1.0",
      "lei": "https://schema.org/leiCode"
    },
    "@type": "https://tap.rsvp/schema/1.0#Transfer",
    "asset": "eip155:1/slip44:60",
    "amount": "1.23",
    "originator": {
      "@id": "did:org:acmecorp",
      "lei:leiCode": "3M5E1GQKGL17HI8CPN20",
      "name": "ACME Corporation"
    },
    "beneficiary": {
      "@id": "did:eg:alice"
    },
    "agents": [
      {
        "@id": "did:web:originator.vasp",
        "for": "did:org:acmecorp"
      },
      {
        "@id": "did:web:beneficiary.vasp",
        "for": "did:eg:alice"
      }
    ]
  }
}
```

### PaymentRequest
[TAIP-14] - Draft

Initiates a payment request from a merchant to a customer.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Draft ([TAIP-14]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Draft ([TAIP-14]) | JSON-LD type "https://tap.rsvp/schema/1.0#PaymentRequest" |
| asset | string | No | Draft ([TAIP-14]) | CAIP-19 identifier of the asset to be paid. Must be present if currency is not provided. |
| currency | string | No | Draft ([TAIP-14]) | ISO 4217 currency code for fiat amount. Must be present if asset is not provided. |
| amount | string | Yes | Draft ([TAIP-14]) | Amount requested in the specified asset or currency |
| supportedAssets | array | No | Draft ([TAIP-14]) | Array of CAIP-19 asset identifiers that can be used to settle a fiat currency amount |
| invoice | string | No | Draft ([TAIP-14]) | URI to an invoice |
| expiry | string | No | Draft ([TAIP-14]) | ISO 8601 timestamp when the request expires |
| merchant | [Party](#party) | Yes | Draft ([TAIP-14]) | Party for the merchant (beneficiary) |
| customer | [Party](#party) | No | Draft ([TAIP-14]) | Party for the customer (originator) |
| requirePresentation | array | No | Draft ([TAIP-14]) | Array of [RequirePresentation](#requirepresentation) policies |

#### Examples

##### Simple crypto payment request
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174014",
  "type": "https://tap.rsvp/schema/1.0#PaymentRequest",
  "from": "did:web:merchant.vasp",
  "to": ["did:web:customer.vasp"],
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#PaymentRequest",
    "asset": "eip155:1/erc20:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "amount": "100.00",
    "merchant": {
      "@id": "did:web:merchant.vasp",
      "name": "Example Store"
    },
    "invoice": "https://example.com/invoice/123"
  }
}
```

##### Fiat payment request with supported assets
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174015",
  "type": "https://tap.rsvp/schema/1.0#PaymentRequest",
  "from": "did:web:merchant.vasp",
  "to": ["did:web:customer.vasp"],
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#PaymentRequest",
    "currency": "USD",
    "amount": "50.00",
    "supportedAssets": [
      "eip155:1/erc20:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "eip155:1/erc20:0x6B175474E89094C44Da98b954EedeAC495271d0F"
    ],
    "merchant": {
      "@id": "did:web:merchant.vasp",
      "name": "Example Store"
    },
    "expiry": "2024-04-21T12:00:00Z",
    "requirePresentation": [
      {
        "@type": "RequirePresentation",
        "@context": ["https://schema.org/Person"],
        "fromAgent": "originator",
        "aboutParty": "originator",
        "presentationDefinition": "https://tap.rsvp/presentation-definitions/email/v1"
      }
    ]
  }
}
```

## Authorization Flow Messages

### Authorize
[TAIP-4] - Review

Approves a transfer for execution.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-4]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-4]) | JSON-LD type "https://tap.rsvp/schema/1.0#Authorize" |
| transfer | object | Yes | Review ([TAIP-4]) | Reference to the Transfer message being authorized |
| reason | string | No | Review ([TAIP-4]) | Optional reason for authorization |

#### Examples

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174002",
  "type": "https://tap.rsvp/schema/1.0#Authorize",
  "from": "did:web:beneficiary.vasp",
  "to": ["did:web:originator.vasp"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Authorize",
    "transfer": {
      "@id": "123e4567-e89b-12d3-a456-426614174000"
    },
    "reason": "All compliance checks passed"
  }
}
```

### Settle
[TAIP-4] - Review

Confirms the on-chain settlement of a transfer.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-4]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-4]) | JSON-LD type "https://tap.rsvp/schema/1.0#Settle" |
| transfer | object | Yes | Review ([TAIP-4]) | Reference to the Transfer message being settled |
| settlementId | string | Yes | Review ([TAIP-4]) | CAIP-220 identifier of the settlement transaction |

#### Examples

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174006",
  "type": "https://tap.rsvp/schema/1.0#Settle",
  "from": "did:web:originator.vasp",
  "to": ["did:web:beneficiary.vasp"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Settle",
    "transfer": {
      "@id": "123e4567-e89b-12d3-a456-426614174000"
    },
    "settlementId": "eip155:1:tx/0x3edb98c24d46d148eb926c714f4fbaa117c47b0c0821f38bfce9763604457c33"
  }
}
```

### Reject
[TAIP-4] - Review

Rejects a proposed transfer.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-4]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-4]) | JSON-LD type "https://tap.rsvp/schema/1.0#Reject" |
| transfer | object | Yes | Review ([TAIP-4]) | Reference to the Transfer message being rejected |
| reason | string | Yes | Review ([TAIP-4]) | Reason for rejection |

#### Examples

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174003",
  "type": "https://tap.rsvp/schema/1.0#Reject",
  "from": "did:web:beneficiary.vasp",
  "to": ["did:web:originator.vasp"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Reject",
    "transfer": {
      "@id": "123e4567-e89b-12d3-a456-426614174000"
    },
    "reason": "Beneficiary account is not active"
  }
}
```

### Cancel
[TAIP-4] - Review

Allows a party to cancel a transaction.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-4]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-4]) | JSON-LD type "https://tap.rsvp/schema/1.0#Cancel" |
| by | string | Yes | Review ([TAIP-4]) | The party cancelling the transaction (e.g. 'originator' or 'beneficiary') |
| reason | string | No | Review ([TAIP-4]) | Human readable message describing why the transaction was cancelled |

#### Examples

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174004",
  "type": "https://tap.rsvp/schema/1.0#Cancel",
  "from": "did:web:originator.vasp",
  "to": ["did:web:beneficiary.vasp"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Cancel",
    "by": "originator",
    "reason": "Customer requested cancellation"
  }
}
```

### Revert
[TAIP-4] - Review

Requests a reversal of a settled transaction. This could be part of a dispute resolution, post-transaction compliance checks, or other reasons. The reversal request can be Settled, Authorized, Rejected, or simply ignored by other agents.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-4]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-4]) | JSON-LD type "https://tap.rsvp/schema/1.0#Revert" |
| transfer | object | Yes | Review ([TAIP-4]) | Reference to the Transfer message being reverted |
| settlementAddress | string | Yes | Review ([TAIP-4]) | CAIP-10 identifier of the proposed settlement address to return the funds to |
| reason | string | Yes | Review ([TAIP-4]) | Human readable message describing why the transaction reversal is being requested |

#### Examples

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174005",
  "type": "https://tap.rsvp/schema/1.0#Revert",
  "from": "did:web:beneficiary.vasp",
  "to": ["did:web:originator.vasp"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Revert",
    "transfer": {
      "@id": "123e4567-e89b-12d3-a456-426614174000"
    },
    "settlementAddress": "eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
    "reason": "Insufficient Originator Information"
  }
}
```

## Participant Management Messages

### UpdateAgent
[TAIP-5] - Review

Updates information about an agent.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-5]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-5]) | JSON-LD type "https://tap.rsvp/schema/1.0#UpdateAgent" |
| agent | [Agent](#agent) | Yes | Review ([TAIP-5]) | Updated Agent |

#### Examples

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174007",
  "type": "https://tap.rsvp/schema/1.0#UpdateAgent",
  "from": "did:web:originator.vasp",
  "to": ["did:web:beneficiary.vasp"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#UpdateAgent",
    "agent": {
      "@id": "did:web:originator.vasp",
      "for": "did:eg:bob",
      "role": "SourceAddress"
    }
  }
}
```

### UpdateParty
[TAIP-6] - Review

Updates information about a party.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-6]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-6]) | JSON-LD type "https://tap.rsvp/schema/1.0#UpdateParty" |
| party | [Party](#party) | Yes | Review ([TAIP-6]) | Updated Party |

#### Examples

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174008",
  "type": "https://tap.rsvp/schema/1.0#UpdateParty",
  "from": "did:web:beneficiary.vasp",
  "to": ["did:web:originator.vasp"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "body": {
    "@context": {
      "@vocab": "https://tap.rsvp/schema/1.0",
      "lei": "https://schema.org/leiCode"
    },
    "@type": "https://tap.rsvp/schema/1.0#UpdateParty",
    "party": {
      "@id": "did:eg:alice",
      "lei:leiCode": "5493001KJTIIGC8Y1R12",
      "name": "Alice Corp Ltd"
    }
  }
}
```

### AddAgents
[TAIP-5] - Review

Adds one or more additional agents to the transaction.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-5]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-5]) | JSON-LD type "https://tap.rsvp/schema/1.0#AddAgents" |
| agents | array of [Agent](#agent) | Yes | Review ([TAIP-5]) | Array of Agents to add to the transaction |

#### Examples

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174009",
  "type": "https://tap.rsvp/schema/1.0#AddAgents",
  "from": "did:web:beneficiary.vasp",
  "to": ["did:web:originator.vasp"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#AddAgents",
    "agents": [
      {
        "@id": "did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
        "for": "did:web:beneficiary.vasp",
        "role": "settlementAddress"
      }
    ]
  }
}
```

### ReplaceAgent
[TAIP-5] - Review

Replaces an agent with another agent in the transaction.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-5]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-5]) | JSON-LD type "https://tap.rsvp/schema/1.0#ReplaceAgent" |
| original | string | Yes | Review ([TAIP-5]) | DID of the Agent to be replaced |
| replacement | [Agent](#agent) | Yes | Review ([TAIP-5]) | Agent to replace the original agent |

#### Examples

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174010",
  "type": "https://tap.rsvp/schema/1.0#ReplaceAgent",
  "from": "did:web:beneficiary.vasp",
  "to": ["did:web:originator.vasp"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#ReplaceAgent",
    "original": "did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
    "replacement": {
      "@id": "did:pkh:eip155:1:0x5678a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
      "for": "did:web:beneficiary.vasp",
      "role": "settlementAddress"
    }
  }
}
```

### RemoveAgent
[TAIP-5] - Review

Removes an agent from the transaction.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-5]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-5]) | JSON-LD type "https://tap.rsvp/schema/1.0#RemoveAgent" |
| agent | string | Yes | Review ([TAIP-5]) | DID of the Agent to be removed |

#### Examples

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174011",
  "type": "https://tap.rsvp/schema/1.0#RemoveAgent",
  "from": "did:web:beneficiary.vasp",
  "to": ["did:web:originator.vasp"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#RemoveAgent",
    "agent": "did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"
  }
}
```

## Relationship proofs

### ConfirmRelationship
[TAIP-9] - Draft

Confirms a relationship between an agent and the entity it acts on behalf of. Can include cryptographic proof via CACAO signatures for self-hosted wallets.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Draft ([TAIP-9]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Draft ([TAIP-9]) | JSON-LD type "https://tap.rsvp/schema/1.0#ConfirmRelationship" |
| body | [Agent](#agent) | Yes | Draft ([TAIP-9]) | Agent containing the relationship details |
| attachments | array | No | Draft ([TAIP-9]) | Optional array containing at most one CAIP-74 message for cryptographic proof |

The body object must contain:

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Draft ([TAIP-9]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Draft ([TAIP-9]) | JSON-LD type "https://tap.rsvp/schema/1.0#Agent" |
| @id | string | Yes | Draft ([TAIP-9]) | DID of the agent |
| for | string | Yes | Draft ([TAIP-9]) | DID of the entity the agent acts on behalf of |
| role | string | No | Draft ([TAIP-9]) | Role of the agent in the transaction |

#### Examples

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174012",
  "type": "https://tap.rsvp/schema/1.0#ConfirmRelationship",
  "from": "did:web:beneficiary.vasp",
  "to": ["did:web:originator.vasp"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Agent",
    "@id": "did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
    "for": "did:web:beneficiary.vasp",
    "role": "settlementAddress"
  },
  "attachments": [
    {
      "id": "proof-1",
      "media_type": "application/json",
      "data": {
        "json": {
          "h": "eth-personal-sign",
          "s": "0x...", // CACAO signature
          "p": "I confirm that this wallet (0x1234...fcdb) is controlled by did:web:beneficiary.vasp",
          "t": "2024-03-07T12:00:00Z"
        }
      }
    }
  ]
}
```

## Policy messages

### UpdatePolicies
[TAIP-7] - Review

Updates policies for a transaction.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-7]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-7]) | JSON-LD type "https://tap.rsvp/schema/1.0#UpdatePolicies" |
| policies | array of [Policy](#policy) ([RequirePresentation](#requirepresentation) or [RequirePurpose](#requirepurpose)) | Yes | Review ([TAIP-7]) | Array of Policy |

#### Examples

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174013",
  "type": "https://tap.rsvp/schema/1.0#UpdatePolicies",
  "from": "did:web:beneficiary.vasp",
  "to": ["did:web:originator.vasp"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#UpdatePolicies",
    "policies": [
      {
        "@type": "RequirePresentation",
        "@context": ["https://schema.org/Person"],
        "fromAgent": "originator",
        "aboutParty": "originator",
        "presentationDefinition": "https://tap.rsvp/presentation-definitions/ivms-101/eu/tfr"
      },
      {
        "@type": "RequirePurpose",
        "purpose": "SALA",
        "categoryPurpose": "CORT"
      }
    ]
  }
}
```

## Data Elements

### Party
[TAIP-6] - Review

Represents a participant in a transaction (originator or beneficiary).

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @id | string | Yes | Review ([TAIP-6]) | DID or IRI of the party |
| lei:leiCode | string | No | Draft ([TAIP-11]) | LEI code for legal entities. Must be a 20-character alpha-numeric string conforming to ISO 17442 |
| name | string | No | Review ([TAIP-6]) | Human-readable name |
| nameHash | string | No | Draft ([TAIP-12]) | SHA-256 hash of the normalized name (uppercase, no whitespace) |

When including an LEI, the Party MUST include the appropriate JSON-LD context:

```json
{
  "@context": { "lei": "https://schema.org/leiCode" },
  "@id": "did:web:example.vasp.com",
  "lei:leiCode": "5493001KJTIIGC8Y1R12"
}
```

If a customer (originator or beneficiary) is a legal entity and has an LEI, that LEI SHOULD be included in their Party. For institutions (VASPs), if they have an LEI, they MUST include it in their Party.

#### Example with LEI and Agent Relationship

```json
{
  "@context": {
    "@vocab": "https://tap.rsvp/schema/1.0",
    "lei": "https://schema.org/leiCode"
  },
  "@type": "https://tap.rsvp/schema/1.0#Transfer",
  "asset": "eip155:1/slip44:60",
  "amount": "100.00",
  "originator": {
    "@id": "did:org:acmecorp",
    "lei:leiCode": "3M5E1GQKGL17HI8CPN20",
    "name": "ACME Corporation"
  },
  "agents": [
    {
      "@id": "did:web:originator.vasp",
      "for": "did:org:acmecorp",
      "policies": [
        {
          "@type": "RequirePresentation",
          "@context": [
            "https://schema.org/Organization",
            "https://www.gleif.org/ontology/Base/Entity"
          ],
          "fromAgent": "beneficiary",
          "aboutAgent": "beneficiary",
          "purpose": "Require beneficiary institution LEI for compliance",
          "presentationDefinition": "https://tap.rsvp/definitions/lei/v1"
        }
      ]
    }
  ]
}
```

The example above shows:
1. A Party for a legal entity (ACME Corporation) with its LEI
2. An Agent representing that party (the VASP)
3. A policy requiring the beneficiary to present their LEI credentials

Note: Future versions may support verifiable LEIs (vLEIs) through the standard credential presentation mechanism defined in [TAIP-8].

### Agent
[TAIP-5] - Review

Represents a service involved in executing transactions.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @id | string | Yes | Review ([TAIP-5]) | DID of the agent |
| role | string | No | Review ([TAIP-5]) | Role of the agent (e.g., "SettlementAddress", "SourceAddress") |
| for | string | No | Review ([TAIP-5]) | Reference to the Party this agent represents |

### Policy
[TAIP-7] - Review

#### RequirePresentation

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @type | string | Yes | Review ([TAIP-7]) | "[RequirePresentation](#requirepresentation)" |
| @context | array | Yes | Review ([TAIP-7]) | Array of context URIs |
| fromAgent | string | Yes | Review ([TAIP-7]) | Agent to present the information |
| aboutParty | string | No | Review ([TAIP-7]) | Party the presentation is about |
| aboutAgent | string | No | Review ([TAIP-7]) | Agent the presentation is about |
| presentationDefinition | string | Yes | Review ([TAIP-7]) | URL to presentation definition |

#### RequirePurpose

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @type | string | Yes | Review ([TAIP-7]) | "[RequirePurpose](#requirepurpose)" |
| purpose | string | Yes | Review ([TAIP-7]) | ISO 20022 purpose code |
| categoryPurpose | string | No | Review ([TAIP-7]) | ISO 20022 category purpose code |

## Message Flow Examples

### Basic Transfer Flow

This flow demonstrates a basic transfer between parties with compliance requirements:
1. The originator initiates a transfer
2. The beneficiary requests additional information via policies
3. After receiving the required information, the beneficiary authorizes the transfer
4. The originator settles the transfer on-chain

Note that all messages share the same thread ID to link them together.

#### 1. Initial Transfer Request
```json
{
  "id": "transfer-123",
  "type": "https://tap.rsvp/schema/1.0#Transfer",
  "from": "did:web:originator.vasp",
  "to": ["did:web:beneficiary.vasp"],
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Transfer",
    "asset": "eip155:1/slip44:60",
    "amount": "1.23",
    "originator": {
      "@id": "did:eg:bob"
    },
    "beneficiary": {
      "@id": "did:eg:alice"
    },
    "agents": [
      {
        "@id": "did:web:originator.vasp"
      },
      {
        "@id": "did:web:beneficiary.vasp"
      }
    ]
  }
}
```

#### 2. Beneficiary's Policy Requirements
```json
{
  "id": "policies-123",
  "type": "https://tap.rsvp/schema/1.0#UpdatePolicies",
  "from": "did:web:beneficiary.vasp",
  "to": ["did:web:originator.vasp"],
  "thid": "transfer-123",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#UpdatePolicies",
    "policies": [
      {
        "@type": "RequirePresentation",
        "@context": ["https://schema.org/Person"],
        "fromAgent": "originator",
        "aboutParty": "originator",
        "presentationDefinition": "https://tap.rsvp/presentation-definitions/ivms-101/eu/tfr"
      }
    ]
  }
}
```

#### 3. Beneficiary's Authorization
```json
{
  "id": "auth-123",
  "type": "https://tap.rsvp/schema/1.0#Authorize",
  "from": "did:web:beneficiary.vasp",
  "to": ["did:web:originator.vasp"],
  "thid": "transfer-123",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Authorize",
    "transfer": {
      "@id": "transfer-123"
    }
  }
}
```

#### 4. Originator's Settlement Confirmation
```json
{
  "id": "settle-123",
  "type": "https://tap.rsvp/schema/1.0#Settle",
  "from": "did:web:originator.vasp",
  "to": ["did:web:beneficiary.vasp"],
  "thid": "transfer-123",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Settle",
    "transfer": {
      "@id": "transfer-123"
    },
    "settlementId": "eip155:1:tx/0x3edb98c24d46d148eb926c714f4fbaa117c47b0c0821f38bfce9763604457c33"
  }
}
```

### Transfer with LEI and Purpose Code

This example shows a transfer that includes:
- Legal Entity Identifier (LEI) for the originator
- ISO 20022 purpose codes for payment classification
- Corporate transfer between institutions

#### Corporate Transfer with LEI and Purpose Codes
```json
{
  "id": "transfer-124",
  "type": "https://tap.rsvp/schema/1.0#Transfer",
  "from": "did:web:originator.vasp",
  "to": ["did:web:beneficiary.vasp"],
  "body": {
    "@context": {
      "lei": "https://schema.org/leiCode"
    },
    "@type": "https://tap.rsvp/schema/1.0#Transfer",
    "asset": "eip155:1/slip44:60",
    "amount": "1.23",
    "purpose": "SALA",
    "categoryPurpose": "CORT",
    "originator": {
      "@id": "did:org:acmecorp-123",
      "lei:leiCode": "3M5E1GQKGL17HI8CPN20",
      "name": "ACME Corporation"
    },
    "beneficiary": {
      "@id": "did:eg:alice"
    },
    "agents": [
      {
        "@id": "did:web:originator.vasp"
      },
      {
        "@id": "did:web:beneficiary.vasp"
      }
    ]
  }
}
```

### Payment Request Flow

This flow demonstrates a complete payment request process from a merchant to a customer, including:
1. A merchant initiates by sending a PaymentRequest for $100 USD, accepting USDC as payment
2. The customer responds with a Transfer message, choosing to pay in USDC
3. The merchant authorizes the transfer after verifying the details match their request
4. The customer settles the payment on-chain and notifies the merchant with the transaction ID

Note that all messages in this flow share the same thread ID (`payment-123`) to link them together. The merchant can use this to track the payment status and match it to their original request.

#### 1. Initial PaymentRequest from Merchant
```json
{
  "id": "payment-123",
  "type": "https://tap.rsvp/schema/1.0#PaymentRequest",
  "from": "did:web:merchant.vasp",
  "to": ["did:web:customer.vasp"],
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#PaymentRequest",
    "currency": "USD",
    "amount": "100.00",
    "supportedAssets": [
      "eip155:1/erc20:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    ],
    "merchant": {
      "@id": "did:web:merchant.vasp",
      "name": "Example Store"
    },
    "expiry": "2024-04-21T12:00:00Z"
  }
}
```

#### 2. Customer's Transfer Response
```json
{
  "id": "transfer-123",
  "type": "https://tap.rsvp/schema/1.0#Transfer",
  "from": "did:web:customer.vasp",
  "to": ["did:web:merchant.vasp"],
  "thid": "payment-123",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Transfer",
    "asset": "eip155:1/erc20:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "amount": "100.00",
    "originator": {
      "@id": "did:web:customer"
    },
    "beneficiary": {
      "@id": "did:web:merchant.vasp",
      "name": "Example Store"
    },
    "agents": [
      {
        "@id": "did:web:customer.vasp",
        "for": "did:web:customer"
      },
      {
        "@id": "did:web:merchant.vasp",
        "for": "did:web:merchant.vasp"
      }
    ]
  }
}
```

#### 3. Merchant's Authorization
```json
{
  "id": "auth-123",
  "type": "https://tap.rsvp/schema/1.0#Authorize",
  "from": "did:web:merchant.vasp",
  "to": ["did:web:customer.vasp"],
  "thid": "payment-123",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Authorize",
    "transfer": {
      "@id": "transfer-123"
    }
  }
}
```

#### 4. Customer's Settlement Confirmation
```json
{
  "id": "settle-123",
  "type": "https://tap.rsvp/schema/1.0#Settle",
  "from": "did:web:customer.vasp",
  "to": ["did:web:merchant.vasp"],
  "thid": "payment-123",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Settle",
    "transfer": {
      "@id": "transfer-123"
    },
    "settlementId": "eip155:1:tx/0x3edb98c24d46d148eb926c714f4fbaa117c47b0c0821f38bfce9763604457c33"
  }
}
```

[TAIP-2]: ./TAIPs/taip-2
[TAIP-3]: ./TAIPs/taip-3
[TAIP-4]: ./TAIPs/taip-4
[TAIP-5]: ./TAIPs/taip-5
[TAIP-6]: ./TAIPs/taip-6
[TAIP-7]: ./TAIPs/taip-7
[TAIP-8]: ./TAIPs/taip-8
[TAIP-9]: ./TAIPs/taip-9
[TAIP-10]: ./TAIPs/taip-10
[TAIP-11]: ./TAIPs/taip-11
[TAIP-12]: ./TAIPs/taip-12
[TAIP-14]: ./TAIPs/taip-14
