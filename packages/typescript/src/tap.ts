/**
 * @fileoverview TAP Message Types and Data Structures
 *
 * This module provides TypeScript type definitions for the Transaction Authorization Protocol (TAP).
 * TAP is a standardized protocol for multi-party transaction authorization before blockchain settlement.
 *
 * ## Key Features
 * - **Type Safety**: Comprehensive TypeScript interfaces for all TAP message types
 * - **JSON-LD Compatible**: All message types support JSON-LD contexts and type identifiers
 * - **DIDComm Integration**: Built on DIDComm messaging for secure agent communication
 * - **Chain Agnostic**: Support for multiple blockchains via CAIP standards
 * - **Compliance Ready**: IVMS101 integration for travel rule compliance
 *
 * ## Core Message Types
 * - `Transfer` - Initiate asset transfers between parties
 * - `Payment` - Request payments from customers (merchant-initiated)
 * - `Escrow` - Hold assets in escrow with conditional release
 * - `Authorize` - Approve transactions after compliance checks
 * - `Connect` - Establish connections between agents
 * - `Settle` - Confirm on-chain settlement
 *
 * ## Usage Example
 * ```typescript
 * import { Transfer, TransferMessage } from '@taprsvp/types';
 *
 * const transfer: Transfer = {
 *   "@context": "https://tap.rsvp/schema/1.0",
 *   "@type": "Transfer",
 *   asset: "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f",
 *   amount: "100.00",
 *   originator: { ... },
 *   agents: [...]
 * };
 *
 * const message: TransferMessage = {
 *   id: "uuid-here",
 *   type: "https://tap.rsvp/schema/1.0#Transfer",
 *   from: "did:example:sender",
 *   to: ["did:example:receiver"],
 *   created_time: Date.now(),
 *   body: transfer
 * };
 * ```
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs | TAIP Specifications}
 * @see {@link https://tap.rsvp | TAP Protocol Documentation}
 * @version 1.5.0
 * @author Transaction Authorization Protocol Working Group
 */

import { IsoCurrency } from "./currencies";
import { Invoice } from "./invoice";
import { PurposeCode, CategoryPurposeCode } from "./purpose_codes";
import { IVMS101_2020, IVMS101_2023 } from "ivms101/dist/";

// ============================================================================
// FUNDAMENTAL TYPES
// ============================================================================
// Core identifier and addressing types used throughout TAP

/**
 * Internationalized Resource Identifier (IRI)
 * A unique identifier that may contain international characters.
 * Used for identifying resources, particularly in JSON-LD contexts.
 *
 * @see {@link https://www.w3.org/TR/json-ld11/#iris | JSON-LD 1.1 IRIs}
 */
export type IRI = `${string}:${string}`;
/**
 * Decentralized Identifier (DID)
 * A globally unique persistent identifier that doesn't require a centralized registration authority.
 *
 * Format: `did:method:method-specific-id`
 *
 * @example "did:web:example.com"
 * @example "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
 * @see {@link https://www.w3.org/TR/did-core/ | DID Core Specification}
 */
export type DID = `did:${string}:${string}`;

/**
 * TAP Context URI
 * Base URI for TAP schema version 1.0.
 * Used as the default context for all TAP messages.
 */
export type TAPContext = "https://tap.rsvp/schema/1.0";

/**
 * TAP Type URI
 * Fully qualified type identifier for TAP message types.
 * Combines the TAP context with a type-specific fragment.
 *
 * @example "https://tap.rsvp/schema/1.0#Transfer"
 */
export type TAPType = `${TAPContext}#${string}`;

/**
 * Base interface for JSON-LD objects
 * Provides the core structure for JSON-LD compatible objects with type information.
 *
 * @template T - The type string that identifies the object type
 */
export interface JsonLdObject<T extends string> {
  "@context"?: IRI | Record<string, string>;
  "@type": T;
}

/**
 * Base interface for TAP message objects
 * Extends JsonLdObject with TAP-specific context and type requirements.
 *
 * @template T - The TAP message type string
 */
export interface TapMessageObject<T extends string> extends JsonLdObject<T> {
  "@context": TAPContext | Record<string, IRI>;
  "@type": T;
}

// ============================================================================
// DATETIME AND IDENTIFIER TYPES
// ============================================================================

/**
 * ISO 8601 DateTime string
 * Represents date and time in a standardized format.
 *
 * @example "2024-03-21T13:45:30Z"
 * @see {@link https://www.iso.org/iso-8601-date-and-time-format.html | ISO 8601}
 */
export type ISO8601DateTime = string;

// ============================================================================
// CHAIN AGNOSTIC IDENTIFIERS (CAIP)
// ============================================================================
// Blockchain and asset identifiers following Chain Agnostic Improvement Proposals

/**
 * Chain Agnostic Blockchain Identifier (CAIP-2)
 * Represents a blockchain in a chain-agnostic way following the CAIP-2 specification.
 * The identifier consists of a namespace and reference separated by a colon.
 *
 * Format: `namespace:reference`
 * - namespace: Represents the blockchain namespace (e.g. 'eip155', 'bip122', 'cosmos')
 * - reference: Chain-specific identifier within that namespace
 *
 * @example "eip155:1" // Ethereum Mainnet
 * @example "bip122:000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f" // Bitcoin Mainnet
 * @example "cosmos:cosmoshub-3" // Cosmos Hub Mainnet
 * @see {@link https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md | CAIP-2 Specification}
 * @public
 */
export type CAIP2 = `${string}:${string}`;

/**
 * Chain Agnostic Account Identifier (CAIP-10)
 * Represents an account/address on a specific blockchain following the CAIP-10 specification.
 * Extends CAIP-2 by adding the account address specific to that chain.
 *
 * Format: `{caip2}:{address}`
 * - caip2: The CAIP-2 chain identifier (e.g. 'eip155:1')
 * - address: Chain-specific account address format
 *
 * @example "eip155:1:0x742d35Cc6634C0532925a3b844Bc454e4438f44e" // Ethereum account on mainnet
 * @example "bip122:000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f:128Lkh3S7CkDTBZ8W7BbpsN3YYizJMp8p6" // Bitcoin account on mainnet
 * @example "cosmos:cosmoshub-3:cosmos1t2uflqwqe0fsj0shcfkrvpukewcw40yjj6hdc0" // Cosmos account
 * @see {@link https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-10.md | CAIP-10 Specification}
 * @public
 */
export type CAIP10 = `${CAIP2}:${string}`;

/**
 * Chain Agnostic Asset Identifier (CAIP-19)
 * Represents an asset/token on a specific blockchain following the CAIP-19 specification.
 * Extends CAIP-2 by adding asset type and identifier information.
 *
 * Format: `{caip2}/{asset_namespace}:{asset_reference}`
 * - caip2: The CAIP-2 chain identifier (e.g. 'eip155:1')
 * - asset_namespace: The asset standard (e.g. 'erc20', 'erc721', 'slip44')
 * - asset_reference: Chain/standard-specific asset identifier
 *
 * @example "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f" // DAI token on Ethereum mainnet
 * @example "eip155:1/erc721:0x06012c8cf97BEaD5deAe237070F9587f8E7A266d" // CryptoKitties NFT contract
 * @example "cosmos:cosmoshub-3/slip44:118" // ATOM token on Cosmos Hub
 * @see {@link https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-19.md | CAIP-19 Specification}
 * @public
 */
export type CAIP19 = `${CAIP2}/${string}:${string}`;

// ============================================================================
// TRADITIONAL FINANCE IDENTIFIERS
// ============================================================================
// Payment and asset identifiers for traditional financial systems

type PayToAuthority = "ach" | "iban" | "bic" | "upi";

/**
 * PayTo URI (RFC 8905)
 * A standardized URI scheme for identifying payment targets.
 * Supports various payment systems including IBAN, SEPA, Bitcoin, etc.
 *
 * Format: `payto://{authority}/{path}[?{query}]`
 * - authority: Identifies the payment target type (e.g., 'iban', 'sepa', 'ach', 'upi', 'bic')
 * - path: Identifies the specific payment target
 * - query: Optional parameters like amount, receiver name, message
 *
 * @example "payto://iban/DE75512108001245126199" // IBAN bank account
 * @example "payto://iban/SOGEDEFFXXX/DE75512108001245126199" // IBAN bank account with BIC
 * @example "payto://bic/SOGEDEFFXXX" // BIC
 * @example "payto://ach/122000661/1234" // ACH transfer with routing and account number
 * @example "payto://upi/alice@example.com" // UPI payment
 * @see {@link https://datatracker.ietf.org/doc/rfc8905/ | RFC 8905: The 'payto' URI Scheme for Payments}
 * @public
 */
export type PayToURI = `payto://${PayToAuthority}/${string}`;

/**
 * Digital Trust Identifier (DTI)
 * A standardized identifier for digital assets in traditional finance.
 *
 * @example "V15WLZJMF"
 * @see {@link https://www.iso.org/standard/85546.html | ISO 24165}
 */
export type DTI = string;

// ============================================================================
// UNIFIED ASSET AND ADDRESS TYPES
// ============================================================================
// Cross-system types supporting both blockchain and traditional finance

/**
 * Asset Identifier
 * Union type representing either a blockchain-based asset (CAIP-19) or a traditional finance asset (DTI).
 * Used to identify assets in a chain-agnostic way across different financial systems.
 *
 * @example "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f" // DAI token on Ethereum mainnet
 * @example "V15WLZJMF" // Bank account in traditional finance
 */
export type Asset = CAIP19 | DTI;

/**
 * Settlement Address
 * Union type representing either a blockchain address (CAIP-10) or a traditional payment target (RFC 8905 PayTo URI).
 * Used to identify settlement destinations across different payment systems.
 *
 * @example "eip155:1:0x742d35Cc6634C0532925a3b844Bc454e4438f44e" // Ethereum address
 * @example "payto://iban/DE75512108001245126199" // IBAN bank account
 * @example "payto://sepa/DE75512108001245126199" // SEPA transfer
 */
export type SettlementAddress = CAIP10 | PayToURI;

/**
 * Decimal Amount
 * String representation of a decimal number.
 * Must be either a whole number or a decimal number with a period separator.
 *
 * @example "100"
 * @example "123.45"
 */
export type Amount = `${number}.${number}` | `${number}`;

/**
 * Chain Agnostic Transaction Identifier (CAIP-220)
 * Represents a transaction on a specific blockchain in a chain-agnostic way.
 *
 * Format: `{caip2}:tx/{txid}`
 *
 * @example "eip155:1:tx/0x4a563af33c4871b51a8b108aa2fe1dd5280a30dfb7236170ae5e5e7957eb6392"
 * @see {@link https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-220.md | CAIP-220 Specification}
 */
export type CAIP220 = string;

// ============================================================================
// REGULATORY AND COMPLIANCE IDENTIFIERS
// ============================================================================
// Standard codes for regulatory compliance and transaction classification

/**
 * Legal Entity Identifier (LEI)
 * A 20-character alphanumeric code that uniquely identifies legal entities globally.
 *
 * @example "969500KN90DZLPGW6898"
 * @see {@link https://www.iso.org/standard/59771.html | ISO 17442}
 */
export type LEICode = string;

/**
 * ISO 20022 External Purpose Code
 * Standardized code indicating the purpose of a financial transaction.
 *
 * @example "CASH" // Cash Management Transfer
 * @example "CORT" // Trade Settlement Payment
 * @see {@link https://www.iso20022.org/catalogue-messages/additional-content-messages/external-code-sets | ISO 20022 External Code Sets}
 */
export type ISO20022PurposeCode = PurposeCode;

/**
 * ISO 20022 External Category Purpose Code
 * High-level classification of the purpose of a financial transaction.
 *
 * @example "CASH" // Cash Management Transfer
 * @example "CORT" // Trade Settlement Payment
 * @see {@link https://www.iso20022.org/catalogue-messages/additional-content-messages/external-code-sets | ISO 20022 External Code Sets}
 */
export type ISO20022CategoryPurposeCode = CategoryPurposeCode;

// ============================================================================
// DIDCOMM MESSAGING FOUNDATION
// ============================================================================
// Base structures for secure messaging between agents

/**
 * DIDComm Attachment
 * Structure for embedding or referencing arbitrary content in DIDComm messages.
 * Supports inline data, external links, and cryptographic integrity verification.
 *
 * @example
 * ```typescript
 * // Base64 encoded attachment
 * const base64Attachment: Attachment = {
 *   id: "document-1",
 *   description: "Transaction receipt PDF",
 *   media_type: "application/pdf",
 *   data: {
 *     base64: "JVBERi0xLjMKJcTl8uXrp..."
 *   }
 * };
 *
 * // JSON data attachment
 * const jsonAttachment: Attachment = {
 *   id: "metadata-1",
 *   media_type: "application/json",
 *   data: {
 *     json: {
 *       timestamp: "2024-01-01T12:00:00Z",
 *       status: "completed"
 *     }
 *   }
 * };
 *
 * // External link attachment with hash
 * const linkedAttachment: Attachment = {
 *   id: "large-file-1",
 *   description: "Transaction history CSV",
 *   media_type: "text/csv",
 *   byte_count: 1048576,
 *   data: {
 *     links: ["https://example.com/files/history.csv"],
 *     hash: "sha256:2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae"
 *   }
 * };
 * ```
 *
 * @see {@link https://identity.foundation/didcomm-messaging/spec/v2.1/#attachments | DIDComm Attachments Specification}
 */
export interface Attachment {
  /**
   * Optional identifier for the attachment
   * Used to reference this attachment within the message scope
   */
  id?: string;

  /**
   * Optional human-readable description of the attachment content
   */
  description?: string;

  /**
   * Optional filename suggestion for persistence
   * Useful when saving the attachment to disk
   */
  filename?: string;

  /**
   * Optional media type of the attachment content
   * Should follow IANA Media Types (MIME types)
   * @example "application/pdf"
   * @example "image/png"
   * @example "application/json"
   */
  media_type?: string;

  /**
   * Optional additional format details
   * Can provide extra context beyond media_type
   */
  format?: string;

  /**
   * Optional timestamp of last content modification
   * Unix timestamp indicating when the content was last modified
   */
  lastmod_time?: number;

  /**
   * Optional estimated size of the content in bytes
   * Helps recipients prepare for large downloads
   */
  byte_count?: number;

  /**
   * Data payload - at least one property must be present
   * Contains the actual content or references to it
   */
  data: {
    /**
     * Detached JWS signature
     * Used for cryptographic proof of attachment integrity
     */
    jws?: string;

    /**
     * Multi-hash format content integrity check
     * Format: "{algorithm}:{hash}"
     * @example "sha256:2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae"
     */
    hash?: string;

    /**
     * Array of URLs where content can be fetched
     * External references to the attachment content
     */
    links?: string[];

    /**
     * Base64url-encoded inline content
     * The actual content encoded as base64url string
     */
    base64?: string;

    /**
     * Directly embedded JSON data
     * For JSON content that doesn't need encoding
     */
    json?: Record<string, unknown>;
  };
}

/**
 * Common DIDComm Message Structure
 * Base interface for all DIDComm messages in TAP.
 *
 * @example
 * ```typescript
 * const transferMessage: DIDCommMessage<Transfer> = {
 *   id: "7c9de123-a456-4789-b012-3456789abcde",
 *   type: "https://tap.rsvp/schema/1.0#Transfer",
 *   from: "did:web:sender.example.com",
 *   to: ["did:web:receiver.example.com"],
 *   created_time: 1704067200, // Unix timestamp
 *   expires_time: 1704153600, // Optional expiration
 *   thid: "parent-thread-id", // Optional thread ID
 *   body: {
 *     "@context": "https://tap.rsvp/schema/1.0",
 *     "@type": "Transfer",
 *     asset: "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f",
 *     amount: "100.00",
 *     // ... other Transfer properties
 *   },
 *   attachments: [
 *     {
 *       id: "kyc-docs",
 *       description: "KYC verification documents",
 *       media_type: "application/pdf",
 *       data: {
 *         base64: "JVBERi0xLjMKJcTl8uXrp..."
 *       }
 *     }
 *   ]
 * };
 * ```
 *
 * @see {@link https://identity.foundation/didcomm-messaging/spec/ | DIDComm Messaging Specification}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 */
export interface DIDCommMessage<T = Record<string, unknown>> {
  /** Unique identifier for the message */
  id: string;

  /** Message type URI that identifies the message type and version */
  type: string;

  /** DID of the sender of the message */
  from: DID;

  /** Array of DIDs of the intended recipients */
  to: DID[];

  /** Optional thread ID to link related messages together */
  thid?: string;

  /** Optional parent thread ID for nested threads */
  pthid?: string;

  /** Unix timestamp when the message was created */
  created_time: number;

  /** Optional Unix timestamp when the message expires */
  expires_time?: number;

  /** Message body containing type-specific content */
  body: T;

  /**
   * Optional array of attachments
   * Used to include additional content that doesn't fit in the message body
   * @see {@link https://identity.foundation/didcomm-messaging/spec/v2.1/#attachments | DIDComm Attachments}
   */
  attachments?: Attachment[];
}

/**
 * DIDComm reply message structure
 * Extends DIDComm message with required thread ID for responses.
 *
 * @template T - The type of the message body
 * @extends DIDCommMessage<T>
 */
export interface DIDCommReply<T = Record<string, unknown>>
  extends DIDCommMessage<T> {
  /** Thread ID linking this reply to the original message */
  thid: string;
}

// ============================================================================
// PARTICIPANT DATA STRUCTURES
// ============================================================================
// Identification and representation of parties and agents in transactions
/**
 * Participant in a TAP transaction
 * Represents either a party (originator/beneficiary) or an agent in the transaction.
 * Can include verification methods and policies.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-5.md | TAIP-5: Agents}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-6.md | TAIP-6: Party Identification}
 */

export interface Participant {
  /**
   * Unique identifier for the participant
   * Can be either a DID or an IRI
   */
  "@id": DID | IRI;
  "@context"?: string | string[];
  "@type"?: string | string[];

  /**
   * Contact email address
   * Based on schema.org/Organization and schema.org/Person
   * @example "compliance@example.vasp.com"
   */
  email?: string;

  /**
   * Contact telephone number
   * Based on schema.org/Organization and schema.org/Person
   * @example "+1-555-123-4567"
   */
  telephone?: string;
}

/**
 * Person Interface
 * Represents a natural person (individual) in TAP transactions.
 * Supports both schema.org/Person properties and IVMS101 identity data for compliance.
 * 
 * **Privacy Considerations**: For natural person information, consider using selective disclosure 
 * (TAIP-8) to protect sensitive data, especially when including IVMS101 fields like national 
 * identifiers and detailed addresses.
 *
 * @example
 * ```typescript
 * // Basic person with schema.org properties
 * const basicPerson: Person = {
 *   "@id": "did:example:alice",
 *   "@type": "https://schema.org/Person",
 *   name: "Alice Johnson",
 *   email: "alice@example.com"
 * };
 *
 * // Person with IVMS101 compliance data
 * const compliancePerson: Person = {
 *   "@id": "did:example:bob", 
 *   "@type": "https://schema.org/Person",
 *   name: [{
 *     primaryIdentifier: "Robert",
 *     secondaryIdentifier: "Smith", 
 *     nameIdentifierType: "LEGL"
 *   }],
 *   geographicAddress: [{
 *     addressType: "HOME",
 *     streetName: "123 Main Street",
 *     buildingNumber: "123",
 *     postCode: "12345",
 *     townName: "Example City",
 *     country: "US"
 *   }],
 *   nationalIdentifier: {
 *     nationalIdentifier: "123-45-6789",
 *     nationalIdentifierType: "ARNU", // Social Security Number
 *     countryOfIssue: "US"
 *   },
 *   dateAndPlaceOfBirth: {
 *     dateOfBirth: "1990-01-15",
 *     placeOfBirth: "New York, NY, US"
 *   },
 *   countryOfResidence: "US"
 * };
 * ```
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-6.md | TAIP-6: Party Identification}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-8.md | TAIP-8: Selective Disclosure}
 */
export interface Person extends Participant {
  "@type": "https://schema.org/Person";

  /**
   * SHA-256 hash of the normalized participant name
   * Used for privacy-preserving name matching per TAIP-12
   * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-12.md | TAIP-12: Privacy-Preserving Name Matching}
   */
  nameHash?: string;

  /**
   * Customer identification string
   * Internal identifier used by the institution for this person
   * @example "CUST-123456"
   */
  customerIdentification?: string;

  /**
   * Person's name
   * Can be a simple string or structured IVMS101 name identifiers
   * For compliance use cases, IVMS101 format provides more detailed name structure
   * @example "Alice Johnson" // Simple string
   * @example [{ primaryIdentifier: "Alice", secondaryIdentifier: "Johnson", nameIdentifierType: "LEGL" }] // IVMS101
   */
  name?: string | IVMS101_2023.NaturalPersonNameId[];

  /**
   * Geographic addresses associated with the person
   * IVMS101 format addresses for travel rule compliance
   * Supports multiple address types (HOME, BIZZ, etc.)
   * @example [{ addressType: "HOME", streetName: "123 Main St", townName: "City", country: "US" }]
   */
  geographicAddress?: IVMS101_2023.Address[];

  /**
   * National identification documents
   * Government-issued identifiers like passport, SSN, driver's license
   * **Privacy**: Consider selective disclosure for sensitive ID information
   * @example { nationalIdentifier: "123-45-6789", nationalIdentifierType: "ARNU", countryOfIssue: "US" }
   */
  nationalIdentifier?: IVMS101_2020.NationalIdentification<IVMS101_2020.NaturalPersonNationalIdentifierTypeCode>;

  /**
   * Date and place of birth information
   * Used for identity verification and compliance
   * **Privacy**: Highly sensitive data - recommend selective disclosure
   */
  dateAndPlaceOfBirth?: {
    /** Date of birth in ISO 8601 format (YYYY-MM-DD) */
    dateOfBirth: string;
    /** Place of birth (city, state/province, country) */
    placeOfBirth: string;
  };

  /**
   * Country of residence
   * ISO 3166-1 alpha-2 country code where the person resides
   * @example "US"
   * @example "CA" 
   * @example "GB"
   */
  countryOfResidence?: IVMS101_2023.CountryCode;
}

/**
 * Organization Interface
 * Represents a legal entity (company, institution, merchant) in TAP transactions.
 * Supports both schema.org/Organization properties and IVMS101 identity data for compliance.
 * 
 * Organizations typically have less privacy concerns than natural persons, making direct
 * inclusion of IVMS101 data more common for transparency and compliance purposes.
 *
 * @example
 * ```typescript
 * // Basic organization with schema.org properties
 * const basicOrg: Organization = {
 *   "@id": "did:web:example.com",
 *   "@type": "https://schema.org/Organization",
 *   name: "Example Corp",
 *   url: "https://example.com",
 *   email: "contact@example.com"
 * };
 *
 * // VASP with full compliance data
 * const vasp: Organization = {
 *   "@id": "did:web:vasp.example.com",
 *   "@type": "https://schema.org/Organization", 
 *   name: "Example Virtual Asset Service Provider",
 *   leiCode: "969500KN90DZLPGW6898",
 *   url: "https://vasp.example.com",
 *   logo: "https://vasp.example.com/logo.png",
 *   description: "Licensed Virtual Asset Service Provider",
 *   email: "compliance@vasp.example.com",
 *   telephone: "+1-555-123-4567",
 *   geographicAddress: [{
 *     addressType: "BIZZ",
 *     streetName: "456 Financial District",
 *     buildingNumber: "456",
 *     postCode: "10005",
 *     townName: "New York",
 *     country: "US"
 *   }],
 *   nationalIdentifier: {
 *     nationalIdentifier: "12-3456789", 
 *     nationalIdentifierType: "TXID", // Tax ID
 *     countryOfIssue: "US"
 *   },
 *   countryOfRegistration: "US"
 * };
 *
 * // Merchant with MCC
 * const merchant: Organization = {
 *   "@id": "did:web:coffee.example.com",
 *   "@type": "https://schema.org/Organization",
 *   name: "Downtown Coffee Shop",
 *   mcc: "5812", // Restaurant
 *   url: "https://coffee.example.com",
 *   geographicAddress: [{
 *     addressType: "BIZZ",
 *     streetName: "123 Main Street", 
 *     buildingNumber: "123",
 *     postCode: "12345",
 *     townName: "Anytown",
 *     country: "US"
 *   }]
 * };
 * ```
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-6.md | TAIP-6: Party Identification}
 * @see {@link https://schema.org/Organization | schema.org/Organization}
 */
export interface Organization extends Participant {
  "@type": "https://schema.org/Organization";

  /**
   * Legal Entity Identifier (LEI) code
   * 20-character alphanumeric code that uniquely identifies legal entities globally
   * Used to uniquely identify legal entities involved in financial transactions
   * @example "969500KN90DZLPGW6898"
   * @see {@link https://www.iso.org/standard/59771.html | ISO 17442}
   */
  leiCode?: LEICode;

  /**
   * Legal name of the organization
   * Can be a simple string or structured IVMS101 name identifiers
   * For regulated entities, IVMS101 format may be required for compliance
   * @example "Example Corporation Inc." // Simple string
   * @example [{ legalPersonName: "Example Corp", legalPersonNameIdentifierType: "LEGL" }] // IVMS101
   */
  name?: string | IVMS101_2023.LegalPersonNameId[];

  /**
   * Customer identification string
   * Internal identifier used by the institution for this organization
   * @example "CORP-789012"
   */
  customerIdentification?: string;

  /**
   * National identification documents
   * Government-issued identifiers like tax ID, business registration number
   * @example { nationalIdentifier: "12-3456789", nationalIdentifierType: "TXID", countryOfIssue: "US" }
   */
  nationalIdentifier?: IVMS101_2020.NationalIdentification<IVMS101_2020.LegalEntityNationalIdentifierTypeCode>;

  /**
   * Merchant Category Code (ISO 18245)
   * Standard classification code for merchant types in payment transactions
   * Used primarily for merchants in payment requests
   *
   * @example "5411" // Grocery stores and supermarkets
   * @example "5812" // Restaurants
   * @example "5734" // Computer software stores
   * @example "6012" // Financial institutions
   * @see {@link https://www.iso.org/standard/33365.html | ISO 18245}
   */
  mcc?: string;

  /**
   * URL pointing to the organization's website
   * Based on schema.org/Organization
   * @example "https://example.vasp.com"
   * @example "https://merchant.example.com"
   */
  url?: string;

  /**
   * URL pointing to the organization's logo image
   * Based on schema.org/Organization
   * @example "https://example.vasp.com/logo.png"
   * @example "https://cdn.example.com/assets/logo.svg"
   */
  logo?: string;

  /**
   * Description of the organization
   * Based on schema.org/Organization
   * @example "Licensed Virtual Asset Service Provider"
   * @example "Online marketplace for digital assets and collectibles"
   * @example "Full-service financial institution"
   */
  description?: string;

  /**
   * Physical addresses of the organization
   * IVMS101 format addresses for regulatory compliance
   * Supports multiple address types (BIZZ for business, etc.)
   * @example [{ addressType: "BIZZ", streetName: "456 Business Ave", townName: "Finance City", country: "US" }]
   */
  geographicAddress?: IVMS101_2023.Address[];

  /**
   * Country of registration/incorporation
   * ISO 3166-1 alpha-2 country code where the organization is legally registered
   * @example "US" // United States
   * @example "GB" // United Kingdom  
   * @example "SG" // Singapore
   * @example "CH" // Switzerland
   */
  countryOfRegistration?: IVMS101_2023.CountryCode;
}

export type Party = Person | Organization;

type AgentRoles =
  | "SettlementAddress"
  | "SourceAddress"
  | "CustodialService"
  | "EscrowAgent"
  | string;

/**
 * Agent Interface
 * Represents software acting on behalf of participants in TAP transactions.
 * Agents handle communication, compliance, and transaction processing.
 *
 * @example
 * ```typescript
 * const originatorAgent: Agent = {
 *   "@id": "did:web:vasp.example.com",
 *   role: "SourceAddress",
 *   for: "did:example:customer123",
 *   name: "Example VASP Agent",
 *   leiCode: "969500KN90DZLPGW6898",
 *   url: "https://vasp.example.com",
 *   email: "compliance@vasp.example.com",
 *   geographicAddress: [{
 *     addressType: IVMS101_2023.AddressType.HOME,
 *     streetName: "123 Main St",
 *     buildingNumber: "123",
 *     postCode: "12345",
 *     townName: "Example City",
 *     country: IVMS101_2023.CountryCode.US
 *   }],
 *   policies: [{
 *     "@type": "RequireAuthorization",
 *     purpose: "AML compliance verification"
 *   }],
 *   serviceUrl: "https://vasp.example.com/didcomm"
 * };
 * ```
 */
export interface Agent extends Partial<Organization> {
  /**
   * Unique identifier for the participant
   * Can be either a DID or an IRI
   */
  "@id": DID | IRI;

  /**
   * Role of the participant in the transaction
   * Standard values for Agents are: "SettlementAddress", "SourceAddress", "CustodialService"
   * All role values MUST use PascalCase
   * Optional for all participant types
   */
  role?: AgentRoles;

  /**
   * DID of the party this participant acts for
   * Used when participant is an agent acting on behalf of another party
   * Required for type "Agent", optional for other types
   * Can be a single DID or an array of DIDs representing multiple parties
   */
  for: DID | DID[];

  /**
   * List of policies that apply to this participant
   * Defines requirements and constraints on the participant's actions
   */
  policies?: Policies[];

  /**
   * Optional DIDComm service endpoint URL
   * This field SHOULD only be used as a fallback when no DIDComm service endpoint
   * is resolvable from the agent's DID document. Particularly useful for self-hosted
   * and decentralized agents. For security purposes, this field SHOULD be ignored
   * if a valid DIDComm service endpoint is already listed in the DID document.
   *
   * @example "https://agent.example.com/didcomm"
   */
  serviceUrl?: IRI;
}

type PartyType =
  | "originator"
  | "beneficiary"
  | "customer"
  | "merchant"
  | "principal";

// ============================================================================
// POLICY FRAMEWORK
// ============================================================================
// Transaction requirements and constraints definition system

/**
 * Base interface for all TAP policy types.
 * Policies define requirements and constraints that must be satisfied during a transaction.
 * Each specific policy type extends this base interface with its own requirements.
 *
 * @template T - The specific policy type identifier (e.g. "RequireAuthorization", "RequirePresentation")
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-7.md | TAIP-7: Policies}
 */
export interface Policy<T extends string> extends JsonLdObject<T> {
  /** The type identifier for this policy */
  "@type": T;

  /**
   * Optional DID of the party or agent required to fulfill this policy
   * Can be a single DID or an array of DIDs
   */
  from?: DID | IRI;

  /**
   * Optional role of the party required to fulfill this policy
   * E.g. 'SettlementAddress', 'SourceAddress', or 'CustodialService'
   */
  fromRole?: AgentRoles;

  /**
   * Optional agent representing a party required to fulfill this policy
   * E.g. 'originator' or 'beneficiary' in TAIP-3
   */
  fromAgent?: PartyType;

  /**
   * Optional human-readable description of the policy's purpose
   * Used to explain why this requirement exists
   */
  purpose?: string;
}
/**
 * Policy requiring authorization before proceeding
 * Used to ensure specific agents authorize a transaction.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-7.md | TAIP-7: Policies}
 */
export interface RequireAuthorization extends Policy<"RequireAuthorization"> {}

/**
 * Policy requiring presentation of verifiable credentials
 * Used to request specific verifiable credentials from participants.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-7.md | TAIP-7: Policies}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-8.md | TAIP-8: Verifiable Credentials}
 */
export interface RequirePresentation extends Policy<"RequirePresentation"> {
  /**
   * Optional DID of the party the presentation is about
   * Used when requesting credentials about a specific party
   */
  aboutParty?: DID | IRI;

  /**
   * Optional DID of the agent the presentation is about
   * Used when requesting credentials about a specific agent
   */
  aboutAgent?: DID | IRI;

  /**
   * Presentation Exchange definition
   * Specifies the required credentials and constraints
   */
  presentationDefinition: string;

  /**
   * Optional credential type shorthand
   * Simplified way to request a specific credential type
   */
  credentialType?: string;
}

/**
 * Policy requiring relationship confirmation
 * Used to verify control of addresses and relationships between parties.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-7.md | TAIP-7: Policies}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-9.md | TAIP-9: Proof of Relationship}
 */
export interface RequireRelationshipConfirmation
  extends Policy<"RequireRelationshipConfirmation"> {
  /**
   * Required nonce for signature
   * Prevents replay attacks
   */
  nonce: string;
}

/**
 * Policy requiring purpose codes for transactions
 * Used to enforce the inclusion of ISO 20022 purpose codes.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-13.md | TAIP-13: Purpose Codes}
 */
export interface RequirePurpose extends Policy<"RequirePurpose"> {
  /**
   * Required purpose code fields
   * Specifies which purpose code types must be included
   */
  required: Array<"purpose" | "categoryPurpose">;
}

/**
 * Policy type definition
 * Union type of all possible policy types in TAP.
 */
export type Policies =
  | RequireAuthorization
  | RequirePresentation
  | RequireRelationshipConfirmation
  | RequirePurpose;

// ============================================================================
// CORE TAP TRANSACTION MESSAGES
// ============================================================================
// Primary transaction initiation and processing message types

/**
 * Transaction Types
 * Union type of all transaction initiation messages in TAP.
 * Used for type-safe handling of transaction messages.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-3.md | TAIP-3: Transfer Message}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-14.md | TAIP-14: Payment Request}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-17.md | TAIP-17: Escrow}
 */
export type Transactions = Transfer | Payment | Escrow;

/**
 * Transfer Message
 * Initiates a transfer of assets between parties.
 * Core message type for asset transfers in TAP.
 *
 * @example
 * ```typescript
 * const transfer: Transfer = {
 *   "@context": "https://tap.rsvp/schema/1.0",
 *   "@type": "Transfer",
 *   asset: "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f", // DAI token
 *   amount: "100.00",
 *   purpose: "CASH", // Cash management transfer
 *   originator: {
 *     "@id": "did:example:originator",
 *     "@type": "https://schema.org/Person",
 *     geographicAddress: [...]
 *   },
 *   agents: [{
 *     "@id": "did:example:originator-agent",
 *     for: "did:example:originator",
 *     role: "SourceAddress",
 *     policies: [{
 *       "@type": "RequireAuthorization"
 *     }]
 *   }]
 * };
 * ```
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-3.md | TAIP-3: Transfer Message}
 */
export interface Transfer extends TapMessageObject<"Transfer"> {
  /**
   * Asset being transferred
   * Can be either a blockchain asset (CAIP-19) or traditional finance asset (DTI)
   */
  asset: Asset;

  /**
   * Amount to transfer
   * String representation of the decimal amount
   */
  amount: Amount;

  /**
   * Optional ISO 20022 purpose code
   * Indicates the purpose of the transfer
   */
  purpose?: ISO20022PurposeCode;

  /**
   * Optional ISO 20022 category purpose code
   * High-level classification of the transfer purpose
   */
  categoryPurpose?: ISO20022CategoryPurposeCode;

  /**
   * Optional expiration timestamp
   * Indicates when the transfer request expires
   */
  expiry?: ISO8601DateTime;

  /**
   * Details of the transfer originator
   * The party initiating the transfer
   */
  originator?: Party;

  /**
   * Optional details of the transfer beneficiary
   * The party receiving the transfer
   */
  beneficiary?: Party;

  /**
   * List of agents involved in the transfer
   * Includes compliance, custody, and other service providers
   */
  agents: Agent[];

  /**
   * Optional settlement transaction identifier
   * CAIP-220 identifier for the on-chain settlement
   */
  settlementId?: CAIP220;

  /**
   * Optional memo field
   * Additional information about the transfer
   */
  memo?: string;
}

/**
 * Payment Message
 * Requests payment from a customer, optionally specifying supported assets.
 * Used for merchant-initiated payment flows.
 *
 * @example
 * ```typescript
 * const payment: Payment = {
 *   "@context": "https://tap.rsvp/schema/1.0",
 *   "@type": "Payment",
 *   currency: "USD",
 *   amount: "49.99",
 *   supportedAssets: [
 *     "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
 *     "eip155:1/erc20:0xa0b86a33e6e0a7c0d4e19e40dce0000000000000"  // USDC
 *   ],
 *   merchant: {
 *     "@id": "did:example:merchant",
 *     "@type": "https://schema.org/Organization",
 *     name: "Coffee Shop LLC",
 *     mcc: "5812", // Restaurant MCC
 *     geographicAddress: [...]
 *   },
 *   agents: [{
 *     "@id": "did:example:merchant-agent",
 *     for: "did:example:merchant",
 *     role: "SettlementAddress",
 *     policies: [{
 *       "@type": "RequireAuthorization"
 *     }]
 *   }]
 * };
 * ```
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-14.md | TAIP-14: Payment Request}
 */
export interface Payment extends TapMessageObject<"Payment"> {
  /**
   * Optional specific asset requested
   * CAIP-19 identifier for the requested blockchain asset
   * Either asset OR currency is required
   */
  asset?: CAIP19;

  /**
   * Optional ISO 4217 currency code
   * For fiat currency payment requests
   * Either asset OR currency is required
   */
  currency?: IsoCurrency;

  /**
   * Amount requested
   * String representation of the decimal amount
   */
  amount: Amount;

  /**
   * Optional list of acceptable assets
   * CAIP-19 identifiers for assets the merchant will accept
   * Used when currency is specified to indicate which crypto assets can be used
   */
  supportedAssets?: CAIP19[];

  /**
   * Optional fallback settlement addresses
   * Array of alternative settlement addresses for redundancy
   * Each address must match the asset or supported assets
   * Enables fallback mechanisms for fiat payments or simple crypto transfers
   */
  fallbackSettlementAddresses?: SettlementAddress[];

  /**
   * Optional Invoice object or URI to an invoice document
   * Provides additional details about the payment request
   *
   * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-16.md | TAIP-16: Invoices}
   */
  invoice?: Invoice | string;

  /**
   * Optional expiration time
   * When the payment request is no longer valid
   */
  expiry?: ISO8601DateTime;

  /**
   * Details of the merchant requesting payment
   * The party requesting to receive the payment
   */
  merchant: Party;

  /**
   * Optional details of the customer
   * The party from whom payment is requested
   */
  customer?: Party;

  /**
   * List of agents involved in the payment
   * Must include at least one merchant agent with policies
   */
  agents: Agent[];
}

// ============================================================================
// AUTHORIZATION AND LIFECYCLE MESSAGES
// ============================================================================
// Transaction authorization, settlement, and lifecycle management

/**
 * Authorization Message
 * Approves a transfer for execution after compliance checks.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
export interface Authorize extends TapMessageObject<"Authorize"> {
  /**
   * Optional settlement address
   * Either a blockchain address (CAIP-10) or traditional payment target (RFC 8905 PayTo URI)
   * REQUIRED if sent by beneficiary agent and original request lacks settlementAddress role agent
   */
  settlementAddress?: SettlementAddress;

  /**
   * Optional settlement asset
   * CAIP-19 identifier specifying the asset for settlement
   * REQUIRED when multiple supportedAssets are present in transaction message
   */
  settlementAsset?: CAIP19;

  /**
   * Optional amount
   * Decimal representation if different from original transaction amount
   */
  amount?: Amount;

  /**
   * Optional expiration timestamp
   * Indicates when the authorization expires
   */
  expiry?: ISO8601DateTime;
}

/**
 * Connect Message
 * Requests a connection between agents with specified constraints.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-15.md | TAIP-15: Agent Connection Protocol}
 */
export interface Connect extends TapMessageObject<"Connect"> {
  /**
   * Details of the requesting agent
   * Includes identity and endpoints
   */
  agent?: Agent;

  /**
   * Party object representing the principal the agent acts on behalf of
   * As defined in TAIP-6
   */
  principal: Party;

  /**
   * Transaction constraints
   * Limits and allowed transaction types
   */
  constraints: TransactionConstraints;

  /**
   * Optional expiration timestamp
   * Indicates when the connection request expires
   */
  expiry?: ISO8601DateTime;

  /**
   * Optional agreement reference
   * URL or identifier of terms agreed to by the principal
   */
  agreement?: string;
}

/**
 * Settlement Message
 * Confirms the on-chain settlement of a transfer.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
export interface Settle extends TapMessageObject<"Settle"> {
  /**
   * Settlement address
   * REQUIRED destination address in CAIP-10 or RFC 8905 format
   */
  settlementAddress: SettlementAddress;

  /**
   * Optional settlement transaction identifier
   * CAIP-220 identifier for the on-chain settlement transaction
   * REQUIRED by at least one agent representing the originator
   */
  settlementId?: CAIP220;

  /**
   * Optional settled amount
   * If specified, must be less than or equal to the amount in the original transaction
   * If an Authorize message specified an amount, this must match that value
   */
  amount?: Amount;
}

/**
 * Rejection Message
 * Rejects a proposed transfer with a reason.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
export interface Reject extends TapMessageObject<"Reject"> {
  /**
   * Optional reason for rejection
   * Human readable explanation of why the transfer was rejected
   */
  reason?: string;
}

/**
 * Cancel Message
 * Terminates an existing transaction or connection.
 * Uses the thread ID to identify what is being cancelled.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Transaction Authorization Protocol}
 */
export interface Cancel extends TapMessageObject<"Cancel"> {
  /**
   * Optional reason for cancellation
   * Human readable explanation
   */
  reason?: string;

  /**
   * DID of the agent initiating cancellation
   * Identifies who is cancelling the transaction
   */
  by: DID;
}

/**
 * Revert Message
 * Requests reversal of a settled transaction.
 * Used for dispute resolution or compliance-related reversals.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
export interface Revert extends TapMessageObject<"Revert"> {
  /**
   * Settlement address for the revert
   * Either a blockchain address (CAIP-10) or traditional payment target (RFC 8905 PayTo URI)
   */
  settlementAddress: SettlementAddress;

  /**
   * Reason for the revert request
   * Explanation of why the transfer needs to be reversed
   */
  reason: string;
}

// ============================================================================
// AGENT AND PARTY MANAGEMENT MESSAGES
// ============================================================================
// Dynamic updates to transaction participants and their properties

/**
 * Update Agent Message
 * Updates the details or policies of an existing agent.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-5.md | TAIP-5: Agents}
 */
export interface UpdateAgent extends TapMessageObject<"UpdateAgent"> {
  /**
   * Updated agent details
   * Complete agent information including any changes
   */
  agent: Agent;
}

/**
 * Update Party Message
 * Updates the details of a party in the transaction.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-6.md | TAIP-6: Party Identification}
 */
export interface UpdateParty extends TapMessageObject<"UpdateParty"> {
  /**
   * Updated party details
   * Complete party information including any changes
   */
  party: Party;
}

/**
 * Add Agents Message
 * Adds new agents to the transaction.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-5.md | TAIP-5: Agents}
 */
export interface AddAgents extends TapMessageObject<"AddAgents"> {
  /**
   * List of agents to add
   * Complete details for each new agent
   */
  agents: Agent[];
}

/**
 * Replace Agent Message
 * Replaces an existing agent with a new one.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-5.md | TAIP-5: Agents}
 */
export interface ReplaceAgent extends TapMessageObject<"ReplaceAgent"> {
  /**
   * DID of the agent to replace
   * Identifies the existing agent
   */
  original: DID;

  /**
   * Details of the replacement agent
   * Complete information for the new agent
   */
  replacement: Agent;
}

/**
 * Remove Agent Message
 * Removes an agent from the transaction.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-5.md | TAIP-5: Agents}
 */
export interface RemoveAgent extends TapMessageObject<"RemoveAgent"> {
  /**
   * DID of the agent to remove
   * Identifies the agent to be removed from the transaction
   */
  agent: DID;
}

// ============================================================================
// RELATIONSHIP AND CONNECTION MESSAGES
// ============================================================================
// Agent connections, relationship proofs, and policy management

/**
 * CACAO Attachment
 * Chain Agnostic CApability Object attachment for proving control of a DID.
 *
 * @see {@link https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-74.md | CAIP-74: CACAO}
 */
export interface CACAOAttachment {
  /**
   * Unique identifier for the attachment
   * Used to reference this attachment within the message
   */
  id: string;

  /**
   * Media type of the attachment
   * Must be "application/json" for CACAO attachments
   */
  media_type: "application/json";

  /**
   * Attachment data containing the CACAO proof
   * Includes signature, header, and proof details
   */
  data: {
    json: {
      /**
       * Header indicating the signature type
       * Must be "eth-personal-sign" for Ethereum personal signatures
       */
      h: "eth-personal-sign";

      /**
       * CACAO signature value
       * The cryptographic signature proving control
       */
      s: string;

      /**
       * Proof message that was signed
       * The message that was signed to create the signature
       */
      p: string;

      /**
       * Timestamp of the signature
       * When the proof was created
       */
      t: ISO8601DateTime;
    };
  };
}

/**
 * Confirm Relationship Message
 * Confirms a relationship between a party and an agent.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-9.md | TAIP-9: Relationship Proofs}
 */
export interface ConfirmRelationship
  extends TapMessageObject<"ConfirmRelationship"> {
  /**
   * DID of the agent
   * Identifies the agent in the relationship
   */
  "@id": DID;

  /**
   * Optional role of the agent
   * Standard values: "SettlementAddress", "SourceAddress", "CustodialService"
   * All role values MUST use PascalCase
   */
  role?: string;

  /**
   * Optional DID of the party
   * Identifies the party the agent is related to
   */
  for?: DID;
}

/**
 * Update Policies Message
 * Updates the policies associated with an agent.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-7.md | TAIP-7: Policies}
 */
export interface UpdatePolicies extends TapMessageObject<"UpdatePolicies"> {
  /**
   * List of updated policies
   * Complete set of policies that should apply
   */
  policies: Policies[];
}

/**
 * Transaction Constraints
 * Defines the allowed transaction parameters for a connection.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-15.md | TAIP-15: Agent Connection Protocol}
 */
export interface TransactionConstraints {
  /**
   * Allowed ISO 20022 purpose codes
   * Array of valid purpose codes for transactions
   */
  purposes?: ISO20022PurposeCode[];

  /**
   * Allowed ISO 20022 category purpose codes
   * Array of valid category purpose codes
   */
  categoryPurposes?: ISO20022CategoryPurposeCode[];

  /**
   * Transaction limits
   * Monetary limits for transactions
   */
  limits?: {
    /**
     * Maximum amount per transaction
     * Decimal string representation
     */
    per_transaction?: Amount;

    /**
     * Maximum per-day total
     * Decimal string representation
     */
    per_day?: Amount;

    /**
     * Maximum weekly total
     * Decimal string representation
     */
    per_week?: Amount;

    /**
     * Maximum monthly total
     * Decimal string representation
     */
    per_month?: Amount;

    /**
     * Maximum yearly total
     * Decimal string representation
     */
    per_year?: Amount;

    /**
     * Currency for the limits
     * ISO 4217 currency code
     */
    currency: IsoCurrency;
  };
}

/**
 * Authorization Required Message
 * Response providing an authorization URL for transaction or connection approval.
 * An agent can require that an end user opens up the authorizationUrl in a web browser or app.
 * An agent may require this to ensure that the end user authorizes a payment or connection.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Transaction Authorization Protocol}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-15.md | TAIP-15: Agent Connection Protocol}
 */
export interface AuthorizationRequired
  extends TapMessageObject<"AuthorizationRequired"> {
  /**
   * URL for authorization
   * Where the user can authorize the transaction or connection
   */
  authorizationUrl: string;

  /**
   * Optional party type required to open the URL
   * Indicates the party type (e.g., "customer", "principal", or "originator") that is required to open the URL
   *
   * @example "customer"
   * @example "principal"
   * @example "originator"
   */
  from?: PartyType;

  /**
   * Expiration timestamp
   * When the authorization URL expires
   */
  expires: ISO8601DateTime;
}

// ============================================================================
// DIDCOMM MESSAGE WRAPPERS
// ============================================================================
// DIDComm envelope structures for all TAP message types

/**
 * Transfer Message Wrapper
 * DIDComm envelope for a Transfer message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-3.md | TAIP-3: Transfer Message}
 */
export interface TransferMessage extends DIDCommMessage<Transfer> {
  type: "https://tap.rsvp/schema/1.0#Transfer";
}

/**
 * Payment Message Wrapper
 * DIDComm envelope for a Payment message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-14.md | TAIP-14: Payment Request}
 */
export interface PaymentMessage extends DIDCommMessage<Payment> {
  type: "https://tap.rsvp/schema/1.0#Payment";
}

/**
 * Authorization Message Wrapper
 * DIDComm envelope for an Authorization message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
export interface AuthorizeMessage extends DIDCommReply<Authorize> {
  type: "https://tap.rsvp/schema/1.0#Authorize";
}

/**
 * Settlement Message Wrapper
 * DIDComm envelope for a Settlement message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
export interface SettleMessage extends DIDCommReply<Settle> {
  type: "https://tap.rsvp/schema/1.0#Settle";
}

/**
 * Rejection Message Wrapper
 * DIDComm envelope for a Rejection message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
export interface RejectMessage extends DIDCommReply<Reject> {
  type: "https://tap.rsvp/schema/1.0#Reject";
}

/**
 * Cancellation Message Wrapper
 * DIDComm envelope for a Cancellation message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
export interface CancelMessage extends DIDCommReply<Cancel> {
  type: "https://tap.rsvp/schema/1.0#Cancel";
}

/**
 * Revert Message Wrapper
 * DIDComm envelope for a Revert message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
export interface RevertMessage extends DIDCommReply<Revert> {
  type: "https://tap.rsvp/schema/1.0#Revert";
}

/**
 * Update Agent Message Wrapper
 * DIDComm envelope for an Update Agent message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-5.md | TAIP-5: Agents}
 */
export interface UpdateAgentMessage extends DIDCommReply<UpdateAgent> {
  type: "https://tap.rsvp/schema/1.0#UpdateAgent";
}

/**
 * Update Party Message Wrapper
 * DIDComm envelope for an Update Party message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-6.md | TAIP-6: Party Identification}
 */
export interface UpdatePartyMessage extends DIDCommReply<UpdateParty> {
  type: "https://tap.rsvp/schema/1.0#UpdateParty";
}

/**
 * Add Agents Message Wrapper
 * DIDComm envelope for an Add Agents message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-5.md | TAIP-5: Agents}
 */
export interface AddAgentsMessage extends DIDCommReply<AddAgents> {
  type: "https://tap.rsvp/schema/1.0#AddAgents";
}

/**
 * Replace Agent Message Wrapper
 * DIDComm envelope for a Replace Agent message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-5.md | TAIP-5: Agents}
 */
export interface ReplaceAgentMessage extends DIDCommReply<ReplaceAgent> {
  type: "https://tap.rsvp/schema/1.0#ReplaceAgent";
}

/**
 * Remove Agent Message Wrapper
 * DIDComm envelope for a Remove Agent message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-5.md | TAIP-5: Agents}
 */
export interface RemoveAgentMessage extends DIDCommReply<RemoveAgent> {
  type: "https://tap.rsvp/schema/1.0#RemoveAgent";
}

/**
 * Confirm Relationship Message Wrapper
 * DIDComm envelope for a Confirm Relationship message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-9.md | TAIP-9: Relationship Proofs}
 */
export interface ConfirmRelationshipMessage
  extends DIDCommReply<ConfirmRelationship> {
  /**
   * Message type identifier
   * Must be "https://tap.rsvp/schema/1.0#ConfirmRelationship" for relationship confirmations
   */
  type: "https://tap.rsvp/schema/1.0#ConfirmRelationship";

  /**
   * Optional CACAO attachments
   * Proofs of DID control for the relationship
   */
  attachments?: [CACAOAttachment];
}

/**
 * Update Policies Message Wrapper
 * DIDComm envelope for an Update Policies message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-7.md | TAIP-7: Policies}
 */
export interface UpdatePoliciesMessage extends DIDCommReply<UpdatePolicies> {
  /**
   * Message type identifier
   * Must be "https://tap.rsvp/schema/1.0#UpdatePolicies" for policy updates
   */
  type: "https://tap.rsvp/schema/1.0#UpdatePolicies";
}

/**
 * Connect Message Wrapper
 * DIDComm envelope for a Connect message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-15.md | TAIP-15: Agent Connection Protocol}
 */
export interface ConnectMessage extends DIDCommMessage<Connect> {
  type: "https://tap.rsvp/schema/1.0#Connect";
}

/**
 * Authorization Required Message Wrapper
 * DIDComm envelope for an Authorization Required message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-15.md | TAIP-15: Agent Connection Protocol}
 */
export interface AuthorizationRequiredMessage
  extends DIDCommReply<AuthorizationRequired> {
  type: "https://tap.rsvp/schema/1.0#AuthorizationRequired";
}

/**
 * Escrow Message
 * Requests an agent to hold assets in escrow on behalf of parties.
 * Enables payment guarantees, asset swaps, and conditional payments.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-17.md | TAIP-17: Composable Escrow}
 */
export interface Escrow extends TapMessageObject<"Escrow"> {
  /**
   * Asset to be held in escrow
   * CAIP-19 identifier for blockchain assets
   * Either asset OR currency is required
   */
  asset?: CAIP19;

  /**
   * ISO 4217 currency code
   * For fiat-denominated escrows
   * Either asset OR currency is required
   */
  currency?: IsoCurrency;

  /**
   * Amount to be held in escrow
   * String representation of the decimal amount
   */
  amount: Amount;

  /**
   * Party whose assets will be placed in escrow
   * The party providing the funds
   */
  originator: Party;

  /**
   * Party who will receive the assets when released
   * The intended recipient of the escrowed funds
   */
  beneficiary: Party;

  /**
   * Expiration timestamp
   * After this time, funds automatically return to originator
   */
  expiry: ISO8601DateTime;

  /**
   * Optional agreement reference
   * URL or URI of the escrow terms and conditions
   */
  agreement?: string;

  /**
   * List of agents involved in the escrow
   * Exactly one agent MUST have role "EscrowAgent"
   */
  agents: Agent[];
}

/**
 * Capture Message
 * Authorizes the release of escrowed funds to the beneficiary.
 * Sent by an agent acting for the beneficiary.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-17.md | TAIP-17: Composable Escrow}
 */
export interface Capture extends TapMessageObject<"Capture"> {
  /**
   * Optional amount to capture
   * If omitted, captures full escrow amount
   * Must be less than or equal to original escrow amount
   */
  amount?: Amount;

  /**
   * Optional settlement address
   * Either a blockchain address (CAIP-10) or traditional payment target (RFC 8905 PayTo URI)
   * If omitted, uses address from earlier Authorize
   */
  settlementAddress?: SettlementAddress;
}

/**
 * Escrow Message Wrapper
 * DIDComm envelope for an Escrow message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-17.md | TAIP-17: Composable Escrow}
 */
export interface EscrowMessage extends DIDCommMessage<Escrow> {
  type: "https://tap.rsvp/schema/1.0#Escrow";
}

/**
 * Capture Message Wrapper
 * DIDComm envelope for a Capture message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-17.md | TAIP-17: Composable Escrow}
 */
export interface CaptureMessage extends DIDCommReply<Capture> {
  type: "https://tap.rsvp/schema/1.0#Capture";
}

/**
 * TAP Message
 * Union type of all possible TAP messages.
 * Used for type-safe message handling in TAP implementations.
 * Includes all transaction, authorization, and management messages.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 */
export type TAPMessage =
  | TransferMessage
  | PaymentMessage
  | AuthorizeMessage
  | SettleMessage
  | RejectMessage
  | CancelMessage
  | RevertMessage
  | UpdateAgentMessage
  | UpdatePartyMessage
  | AddAgentsMessage
  | ReplaceAgentMessage
  | RemoveAgentMessage
  | ConfirmRelationshipMessage
  | UpdatePoliciesMessage
  | ConnectMessage
  | AuthorizationRequiredMessage
  | EscrowMessage
  | CaptureMessage;

// ============================================================================
// TAIP SPECIFICATION CROSS-REFERENCE
// ============================================================================
/**
 * TAP Message Type to TAIP Specification Mapping
 *
 * This comprehensive mapping shows which TAIP specification defines each message type:
 *
 * **Core Protocol Framework:**
 * - TAIP-1: Transaction Authorization Protocol Overview
 * - TAIP-2: Message Format (DIDComm structure) → {@link DIDCommMessage}, {@link DIDCommReply}
 *
 * **Transaction Messages:**
 * - TAIP-3: Transfer Message → {@link Transfer}, {@link TransferMessage}
 * - TAIP-4: Authorization Flow → {@link Authorize}, {@link Settle}, {@link Reject}, {@link Cancel}, {@link Revert}, {@link AuthorizationRequired}
 * - TAIP-14: Payment Request → {@link Payment}, {@link PaymentMessage}
 * - TAIP-17: Composable Escrow → {@link Escrow}, {@link Capture}, {@link EscrowMessage}, {@link CaptureMessage}
 *
 * **Participant Management:**
 * - TAIP-5: Agents → {@link Agent}, {@link UpdateAgent}, {@link AddAgents}, {@link ReplaceAgent}, {@link RemoveAgent}
 * - TAIP-6: Party Identification → {@link Party}, {@link Person}, {@link Organization}, {@link UpdateParty}
 *
 * **Policy and Compliance:**
 * - TAIP-7: Policies → {@link Policy}, {@link RequireAuthorization}, {@link RequirePresentation}, {@link RequirePurpose}, {@link UpdatePolicies}
 * - TAIP-8: Verifiable Credentials → {@link RequirePresentation}
 * - TAIP-9: Proof of Relationship → {@link RequireRelationshipConfirmation}, {@link ConfirmRelationship}
 * - TAIP-12: Privacy-Preserving Name Matching → {@link Person.nameHash}
 * - TAIP-13: Purpose Codes → {@link ISO20022PurposeCode}, {@link ISO20022CategoryPurposeCode}, {@link RequirePurpose}
 *
 * **Connection Management:**
 * - TAIP-15: Agent Connection Protocol → {@link Connect}, {@link ConnectMessage}, {@link TransactionConstraints}
 *
 * **Invoice and Documentation:**
 * - TAIP-16: Invoices → {@link Payment.invoice} (Invoice type imported from ./invoice)
 *
 * **Standards Integration:**
 * - CAIP-2: Chain ID → {@link CAIP2}
 * - CAIP-10: Account ID → {@link CAIP10}
 * - CAIP-19: Asset ID → {@link CAIP19}
 * - CAIP-74: CACAO → {@link CACAOAttachment}
 * - CAIP-220: Transaction ID → {@link CAIP220}
 * - RFC 8905: PayTo URI → {@link PayToURI}
 * - ISO 24165: Digital Trust Identifier → {@link DTI}
 * - ISO 17442: Legal Entity Identifier → {@link LEICode}
 * - ISO 20022: Purpose Codes → {@link ISO20022PurposeCode}, {@link ISO20022CategoryPurposeCode}
 * - IVMS101: Travel Rule Data → {@link Person}, {@link Organization}
 *
 * For the complete specifications, visit: https://github.com/TransactionAuthorizationProtocol/TAIPs
 */

// All types and interfaces are now exported directly in their declarations
