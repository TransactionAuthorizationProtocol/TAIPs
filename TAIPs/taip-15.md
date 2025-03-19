---
taip: 15
title: Agent Connection Protocol
status: Draft
type: Standard
author: Pelle Braendgaard <pelle@notabene.id>
created: 2024-03-21
updated: 2024-03-21
requires: [2, 4, 6, 9, 13]
---

## Simple Summary

A standard protocol for establishing secure, authorized connections between agents in the Transaction Authorization Protocol ecosystem, with support for OAuth-style authorization flows and transaction constraints.

## Abstract

This TAIP defines a protocol for agents to establish secure, authorized connections with each other, particularly for ongoing business relationships. It builds on [TAIP-2] messaging, [TAIP-9] relationship proofs, and [TAIP-13] purpose codes to provide a standardized way for agents to request and authorize connections with transaction constraints. The protocol includes OAuth-style authorization flows, allowing interactive user consent when needed, and supports defining transaction limits and allowed purposes upfront.

## Motivation

The Transaction Authorization Protocol enables secure communication between different agents (VASPs, wallets, custodians, etc.). However, for ongoing business relationships, agents need a way to establish persistent, authorized connections with predefined constraints. Current implementations often rely on ad-hoc methods or require repeated authorizations. This TAIP addresses several key needs:

1. **Business Integration:** B2B services need to connect securely with their customers' accounts at VASPs or custodians.
2. **User Authorization:** Account holders must explicitly authorize agent connections through familiar OAuth-style flows.
3. **Transaction Constraints:** Connections should specify upfront what types of transactions are allowed (purposes, limits).
4. **Relationship Verification:** Agents must prove their relationship to the parties they represent.
5. **Risk Management:** Receiving agents need to maintain state and manage risk in real-time.

By standardizing these connection aspects, we enable secure B2B integrations while maintaining user control and risk management.

## Specification

### Connect Message

A message sent by an agent requesting connection to another agent:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "type": "https://tap.rsvp/schema/1.0#Connect",
  "from": "did:example:b2b-service",
  "to": ["did:example:vasp"],
  "created_time": 1516269022,
  "expires_time": 1516385931,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Connect",
    "agent": {
      "@id": "did:example:b2b-service",
      "name": "B2B Payment Service",
      "type": "ServiceAgent",
      "endpoints": {
        "messaging": "https://api.b2bservice.com/agent"
      }
    },
    "for": "did:example:business-customer",
    "constraints": {
      "purposes": ["BEXP", "SUPP"],
      "categoryPurposes": ["CASH", "CCRD"],
      "limits": {
        "per_transaction": "10000.00",
        "daily": "50000.00",
        "currency": "USD"
      }
    }
  }
}
```

### Response Messages

The receiving agent (VASP) can handle authorization in two ways:

1. Out-of-band through their existing authentication system (email, app notification, etc.)
2. Through an authorization URL that can be displayed to the customer

#### Authorization URL Response

If the VASP chooses to use an authorization URL:

```json
{
  "id": "98765432-e89b-12d3-a456-426614174000",
  "type": "https://tap.rsvp/schema/1.0#AuthorizationRequired",
  "from": "did:example:vasp",
  "to": ["did:example:b2b-service"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "created_time": 1516269023,
  "expires_time": 1516385931,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#AuthorizationRequired",
    "authorization_url": "https://vasp.com/authorize?request=abc123",
    "expires": "2024-03-22T15:00:00Z"
  }
}
```

The authorization URL should display a secure page where the customer can:
- Authenticate with the VASP
- Review the connection request details
- Approve or deny the request

#### Final Response Messages

After authorization (either out-of-band or via URL), the VASP responds using [TAIP-4] messages:

- **Authorize:** Connection is approved
```json
{
  "id": "abcdef12-e89b-12d3-a456-426614174000",
  "type": "https://tap.rsvp/schema/1.0#Authorize",
  "from": "did:example:vasp",
  "to": ["did:example:b2b-service"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "created_time": 1516269024,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Authorize",
    "connection": {
      "id": "conn-abc123"
    }
  }
}
```

- **Reject:** Connection is denied
```json
{
  "id": "76543210-e89b-12d3-a456-426614174000",
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

- **Cancel:** Either party can terminate the connection
```json
{
  "id": "fedcba98-e89b-12d3-a456-426614174000",
  "type": "https://tap.rsvp/schema/1.0#Cancel",
  "from": "did:example:vasp",
  "to": ["did:example:b2b-service"],
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "created_time": 1516269025,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Cancel",
    "connection_id": "conn-abc123",
    "reason": "user_requested"
  }
}
```

### Connection Flow

1. Agent A sends Connect message to Agent B with:
   - Their identity and endpoints
   - The party they represent
   - Desired transaction constraints
   
2. Agent B chooses an authorization method:
   - Option 1: Out-of-band Authorization
     - Notifies customer through existing channels
     - Customer logs into VASP's service to review
   - Option 2: Authorization URL
     - Returns AuthorizationRequired with URL
     - Customer opens URL to review and authenticate

3. Customer reviews and decides:
   - Views connection details and constraints
   - Approves or denies through chosen interface

4. Agent B sends final response:
   - Authorize message if approved
   - Reject message if denied

5. Once authorized:
   - Connection is established with a unique identifier
   - Future transactions must respect the agreed constraints
   - Either party can Cancel the connection

### Connection Security

- All messages MUST be encrypted using [TAIP-2] message encryption
- Agents MUST verify DIDs and signatures before accepting connections
- Authorization MUST be performed through secure, authenticated channels
- Authorization URLs MUST use HTTPS and include CSRF protection
- Connection identifiers should be unique and unpredictable

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

## References

* [TAIP-2] TAP Messaging
* [TAIP-4] Transaction Authorization Protocol
* [TAIP-6] Transaction Parties
* [TAIP-9] Proof of Relationship
* [TAIP-13] Purpose Codes

[TAIP-2]: ./taip-2 "TAP Messaging"
[TAIP-4]: ./taip-4 "Transaction Authorization Protocol"
[TAIP-6]: ./taip-6 "Transaction Parties"
[TAIP-9]: ./taip-9 "Proof of Relationship"
[TAIP-13]: ./taip-13 "Purpose Codes"

## Copyright

Copyright and related rights waived via [CC0]. 