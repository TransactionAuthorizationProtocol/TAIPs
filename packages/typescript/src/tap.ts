// TAP Message Types and Data Structures
// Based on TAIP specifications

import { Purpose, CategoryPurpose } from "@taprsvp/iso20022_external_codes";
import { IsoCurrency } from "./currencies";
/**
 * Internationalized Resource Identifier (IRI)
 * A unique identifier that may contain international characters.
 * Used for identifying resources, particularly in JSON-LD contexts.
 *
 * @see {@link https://www.w3.org/TR/json-ld11/#iris | JSON-LD 1.1 IRIs}
 */
type IRI = `${string}:${string}`;

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
type DID = `did:${string}:${string}`;

/**
 * TAP Context URI
 * Base URI for TAP schema version 1.0.
 * Used as the default context for all TAP messages.
 */
type TAPContext = "https://tap.rsvp/schema/1.0";

/**
 * TAP Type URI
 * Fully qualified type identifier for TAP message types.
 * Combines the TAP context with a type-specific fragment.
 *
 * @example "https://tap.rsvp/schema/1.0#Transfer"
 */
type TAPType = `${TAPContext}#${string}`;

/**
 * Base interface for JSON-LD objects
 * Provides the core structure for JSON-LD compatible objects with type information.
 *
 * @template T - The type string that identifies the object type
 */
interface JsonLdObject<T extends string> {
  "@context"?: IRI | Record<string, string>;
  "@type": T;
}

/**
 * Base interface for TAP message objects
 * Extends JsonLdObject with TAP-specific context and type requirements.
 *
 * @template T - The TAP message type string
 */
interface TapMessageObject<T extends string> extends JsonLdObject<T> {
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
type ISO8601DateTime = string;
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
type DTI = string;

/**
 * Asset Identifier
 * Union type representing either a blockchain-based asset (CAIP-19) or a traditional finance asset (DTI).
 * Used to identify assets in a chain-agnostic way across different financial systems.
 *
 * @example "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f" // DAI token on Ethereum mainnet
 * @example "iban:GB29NWBK60161331926819" // Bank account in traditional finance
 */
type Asset = CAIP19 | DTI;

/**
 * Decimal Amount
 * String representation of a decimal number.
 * Must be either a whole number or a decimal number with a period separator.
 *
 * @example "100"
 * @example "123.45"
 */
type Amount = `${number}.${number}` | `${number}`;

/**
 * Chain Agnostic Transaction Identifier (CAIP-220)
 * Represents a transaction on a specific blockchain in a chain-agnostic way.
 *
 * Format: `{caip2}/tx/{txid}`
 *
 * @example "eip155:1/tx/0x4a563af33c4871b51a8b108aa2fe1dd5280a30dfb7236170ae5e5e7957eb6392"
 * @see {@link https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-220.md | CAIP-220 Specification}
 */
type CAIP220 = string;
/**
 * Legal Entity Identifier (LEI)
 * A 20-character alphanumeric code that uniquely identifies legal entities globally.
 *
 * @example "969500KN90DZLPGW6898"
 * @see {@link https://www.iso.org/standard/59771.html | ISO 17442}
 */
type LEICode = string;

/**
 * ISO 20022 External Purpose Code
 * Standardized code indicating the purpose of a financial transaction.
 *
 * @example "CASH" // Cash Management Transfer
 * @example "CORT" // Trade Settlement Payment
 * @see {@link https://www.iso20022.org/catalogue-messages/additional-content-messages/external-code-sets | ISO 20022 External Code Sets}
 */
type ISO20022PurposeCode = Purpose;

/**
 * ISO 20022 External Category Purpose Code
 * High-level classification of the purpose of a financial transaction.
 *
 * @example "CASH" // Cash Management Transfer
 * @example "CORT" // Trade Settlement Payment
 * @see {@link https://www.iso20022.org/catalogue-messages/additional-content-messages/external-code-sets | ISO 20022 External Code Sets}
 */
type ISO20022CategoryPurposeCode = CategoryPurpose;

// Common DIDComm Message Structure
/**
 * Common DIDComm Message Structure
 * Base interface for all DIDComm messages in TAP.
 *
 * @see {@link https://identity.foundation/didcomm-messaging/spec/ | DIDComm Messaging Specification}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 */
interface DIDCommMessage<T = Record<string, unknown>> {
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
interface DIDCommReply<T = Record<string, unknown>> extends DIDCommMessage<T> {
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

type ParticipantTypes = "Agent" | "Party";

interface Participant<T extends ParticipantTypes> extends JsonLdObject<T> {
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
   * e.g., "originator", "beneficiary", "agent"
   */
  role?: string;

  /**
   * DID of the party this participant acts for
   * Used when participant is an agent acting on behalf of another party
   */
  for?: DID;

  /**
   * List of policies that apply to this participant
   * Defines requirements and constraints on the participant's actions
   */
  policies?: Policies[];
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
interface Policy<T extends string> extends JsonLdObject<T> {
  /** The type identifier for this policy */
  "@type": T;

  /**
   * Optional DID of the party or agent required to fulfill this policy
   * Can be a single DID or an array of DIDs
   */
  from?: string;

  /**
   * Optional role of the party required to fulfill this policy
   * E.g. 'SettlementAddress' for TAIP-3
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
interface RequireAuthorization extends Policy<"RequireAuthorization"> {}

/**
 * Policy requiring presentation of verifiable credentials
 * Used to request specific verifiable credentials from participants.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-7.md | TAIP-7: Policies}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-8.md | TAIP-8: Verifiable Credentials}
 */
interface RequirePresentation extends Policy<"RequirePresentation"> {
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
interface RequireRelationshipConfirmation
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
interface RequirePurpose extends Policy<"RequirePurpose"> {
  /**
   * Required purpose code fields
   * Specifies which purpose code types must be included
   */
  fields: ("purpose" | "categoryPurpose")[];
}

/**
 * Policy type definition
 * Union type of all possible policy types in TAP.
 */
type Policies =
  | RequireAuthorization
  | RequirePresentation
  | RequireRelationshipConfirmation
  | RequirePurpose;

// Core TAP Data Structures

/**
 * Transfer Message
 * Initiates a transfer of assets between parties.
 * Core message type for asset transfers in TAP.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-3.md | TAIP-3: Transfer Message}
 */
interface Transfer extends TapMessageObject<"Transfer"> {
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
 * Payment Request Message
 * Requests payment from a customer, optionally specifying supported assets.
 * Used for merchant-initiated payment flows.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-14.md | TAIP-14: Payment Request}
 */
interface PaymentRequest extends TapMessageObject<"PaymentRequest"> {
  /**
   * Optional specific asset requested
   * CAIP-19 identifier for the requested blockchain asset
   */
  asset?: CAIP19;

  /**
   * Optional ISO 4217 currency code
   * For fiat currency payment requests
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
   */
  supportedAssets?: CAIP19[];

  /**
   * Optional URI to an invoice document
   * Provides additional details about the payment request
   */
  invoice?: string;

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
 * Transaction Types
 * Union type of all transaction initiation messages in TAP.
 * Used for type-safe handling of transaction messages.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-3.md | TAIP-3: Transfer Message}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-14.md | TAIP-14: Payment Request}
 */
type Transactions = Transfer | PaymentRequest;

/**
 * Authorization Message
 * Approves a transfer for execution after compliance checks.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
interface Authorize extends TapMessageObject<"Authorize"> {
  /**
   * Reference to the transfer being authorized
   * Contains the transfer message ID
   */
  transfer: {
    /** ID of the transfer message being authorized */
    "@id": string;
  };

  /**
   * Optional authorization reason
   * Additional context for the authorization decision
   */
  reason?: string;
}

/**
 * Settlement Message
 * Confirms the on-chain settlement of a transfer.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
interface Settle extends TapMessageObject<"Settle"> {
  /**
   * Reference to the transfer being settled
   * Contains the transfer message ID
   */
  transfer: {
    /** ID of the transfer message being settled */
    "@id": string;
  };

  /**
   * Settlement transaction identifier
   * CAIP-220 identifier for the on-chain settlement transaction
   */
  settlementId: CAIP220;
}

/**
 * Rejection Message
 * Rejects a proposed transfer with a reason.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
interface Reject extends TapMessageObject<"Reject"> {
  /**
   * Reference to the transfer being rejected
   * Contains the transfer message ID
   */
  transfer: {
    /** ID of the transfer message being rejected */
    "@id": string;
  };

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
interface Cancel extends TapMessageObject<"Cancel"> {
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
interface Revert extends TapMessageObject<"Revert"> {
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
interface UpdateAgent extends TapMessageObject<"UpdateAgent"> {
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
interface UpdateParty extends TapMessageObject<"UpdateParty"> {
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
interface AddAgents extends TapMessageObject<"AddAgents"> {
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
interface ReplaceAgent extends TapMessageObject<"ReplaceAgent"> {
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
interface RemoveAgent extends TapMessageObject<"RemoveAgent"> {
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
interface CACAOAttachment {
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
interface ConfirmRelationship extends TapMessageObject<"ConfirmRelationship"> {
  /**
   * DID of the agent
   * Identifies the agent in the relationship
   */
  "@id": DID;

  /**
   * Optional role of the agent
   * Describes the agent's function in the relationship
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
interface UpdatePolicies extends TapMessageObject<"UpdatePolicies"> {
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
interface TransactionConstraints {
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
 * Connect Message
 * Requests a connection between agents with specified constraints.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-15.md | TAIP-15: Agent Connection Protocol}
 */
interface Connect extends TapMessageObject<"Connect"> {
  /**
   * Details of the requesting agent
   * Includes identity and endpoints
   */
  agent?: {
    /** DID of the agent */
    "@id": DID;
    /** Human-readable name */
    name?: string;
    /** Type of agent */
    type?: string;
    /** Service URL */
    serviceUrl?: string;
  };

  /**
   * DID of the represented party
   * The party the agent acts on behalf of
   */
  for: DID;

  /**
   * Transaction constraints
   * Limits and allowed transaction types
   */
  constraints: TransactionConstraints;
}

/**
 * Authorization Required Message
 * Response providing an authorization URL for connection approval.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-15.md | TAIP-15: Agent Connection Protocol}
 */
interface AuthorizationRequired
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

// DIDComm Message Wrappers

/**
 * Transfer Message Wrapper
 * DIDComm envelope for a Transfer message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-3.md | TAIP-3: Transfer Message}
 */
interface TransferMessage extends DIDCommMessage<Transfer> {
  type: "https://tap.rsvp/schema/1.0#Transfer";
}

/**
 * Payment Request Message Wrapper
 * DIDComm envelope for a Payment Request message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-14.md | TAIP-14: Payment Request}
 */
interface PaymentRequestMessage extends DIDCommMessage<PaymentRequest> {
  type: "https://tap.rsvp/schema/1.0#PaymentRequest";
}

/**
 * Authorization Message Wrapper
 * DIDComm envelope for an Authorization message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
interface AuthorizeMessage extends DIDCommReply<Authorize> {
  type: "https://tap.rsvp/schema/1.0#Authorize";
}

/**
 * Settlement Message Wrapper
 * DIDComm envelope for a Settlement message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
interface SettleMessage extends DIDCommReply<Settle> {
  type: "https://tap.rsvp/schema/1.0#Settle";
}

/**
 * Rejection Message Wrapper
 * DIDComm envelope for a Rejection message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
interface RejectMessage extends DIDCommReply<Reject> {
  type: "https://tap.rsvp/schema/1.0#Reject";
}

/**
 * Cancellation Message Wrapper
 * DIDComm envelope for a Cancellation message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
interface CancelMessage extends DIDCommReply<Cancel> {
  type: "https://tap.rsvp/schema/1.0#Cancel";
}

/**
 * Revert Message Wrapper
 * DIDComm envelope for a Revert message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-4.md | TAIP-4: Authorization Flow}
 */
interface RevertMessage extends DIDCommReply<Revert> {
  type: "https://tap.rsvp/schema/1.0#Revert";
}

/**
 * Update Agent Message Wrapper
 * DIDComm envelope for an Update Agent message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-5.md | TAIP-5: Agents}
 */
interface UpdateAgentMessage extends DIDCommReply<UpdateAgent> {
  type: "https://tap.rsvp/schema/1.0#UpdateAgent";
}

/**
 * Update Party Message Wrapper
 * DIDComm envelope for an Update Party message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-6.md | TAIP-6: Party Identification}
 */
interface UpdatePartyMessage extends DIDCommReply<UpdateParty> {
  type: "https://tap.rsvp/schema/1.0#UpdateParty";
}

/**
 * Add Agents Message Wrapper
 * DIDComm envelope for an Add Agents message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-5.md | TAIP-5: Agents}
 */
interface AddAgentsMessage extends DIDCommReply<AddAgents> {
  type: "https://tap.rsvp/schema/1.0#AddAgents";
}

/**
 * Replace Agent Message Wrapper
 * DIDComm envelope for a Replace Agent message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-5.md | TAIP-5: Agents}
 */
interface ReplaceAgentMessage extends DIDCommReply<ReplaceAgent> {
  type: "https://tap.rsvp/schema/1.0#ReplaceAgent";
}

/**
 * Remove Agent Message Wrapper
 * DIDComm envelope for a Remove Agent message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-5.md | TAIP-5: Agents}
 */
interface RemoveAgentMessage extends DIDCommReply<RemoveAgent> {
  type: "https://tap.rsvp/schema/1.0#RemoveAgent";
}

/**
 * Confirm Relationship Message Wrapper
 * DIDComm envelope for a Confirm Relationship message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-9.md | TAIP-9: Relationship Proofs}
 */
interface ConfirmRelationshipMessage extends DIDCommReply<ConfirmRelationship> {
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
interface UpdatePoliciesMessage extends DIDCommReply<UpdatePolicies> {
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
interface ConnectMessage extends DIDCommMessage<Connect> {
  type: "https://tap.rsvp/schema/1.0#Connect";
}

/**
 * Authorization Required Message Wrapper
 * DIDComm envelope for an Authorization Required message.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-15.md | TAIP-15: Agent Connection Protocol}
 */
interface AuthorizationRequiredMessage
  extends DIDCommReply<AuthorizationRequired> {
  type: "https://tap.rsvp/schema/1.0#AuthorizationRequired";
}

/**
 * TAP Message
 * Union type of all possible TAP messages.
 * Used for type-safe message handling in TAP implementations.
 * Includes all transaction, authorization, and management messages.
 *
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-2.md | TAIP-2: Message Format}
 */
type TAPMessage =
  | TransferMessage
  | PaymentRequestMessage
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
  | AuthorizationRequiredMessage;

// Export all types
export type {
  // Common Types
  DID,
  IRI,
  ISO8601DateTime,
  // CAIP2, CAIP10, and CAIP19 are exported above with their documentation
  CAIP220,
  DTI,
  Asset,
  Amount,
  LEICode,
  ISO20022PurposeCode,
  ISO20022CategoryPurposeCode,

  // Message Structure
  DIDCommMessage,
  Participant,
  RequireAuthorization,
  RequirePresentation,
  RequireRelationshipConfirmation,
  RequirePurpose,
  Policy,

  // Core TAP types
  Transfer,
  PaymentRequest,
  Transactions,
  Authorize,
  Settle,
  Reject,
  Cancel,
  Revert,
  UpdateAgent,
  UpdateParty,
  AddAgents,
  ReplaceAgent,
  RemoveAgent,
  ConfirmRelationship,
  UpdatePolicies,

  // DIDComm Message types
  TransferMessage,
  PaymentRequestMessage,
  AuthorizeMessage,
  SettleMessage,
  RejectMessage,
  CancelMessage,
  RevertMessage,
  UpdateAgentMessage,
  UpdatePartyMessage,
  AddAgentsMessage,
  ReplaceAgentMessage,
  RemoveAgentMessage,
  CACAOAttachment,
  ConfirmRelationshipMessage,
  UpdatePoliciesMessage,
  ConnectMessage,
  AuthorizationRequiredMessage,
  TAPMessage,

  // New types
  TransactionConstraints,
  Connect,
  AuthorizationRequired,
};
