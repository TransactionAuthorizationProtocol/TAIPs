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
  "@type": "Connect",
  "@id": "123e4567-e89b-12d3-a456-426614174000",
  "from": {
    "@id": "did:example:b2b-service",
    "name": "B2B Payment Service",
    "type": "ServiceAgent",
    "endpoints": {
      "messaging": "https://api.b2bservice.com/agent",
      "callback": "https://api.b2bservice.com/oauth/callback"
    }
  },
  "to": ["did:example:vasp"],
  "for": "did:example:business-customer",
  "constraints": {
    "purposes": ["BEXP", "SUPP"],
    "categoryPurposes": ["CASH", "CCRD"],
    "limits": {
      "per_transaction": "10000.00",
      "daily": "50000.00",
      "currency": "USD"
    }
  },
  "proof": {
    "@type": "ConfirmRelationship",
    "@id": "did:example:b2b-service",
    "for": "did:example:business-customer",
    "signature": "..."
  }
}
```

### Authorization Response

If user authorization is required, the receiving agent responds with an authorization URL:

```json
{
  "@type": "AuthorizationRequired",
  "@id": "98765432-e89b-12d3-a456-426614174000",
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "authorization_url": "https://vasp.com/authorize?request=abc123",
  "expires": "2024-03-22T15:00:00Z"
}
```

The authorization URL can be opened in a browser or embedded view, where the user can review and approve the connection request, including:
- The requesting agent's identity
- Requested transaction purposes and limits
- Any relationship proofs provided

### Response Messages

After authorization (or immediately if not required), the receiving agent responds using [TAIP-4] messages:

- **Authorize:** Connection is approved with a bearer token
```json
{
  "@type": "Authorize",
  "@id": "abcdef12-e89b-12d3-a456-426614174000",
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "connection": {
    "id": "conn-abc123",
    "bearer_token": "eyJhbGci...",
    "expires": "2025-03-21T00:00:00Z"
  }
}
```

- **Reject:** Connection is denied
```json
{
  "@type": "Reject",
  "@id": "76543210-e89b-12d3-a456-426614174000",
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "reason": "unauthorized"
}
```

- **Cancel:** Either party can terminate the connection
```json
{
  "@type": "Cancel",
  "@id": "fedcba98-e89b-12d3-a456-426614174000",
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "connection_id": "conn-abc123",
  "reason": "user_requested"
}
```

### Connection Flow

1. Agent A sends Connect message to Agent B with:
   - Their identity and endpoints
   - The party they represent (with proof)
   - Desired transaction constraints
   
2. Agent B either:
   - Returns AuthorizationRequired with a URL for user consent
   - Directly responds with Authorize/Reject based on policy

3. If authorization URL provided:
   - User reviews and approves/denies the connection
   - Agent B sends Authorize/Reject accordingly

4. If authorized:
   - Connection is established with bearer token
   - Future transactions must respect constraints
   - Either party can Cancel the connection

### Connection Security

- All messages MUST be encrypted using [TAIP-2] message encryption
- Agents MUST verify DIDs and signatures before accepting connections
- Bearer tokens should be secure and rotated periodically
- Relationship proofs must follow [TAIP-9] specifications
- Authorization URLs must use HTTPS and include CSRF protection

## Rationale

The design choices in this specification aim to balance security, usability, and flexibility:

- **Single Connect Message:** Simplified from previous multi-message flow for clarity
- **OAuth-style Flow:** Familiar pattern for user authorization
- **Purpose Codes:** Leveraging [TAIP-13] for standardized transaction types
- **Transaction Limits:** Clear constraints for risk management
- **Relationship Proofs:** Using [TAIP-9] for verified connections
- **Bearer Tokens:** Simple but secure ongoing authentication
- **State Management:** Receiving agents track connection status

## Security Considerations

- **Authorization Flow:** Must prevent CSRF and phishing attacks
- **Bearer Tokens:** Should be secure, short-lived, and rotatable
- **Relationship Proofs:** Must be cryptographically verified
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