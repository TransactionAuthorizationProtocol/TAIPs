// TAP Message Types and Data Structures
// Based on TAIP specifications

import { IsoCurrency } from "./currencies";
import { Invoice } from "./invoice";
import { PurposeCode, CategoryPurposeCode } from "./purpose_codes";

/**
 * Internationalized Resource Identifier (IRI)
 * A unique identifier that may contain international characters.
 * Used for identifying resources, particularly in JSON-LD contexts.
 *
 * @see {@link https://www.w3.org/TR/json-ld11/#iris | JSON-LD 1.1 IRIs}
 */
export type IRI = `${string}:${string}`;

// Common Types
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
/**
 * ISO 8601 DateTime string
 * Represents date and time in a standardized format.
 *
 * @example "2024-03-21T13:45:30Z"
 * @see {@link https://www.iso.org/iso-8601-date-and-time-format.html | ISO 8601}
 */
export type ISO8601DateTime = string;
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

// Common DIDComm Message Structure
/**
 * Common DIDComm Message Structure
 * Base interface for all DIDComm messages in TAP.
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
// Participant Data Structure
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
   * Human-readable name of the participant
   * Optional to support privacy requirements
   */
  name?: string;

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

export interface Person extends Participant {
  "@type": "https://schema.org/Person";

  /**
   * SHA-256 hash of the normalized participant name
   * Used for privacy-preserving name matching per TAIP-12
   */
  nameHash?: string;
}

export interface Organization extends Participant {
  "@type": "https://schema.org/Organization";

  /**
   * Legal Entity Identifier code
   * Used to uniquely identify legal entities involved in financial transactions
   */
  leiCode?: LEICode;

  /**
   * Legal name of the organization
   * Optional to support privacy requirements
   */
  legalName?: string;

  /**
   * Tax identification number of the organization
   * Optional to support privacy requirements
   */
  taxId?: string;

  /**
   * Value Added Tax identification number of the organization
   * Optional to support privacy requirements
   */
  vatId?: string;

  /**
   * Merchant Category Code (ISO 18245)
   * Standard classification code for merchant types in payment transactions
   * Used primarily for merchants in payment requests
   *
   * @example "5411" // Grocery stores and supermarkets
   * @example "5812" // Restaurants
   * @see {@link https://www.iso.org/standard/33365.html | ISO 18245}
   */
  mcc?: string;

  /**
   * URL pointing to the participant's website
   * Based on schema.org/Organization
   * @example "https://example.vasp.com"
   */
  url?: string;

  /**
   * URL pointing to the participant's logo image
   * Based on schema.org/Organization
   * @example "https://example.vasp.com/logo.png"
   */
  logo?: string;

  /**
   * Description of the participant
   * Based on schema.org/Organization
   * @example "Licensed Virtual Asset Service Provider"
   */
  description?: string;
}

export type Party = Person | Organization;

type AgentRoles =
  | "SettlementAddress"
  | "SourceAddress"
  | "CustodialService"
  | "EscrowAgent"
  | string;

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
  fromAgent?: "originator" | "beneficiary" | "customer" | "merchant";

  /**
   * Optional human-readable description of the policy's purpose
   * Used to explain why this requirement exists
   */
  purpose?: string;
}
// Policy Types
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

// Core TAP Data Structures

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
   * Optional default settlement address
   * Either a blockchain address (CAIP-10) or traditional payment target (RFC 8905 PayTo URI)
   * Primary address for receiving payment
   */
  defaultAddress?: SettlementAddress;

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
 * Response providing an authorization URL for connection approval.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-15.md | TAIP-15: Agent Connection Protocol}
 */
export interface AuthorizationRequired
  extends TapMessageObject<"AuthorizationRequired"> {
  /**
   * URL for connection authorization
   * Where the customer can review and approve
   */
  authorization_url: string;

  /**
   * Expiration timestamp
   * When the authorization URL expires
   */
  expires: ISO8601DateTime;
}

/**
 * DIDComm Message Wrappers

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

// All types and interfaces are now exported directly in their declarations
