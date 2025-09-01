# @taprsvp/types Changelog

All notable changes to the TypeScript package are documented in this file.

## [1.12.0] - 2025-09-01

### Added
- **TAIP-18 Asset Exchange**: Added Exchange and Quote message types for cross-asset transactions
  - Added `Exchange` interface supporting multi-asset arrays for source and target assets
  - Added `Quote` interface for liquidity provider responses with pricing and expiration
  - Support for CAIP-19, DTI, and ISO-4217 currency codes in asset arrays
  - Added `ExchangeMessage` and `QuoteMessage` DIDComm wrappers
  - Updated `Transactions` union type to include `Exchange`
  - Updated `TAPMessage` union type to include `ExchangeMessage` and `QuoteMessage`
  - Enhanced TAIP specification cross-reference documentation
  - Enables cross-asset quotes (USDC to EURC), FX transactions, on/off-ramp services, and cross-chain bridging

## [1.11.0] - 2025-08-23

### Enhanced
- **TAIP-15 Transaction Constraints**: Enhanced TransactionConstraints interface for improved connection security
  - Added `allowedBeneficiaries` field: Array of TAIP-6 Party objects for approved payment recipients
  - Added `allowedSettlementAddresses` field: Array of CAIP-10 addresses for approved settlement addresses  
  - Added `allowedAssets` field: Array of CAIP-19 asset identifiers for approved transaction assets
  - Enhanced Zod validator schemas to validate new constraint fields
  - Added `validateTransactionConstraints()` function for standalone constraint validation
  - Updated Connect interface examples and JSDoc documentation
  - Comprehensive constraint validation enables granular control over agent connection permissions

## [1.10.0] - 2025-08-21

### Added
- **Enhanced Zod v4 Validation**: Comprehensive runtime validation for TAP messages
  - New `validator` module available at `@taprsvp/types/validator` 
  - Zod v4 schemas for all TAP message types (Transfer, Payment, Authorize, etc.)
  - **Strict ISO Standards Validation**: Proper validation using actual ISO code sets
    - ISO 4217 currency code validation (156 valid codes: USD, EUR, GBP, etc.)
    - ISO 20022 purpose code validation (367 valid codes: SALA, TRAD, RENT, etc.)
    - ISO 20022 category purpose code validation (38 valid codes)
  - Validation functions: `validateTAPMessage()`, `parseTAPMessage()`, `isTAPMessage()`
  - Message-specific validators for each TAP message type
  - Full CAIP-10, CAIP-19, PayTo URI, and DID validation
  - Comprehensive test suite with 74 test cases covering all validation scenarios
  - Separate module path keeps validators optional for bundle size optimization

## [1.9.0] - 2025-08-21

### Changed
- **Updated Connect Interface**: Restructured to support new TAIP-15 requester/principal/agents pattern
  - Added `requester` and `principal` Party fields to Connect interface
  - Replaced single `agent` field with required `agents` array
  - Agents array must include at least one agent with `@id` matching DIDComm `from` field and `for` attribute set to requester DID
  - Updated JSDoc documentation to reflect TAIP-15 specification changes
  - Maintained backward compatibility for existing message types

### Enhanced
- **Enhanced Agent Interface**: Updated agent structure to support multi-party connections
  - Clarified `for` attribute usage in agent definitions
  - Updated documentation to reference TAIP-5 specification for agent details
  - Consistent agent array patterns across Transfer, Payment, and Connect messages
  - Updated TypeScript interfaces, JSON schemas, and test vectors to match new structure
  - Removed `type` attributes from all agent examples across codebase for consistency with TAIP-5 specification

## [1.8.0] - 2025-08-21

### Added
- **DIDComm Attachments Support**: Added full DIDComm v2.1 attachments support
  - Added `Attachment` interface following DIDComm v2.1 specification
  - Added optional `attachments` array to `DIDCommMessage` interface
  - Supports inline data (base64, JSON), external links, and cryptographic integrity verification (JWS, hash)
  - Includes comprehensive documentation with usage examples for different attachment types
  - Enables inclusion of supplementary documents like KYC verification, receipts, and compliance documentation

- **DIDComm Out-of-Band Messages**: Added support for out-of-band invitation messages
  - Added `OutOfBandInvitation` interface extending `DIDCommMessage<OutOfBandGoal>`
  - Added `OutOfBandGoal` interface for invitation body fields
  - Supports QR codes, URLs, emails for sharing invitations
  - Enables bundling initial protocol messages (like Connect requests) with invitations
  - Compatible with TAIP-15 Agent Connection Protocol for TAP-specific connections

- **Presentation Message**: Added support for verifiable credential presentations per TAIP-8
  - Added `PresentationMessage` interface implementing DIDCommReply with empty body
  - Requires attachments containing verifiable presentations
  - Follows WACI Present Proof protocol v3.0 specification
  - Enables selective disclosure for privacy-preserving identity verification

- **Enhanced Message Type Support**: Expanded TAPMessage union type to include 19 message types
  - Added PresentationMessage to support TAIP-8 selective disclosure
  - Improved cross-reference documentation for all TAIP specifications

## [1.7.0] - 2025-08-18

### Added
- **Comprehensive Documentation**: Enhanced TypeScript library with complete documentation and guides
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

## [1.6.0] - 2025-08-04

### Added
- **Comprehensive JSDoc Documentation**: Enhanced TypeScript library with comprehensive documentation
  - Added comprehensive JSDoc documentation to all TAP message types
  - File-level overview with protocol explanation, features, and usage examples
  - Organized code into logical sections with clear headers
  - Practical usage examples for Transfer, Payment, DIDCommMessage, and Agent interfaces
  - Complete TAIP specification cross-reference mapping
  - Enhanced IntelliSense and documentation tooltips for better developer experience

### Enhanced
- **TAIP-12 Name Hashing Implementation**: Added production-ready TypeScript implementation for privacy-preserving name matching
  - Added `generateNameHash()` function with SHA-256 hashing using Web Crypto API and Node.js crypto fallback
  - Added `normalizeForHashing()` function for TAIP-12 compliant name normalization (uppercase, whitespace removal)
  - Cross-platform compatibility supporting browsers and Node.js environments without additional dependencies
  - Comprehensive test suite with 19 test cases including TAIP-12 specification test vectors
  - Support for non-Western names (Arabic, Chinese, Korean, Japanese scripts)
  - Compatible with VerifyVASP and GTR networks per TAIP-12 specification
  - Added Vitest testing framework for comprehensive validation

## [1.5.0] - 2025-08-03

### Changed
- **AuthorizationRequired Message**: Enhanced interface for both transaction and connection authorization
  - Updated TypeScript interface with enhanced documentation for both transaction and connection authorization
  - AuthorizationRequired moved from TAIP-15 to TAIP-4 as standard authorization message
  - Added optional `from` field to specify party type (customer, principal, originator) required to open URL

## [1.4.0] - 2025-07-28

### Added
- **RFC 8905 PayTo URI Support**: Settlement addresses now support both blockchain (CAIP-10) and traditional payment systems (RFC 8905)
  - Settlement addresses in Transfer, Authorize, Settle, Revert, and Capture messages now accept PayTo URIs
  - Payment messages support `fallbackSettlementAddresses` field with mixed CAIP-10 and RFC 8905 addresses
  - Enables failover mechanisms for fiat payments and crypto transfers

- **Purpose Code Types**: Added ISO 20022 External Purpose Code union types
  - ExternalPurposeCode: 331 standardized purpose codes
  - ExternalCategoryPurposeCode: 48 category purpose codes

- **schema.org Organization Attributes**: Added optional organization metadata fields to Agents and Parties
  - Based on schema.org/Organization standard
  - Added fields: `name`, `url`, `logo`, `description`, `email`, `telephone`
  - Available for both Agent (TAIP-5) and Party (TAIP-6) entities