// TAP Message Types and Data Structures
// Based on TAIP specifications

// Common Types
type DID = string;
type IRI = string;
type ISO8601DateTime = string;
type CAIP19 = string;
type CAIP220 = string;
type LEICode = string; // 20-character alpha-numeric string conforming to ISO 17442
type ISO20022PurposeCode = string; // ISO 20022 ExternalPurpose1Code
type ISO20022CategoryPurposeCode = string; // ISO 20022 ExternalCategoryPurpose1Code

// Common DIDComm Message Structure
interface DIDCommMessage {
  id: string;
  type: string;
  from: DID;
  to: DID[];
  thid?: string;
  pthid?: string;
  created_time: number;
  expires_time?: number;
  body: Record<string, unknown>;
}

// Party Data Structure
interface Party {
  "@context"?: {
    "@vocab"?: string;
    lei?: string;
  };
  "@id": DID | IRI;
  "lei:leiCode"?: LEICode;
  name?: string;
  nameHash?: string; // SHA-256 hash of normalized name per TAIP-12
}

// Agent Data Structure
interface Agent {
  "@id": DID;
  role?: string;
  for?: DID;
  policies?: Policy[];
}

// Policy Types
interface RequirePresentation {
  "@type": "RequirePresentation";
  "@context": string[];
  fromAgent: string;
  aboutParty?: string;
  aboutAgent?: string;
  presentationDefinition: string;
  credentialType?: string; // Optional, for simpler credential requests
}

interface RequirePurpose {
  "@type": "RequirePurpose";
  fromAgent: string;
  fields: ("purpose" | "categoryPurpose")[];
}

type Policy = RequirePresentation | RequirePurpose;

// Message Types

// Transfer Message
interface TransferMessage extends DIDCommMessage {
  type: "https://tap.rsvp/schema/1.0#Transfer";
  body: {
    "@context": string | Record<string, string>;
    "@type": "https://tap.rsvp/schema/1.0#Transfer";
    asset: CAIP19;
    amount: string;
    purpose?: ISO20022PurposeCode;
    categoryPurpose?: ISO20022CategoryPurposeCode;
    originator: Party;
    beneficiary?: Party;
    agents: Agent[];
    settlementId?: CAIP220;
    memo?: string;
  };
}

// PaymentRequest Message
interface PaymentRequestMessage extends DIDCommMessage {
  type: "https://tap.rsvp/schema/1.0#PaymentRequest";
  body: {
    "@context": string;
    "@type": "https://tap.rsvp/schema/1.0#PaymentRequest";
    asset?: CAIP19;
    currency?: string; // ISO 4217 currency code
    amount: string;
    supportedAssets?: CAIP19[];
    invoice?: string; // URI to invoice
    expiry?: ISO8601DateTime;
    merchant: Party;
    customer?: Party;
    agents: Agent[]; // Required to specify merchant agent with policies
  };
}

// Authorization Flow Messages

interface AuthorizeMessage extends DIDCommMessage {
  type: "https://tap.rsvp/schema/1.0#Authorize";
  body: {
    "@context": string;
    "@type": "https://tap.rsvp/schema/1.0#Authorize";
    transfer: {
      "@id": string;
    };
    reason?: string;
  };
}

interface SettleMessage extends DIDCommMessage {
  type: "https://tap.rsvp/schema/1.0#Settle";
  body: {
    "@context": string;
    "@type": "https://tap.rsvp/schema/1.0#Settle";
    transfer: {
      "@id": string;
    };
    settlementId: CAIP220;
  };
}

interface RejectMessage extends DIDCommMessage {
  type: "https://tap.rsvp/schema/1.0#Reject";
  body: {
    "@context": string;
    "@type": "https://tap.rsvp/schema/1.0#Reject";
    transfer: {
      "@id": string;
    };
    reason: string;
  };
}

interface CancelMessage extends DIDCommMessage {
  type: "https://tap.rsvp/schema/1.0#Cancel";
  body: {
    "@context": string;
    "@type": "https://tap.rsvp/schema/1.0#Cancel";
    reason?: string;
  };
}

interface RevertMessage extends DIDCommMessage {
  type: "https://tap.rsvp/schema/1.0#Revert";
  body: {
    "@context": string;
    "@type": "https://tap.rsvp/schema/1.0#Revert";
    transfer: {
      "@id": string;
    };
    settlementAddress: string; // CAIP-10 identifier
    reason: string;
  };
}

// Participant Management Messages

interface UpdateAgentMessage extends DIDCommMessage {
  type: "https://tap.rsvp/schema/1.0#UpdateAgent";
  body: {
    "@context": string;
    "@type": "https://tap.rsvp/schema/1.0#UpdateAgent";
    agent: Agent;
  };
}

interface UpdatePartyMessage extends DIDCommMessage {
  type: "https://tap.rsvp/schema/1.0#UpdateParty";
  body: {
    "@context":
      | string
      | {
          "@vocab": string;
          lei?: string;
        };
    "@type": "https://tap.rsvp/schema/1.0#UpdateParty";
    party: Party;
  };
}

interface AddAgentsMessage extends DIDCommMessage {
  type: "https://tap.rsvp/schema/1.0#AddAgents";
  body: {
    "@context": string;
    "@type": "https://tap.rsvp/schema/1.0#AddAgents";
    agents: Agent[];
  };
}

interface ReplaceAgentMessage extends DIDCommMessage {
  type: "https://tap.rsvp/schema/1.0#ReplaceAgent";
  body: {
    "@context": string;
    "@type": "https://tap.rsvp/schema/1.0#ReplaceAgent";
    original: DID;
    replacement: Agent;
  };
}

interface RemoveAgentMessage extends DIDCommMessage {
  type: "https://tap.rsvp/schema/1.0#RemoveAgent";
  body: {
    "@context": string;
    "@type": "https://tap.rsvp/schema/1.0#RemoveAgent";
    agent: DID;
  };
}

// Relationship Proofs

interface CACAOAttachment {
  id: string;
  media_type: "application/json";
  data: {
    json: {
      h: "eth-personal-sign";
      s: string; // CACAO signature
      p: string; // Proof message
      t: ISO8601DateTime;
    };
  };
}

interface ConfirmRelationshipMessage extends DIDCommMessage {
  type: "https://tap.rsvp/schema/1.0#ConfirmRelationship";
  body: Record<string, unknown> & {
    "@context": string;
    "@type": "https://tap.rsvp/schema/1.0#Agent";
    "@id": DID;
    role?: string;
    for?: DID;
  };
  attachments?: [CACAOAttachment];
}

// Policy Messages

interface UpdatePoliciesMessage extends DIDCommMessage {
  type: "https://tap.rsvp/schema/1.0#UpdatePolicies";
  body: {
    "@context": string;
    "@type": "https://tap.rsvp/schema/1.0#UpdatePolicies";
    policies: Policy[];
  };
}

// Union type for all TAP messages
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
  | UpdatePoliciesMessage;

// Export all types
export type {
  DID,
  IRI,
  ISO8601DateTime,
  CAIP19,
  CAIP220,
  LEICode,
  ISO20022PurposeCode,
  ISO20022CategoryPurposeCode,
  DIDCommMessage,
  Party,
  Agent,
  RequirePresentation,
  RequirePurpose,
  Policy,
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
  TAPMessage,
};
