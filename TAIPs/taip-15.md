---
taip: 15
title: Agent Connection Protocol
status: Draft
type: Standard
author: Pelle Braendgaard <pelle@notabene.id>
created: 2024-03-21
updated: 2024-03-21
requires: [2, 6]
---

## Simple Summary

A standard protocol for establishing and managing secure connections between agents in the Transaction Authorization Protocol ecosystem, enabling reliable and authenticated communication channels for subsequent message exchange.

## Abstract

This TAIP defines a protocol for agents to establish secure, authenticated connections with each other. It builds on [TAIP-2] messaging and [TAIP-6] agent roles to provide a standardized way for agents to discover, authenticate, and maintain connections. The protocol includes connection establishment, capability negotiation, and connection state management, ensuring that agents can reliably communicate while maintaining security and privacy.

## Motivation

The Transaction Authorization Protocol relies heavily on secure communication between different agents (VASPs, wallets, custodians, etc.). However, before agents can exchange messages about transactions, they need a way to establish secure connections with each other. Current implementations often rely on ad-hoc connection methods or assume pre-existing relationships. This TAIP addresses several key needs:

1. **Standardized Discovery:** Agents need a consistent way to find and connect to other agents in the ecosystem.
2. **Authentication:** Connections must be authenticated to prevent impersonation and ensure messages are exchanged with legitimate parties.
3. **Capability Exchange:** Agents should be able to negotiate which protocol features they support during connection.
4. **Connection Management:** Clear states and lifecycle for connections, including establishment, maintenance, and graceful termination.
5. **Reconnection Handling:** Reliable ways to handle network issues and reconnect without losing context.

By standardizing these connection aspects, we enable more reliable and secure agent interactions across the ecosystem.

## Specification

### Connection Messages

#### ConnectionRequest

A message sent by an agent initiating a connection:

```json
{
  "@type": "ConnectionRequest",
  "@id": "123e4567-e89b-12d3-a456-426614174000",
  "from": {
    "@id": "did:example:alice",
    "name": "Alice's Wallet",
    "type": "WalletAgent",
    "endpoints": {
      "messaging": "https://wallet.example.com/agent"
    }
  },
  "supported_protocols": ["TAIP-2", "TAIP-3", "TAIP-4"],
  "supported_features": {
    "TAIP-4": ["Authorize", "Reject", "Cancel"]
  },
  "connection_timing": {
    "expires": "2024-03-22T15:00:00Z",
    "timeout": 300
  }
}
```

#### ConnectionResponse

A message sent in response to a ConnectionRequest:

```json
{
  "@type": "ConnectionResponse",
  "@id": "98765432-e89b-12d3-a456-426614174000",
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "from": {
    "@id": "did:example:bob",
    "name": "Bob's VASP",
    "type": "VASPAgent",
    "endpoints": {
      "messaging": "https://vasp.example.com/agent"
    }
  },
  "supported_protocols": ["TAIP-2", "TAIP-3", "TAIP-4"],
  "supported_features": {
    "TAIP-4": ["Authorize", "Reject", "Cancel", "Revert"]
  },
  "status": "accepted",
  "connection_id": "conn-abc123"
}
```

#### ConnectionUpdate

A message to update connection state or renegotiate capabilities:

```json
{
  "@type": "ConnectionUpdate",
  "@id": "abcdef12-e89b-12d3-a456-426614174000",
  "connection_id": "conn-abc123",
  "status": "active",
  "updated_features": {
    "TAIP-4": ["Authorize", "Reject", "Cancel", "Revert", "Settle"]
  }
}
```

#### ConnectionClose

A message to gracefully terminate a connection:

```json
{
  "@type": "ConnectionClose",
  "@id": "76543210-e89b-12d3-a456-426614174000",
  "connection_id": "conn-abc123",
  "reason": "shutdown",
  "reconnect_after": "2024-03-21T16:00:00Z"
}
```

### Connection States

Connections can be in the following states:

1. **requested** - Initial state when ConnectionRequest is sent
2. **negotiating** - During capability negotiation
3. **active** - Connection established and ready for message exchange
4. **inactive** - Temporary suspension (e.g. rate limiting)
5. **closed** - Connection terminated

### Connection Flow

1. Agent A discovers Agent B (through DID resolution or other means)
2. Agent A sends ConnectionRequest
3. Agent B validates request and responds with ConnectionResponse
4. If accepted, connection moves to active state
5. Agents exchange messages using established connection
6. Either agent can send ConnectionUpdate to modify state
7. Either agent can send ConnectionClose to terminate

### Connection Security

- All messages MUST be encrypted using [TAIP-2] message encryption
- Agents MUST verify DIDs and signatures before accepting connections
- Connection IDs should be unique and unpredictable
- Endpoints MUST use HTTPS for transport security

## Rationale

The design choices in this specification aim to balance security, flexibility, and ease of implementation:

- **Message Structure:** Following [TAIP-2] patterns for consistency
- **State Machine:** Clear states enable reliable implementation
- **Capability Negotiation:** Allows gradual protocol adoption
- **Connection IDs:** Separate from message IDs for connection tracking
- **Timeouts:** Prevent hanging connections and resource exhaustion

## Security Considerations

- **DID Authentication:** Agents must verify DIDs and signatures
- **Message Replay:** Use nonces or timestamps to prevent replay attacks
- **Connection Limits:** Implement rate limiting and connection quotas
- **Endpoint Validation:** Verify HTTPS certificates and domain names
- **Resource Protection:** Monitor connection states to prevent DoS

## Privacy Considerations

- **Minimal Disclosure:** Only exchange necessary capabilities
- **Connection Isolation:** Use unique IDs per connection
- **Endpoint Privacy:** Consider proxy endpoints for sensitive agents
- **Data Retention:** Clear connection data after termination
- **Audit Logs:** Balance logging needs with privacy

## References

* [TAIP-2] TAP Messaging
* [TAIP-6] Transaction Parties

[TAIP-2]: ./taip-2 "TAP Messaging"
[TAIP-6]: ./taip-6 "Transaction Parties"

## Copyright

Copyright and related rights waived via [CC0]. 