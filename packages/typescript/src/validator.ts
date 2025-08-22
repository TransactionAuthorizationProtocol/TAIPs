/**
 * @fileoverview TAP Message Validation using Zod v4
 * 
 * This module provides Zod schema definitions for validating TAP (Transaction Authorization Protocol) messages.
 * It ensures type safety and runtime validation of all TAP message types.
 * 
 * @see {@link https://github.com/colinhacks/zod | Zod Documentation}
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs | TAP Specifications}
 * @version 1.0.0
 */

import { z } from 'zod';

// ============================================================================
// FUNDAMENTAL VALIDATORS
// ============================================================================

/** Decentralized Identifier (DID) validator */
export const DIDSchema = z.string().regex(/^did:[a-z0-9]+:[a-zA-Z0-9._%-]+$/);

/** Internationalized Resource Identifier (IRI) validator */
export const IRISchema = z.string().regex(/^[a-zA-Z][a-zA-Z0-9+.-]*:.+$/);

/** TAP Context URI validator */
export const TAPContextSchema = z.literal("https://tap.rsvp/schema/1.0");

/** TAP Type URI validator */
export const TAPTypeSchema = z.string().regex(/^https:\/\/tap\.rsvp\/schema\/1\.0#[A-Za-z]+$/);

/** ISO 8601 DateTime validator */
export const ISO8601DateTimeSchema = z.string().datetime();

/** UUID v4 validator */
export const UUIDSchema = z.string().uuid();

/** CAIP-2 Chain ID validator (namespace:reference) */
export const CAIP2Schema = z.string().regex(/^[a-z0-9]+:[a-zA-Z0-9._%-]+$/);

/** CAIP-10 Account Address validator (chain_id:account_address) */
export const CAIP10Schema = z.string().regex(/^[a-z0-9]+:[a-zA-Z0-9._%-]+:[a-zA-Z0-9._%-]+$/);

/** CAIP-19 Asset ID validator (chain_id/token_namespace:token_reference) */
export const CAIP19Schema = z.string().regex(/^[a-z0-9]+:[a-zA-Z0-9._%-]+\/[a-z0-9]+:[a-zA-Z0-9._%-]+$/);

/** PayTo URI validator for traditional banking */
export const PayToURISchema = z.string().regex(/^payto:\/\/[a-zA-Z0-9._%-]+\/[a-zA-Z0-9._%-]+/);

/** Settlement Address (union of CAIP-10 and PayTo URI) */
export const SettlementAddressSchema = z.union([CAIP10Schema, PayToURISchema]);

/** Amount as decimal string validator */
export const AmountSchema = z.string().regex(/^\d+(\.\d+)?$/);

/** ISO 4217 Currency Code validator */
export const CurrencyCodeSchema = z.string().length(3).regex(/^[A-Z]{3}$/);

/** Asset ID (union of CAIP-19 and ISO 4217 currency code) */
export const AssetSchema = z.union([CAIP19Schema, CurrencyCodeSchema]);

// ============================================================================
// JSON-LD BASE VALIDATORS
// ============================================================================

/** Base JSON-LD object validator */
export const JsonLdObjectSchema = z.object({
  "@context": z.union([IRISchema, z.record(z.string(), z.string())]).optional(),
  "@type": z.string()
});

/** TAP Message Object base validator */
export const TapMessageObjectSchema = JsonLdObjectSchema.merge(z.object({
  "@context": z.union([TAPContextSchema, z.record(z.string(), IRISchema)]),
  "@type": z.string()
}));

// ============================================================================
// PARTICIPANT VALIDATORS
// ============================================================================

/** Base Participant validator */
export const ParticipantSchema = z.object({
  "@id": DIDSchema,
  "@type": z.string().optional(),
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  url: z.string().url().optional()
});

/** Natural Person validator */
export const PersonSchema = ParticipantSchema.merge(z.object({
  "@type": z.literal("https://schema.org/Person").optional(),
  givenName: z.string().optional(),
  familyName: z.string().optional(),
  additionalName: z.string().optional(),
  birthDate: z.string().optional(),
  nationality: z.string().optional()
}));

/** Organization validator */
export const OrganizationSchema = ParticipantSchema.merge(z.object({
  "@type": z.literal("https://schema.org/Organization").optional(),
  legalName: z.string().optional(),
  taxID: z.string().optional(),
  leiCode: z.string().optional(),
  address: z.object({
    streetAddress: z.string().optional(),
    addressLocality: z.string().optional(),
    addressRegion: z.string().optional(),
    postalCode: z.string().optional(),
    addressCountry: z.string().optional()
  }).optional()
}));

/** Party (Person or Organization) validator */
export const PartySchema = z.union([PersonSchema, OrganizationSchema]);

/** Agent validator */
export const AgentSchema = OrganizationSchema.partial().merge(z.object({
  "@id": DIDSchema,
  for: DIDSchema,
  role: z.string().optional(),
  policies: z.array(z.record(z.string(), z.unknown())).optional()
}));

// ============================================================================
// DIDCOMM MESSAGE VALIDATORS
// ============================================================================

/** DIDComm Message base validator */
export const DIDCommMessageSchema = z.object({
  id: UUIDSchema,
  type: TAPTypeSchema,
  from: DIDSchema,
  to: z.array(DIDSchema),
  created_time: z.number(),
  expires_time: z.number().optional(),
  body: z.record(z.string(), z.unknown())
});

/** DIDComm Reply base validator */
export const DIDCommReplySchema = DIDCommMessageSchema.merge(z.object({
  thid: UUIDSchema
}));

// ============================================================================
// TAP MESSAGE VALIDATORS
// ============================================================================

/** Transfer message body validator */
export const TransferSchema = TapMessageObjectSchema.merge(z.object({
  "@type": z.literal("Transfer"),
  asset: CAIP19Schema,
  amount: AmountSchema,
  originator: PartySchema,
  beneficiary: PartySchema,
  agents: z.array(AgentSchema),
  settlementAddress: SettlementAddressSchema.optional(),
  purposeCode: z.string().optional(),
  reference: z.string().optional()
}));

/** Payment message body validator */
export const PaymentSchema = TapMessageObjectSchema.merge(z.object({
  "@type": z.literal("Payment"),
  amount: AmountSchema,
  asset: AssetSchema.optional(),
  currency: CurrencyCodeSchema.optional(),
  payer: PartySchema,
  payee: PartySchema,
  agents: z.array(AgentSchema),
  settlementAddress: SettlementAddressSchema.optional(),
  purposeCode: z.string().optional(),
  reference: z.string().optional(),
  invoiceId: z.string().optional()
})).refine(data => data.asset || data.currency, {
  message: "Either asset or currency must be provided"
});

/** Authorization message body validator */
export const AuthorizeSchema = TapMessageObjectSchema.merge(z.object({
  "@type": z.literal("Authorize"),
  decision: z.enum(["approve", "deny"]),
  reason: z.string().optional(),
  conditions: z.array(z.record(z.string(), z.unknown())).optional()
}));

/** Connect message body validator */
export const ConnectSchema = TapMessageObjectSchema.merge(z.object({
  "@type": z.literal("Connect"),
  agent: AgentSchema,
  capabilities: z.array(z.string()).optional(),
  protocols: z.array(z.string()).optional()
}));

/** Settle message body validator */
export const SettleSchema = TapMessageObjectSchema.merge(z.object({
  "@type": z.literal("Settle"),
  txHash: z.string(),
  blockHash: z.string().optional(),
  blockNumber: z.number().optional(),
  transactionIndex: z.number().optional(),
  gasUsed: z.string().optional(),
  effectiveGasPrice: z.string().optional()
}));

/** Reject message body validator */
export const RejectSchema = TapMessageObjectSchema.merge(z.object({
  "@type": z.literal("Reject"),
  reason: z.string(),
  code: z.string().optional()
}));

/** Cancel message body validator */
export const CancelSchema = TapMessageObjectSchema.merge(z.object({
  "@type": z.literal("Cancel"),
  reason: z.string().optional()
}));

/** Revert message body validator */
export const RevertSchema = TapMessageObjectSchema.merge(z.object({
  "@type": z.literal("Revert"),
  reason: z.string(),
  txHash: z.string().optional()
}));

// ============================================================================
// DIDCOMM WRAPPED MESSAGE VALIDATORS
// ============================================================================

/** Transfer DIDComm message validator */
export const TransferMessageSchema = DIDCommMessageSchema.merge(z.object({
  type: z.literal("https://tap.rsvp/schema/1.0#Transfer"),
  body: TransferSchema
}));

/** Payment DIDComm message validator */
export const PaymentMessageSchema = DIDCommMessageSchema.merge(z.object({
  type: z.literal("https://tap.rsvp/schema/1.0#Payment"),
  body: PaymentSchema
}));

/** Authorization DIDComm reply validator */
export const AuthorizeMessageSchema = DIDCommReplySchema.merge(z.object({
  type: z.literal("https://tap.rsvp/schema/1.0#Authorize"),
  body: AuthorizeSchema
}));

/** Connect DIDComm message validator */
export const ConnectMessageSchema = DIDCommMessageSchema.merge(z.object({
  type: z.literal("https://tap.rsvp/schema/1.0#Connect"),
  body: ConnectSchema
}));

/** Settle DIDComm reply validator */
export const SettleMessageSchema = DIDCommReplySchema.merge(z.object({
  type: z.literal("https://tap.rsvp/schema/1.0#Settle"),
  body: SettleSchema
}));

/** Reject DIDComm reply validator */
export const RejectMessageSchema = DIDCommReplySchema.merge(z.object({
  type: z.literal("https://tap.rsvp/schema/1.0#Reject"),
  body: RejectSchema
}));

/** Cancel DIDComm reply validator */
export const CancelMessageSchema = DIDCommReplySchema.merge(z.object({
  type: z.literal("https://tap.rsvp/schema/1.0#Cancel"),
  body: CancelSchema
}));

/** Revert DIDComm reply validator */
export const RevertMessageSchema = DIDCommReplySchema.merge(z.object({
  type: z.literal("https://tap.rsvp/schema/1.0#Revert"),
  body: RevertSchema
}));

// ============================================================================
// UNION VALIDATOR FOR ALL TAP MESSAGES
// ============================================================================

/** All TAP Message types validator */
export const TAPMessageSchema = z.discriminatedUnion("type", [
  TransferMessageSchema,
  PaymentMessageSchema,
  AuthorizeMessageSchema,
  ConnectMessageSchema,
  SettleMessageSchema,
  RejectMessageSchema,
  CancelMessageSchema,
  RevertMessageSchema
]);

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates a TAP message against the appropriate schema
 * @param message - The message to validate
 * @returns Validation result with parsed data or error details
 */
export function validateTAPMessage(message: unknown) {
  return TAPMessageSchema.safeParse(message);
}

/**
 * Validates and parses a TAP message, throwing on validation failure
 * @param message - The message to validate
 * @returns Parsed and validated message
 * @throws ZodError if validation fails
 */
export function parseTAPMessage(message: unknown) {
  return TAPMessageSchema.parse(message);
}

/**
 * Type guard to check if an object is a valid TAP message
 * @param message - The message to check
 * @returns True if the message is a valid TAP message
 */
export function isTAPMessage(message: unknown): boolean {
  return TAPMessageSchema.safeParse(message).success;
}

// ============================================================================
// SPECIFIC MESSAGE TYPE VALIDATORS
// ============================================================================

/** Validates Transfer messages */
export const validateTransferMessage = (message: unknown) => TransferMessageSchema.safeParse(message);

/** Validates Payment messages */
export const validatePaymentMessage = (message: unknown) => PaymentMessageSchema.safeParse(message);

/** Validates Authorization messages */
export const validateAuthorizeMessage = (message: unknown) => AuthorizeMessageSchema.safeParse(message);

/** Validates Connect messages */
export const validateConnectMessage = (message: unknown) => ConnectMessageSchema.safeParse(message);

/** Validates Settlement messages */
export const validateSettleMessage = (message: unknown) => SettleMessageSchema.safeParse(message);

/** Validates Reject messages */
export const validateRejectMessage = (message: unknown) => RejectMessageSchema.safeParse(message);

/** Validates Cancel messages */
export const validateCancelMessage = (message: unknown) => CancelMessageSchema.safeParse(message);

/** Validates Revert messages */
export const validateRevertMessage = (message: unknown) => RevertMessageSchema.safeParse(message);