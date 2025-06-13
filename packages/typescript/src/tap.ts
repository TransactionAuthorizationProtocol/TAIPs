// TAP Message Types and Data Structures
// Based on TAIP specifications

import { Purpose, CategoryPurpose } from "@taprsvp/iso20022_external_codes";
import { IsoCurrency } from "./currencies";
import { Invoice } from "./invoice";

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
/**
 * Digital Trust Identifier (DTI)
 * A standardized identifier for digital assets in traditional finance.
 *
 * @example "iban:GB29NWBK60161331926819"
 * @see {@link https://www.iso.org/standard/80601.html | ISO 23897}
 */
export type DTI = string;

/**
 * Asset Identifier
 * Union type representing either a blockchain-based asset (CAIP-19) or a traditional finance asset (DTI).
 * Used to identify assets in a chain-agnostic way across different financial systems.
 *
 * @example "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f" // DAI token on Ethereum mainnet
 * @example "iban:GB29NWBK60161331926819" // Bank account in traditional finance
 */
export type Asset = CAIP19 | DTI;

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
 * Format: `{caip2}/tx/{txid}`
 *
 * @example "eip155:1/tx/0x4a563af33c4871b51a8b108aa2fe1dd5280a30dfb7236170ae5e5e7957eb6392"
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
export type ISO20022PurposeCode = Purpose;

/**
 * ISO 20022 External Category Purpose Code
 * High-level classification of the purpose of a financial transaction.
 *
 * @example "CASH" // Cash Management Transfer
 * @example "CORT" // Trade Settlement Payment
 * @see {@link https://www.iso20022.org/catalogue-messages/additional-content-messages/external-code-sets | ISO 20022 External Code Sets}
 */
export type ISO20022CategoryPurposeCode = CategoryPurpose;

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

export type ParticipantTypes = "Agent" | "Party";

export interface Participant<T extends ParticipantTypes>
  extends JsonLdObject<T> {
  /**
   * Unique identifier for the participant
   * Can be either a DID or an IRI
   */
  "@id": DID | IRI;

  "@type": T;

  /**
   * Legal Entity Identifier code
   * Used to uniquely identify legal entities involved in financial transactions
   */
  "lei:leiCode"?: LEICode;

  /**
   * Human-readable name of the participant
   * Optional to support privacy requirements
   */
  name?: string;

  /**
   * SHA-256 hash of the normalized participant name
   * Used for privacy-preserving name matching per TAIP-12
   */
  nameHash?: string;

  /**
   * Role of the participant in the transaction
   * Standard values for Agents are: "SettlementAddress", "SourceAddress", "CustodialService"
   * All role values MUST use PascalCase
   * Optional for all participant types
   */
  role?: string;

  /**
   * DID of the party this participant acts for
   * Used when participant is an agent acting on behalf of another party
   * Required for type "Agent", optional for other types
   * Can be a single DID or an array of DIDs representing multiple parties
   */
  for: T extends "Agent" ? DID | DID[] : DID | undefined;

  /**
   * List of policies that apply to this participant
   * Defines requirements and constraints on the participant's actions
   */
  policies?: Policies[];

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
  from?: string;

  /**
   * Optional role of the party required to fulfill this policy
   * E.g. 'SettlementAddress', 'SourceAddress', or 'CustodialService'
   */
  fromRole?: string;

  /**
   * Optional agent representing a party required to fulfill this policy
   * E.g. 'originator' or 'beneficiary' in TAIP-3
   */
  fromAgent?: string;

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
  aboutParty?: string;

  /**
   * Optional DID of the agent the presentation is about
   * Used when requesting credentials about a specific agent
   */
  aboutAgent?: string;

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
 */
export type Transactions = Transfer | Payment;

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
  originator: Participant<"Party">;

  /**
   * Optional details of the transfer beneficiary
   * The party receiving the transfer
   */
  beneficiary?: Participant<"Party">;

  /**
   * List of agents involved in the transfer
   * Includes compliance, custody, and other service providers
   */
  agents: Participant<"Agent">[];

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
  merchant: Participant<"Party">;

  /**
   * Optional details of the customer
   * The party from whom payment is requested
   */
  customer?: Participant<"Party">;

  /**
   * List of agents involved in the payment
   * Must include at least one merchant agent with policies
   */
  agents: Participant<"Agent">[];
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
   * The blockchain address where funds should be sent
   */
  settlementAddress?: CAIP10;

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
  agent?: Participant<"Agent"> & {
    /** Service URL */
    serviceUrl?: IRI;
  };

  /**
   * Party object representing the principal the agent acts on behalf of
   * As defined in TAIP-6
   */
  principal: Participant<"Party">;

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
}

/**
 * Complete Message
 * Indicates that a transaction is ready for settlement, sent by the merchant's agent.
 * Used in the Payment flow to provide settlement address to the customer.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-14.md | TAIP-14: Payments}
 */
export interface Complete extends TapMessageObject<"Complete"> {
  /**
   * Settlement address
   * The blockchain address where funds should be sent, specified in CAIP-10 format
   */
  settlementAddress: CAIP10;

  /**
   * Optional final payment amount
   * If specified, must be less than or equal to the amount in the original Payment message
   * If omitted, the full amount from the original Payment message is implied
   */
  amount?: Amount;
}

/**
 * Settlement Message
 * Confirms the on-chain settlement of a transfer.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
export interface Settle extends TapMessageObject<"Settle"> {
  /**
   * Settlement transaction identifier
   * CAIP-220 identifier for the on-chain settlement transaction
   */
  settlementId: CAIP220;

  /**
   * Optional settled amount
   * If specified, must be less than or equal to the amount in the original transaction
   * If a Complete message specified an amount, this must match that value
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
   * Reason for rejection
   * Explanation of why the transfer was rejected
   */
  reason: string;
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
   * CAIP-10 identifier for the revert destination
   */
  settlementAddress: string;

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
  agent: Participant<"Agent">;
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
  party: Participant<"Party">;
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
  agents: Participant<"Agent">[];
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
  replacement: Participant<"Agent">;
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
    per_transaction: Amount;

    /**
     * Maximum daily total
     * Decimal string representation
     */
    daily: Amount;

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
 * Complete Message Wrapper
 * DIDComm envelope for a Complete message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-14.md | TAIP-14: Payments}
 */
export interface CompleteMessage extends DIDCommReply<Complete> {
  type: "https://tap.rsvp/schema/1.0#Complete";
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
  | CompleteMessage;

// All types and interfaces are now exported directly in their declarations
