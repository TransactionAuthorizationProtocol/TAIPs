---
taip: 20
title: Connections
status: Draft
type: Standard
author: Pelle Braendgaard <pelle@notabene.id>, Martin de Jonge <martindejonge1981-collab>
created: 2026-01-26
requires: 2, 4, 5
---

## Simple Summary
A standardized way for Entities to establish trusted connections, exchange DDQ documents, and signal mutual trust relationships. This TAIP introduces one new `Connect` message and reuses three existing TAIP-4 messages (`Authorize` for approval, `Reject` for decline, `Cancel` for termination).

## Abstract
This TAIP extends the existing TAP protocol with a `Connect` message type for establishing trusted connections between VASPs, and leverages the existing `Authorize`, `Reject`, `Cancel` messages from TAIP-4 to manage DDQ access, mutual trust relationships, and whitelisting capabilities. This approach minimizes new message types and builds on established TAP patterns.
Within the connections the protocol establishes different connection types, which differ in trust level:
**ddq-access**: View DDQ documents
**mutual-trust**: Established trust relationship, but transactions still reviewed individually
**whitelist**: Pre-approved automatic transaction processing (typically requires mutual-trust first)
Typical progression: **ddq-access → mutual-trust → whitelist**

## Motivation

This adds to TAP a standardized way for establishing pre-approved trusted connections.  This TAIP:
- Introduces one new message type (`Connect`) for relationship establishment
- Reuses existing message types from TAIP-4 for all approval/denial flows
- Extends the semantic meaning of `Authorize`, `Reject`, `Cancel` to cover non-payment authorization scenarios
- Provides a foundation for DDQ exchange, mutual trust, and whitelisting

## Specification

### New Message Type: Connect

#### Connect Message Body

The `Connect` message body contains:

- `@context` - REQUIRED the JSON-LD context `https://tap.rsvp/schema/1.0`
- `@type` - REQUIRED the JSON-LD type `https://tap.rsvp/schema/1.0#Connect`
- `action` - REQUIRED string indicating the connection action: `establish` or `update` (use Cancel from TAIP-4 to terminate connections)
- `connectionTypes` - REQUIRED (for establish/update) array of strings specifying requested connection types: `ddq-access`, `mutual-trust`, `whitelist`
- `purpose` - OPTIONAL string providing human-readable reason for connection
- `expiry` - OPTIONAL ISO 8601 timestamp when connection should automatically terminate (distinct from message `expires_time`)
- `metadata` - OPTIONAL object containing additional context

**Complete DIDComm message example:**

```json
{
  "id": "conn-123e4567-e89b-12d3-a456-426614174000",
  "type": "https://tap.rsvp/schema/1.0#Connect",
  "from": "did:web:vasps.id:initiator",
  "to": ["did:web:vasps.id:recipient"],
  "created_time": 1769086601,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Connect",
    "action": "establish",
    "connectionTypes": ["ddq-access", "mutual-trust"],
    "purpose": "Request DDQ access for compliance verification",
    "expiry": "2026-01-26T00:00:00Z"
  }
}
```

### Extending TAIP-4 Messages for Connections

The existing messages from TAIP-4 are reused for connection management:

#### Authorize - Connection Approval

When responding to `Connect` messages with approval, use the standard `Authorize` message from TAIP-4:

**Authorize Body Structure (from TAIP-4):**
- `@context` - REQUIRED the JSON-LD context `https://tap.rsvp/schema/1.0`
- `@type` - REQUIRED the JSON-LD type `https://tap.rsvp/schema/1.0#Authorize`
- `settlementAddress` - OPTIONAL (omitted for connection responses)
- `settlementAsset` - OPTIONAL (omitted for connection responses)
- `amount` - OPTIONAL (omitted for connection responses)
- `expiry` - OPTIONAL ISO 8601 timestamp when the connection authorization expires

**Connection-Specific Attributes (new, added to body):**
- `approvedTypes` - OPTIONAL array of approved connection types (subset of requested types)
- `ddqDocument` - OPTIONAL object containing DDQ document reference (see below)
- `trustLevel` - OPTIONAL string: `whitelisted`, `trusted`, `standard`, `reviewing`, or `suspended`

**DDQ Document Object Structure:**
- `documentId` - REQUIRED string unique identifier for the document
- `version` - OPTIONAL string document version
- `accessUrl` - OPTIONAL string HTTPS URL for document retrieval
- `checksum` - OPTIONAL string SHA-256 hash for integrity verification
- `expiresAt` - OPTIONAL ISO 8601 timestamp when document access expires

**Complete approval example:**

```json
{
  "id": "auth-456",
  "type": "https://tap.rsvp/schema/1.0#Authorize",
  "from": "did:web:vasps.id:recipient",
  "to": ["did:web:vasps.id:initiator"],
  "thid": "conn-123e4567-e89b-12d3-a456-426614174000",
  "created_time": 1769087421,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Authorize",
    "approvedTypes": ["ddq-access", "mutual-trust"],
    "expiry": "2026-01-26T00:00:00Z",
    "ddqDocument": {
      "documentId": "ddq-uuid-789",
      "version": "2024-Q4",
      "accessUrl": "https://vasps.id/api/ddq/ddq-uuid-789",
      "checksum": "sha256:abc123...",
      "expiresAt": "2026-12-31T23:59:59Z"
    },
    "trustLevel": "trusted"
  }
}
```

#### Reject - Connection Declined

When declining a `Connect` request, use the standard `Reject` message from TAIP-4:

**Reject Body Structure (from TAIP-4):**
- `@context` - REQUIRED the JSON-LD context `https://tap.rsvp/schema/1.0`
- `@type` - REQUIRED the JSON-LD type `https://tap.rsvp/schema/1.0#Reject`
- `reason` - OPTIONAL string explaining the rejection

**Complete rejection example:**

```json
{
  "id": "reject-789",
  "type": "https://tap.rsvp/schema/1.0#Reject",
  "from": "did:web:vasps.id:recipient",
  "to": ["did:web:vasps.id:initiator"],
  "thid": "conn-123e4567-e89b-12d3-a456-426614174000",
  "created_time": 1769087421,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Reject",
    "reason": "Insufficient compliance documentation"
  }
}
```

#### Cancel - Connection Termination

To terminate an existing connection, use the standard `Cancel` message from TAIP-4:

**Cancel Body Structure (from TAIP-4):**
- `@context` - REQUIRED the JSON-LD context `https://tap.rsvp/schema/1.0`
- `@type` - REQUIRED the JSON-LD type `https://tap.rsvp/schema/1.0#Cancel`
- `by` - REQUIRED in TAIP-4 for transactions to specify which party (e.g., "originator" or "beneficiary") is canceling. For connections, this can be set to the sender's DID or a simple identifier like "initiator" or "recipient" since the `from` field already identifies the canceling party.
- `reason` - OPTIONAL string explaining the cancellation

**Complete cancellation example:**

```json
{
  "id": "cancel-101",
  "type": "https://tap.rsvp/schema/1.0#Cancel",
  "from": "did:web:vasps.id:initiator",
  "to": ["did:web:vasps.id:recipient"],
  "thid": "conn-123e4567-e89b-12d3-a456-426614174000",
  "created_time": 1769087900,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Cancel",
    "by": "did:web:vasps.id:initiator",
    "reason": "Business relationship ended"
  }
}
```

**Note on `by` field for connections:** While TAIP-4 requires the `by` field to specify which party is canceling a transaction (e.g., "originator" or "beneficiary"), connections don't have these predefined roles. For connection cancellations, implementations MAY set `by` to the sender's DID (matching the `from` field) or use simple identifiers like "initiator" or "recipient". The `from` field in the message envelope is sufficient to identify who is terminating the connection.

### Connection Types

The protocol defines three primary connection types:

1. **`ddq-access`**: Grants access to view DDQ documents
   - Allows one party to retrieve the other's Due Diligence Questionnaire
   - Can be one-way (requester views owner's DDQ) or mutual
   - Example: "We can see each other's compliance documentation"

2. **`mutual-trust`**: Establishes bilateral trust relationship for compliance purposes
   - Both parties acknowledge each other as verified entities
   - Reduces verification requirements but transactions still reviewed
   - Enables information sharing beyond DDQ
   - Example: "We've completed due diligence on each other"

3. **`whitelist`**: Enables pre-approved, straight-through transaction processing
   - Transactions from whitelisted parties proceed with minimal friction
   - Automatic approval for transactions (within agreed parameters)
   - Typically requires `mutual-trust` to be established first
   - Example: "Transactions from this counterparty are auto-approved"

**Typical progression:** `ddq-access` → `mutual-trust` → `whitelist`

## Workflows

### Establishing DDQ Access Connection

```
Requester                           Owner
    |                                 |
    |--Connect------------------------->|
    |  (action: establish,             |
    |   connectionTypes: [ddq-access]) |
    |                                 |
    |<--Authorize----------------------|
    |  (approvedTypes: [ddq-access],   |
    |   ddqDocument: {...})            |
    |                                 |
```

### Declining Connection Request

```
Requester                           Owner
    |                                 |
    |--Connect------------------------->|
    |  (action: establish)             |
    |                                 |
    |<--Reject-------------------------|
    |  (reason: "...")                 |
    |                                 |
```

### Mutual Whitelisting

```
Party A                            Party B
    |                                 |
    |--Connect------------------------->|
    |  (action: establish,             |
    |   connectionTypes:               |
    |     [mutual-trust, whitelist])   |
    |                                 |
    |<--Authorize----------------------|
    |  (approvedTypes:                 |
    |     [mutual-trust, whitelist],   |
    |   trustLevel: whitelisted)       |
    |                                 |
    |<-Connect-------------------------|
    |  (action: establish,             |
    |   connectionTypes:               |
    |     [mutual-trust, whitelist])   |
    |                                 |
    |--Authorize----------------------->|
    |  (approvedTypes:                 |
    |     [mutual-trust, whitelist],   |
    |   trustLevel: whitelisted)       |
    |                                 |
```

### Updating Connection

```
Party A                            Party B
    |                                 |
    |--Connect------------------------->|
    |  (action: update,                |
    |   connectionTypes: [whitelist])  |
    |  [adding whitelist to existing   |
    |   mutual-trust connection]       |
    |                                 |
    |<--Authorize----------------------|
    |  (approvedTypes:                 |
    |     [mutual-trust, whitelist])   |
    |                                 |
```

### Terminating Connection

Either party can terminate a connection by sending `Cancel` (from TAIP-4):

```
Either Party                       Other Party
    |                                 |
    |--Cancel-------------------------->|
    |  (by: sender's DID or role,      |
    |   reason: "...")                 |
    |                                 |
```

Note: When terminating via `Cancel`, the `thid` should reference the original `Connect` message that established the connection. The `by` field can be set to the sender's DID or a simple identifier since connections don't have predefined party roles like transactions do.

### Requesting Updated DDQ Document

After a connection is established, a party can request document updates by sending a new `Connect` with `action: update`:

```
Requester                           Owner
    |                                 |
    |--Connect------------------------->|
    |  (action: update,                |
    |   connectionTypes: [ddq-access], |
    |   purpose: "request updated DDQ")|
    |                                 |
    |<--Authorize----------------------|
    |  (approvedTypes: [ddq-access],   |
    |   ddqDocument: {                 |
    |     documentId: "new-uuid",      |
    |     version: "2025-Q1"})         |
    |                                 |
```

## Impact Analysis

### TAIP-4 Changes

**✅ NO BREAKING CHANGES**

All existing TAIP-4 message structures remain valid and unchanged.

**What's Being Extended:**

1. **Semantic Extension**: `Authorize` can now respond to `Connect` messages (in addition to `Transfer`, `Payment`, etc.)
2. **Optional New Fields**: New optional fields added to `Authorize` body for connection scenarios
3. **Backward Compatible**: Existing TAIP-4 implementations ignore unknown fields

**Existing TAIP-4 Fields (All Unchanged):**
- ✅ `@context` (REQUIRED) - Still `https://tap.rsvp/schema/1.0`
- ✅ `@type` (REQUIRED) - Still `https://tap.rsvp/schema/1.0#Authorize`
- ✅ `settlementAddress` (OPTIONAL) - Unchanged, omitted for connections
- ✅ `settlementAsset` (OPTIONAL) - Unchanged, omitted for connections
- ✅ `amount` (OPTIONAL) - Unchanged, omitted for connections
- ✅ `expiry` (OPTIONAL) - Unchanged, reused for connection expiry

**New Optional Fields (Added to Authorize body):**
- ➕ `approvedTypes` (OPTIONAL) - Array of approved connection types
- ➕ `ddqDocument` (OPTIONAL) - Object with DDQ document details
- ➕ `trustLevel` (OPTIONAL) - Trust status indicator

**Note**: Removed `connectionStatus` and `reason` fields - use existing TAIP-4 message types instead:
- Use `Reject` message (not Authorize) to decline connections
- Use `Cancel` message to terminate connections

### New Additions

**New Message Type:**
- `Connect`: New top-level message type

**Connect Message Mandatory Fields:**
- ✅ `@context` (REQUIRED)
- ✅ `@type` (REQUIRED)
- ✅ `action` (REQUIRED) - Must be `establish` or `update`
- ✅ `connectionTypes` (REQUIRED - Must be `ddq-access`, `mutual-trust`, `whitelist`


## State Management

Implementations SHOULD maintain a local `trusted_connections` table:

```typescript
interface TrustedConnection {
  connectionId: string;
  counterpartyDid: string;
  connectionTypes: string[];
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'REVOKED';
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  
  // Link to most recent Connect message
  connectMessageId: string;
  
  // Link to most recent Authorize response
  authorizeMessageId?: string;
  
  // DDQ document details (if ddq-access granted)
  ddqDocumentId?: string;
  ddqAccessUrl?: string;
  ddqExpiresAt?: Date;
  
  // Trust level
  trustLevel?: string;
  
  metadata?: Record<string, any>;
}
```

### Processing Connect Messages

When receiving a `Connect` message:

1. Validate the message structure and `action` field
2. For `action: establish`:
   - Create new `trusted_connections` entry with status PENDING
   - Evaluate connection request based on internal policies
3. For `action: update`:
   - Locate existing connection
   - Evaluate requested changes
4. Respond with appropriate message:
   - **Approve**: Send `Authorize` with `approvedTypes`, optional `ddqDocument`, and `trustLevel`
   - **Decline**: Send `Reject` with optional `reason`

### Processing Authorize/Reject/Cancel Responses

When receiving a response to your `Connect`:

**For Authorize responses:**
1. Locate corresponding `trusted_connections` entry via `thid`
2. Update status to APPROVED
3. Store `approvedTypes` array
4. If `ddqDocument` present, store document access details
5. If `trustLevel` present, store trust status
6. Update `expiresAt` from `expiry` field if provided

**For Reject responses:**
1. Locate corresponding `trusted_connections` entry via `thid`
2. Update status to DECLINED
3. Store optional `reason`
4. Mark connection as not available

**For Cancel messages:**
1. Locate corresponding `trusted_connections` entry via `thid`
2. Update status to REVOKED
3. Remove access permissions
4. Archive connection record


## Test Cases

### Valid Connect - Establish

```json
{
  "id": "test-connect-001",
  "type": "https://tap.rsvp/schema/1.0#Connect",
  "from": "did:web:vasp-a.example",
  "to": ["did:web:vasp-b.example"],
  "created_time": 1769086601,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Connect",
    "action": "establish",
    "connectionTypes": ["ddq-access"]
  }
}
```

### Valid Authorize - Connection Approved

```json
{
  "id": "test-auth-001",
  "type": "https://tap.rsvp/schema/1.0#Authorize",
  "from": "did:web:vasp-b.example",
  "to": ["did:web:vasp-a.example"],
  "thid": "test-connect-001",
  "created_time": 1769087421,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Authorize",
    "approvedTypes": ["ddq-access"],
    "ddqDocument": {
      "documentId": "ddq-12345",
      "accessUrl": "https://vasp-b.example/api/ddq/ddq-12345"
    }
  }
}
```

### Valid Reject - Connection Declined

```json
{
  "id": "test-reject-001",
  "type": "https://tap.rsvp/schema/1.0#Reject",
  "from": "did:web:vasp-b.example",
  "to": ["did:web:vasp-a.example"],
  "thid": "test-connect-001",
  "created_time": 1769087421,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Reject",
    "reason": "Insufficient compliance documentation"
  }
}
```

### Valid Cancel - Connection Terminated

```json
{
  "id": "test-cancel-001",
  "type": "https://tap.rsvp/schema/1.0#Cancel",
  "from": "did:web:vasp-a.example",
  "to": ["did:web:vasp-b.example"],
  "thid": "test-connect-001",
  "created_time": 1769087900,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Cancel",
    "by": "did:web:vasp-a.example",
    "reason": "Business relationship ended"
  }
}
```

## Security Considerations

- All messages MUST be sent over DIDComm encrypted channels
- DDQ access URLs SHOULD be time-limited and authenticated
- Implementations MUST verify DID signatures on all messages
- Expiration times SHOULD be enforced automatically
- Connection termination via `Cancel` MUST be honored immediately
- DDQ document checksums SHOULD be verified before use

## Privacy Considerations

- `Connect.purpose` is optional to protect privacy
- `Authorize.reason` for declines is optional  
- `Reject.reason` is optional to protect decision-making details
- DDQ access URLs should be unique per requester when possible
- Connection status changes are bilateral (not broadcast)
- Document versions and expiry times help limit data exposure


## Backwards Compatibility

### Complete Backward Compatibility

This TAIP maintains full backward compatibility:

1. **Existing TAP Implementations:**
   - Continue working unchanged
   - May ignore `Connect` messages (unknown type)
   - May ignore new optional fields in `Authorize` messages
   - `Authorize`, `Reject` and `Cancel` work as specified in TAIP-4
   - All existing payment/transfer flows unaffected

2. **Detection of Support:**
   - Send `Connect` message
   - If receive `Authorize` or `Reject` response → counterparty supports TAIP-19
   - If no response or error → counterparty doesn't support TAIP-19
   - Fall back to manual/out-of-band connection establishment

3. **Gradual Adoption:**
   - VASPs can implement `Connect` independently
   - No coordination required for rollout
   - Coexists with existing TAP workflows

## Integration with Existing TAIPs

### TAIP-4 (Transaction Authorization Protocol)

This TAIP reuses three existing TAIP-4 messages for connection management:
- **`Authorize`**: Extended with optional fields for connection approval
- **`Reject`**: Used as-is for connection decline
- **`Cancel`**: Used as-is for connection termination

The message structures are identical; only the context (responding to `Connect` vs `Transfer`) differs.

### TAIP-7 (Agent Policies)

Connection status can be expressed as policies. Not implemented as part of this spec. For example:

```json
{
  "@type": "RequireConnection",
  "connectionTypes": ["whitelist"],
  "fromAgent": "beneficiary"
}
```

This policy would require the beneficiary to be whitelisted before sending transfers to them.

## References

- [TAIP-2] Defines the TAP Message structure
- [TAIP-4] Transaction Authorization Protocol
- [TAIP-7] Agent Policies

[TAIP-2]: ./taip-2
[TAIP-4]: ./taip-4
[TAIP-7]: ./taip-7

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
