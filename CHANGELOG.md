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

## [2025-08-18]

### Added
- **TypeScript Package v1.7.0**: Released enhanced TypeScript library with comprehensive documentation and fixes
  - Added comprehensive README.md with installation guide, quick start examples, and complete API reference
  - Enhanced examples with current type definitions (Person, Organization, Agent, Party)
  - Added nameHash examples for travel rule compliance with privacy-preserving name matching
  - Updated participant type documentation to reflect current schema.org-based interfaces
  - Added complete participant interfaces documentation (Person, Organization, Agent, Party)
  - Enhanced travel rule compliance examples with IVMS101 data structures
  - Improved developer experience with detailed usage examples and standards compliance information

### Fixed
- **Payment Message Type**: Removed erroneous `defaultAddress` field from Payment interface
  - Fixed Payment interface to comply with TAIP-14 specification
  - Settlement addresses should be provided by agents with SettlementAddress role, not as direct fields
  - Maintained `fallbackSettlementAddresses` field as specified in TAIP-14
  - Updated JSDoc examples to remove invalid `defaultAddress` references

- **TAIP-12 Name Hashing Implementation**: Added production-ready TypeScript implementation for privacy-preserving name matching
  - Added `generateNameHash()` function with SHA-256 hashing using Web Crypto API and Node.js crypto fallback
  - Added `normalizeForHashing()` function for TAIP-12 compliant name normalization (uppercase, whitespace removal)
  - Cross-platform compatibility supporting browsers and Node.js environments without additional dependencies
  - Comprehensive test suite with 19 test cases including TAIP-12 specification test vectors
  - Support for non-Western names (Arabic, Chinese, Korean, Japanese scripts)
  - Compatible with VerifyVASP and GTR networks per TAIP-12 specification
  - Added Vitest testing framework for comprehensive validation
  - Enhanced TypeScript package (@taprsvp/types) with new nameHash utilities

## [2025-08-16]

### Fixed
- **Test Vector Issues**: Fixed incorrect TAIP references and missing required fields in test vectors
  - Fixed `authorization-required/valid-authorization-required.json` to reference correct TAIP-4 instead of TAIP-15
  - Added required `settlementAddress` field to `settle/valid.json` test vector per TAIP-4 specification
- **Test Vector Organization**: Reorganized test vector file structure for better maintainability
  - Moved top-level test vectors to appropriate subfolders based on message type
  - `valid-authorize.json` → `authorize/` subfolder
  - `valid-payment*.json` → `payment-request/` subfolder
  - `valid-revert.json` → `revert/` subfolder
  - `valid-settle.json` → `settle/` subfolder
  - Ensures consistent organization with existing test vector structure

## [2025-08-13]

### Changed
- **Test Vectors**: Updated test vectors to reflect recent protocol changes
  - Updated AuthorizationRequired test vectors to reference TAIP-4 instead of TAIP-15
  - Added test vectors for TAIP-17 Escrow messages with valid and invalid examples
  - Added test vectors demonstrating PayTo URI support (RFC 8905) for traditional banking integration
  - Added examples for Transfer messages with IBAN PayTo URIs
  - Added Payment request examples with ACH/wire PayTo URIs

## [2025-08-04]

### Added
- **IVMS101 Data Inclusion Documentation**: Explicitly documented existing capability for including IVMS101 identity data directly in party objects alongside schema.org data
  - Updated TAIP-6: Added explicit specification and examples for IVMS101 data in party objects
  - Added comprehensive examples showing Person and Organization with IVMS101 fields
  - Documented geographic addresses, national identifiers, and compliance data inclusion
  - Added privacy recommendations for selective disclosure of natural person information
  - Clarified that this capability was always supported by the JSON-LD extensibility but was not explicitly documented
- **TypeScript Package v1.6.0**: Released enhanced TypeScript library with comprehensive documentation
  - Added comprehensive JSDoc documentation to all TAP message types
  - File-level overview with protocol explanation, features, and usage examples
  - Organized code into logical sections with clear headers
  - Practical usage examples for Transfer, Payment, DIDCommMessage, and Agent interfaces
  - Complete TAIP specification cross-reference mapping
  - Enhanced IntelliSense and documentation tooltips for better developer experience

### Changed
- **TAIP-6 (Transaction Parties)**: Enhanced documentation to explicitly describe IVMS101 data inclusion
  - Documented that party objects can include both schema.org and IVMS101 properties
  - Added concrete examples for natural persons and organizations with compliance data
  - Added privacy recommendations for selective disclosure of sensitive information
  - Made explicit what was previously implicit through JSON-LD extensibility
- **TAIP-10 (IVMS101 Travel Rule)**: Updated to clarify dual approach for IVMS data exchange
  - Documented direct inclusion in party objects for transparent compliance
  - Maintained selective disclosure via presentations for enhanced privacy
  - Clarified that both approaches have always been supported for different use cases
- **TAIP-14 (Payments)**: Enhanced merchant examples to demonstrate IVMS101 compliance data
  - Updated examples to show both schema.org and IVMS101 properties
  - Demonstrated LEI codes, geographic addresses, and national identifiers for organizations
  - Added privacy considerations for natural person merchants

## [2025-08-03]

### Changed
- **AuthorizationRequired Message**: Moved from TAIP-15 to TAIP-4 as standard authorization message
  - AuthorizationRequired is now part of the core transaction authorization protocol (TAIP-4)
  - Added optional `from` field to specify party type (customer, principal, originator) required to open URL
  - TAIP-15 now references TAIP-4 for complete AuthorizationRequired specification
  - Updated TypeScript interface with enhanced documentation for both transaction and connection authorization
  - Added comprehensive test case example to TAIP-4
  - Updated messages.md to document AuthorizationRequired as part of authorization flow

## [2025-07-28]

### Added
- **RFC 8905 PayTo URI Support**: Settlement addresses now support both blockchain (CAIP-10) and traditional payment systems (RFC 8905)
  - Added to TAIP-4: Authorize, Settle, and Revert messages now accept PayTo URIs for bank transfers
  - Added to TAIP-14: Payment messages support `fallbackSettlementAddresses` field
  - Added to Transfer, Capture, and Invoice messages
- **Fallback Settlement Addresses**: New optional field in Payment messages for redundancy
  - Supports array of mixed CAIP-10 and RFC 8905 addresses
  - Enables failover mechanisms for fiat payments and crypto transfers
- **Purpose Code Types**: Added ISO 20022 External Purpose Code union types to TypeScript package
  - ExternalPurposeCode: 331 standardized purpose codes
  - ExternalCategoryPurposeCode: 48 category purpose codes
- **schema.org/Organization Attributes**: Added optional organization metadata fields to Agents and Parties
  - Based on schema.org/Organization standard
  - Added fields: `name`, `url`, `logo`, `description`, `email`, `telephone`
  - Available for both Agent (TAIP-5) and Party (TAIP-6) entities
- **schema.org/Product Attributes**: Added optional product metadata fields to Invoice Line Items
  - Based on schema.org/Product standard
  - Added fields to line items: `name`, `image`, `url`
  - Enhances invoice line items in TAIP-16 with richer product information

### Changed
- **TypeScript Package (@taprsvp/types)**:
  - Added `PayToURI` type for RFC 8905 support
  - Created `SettlementAddress` union type (CAIP-10 | PayToURI)
  - Updated all settlement address fields to use new union type
  - Converted `IsoCurrency` from enum to union type for better tree-shaking
  - Converted purpose codes from enums to union types
  - Extended `Participant` interface with schema.org/Organization attributes
  - Enhanced `LineItem` interface with schema.org/Product attributes
- **JSON Schemas**:
  - Created `payto-uri.json` and `settlement-address.json` common schemas
  - Updated all message schemas to support new settlement address formats
  - Fixed DIDComm message type pattern to match body @type format
  - Enhanced `agent.json` and `party.json` schemas with organization attributes
  - Updated `invoice.json` schema to include product attributes in line items

### Updated
- TAIP-4: Added RFC 8905 reference and examples for traditional payment settlement
- TAIP-5: Added schema.org/Organization attributes to Agent specification
- TAIP-6: Added schema.org/Organization attributes to Party specification
- TAIP-14: Added `fallbackSettlementAddresses` field specification
- TAIP-16: Added schema.org/Product attributes to invoice line items

## [2025-06-25]

### Changed
- **TAIP Status Updates**:
  - TAIP-1: Transaction Authorization Improvement Proposals - Advanced to **Final** status
  - TAIPs 2-10 - Advanced to **Last Call** status:
    - TAIP-2: Messaging
    - TAIP-3: Virtual Asset Transfer
    - TAIP-4: Transaction Authorization Protocol
    - TAIP-5: Transaction Agents
    - TAIP-6: Transaction Parties
    - TAIP-7: Agent Policies
    - TAIP-8: Selective Disclosure
    - TAIP-9: Proof of Relationship
    - TAIP-10: IVMS101 for Travel Rule
  - TAIPs 15-16 - Advanced from **Draft** to **Review** status:
    - TAIP-15: Agent Connection Protocol
    - TAIP-16: Invoices

## [2025-06-24]

### Added
- JSON Schema definitions for all TAP message types in `/schemas/` directory
- Developer resources page with implementation guides
- TAIP-17: Composable Escrow workflow (Draft)
  - New `Escrow` message type for holding assets on behalf of parties
  - New `Capture` message type for releasing escrowed funds
  - Supports both cryptocurrency assets and fiat currency denominations
  - Enables payment guarantees and asset swap use cases
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

### Current TAP Messages (18 total)
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
16. **AuthorizationRequired** - Request authorization (moved to TAIP-4)
17. **Escrow** - Hold assets in escrow with conditions (TAIP-17)
18. **Capture** - Release escrowed funds (TAIP-17)

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
