# Transaction Authorization Protocol (TAP) Message Types and Data Structures

## Table of Contents

- [Common DIDComm Message Structure](#common-didcomm-message-structure)
- [Core Data Structures](#core-data-structures)
  - [Party Object](#party-object)
  - [Agent Object](#agent-object)
  - [Policy Objects](#policy-objects)
    - [RequirePresentation](#requirepresentation)
    - [RequirePurpose](#requirepurpose)
- [Message Types](#message-types)
  - [Authorization Flow Messages](#authorization-flow-messages)
    - [Transfer Message](#transfer-message)
    - [Authorize Message](#authorize-message)
    - [Reject Message](#reject-message)
    - [Cancel Message](#cancel-message)
    - [Revert Message](#revert-message)
    - [Settle Message](#settle-message)
  - [Participant Management Messages](#participant-management-messages)
    - [UpdateAgent Message](#updateagent-message)
    - [UpdateParty Message](#updateparty-message)
    - [AddAgents Message](#addagents-message)
    - [ReplaceAgent Message](#replaceagent-message)
    - [RemoveAgent Message](#removeagent-message)
  - [Relationship proofs](#relationship-proofs)
    - [ConfirmRelationship Message](#confirmrelationship-message)
  - [Policy Messages](#policy-messages)
    - [UpdatePolicies Message](#updatepolicies-message)
- [Message Flow Examples](#message-flow-examples)
  - [Basic Transfer Flow](#basic-transfer-flow)
  - [Transfer with LEI and Purpose Code](#transfer-with-lei-and-purpose-code)

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

# Transaction Message

### Transfer Message ([TAIP-3] - Review)
Initiates a virtual asset transfer between parties.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-3]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-3]) | JSON-LD type "https://tap.rsvp/schema/1.0#Transfer" |
| asset | string | Yes | Review ([TAIP-3]) | CAIP-19 identifier of the asset |
| amount | string | Yes | Review ([TAIP-3]) | Decimal amount of the asset |
| originator | object | Yes | Review ([TAIP-3]) | Party object for the sender |
| beneficiary | object | No | Review ([TAIP-3]) | Party object for the recipient |
| agents | array | Yes | Review ([TAIP-3]) | Array of Agent objects |
| settlementId | string | No | Review ([TAIP-3]) | CAIP-220 identifier of settlement transaction |
| memo | string | No | Review ([TAIP-3]) | Human readable message about the transfer |

#### Examples

```json
// Simple first-party transfer
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

// Third-party transfer with LEI
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

## Authorization Flow Messages

### Authorize Message ([TAIP-4] - Review)
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

### Reject Message ([TAIP-4] - Review)
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

### Cancel Message ([TAIP-4] - Review)
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

### Revert Message ([TAIP-4] - Review)
Requests a reversal of the transaction.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-4]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-4]) | JSON-LD type "https://tap.rsvp/schema/1.0#Revert" |
| transfer | object | Yes | Review ([TAIP-4]) | Reference to the Transfer message being reverted |
| reason | string | No | Review ([TAIP-4]) | Optional reason for requesting the revert |

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
    "reason": "Wrong beneficiary account"
  }
}
```

### Settle Message ([TAIP-4] - Review)
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

## Participant Management Messages

### UpdateAgent Message ([TAIP-5] - Review)

Updates information about an agent.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-5]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-5]) | JSON-LD type "https://tap.rsvp/schema/1.0#UpdateAgent" |
| agent | object | Yes | Review ([TAIP-5]) | Updated Agent object |

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

### UpdateParty Message ([TAIP-6] - Review)

Updates information about a party.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-6]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-6]) | JSON-LD type "https://tap.rsvp/schema/1.0#UpdateParty" |
| party | object | Yes | Review ([TAIP-6]) | Updated Party object |

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

### AddAgents Message ([TAIP-5] - Review)
Adds one or more additional agents to the transaction.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-5]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-5]) | JSON-LD type "https://tap.rsvp/schema/1.0#AddAgents" |
| agents | array | Yes | Review ([TAIP-5]) | Array of Agent objects to add to the transaction |

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

### ReplaceAgent Message ([TAIP-5] - Review)
Replaces an agent with another agent in the transaction.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-5]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-5]) | JSON-LD type "https://tap.rsvp/schema/1.0#ReplaceAgent" |
| original | string | Yes | Review ([TAIP-5]) | DID of the Agent to be replaced |
| replacement | object | Yes | Review ([TAIP-5]) | Agent object to replace the original agent |

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

### RemoveAgent Message ([TAIP-5] - Review)
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

### ConfirmRelationship Message ([TAIP-9] - Draft)
Confirms a relationship between an agent and the entity it acts on behalf of. Can include cryptographic proof via CACAO signatures for self-hosted wallets.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Draft ([TAIP-9]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Draft ([TAIP-9]) | JSON-LD type "https://tap.rsvp/schema/1.0#ConfirmRelationship" |
| body | object | Yes | Draft ([TAIP-9]) | Agent object containing the relationship details |
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

### UpdatePolicies Message ([TAIP-7] - Review)
Updates policies for a transaction.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @context | string | Yes | Review ([TAIP-7]) | JSON-LD context "https://tap.rsvp/schema/1.0" |
| @type | string | Yes | Review ([TAIP-7]) | JSON-LD type "https://tap.rsvp/schema/1.0#UpdatePolicies" |
| policies | array | Yes | Review ([TAIP-7]) | Array of policy objects |

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

### Party Object ([TAIP-6] - Review)
Represents a participant in a transaction (originator or beneficiary).

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @id | string | Yes | Review ([TAIP-6]) | DID or IRI of the party |
| lei:leiCode | string | No | Draft ([TAIP-11]) | LEI code for legal entities |
| name | string | No | Review ([TAIP-6]) | Human-readable name |

### Agent Object ([TAIP-5] - Review)
Represents a service involved in executing transactions.

| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @id | string | Yes | Review ([TAIP-5]) | DID of the agent |
| role | string | No | Review ([TAIP-5]) | Role of the agent (e.g., "SettlementAddress", "SourceAddress") |
| for | string | No | Review ([TAIP-5]) | Reference to the Party this agent represents |

### Policy Objects ([TAIP-7] - Review)

#### RequirePresentation Policy
| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @type | string | Yes | Review ([TAIP-7]) | "RequirePresentation" |
| @context | array | Yes | Review ([TAIP-7]) | Array of context URIs |
| fromAgent | string | Yes | Review ([TAIP-7]) | Agent to present the information |
| aboutParty | string | No | Review ([TAIP-7]) | Party the presentation is about |
| aboutAgent | string | No | Review ([TAIP-7]) | Agent the presentation is about |
| presentationDefinition | string | Yes | Review ([TAIP-7]) | URL to presentation definition |

#### RequirePurpose Policy
| Attribute | Type | Required | Status | Description |
|-----------|------|----------|---------|-------------|
| @type | string | Yes | Review ([TAIP-7]) | "RequirePurpose" |
| purpose | string | Yes | Review ([TAIP-7]) | ISO 20022 purpose code |
| categoryPurpose | string | No | Review ([TAIP-7]) | ISO 20022 category purpose code |

## Message Flow Examples

### Basic Transfer Flow
```json
// 1. Transfer Message
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

// 2. UpdatePolicies Message
{
  "id": "policies-123",
  "type": "https://tap.rsvp/schema/1.0#UpdatePolicies",
  "from": "did:web:beneficiary.vasp",
  "to": ["did:web:originator.vasp"],
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

// 3. Authorize Message
{
  "id": "auth-123",
  "type": "https://tap.rsvp/schema/1.0#Authorize",
  "from": "did:web:beneficiary.vasp",
  "to": ["did:web:originator.vasp"],
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Authorize",
    "transfer": {
      "@id": "transfer-123"
    }
  }
}

// 4. Settle Message
{
  "id": "settle-123",
  "type": "https://tap.rsvp/schema/1.0#Settle",
  "from": "did:web:originator.vasp",
  "to": ["did:web:beneficiary.vasp"],
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

[TAIP-2]: ./TAIPs/taip-2
[TAIP-3]: ./TAIPs/taip-3
[TAIP-4]: ./TAIPs/taip-4
[TAIP-5]: ./TAIPs/taip-5
[TAIP-6]: ./TAIPs/taip-6
[TAIP-7]: ./TAIPs/taip-7
[TAIP-11]: ./TAIPs/taip-11 