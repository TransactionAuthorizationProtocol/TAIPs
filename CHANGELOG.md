---
layout: default
title: Changelog
permalink: /changelog/
---

# Changelog

All notable structural changes to the Transaction Authorization Protocol (TAP) are documented in this file.

This changelog focuses on:
- New TAIPs and their acceptance status
- Message format changes
- Protocol structural changes
- Breaking changes

## [2025-06-24]

### Added
- JSON Schema definitions for all TAP message types in `/schemas/` directory
- Developer resources page with implementation guides
- TypeScript fixes: Added `by` field to Cancel interface

### Removed
- Complete message type (replaced by extended Authorize message)
- Test vectors for removed Complete message

## [2025-06-23]

### Changed
- **BREAKING**: Replaced `Complete` message with enhanced `Authorize` message to simplify flow
- Made `originator` field optional in Transfer messages to support unknown originators
- Made `role` field optional in Agent structures
- Added `principal` as primary party in Connection messages

## [2025-04-22]

### Added
- TAIP-16: Invoices - Structured invoice format for payment requests
- MCC (Merchant Category Code) field to Party structure for merchant identification

## [2025-03-31]

### Added
- `expiry` fields to Transfer, Authorize, and Connect messages for business intent expiration
- Complete message for payment completion flows
- `amount` field to Settle message for partial settlement support

### Changed
- Distinguished between message expiration (`expires_time`) and business expiration (`expiry`)

## [2025-03-30]

### Changed
- **BREAKING**: Renamed `PaymentRequest` to `Payment` throughout codebase
- Updated all references and test vectors

## [2025-03-26]

### Added
- TAIP-15: Agent Connection Protocol - OAuth-style authorization flows for B2B integrations
- Connect message for establishing agent connections
- AuthorizationRequired message for connection approval flows

## [2025-03-11]

### Added
- TAIP-13: Transaction Purpose Codes - ISO 20022 purpose code integration
- Purpose and categoryPurpose fields to Transfer messages
- PaymentRequest message (later renamed to Payment)

## [2025-03-10]

### Added
- TAIP-14: Payment Requests - Merchant-initiated payment flows

## [2025-03-07]

### Added
- Cancel message for transaction termination
- Revert message for transaction reversal requests

## [2025-03-05]

### Added
- TAIP-11: Legal Entity Identifier (LEI) - Institutional participant identification
- TAIP-12: Hashed Participant Name Sharing - Privacy-preserving name matching
- `lei` field to Party structure
- `nameHash` field to Party structure

## [2025-03-02]

### Added
- TAIP-10: IVMS101 for Travel Rule - Regulatory compliance integration
- `ivms101` field to Party structure for Travel Rule data

## [2024-01-26]

### Added
- TAIP-9: Proof of Relationship - Agent-party relationship verification
- ConfirmRelationship message
- CACAO attachment support for DID proofs

## [2024-01-25]

### Added
- TAIP-8: Selective Disclosure - Privacy-preserving credential sharing
- RequirePresentation policy type
- Presentation Exchange integration

## [2024-01-24]

### Added
- TAIP-7: Agent Policies - Requirement enforcement framework
- Policy structures: RequireAuthorization, RequirePresentation, RequirePurpose
- UpdatePolicies message

## [2024-01-23]

### Added
- TAIP-6: Transaction Parties - Party identification and representation
- Party data structure with name, LEI, and verification methods

## [2024-01-09]

### Added
- TAIP-3: Virtual Asset Transfer - Core transfer functionality
- TAIP-4: Transaction Authorization Protocol - Core authorization flow
- TAIP-5: Transaction Agents - Software agent framework
- Transfer message for asset transfers
- Authorization flow messages: Authorize, Settle, Reject
- Agent management messages: UpdateAgent, AddAgents, ReplaceAgent, RemoveAgent
- Agent data structure with roles and policies

## [2023-12-19]

### Added
- TAIP-1: Transaction Authorization Improvement Proposals - Framework document

## [2023-12-14]

### Added
- TAIP-2: Messaging - DIDComm v2 message format
- Base message structure and threading model
- JSON-LD context definitions
- Initial repository structure

## Message Type Summary

### Current TAP Messages (16 total)
1. **Transfer** - Virtual asset transfer initiation
2. **Payment** - Payment request with invoice support
3. **Authorize** - Transaction authorization (enhanced to replace Complete)
4. **Settle** - On-chain settlement confirmation
5. **Reject** - Transaction rejection
6. **Cancel** - Transaction cancellation
7. **Revert** - Transaction reversal request
8. **UpdateAgent** - Agent information update
9. **UpdateParty** - Party information update
10. **AddAgents** - Add agents to transaction
11. **ReplaceAgent** - Replace existing agent
12. **RemoveAgent** - Remove agent from transaction
13. **ConfirmRelationship** - Confirm party-agent relationship
14. **UpdatePolicies** - Update agent policies
15. **Connect** - Establish agent connection
16. **AuthorizationRequired** - Request connection authorization

### Removed Messages
- **Complete** (2024-06-12) - Functionality merged into Authorize message

## Breaking Changes Summary

### 2024-06-12
- Complete message removed - migrate to Authorize with settlement details
- Cancel message now requires `by` field

### 2024-03-15
- PaymentRequest renamed to Payment - update all message type references

### 2024-02-10
- Transfer message supports optional originator - handle missing originator cases

---

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) for protocol versions.
