/**
 * @fileoverview Tests for TAP Message Validation using Zod v4
 * 
 * These tests verify that the Zod validation schemas correctly validate and reject
 * TAP messages according to the protocol specifications.
 */

import { describe, it, expect } from 'vitest';
import {
  // Fundamental validators
  DIDSchema,
  IRISchema,
  TAPContextSchema,
  TAPTypeSchema,
  ISO8601DateTimeSchema,
  UUIDSchema,
  CAIP2Schema,
  CAIP10Schema,
  CAIP19Schema,
  PayToURISchema,
  SettlementAddressSchema,
  AmountSchema,
  CurrencyCodeSchema,
  PurposeCodeSchema,
  CategoryPurposeCodeSchema,
  AssetSchema,
  
  // Participant validators
  ParticipantSchema,
  PersonSchema,
  OrganizationSchema,
  PartySchema,
  AgentSchema,
  
  // Message validators
  TransferSchema,
  PaymentSchema,
  ExchangeSchema,
  QuoteSchema,
  EscrowSchema,
  CaptureSchema,
  AuthorizeSchema,
  ConnectSchema,
  SettleSchema,
  RejectSchema,
  CancelSchema,
  RevertSchema,
  
  // DIDComm wrapped validators
  TransferMessageSchema,
  PaymentMessageSchema,
  ExchangeMessageSchema,
  QuoteMessageSchema,
  EscrowMessageSchema,
  CaptureMessageSchema,
  AuthorizeMessageSchema,
  ConnectMessageSchema,
  SettleMessageSchema,
  RejectMessageSchema,
  CancelMessageSchema,
  RevertMessageSchema,
  TAPMessageSchema,
  
  // Validation functions
  validateTAPMessage,
  parseTAPMessage,
  isTAPMessage,
  validateTransferMessage,
  validatePaymentMessage,
  validateExchangeMessage,
  validateQuoteMessage,
  validateEscrowMessage,
  validateCaptureMessage,
  validateAuthorizeMessage,
  validateConnectMessage,
  validateSettleMessage,
  validateRejectMessage,
  validateCancelMessage,
  validateRevertMessage
} from './validator';

describe('Fundamental Validators', () => {
  describe('DIDSchema', () => {
    it('should validate valid DIDs', () => {
      expect(DIDSchema.safeParse('did:web:example.com').success).toBe(true);
      expect(DIDSchema.safeParse('did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK').success).toBe(true);
      expect(DIDSchema.safeParse('did:example:123456789abcdefg').success).toBe(true);
    });

    it('should reject invalid DIDs', () => {
      expect(DIDSchema.safeParse('not-a-did').success).toBe(false);
      expect(DIDSchema.safeParse('did:').success).toBe(false);
      expect(DIDSchema.safeParse('did:web:').success).toBe(false);
      expect(DIDSchema.safeParse('').success).toBe(false);
    });
  });

  describe('IRISchema', () => {
    it('should validate valid IRIs', () => {
      expect(IRISchema.safeParse('https://tap.rsvp/schema/1.0').success).toBe(true);
      expect(IRISchema.safeParse('mailto:test@example.com').success).toBe(true);
      expect(IRISchema.safeParse('urn:example:resource').success).toBe(true);
    });

    it('should reject invalid IRIs', () => {
      expect(IRISchema.safeParse('not-an-iri').success).toBe(false);
      expect(IRISchema.safeParse('').success).toBe(false);
      expect(IRISchema.safeParse('123:invalid').success).toBe(false);
    });
  });

  describe('UUIDSchema', () => {
    it('should validate valid UUIDs', () => {
      expect(UUIDSchema.safeParse('123e4567-e89b-42d3-a456-426614174000').success).toBe(true);
      expect(UUIDSchema.safeParse('01234567-89ab-4def-a123-456789abcdef').success).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(UUIDSchema.safeParse('not-a-uuid').success).toBe(false);
      expect(UUIDSchema.safeParse('123456').success).toBe(false);
      expect(UUIDSchema.safeParse('').success).toBe(false);
    });
  });

  describe('CAIP10Schema', () => {
    it('should validate valid CAIP-10 addresses', () => {
      expect(CAIP10Schema.safeParse('eip155:1:0x742d35Cc6234C4532BC44b7532C4524532BC44b7').success).toBe(true);
      expect(CAIP10Schema.safeParse('bip122:000000000019d6689c085ae165831e93:1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2').success).toBe(true);
      expect(CAIP10Schema.safeParse('cosmos:cosmoshub-3:cosmos1t2uflqwqe0fsj0shcfkrvpukewcw40yjj6hdc0').success).toBe(true);
    });

    it('should reject invalid CAIP-10 addresses', () => {
      expect(CAIP10Schema.safeParse('eip155:1').success).toBe(false);
      expect(CAIP10Schema.safeParse('invalid-address').success).toBe(false);
      expect(CAIP10Schema.safeParse('').success).toBe(false);
    });
  });

  describe('CAIP19Schema', () => {
    it('should validate valid CAIP-19 asset IDs', () => {
      expect(CAIP19Schema.safeParse('eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f').success).toBe(true);
      expect(CAIP19Schema.safeParse('bip122:000000000019d6689c085ae165831e93/slip44:0').success).toBe(true);
    });

    it('should reject invalid CAIP-19 asset IDs', () => {
      expect(CAIP19Schema.safeParse('eip155:1').success).toBe(false);
      expect(CAIP19Schema.safeParse('invalid-asset').success).toBe(false);
      expect(CAIP19Schema.safeParse('').success).toBe(false);
    });
  });

  describe('PayToURISchema', () => {
    it('should validate valid PayTo URIs', () => {
      expect(PayToURISchema.safeParse('payto://iban/DE75512108001245126199').success).toBe(true);
      expect(PayToURISchema.safeParse('payto://sepa/DE75512108001245126199').success).toBe(true);
      expect(PayToURISchema.safeParse('payto://ach/123456789/987654321').success).toBe(true);
    });

    it('should reject invalid PayTo URIs', () => {
      expect(PayToURISchema.safeParse('not-payto-uri').success).toBe(false);
      expect(PayToURISchema.safeParse('payto://').success).toBe(false);
      expect(PayToURISchema.safeParse('').success).toBe(false);
    });
  });

  describe('AmountSchema', () => {
    it('should validate valid amounts', () => {
      expect(AmountSchema.safeParse('100').success).toBe(true);
      expect(AmountSchema.safeParse('100.50').success).toBe(true);
      expect(AmountSchema.safeParse('0.01').success).toBe(true);
      expect(AmountSchema.safeParse('1000000').success).toBe(true);
    });

    it('should reject invalid amounts', () => {
      expect(AmountSchema.safeParse('abc').success).toBe(false);
      expect(AmountSchema.safeParse('100.').success).toBe(false);
      expect(AmountSchema.safeParse('.50').success).toBe(false);
      expect(AmountSchema.safeParse('').success).toBe(false);
    });
  });

  describe('CurrencyCodeSchema', () => {
    it('should validate valid ISO 4217 currency codes', () => {
      expect(CurrencyCodeSchema.safeParse('USD').success).toBe(true);
      expect(CurrencyCodeSchema.safeParse('EUR').success).toBe(true);
      expect(CurrencyCodeSchema.safeParse('GBP').success).toBe(true);
      expect(CurrencyCodeSchema.safeParse('JPY').success).toBe(true);
      expect(CurrencyCodeSchema.safeParse('AED').success).toBe(true);
      expect(CurrencyCodeSchema.safeParse('ZWL').success).toBe(true);
    });

    it('should reject invalid currency codes', () => {
      expect(CurrencyCodeSchema.safeParse('usd').success).toBe(false);
      expect(CurrencyCodeSchema.safeParse('US').success).toBe(false);
      expect(CurrencyCodeSchema.safeParse('USDT').success).toBe(false);
      expect(CurrencyCodeSchema.safeParse('FAKE').success).toBe(false);
      expect(CurrencyCodeSchema.safeParse('').success).toBe(false);
    });
  });

  describe('PurposeCodeSchema', () => {
    it('should validate valid ISO 20022 purpose codes', () => {
      expect(PurposeCodeSchema.safeParse('SALA').success).toBe(true); // Salary payment
      expect(PurposeCodeSchema.safeParse('TRAD').success).toBe(true); // Trade services
      expect(PurposeCodeSchema.safeParse('RENT').success).toBe(true); // Rent payment
      expect(PurposeCodeSchema.safeParse('INTC').success).toBe(true); // Intra-company payment
      expect(PurposeCodeSchema.safeParse('SUPP').success).toBe(true); // Supplier payment
    });

    it('should reject invalid purpose codes', () => {
      expect(PurposeCodeSchema.safeParse('sala').success).toBe(false); // lowercase
      expect(PurposeCodeSchema.safeParse('INVALID').success).toBe(false); // not in enum
      expect(PurposeCodeSchema.safeParse('TEST').success).toBe(false); // not in enum
      expect(PurposeCodeSchema.safeParse('').success).toBe(false); // empty
    });
  });

  describe('CategoryPurposeCodeSchema', () => {
    it('should validate valid ISO 20022 category purpose codes', () => {
      expect(CategoryPurposeCodeSchema.safeParse('SALA').success).toBe(true); // Salary
      expect(CategoryPurposeCodeSchema.safeParse('TRAD').success).toBe(true); // Trade
      expect(CategoryPurposeCodeSchema.safeParse('SUPP').success).toBe(true); // Supplier
      expect(CategoryPurposeCodeSchema.safeParse('TAXS').success).toBe(true); // Tax
    });

    it('should reject invalid category purpose codes', () => {
      expect(CategoryPurposeCodeSchema.safeParse('sala').success).toBe(false); // lowercase
      expect(CategoryPurposeCodeSchema.safeParse('INVALID').success).toBe(false); // not in enum  
      expect(CategoryPurposeCodeSchema.safeParse('').success).toBe(false); // empty
    });
  });
});

describe('Participant Validators', () => {
  describe('ParticipantSchema', () => {
    it('should validate valid participants', () => {
      const participant = {
        "@id": "did:example:alice",
        name: "Alice Smith",
        email: "alice@example.com"
      };
      expect(ParticipantSchema.safeParse(participant).success).toBe(true);
    });

    it('should require @id and name', () => {
      expect(ParticipantSchema.safeParse({ name: "Alice" }).success).toBe(false);
      expect(ParticipantSchema.safeParse({ "@id": "did:example:alice" }).success).toBe(false);
    });
  });

  describe('PersonSchema', () => {
    it('should validate valid persons', () => {
      const person = {
        "@id": "did:example:alice",
        "@type": "https://schema.org/Person",
        name: "Alice Smith",
        givenName: "Alice",
        familyName: "Smith"
      };
      expect(PersonSchema.safeParse(person).success).toBe(true);
    });
  });

  describe('OrganizationSchema', () => {
    it('should validate valid organizations', () => {
      const organization = {
        "@id": "did:web:example.com",
        "@type": "https://schema.org/Organization",
        name: "Example Corp",
        legalName: "Example Corporation",
        url: "https://example.com"
      };
      expect(OrganizationSchema.safeParse(organization).success).toBe(true);
    });
  });

  describe('AgentSchema', () => {
    it('should validate valid agents', () => {
      const agent = {
        "@id": "did:example:agent",
        for: "did:example:alice",
        name: "Wallet Service",
        role: "WalletProvider"
      };
      expect(AgentSchema.safeParse(agent).success).toBe(true);
    });

    it('should require @id and for fields', () => {
      expect(AgentSchema.safeParse({ name: "Agent" }).success).toBe(false);
      expect(AgentSchema.safeParse({ "@id": "did:example:agent" }).success).toBe(false);
    });
  });
});

describe('TAP Message Validators', () => {
  const validAgent = {
    "@id": "did:example:agent",
    for: "did:example:alice",
    name: "Test Agent"
  };

  const validPerson = {
    "@id": "did:example:alice",
    name: "Alice Smith"
  };

  describe('TransferSchema', () => {
    it('should validate valid transfer messages', () => {
      const transfer = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Transfer",
        asset: "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f",
        amount: "100.00",
        originator: validPerson,
        beneficiary: validPerson,
        agents: [validAgent],
        purposeCode: "TRAD"
      };
      expect(TransferSchema.safeParse(transfer).success).toBe(true);
    });

    it('should reject transfer with invalid purpose code', () => {
      const transfer = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Transfer",
        asset: "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f",
        amount: "100.00",
        originator: validPerson,
        beneficiary: validPerson,
        agents: [validAgent],
        purposeCode: "INVALID"
      };
      expect(TransferSchema.safeParse(transfer).success).toBe(false);
    });

    it('should require required fields', () => {
      const transfer = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Transfer"
      };
      expect(TransferSchema.safeParse(transfer).success).toBe(false);
    });
  });

  describe('PaymentSchema', () => {
    it('should validate payment with asset', () => {
      const payment = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Payment",
        amount: "50.00",
        asset: "USD",
        payer: validPerson,
        payee: validPerson,
        agents: [validAgent]
      };
      expect(PaymentSchema.safeParse(payment).success).toBe(true);
    });

    it('should validate payment with currency', () => {
      const payment = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Payment",
        amount: "50.00",
        currency: "USD",
        payer: validPerson,
        payee: validPerson,
        agents: [validAgent],
        purposeCode: "SALA"
      };
      expect(PaymentSchema.safeParse(payment).success).toBe(true);
    });

    it('should reject payment with invalid purpose code', () => {
      const payment = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Payment",
        amount: "50.00",
        currency: "USD",
        payer: validPerson,
        payee: validPerson,
        agents: [validAgent],
        purposeCode: "BADCODE"
      };
      expect(PaymentSchema.safeParse(payment).success).toBe(false);
    });

    it('should require either asset or currency', () => {
      const payment = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Payment",
        amount: "50.00",
        payer: validPerson,
        payee: validPerson,
        agents: [validAgent]
      };
      expect(PaymentSchema.safeParse(payment).success).toBe(false);
    });
  });

  describe('ExchangeSchema', () => {
    it('should validate exchange with fromAmount', () => {
      const exchange = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Exchange",
        fromAssets: ["USD"],
        toAssets: ["eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
        fromAmount: "1000.00",
        requester: validPerson,
        agents: [validAgent]
      };
      expect(ExchangeSchema.safeParse(exchange).success).toBe(true);
    });

    it('should validate exchange with toAmount', () => {
      const exchange = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Exchange",
        fromAssets: ["USD"],
        toAssets: ["EUR"],
        toAmount: "900.00",
        requester: validPerson,
        provider: validPerson,
        agents: [validAgent]
      };
      expect(ExchangeSchema.safeParse(exchange).success).toBe(true);
    });

    it('should validate exchange with multiple assets', () => {
      const exchange = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Exchange",
        fromAssets: ["USD", "EUR"],
        toAssets: ["eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f"],
        fromAmount: "1000.00",
        requester: validPerson,
        agents: [validAgent]
      };
      expect(ExchangeSchema.safeParse(exchange).success).toBe(true);
    });

    it('should require either fromAmount or toAmount', () => {
      const exchange = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Exchange",
        fromAssets: ["USD"],
        toAssets: ["EUR"],
        requester: validPerson,
        agents: [validAgent]
      };
      expect(ExchangeSchema.safeParse(exchange).success).toBe(false);
    });

    it('should require at least one fromAsset and toAsset', () => {
      const exchange = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Exchange",
        fromAssets: [],
        toAssets: ["EUR"],
        fromAmount: "1000.00",
        requester: validPerson,
        agents: [validAgent]
      };
      expect(ExchangeSchema.safeParse(exchange).success).toBe(false);
    });
  });

  describe('QuoteSchema', () => {
    it('should validate valid quote messages', () => {
      const quote = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Quote",
        fromAsset: "USD",
        toAsset: "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        fromAmount: "1000.00",
        toAmount: "996.00",
        provider: validPerson,
        agents: [validAgent],
        expiresAt: "2025-07-21T00:00:00Z"
      };
      expect(QuoteSchema.safeParse(quote).success).toBe(true);
    });

    it('should require all required fields', () => {
      const quote = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Quote",
        fromAsset: "USD",
        toAsset: "EUR"
      };
      expect(QuoteSchema.safeParse(quote).success).toBe(false);
    });
  });

  describe('EscrowSchema', () => {
    it('should validate escrow with asset', () => {
      const escrow = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Escrow",
        asset: "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        amount: "1000.00",
        originator: validPerson,
        beneficiary: validPerson,
        expiry: "2025-07-21T01:00:00Z",
        agents: [validAgent]
      };
      expect(EscrowSchema.safeParse(escrow).success).toBe(true);
    });

    it('should validate escrow with currency', () => {
      const escrow = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Escrow",
        currency: "USD",
        amount: "1000.00",
        originator: validPerson,
        beneficiary: validPerson,
        expiry: "2025-07-21T01:00:00Z",
        agreement: "https://example.com/escrow-terms",
        agents: [validAgent]
      };
      expect(EscrowSchema.safeParse(escrow).success).toBe(true);
    });

    it('should require either asset or currency', () => {
      const escrow = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Escrow",
        amount: "1000.00",
        originator: validPerson,
        beneficiary: validPerson,
        expiry: "2025-07-21T01:00:00Z",
        agents: [validAgent]
      };
      expect(EscrowSchema.safeParse(escrow).success).toBe(false);
    });

    it('should require all required fields', () => {
      const escrow = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Escrow",
        asset: "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      };
      expect(EscrowSchema.safeParse(escrow).success).toBe(false);
    });
  });

  describe('CaptureSchema', () => {
    it('should validate capture with all optional fields', () => {
      const capture = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Capture",
        amount: "500.00",
        settlementAddress: "eip155:1:0xabcdef0123456789abcdef0123456789abcdef01"
      };
      expect(CaptureSchema.safeParse(capture).success).toBe(true);
    });

    it('should validate capture with no optional fields', () => {
      const capture = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Capture"
      };
      expect(CaptureSchema.safeParse(capture).success).toBe(true);
    });

    it('should validate capture with PayTo URI settlement address', () => {
      const capture = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Capture",
        amount: "500.00",
        settlementAddress: "payto://iban/DE75512108001245126199"
      };
      expect(CaptureSchema.safeParse(capture).success).toBe(true);
    });
  });

  describe('AuthorizeSchema', () => {
    it('should validate valid authorization', () => {
      const authorize = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Authorize",
        decision: "approve"
      };
      expect(AuthorizeSchema.safeParse(authorize).success).toBe(true);
    });

    it('should validate deny decision', () => {
      const authorize = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Authorize",
        decision: "deny",
        reason: "Compliance check failed"
      };
      expect(AuthorizeSchema.safeParse(authorize).success).toBe(true);
    });

    it('should reject invalid decisions', () => {
      const authorize = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Authorize",
        decision: "maybe"
      };
      expect(AuthorizeSchema.safeParse(authorize).success).toBe(false);
    });
  });

  describe('SettleSchema', () => {
    it('should validate valid settlement', () => {
      const settle = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Settle",
        txHash: "0x1234567890abcdef1234567890abcdef12345678"
      };
      expect(SettleSchema.safeParse(settle).success).toBe(true);
    });

    it('should require txHash', () => {
      const settle = {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Settle"
      };
      expect(SettleSchema.safeParse(settle).success).toBe(false);
    });
  });
});

describe('DIDComm Message Validators', () => {
  const validTransferBody = {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "Transfer",
    asset: "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f",
    amount: "100.00",
    originator: { "@id": "did:example:alice", name: "Alice" },
    beneficiary: { "@id": "did:example:bob", name: "Bob" },
    agents: [{ "@id": "did:example:agent", for: "did:example:alice", name: "Agent" }]
  };

  const validExchangeBody = {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "Exchange",
    fromAssets: ["USD"],
    toAssets: ["EUR"],
    fromAmount: "1000.00",
    requester: { "@id": "did:example:alice", name: "Alice" },
    agents: [{ "@id": "did:example:agent", for: "did:example:alice", name: "Agent" }]
  };

  const validQuoteBody = {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "Quote",
    fromAsset: "USD",
    toAsset: "EUR",
    fromAmount: "1000.00",
    toAmount: "900.00",
    provider: { "@id": "did:example:provider", name: "Provider" },
    agents: [{ "@id": "did:example:agent", for: "did:example:provider", name: "Agent" }],
    expiresAt: "2025-07-21T00:00:00Z"
  };

  const validEscrowBody = {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "Escrow",
    asset: "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    amount: "1000.00",
    originator: { "@id": "did:example:alice", name: "Alice" },
    beneficiary: { "@id": "did:example:bob", name: "Bob" },
    expiry: "2025-07-21T01:00:00Z",
    agents: [{ "@id": "did:example:agent", for: "did:example:alice", name: "Agent" }]
  };

  const validCaptureBody = {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "Capture",
    amount: "500.00",
    settlementAddress: "eip155:1:0xabcdef0123456789abcdef0123456789abcdef01"
  };

  describe('TransferMessageSchema', () => {
    it('should validate valid transfer messages', () => {
      const message = {
        id: "01234567-89ab-4def-a123-456789abcdef",
        type: "https://tap.rsvp/schema/1.0#Transfer",
        from: "did:example:sender",
        to: ["did:example:receiver"],
        created_time: Date.now(),
        body: validTransferBody
      };
      expect(TransferMessageSchema.safeParse(message).success).toBe(true);
    });

    it('should reject wrong message type', () => {
      const message = {
        id: "01234567-89ab-4def-a123-456789abcdef",
        type: "https://tap.rsvp/schema/1.0#Payment",
        from: "did:example:sender",
        to: ["did:example:receiver"],
        created_time: Date.now(),
        body: validTransferBody
      };
      expect(TransferMessageSchema.safeParse(message).success).toBe(false);
    });
  });

  describe('ExchangeMessageSchema', () => {
    it('should validate valid exchange messages', () => {
      const message = {
        id: "01234567-89ab-4def-a123-456789abcdef",
        type: "https://tap.rsvp/schema/1.0#Exchange",
        from: "did:example:sender",
        to: ["did:example:receiver"],
        created_time: Date.now(),
        body: validExchangeBody
      };
      expect(ExchangeMessageSchema.safeParse(message).success).toBe(true);
    });

    it('should reject wrong message type', () => {
      const message = {
        id: "01234567-89ab-4def-a123-456789abcdef",
        type: "https://tap.rsvp/schema/1.0#Transfer",
        from: "did:example:sender",
        to: ["did:example:receiver"],
        created_time: Date.now(),
        body: validExchangeBody
      };
      expect(ExchangeMessageSchema.safeParse(message).success).toBe(false);
    });
  });

  describe('QuoteMessageSchema', () => {
    it('should validate quote replies with thid', () => {
      const message = {
        id: "01234567-89ab-4def-a123-456789abcdef",
        type: "https://tap.rsvp/schema/1.0#Quote",
        from: "did:example:provider",
        to: ["did:example:requester"],
        thid: "12345678-9abc-4def-a123-456789abcdef",
        created_time: Date.now(),
        body: validQuoteBody
      };
      expect(QuoteMessageSchema.safeParse(message).success).toBe(true);
    });

    it('should require thid for quote reply messages', () => {
      const message = {
        id: "01234567-89ab-4def-a123-456789abcdef",
        type: "https://tap.rsvp/schema/1.0#Quote",
        from: "did:example:provider",
        to: ["did:example:requester"],
        created_time: Date.now(),
        body: validQuoteBody
      };
      expect(QuoteMessageSchema.safeParse(message).success).toBe(false);
    });
  });

  describe('EscrowMessageSchema', () => {
    it('should validate valid escrow messages', () => {
      const message = {
        id: "01234567-89ab-4def-a123-456789abcdef",
        type: "https://tap.rsvp/schema/1.0#Escrow",
        from: "did:example:sender",
        to: ["did:example:receiver"],
        created_time: Date.now(),
        body: validEscrowBody
      };
      expect(EscrowMessageSchema.safeParse(message).success).toBe(true);
    });

    it('should reject wrong message type', () => {
      const message = {
        id: "01234567-89ab-4def-a123-456789abcdef",
        type: "https://tap.rsvp/schema/1.0#Transfer",
        from: "did:example:sender",
        to: ["did:example:receiver"],
        created_time: Date.now(),
        body: validEscrowBody
      };
      expect(EscrowMessageSchema.safeParse(message).success).toBe(false);
    });
  });

  describe('CaptureMessageSchema', () => {
    it('should validate capture replies with thid', () => {
      const message = {
        id: "01234567-89ab-4def-a123-456789abcdef",
        type: "https://tap.rsvp/schema/1.0#Capture",
        from: "did:example:releaser",
        to: ["did:example:originator"],
        thid: "12345678-9abc-4def-a123-456789abcdef",
        created_time: Date.now(),
        body: validCaptureBody
      };
      expect(CaptureMessageSchema.safeParse(message).success).toBe(true);
    });

    it('should require thid for capture reply messages', () => {
      const message = {
        id: "01234567-89ab-4def-a123-456789abcdef",
        type: "https://tap.rsvp/schema/1.0#Capture",
        from: "did:example:releaser",
        to: ["did:example:originator"],
        created_time: Date.now(),
        body: validCaptureBody
      };
      expect(CaptureMessageSchema.safeParse(message).success).toBe(false);
    });
  });

  describe('AuthorizeMessageSchema', () => {
    it('should validate authorization replies with thid', () => {
      const message = {
        id: "01234567-89ab-4def-a123-456789abcdef",
        type: "https://tap.rsvp/schema/1.0#Authorize",
        from: "did:example:authorizer",
        to: ["did:example:sender"],
        thid: "12345678-9abc-4def-a123-456789abcdef",
        created_time: Date.now(),
        body: {
          "@context": "https://tap.rsvp/schema/1.0",
          "@type": "Authorize",
          decision: "approve"
        }
      };
      expect(AuthorizeMessageSchema.safeParse(message).success).toBe(true);
    });

    it('should require thid for reply messages', () => {
      const message = {
        id: "01234567-89ab-4def-a123-456789abcdef",
        type: "https://tap.rsvp/schema/1.0#Authorize",
        from: "did:example:authorizer",
        to: ["did:example:sender"],
        created_time: Date.now(),
        body: {
          "@context": "https://tap.rsvp/schema/1.0",
          "@type": "Authorize",
          decision: "approve"
        }
      };
      expect(AuthorizeMessageSchema.safeParse(message).success).toBe(false);
    });
  });
});

describe('TAPMessageSchema (Discriminated Union)', () => {
  it('should validate different message types', () => {
    const transferMessage = {
      id: "01234567-89ab-4def-a123-456789abcdef",
      type: "https://tap.rsvp/schema/1.0#Transfer",
      from: "did:example:sender",
      to: ["did:example:receiver"],
      created_time: Date.now(),
      body: {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Transfer",
        asset: "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f",
        amount: "100.00",
        originator: { "@id": "did:example:alice", name: "Alice" },
        beneficiary: { "@id": "did:example:bob", name: "Bob" },
        agents: [{ "@id": "did:example:agent", for: "did:example:alice", name: "Agent" }]
      }
    };

    const exchangeMessage = {
      id: "12345678-9abc-4def-a123-456789abcdef",
      type: "https://tap.rsvp/schema/1.0#Exchange",
      from: "did:example:requester",
      to: ["did:example:provider"],
      created_time: Date.now(),
      body: {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Exchange",
        fromAssets: ["USD"],
        toAssets: ["EUR"],
        fromAmount: "1000.00",
        requester: { "@id": "did:example:alice", name: "Alice" },
        agents: [{ "@id": "did:example:agent", for: "did:example:alice", name: "Agent" }]
      }
    };

    const escrowMessage = {
      id: "23456789-abcd-4ef0-a123-456789abcdef",
      type: "https://tap.rsvp/schema/1.0#Escrow",
      from: "did:example:originator",
      to: ["did:example:beneficiary"],
      created_time: Date.now(),
      body: {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Escrow",
        asset: "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        amount: "1000.00",
        originator: { "@id": "did:example:alice", name: "Alice" },
        beneficiary: { "@id": "did:example:bob", name: "Bob" },
        expiry: "2025-07-21T01:00:00Z",
        agents: [{ "@id": "did:example:agent", for: "did:example:alice", name: "Agent" }]
      }
    };

    const authorizeMessage = {
      id: "34567890-bcde-4f01-a123-456789abcdef",
      type: "https://tap.rsvp/schema/1.0#Authorize",
      from: "did:example:authorizer",
      to: ["did:example:sender"],
      thid: "87654321-dcba-4fed-a321-fedcba987654",
      created_time: Date.now(),
      body: {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Authorize",
        decision: "approve"
      }
    };

    expect(TAPMessageSchema.safeParse(transferMessage).success).toBe(true);
    expect(TAPMessageSchema.safeParse(exchangeMessage).success).toBe(true);
    expect(TAPMessageSchema.safeParse(escrowMessage).success).toBe(true);
    expect(TAPMessageSchema.safeParse(authorizeMessage).success).toBe(true);
  });

  it('should validate quote and capture reply messages', () => {
    const quoteMessage = {
      id: "45678901-cdef-4012-a123-456789abcdef",
      type: "https://tap.rsvp/schema/1.0#Quote",
      from: "did:example:provider",
      to: ["did:example:requester"],
      thid: "12345678-9abc-4def-a123-456789abcdef",
      created_time: Date.now(),
      body: {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Quote",
        fromAsset: "USD",
        toAsset: "EUR",
        fromAmount: "1000.00",
        toAmount: "900.00",
        provider: { "@id": "did:example:provider", name: "Provider" },
        agents: [{ "@id": "did:example:agent", for: "did:example:provider", name: "Agent" }],
        expiresAt: "2025-07-21T00:00:00Z"
      }
    };

    const captureMessage = {
      id: "56789012-def0-4123-a123-456789abcdef",
      type: "https://tap.rsvp/schema/1.0#Capture",
      from: "did:example:releaser",
      to: ["did:example:originator"],
      thid: "23456789-abcd-4ef0-a123-456789abcdef",
      created_time: Date.now(),
      body: {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Capture",
        amount: "500.00",
        settlementAddress: "eip155:1:0xabcdef0123456789abcdef0123456789abcdef01"
      }
    };

    expect(TAPMessageSchema.safeParse(quoteMessage).success).toBe(true);
    expect(TAPMessageSchema.safeParse(captureMessage).success).toBe(true);
  });
});

describe('Validation Functions', () => {
  const validMessage = {
    id: "01234567-89ab-4def-a123-456789abcdef",
    type: "https://tap.rsvp/schema/1.0#Transfer",
    from: "did:example:sender",
    to: ["did:example:receiver"],
    created_time: Date.now(),
    body: {
      "@context": "https://tap.rsvp/schema/1.0",
      "@type": "Transfer",
      asset: "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f",
      amount: "100.00",
      originator: { "@id": "did:example:alice", name: "Alice" },
      beneficiary: { "@id": "did:example:bob", name: "Bob" },
      agents: [{ "@id": "did:example:agent", for: "did:example:alice", name: "Agent" }]
    }
  };

  describe('validateTAPMessage', () => {
    it('should return success for valid messages', () => {
      const result = validateTAPMessage(validMessage);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe("https://tap.rsvp/schema/1.0#Transfer");
      }
    });

    it('should return error for invalid messages', () => {
      const result = validateTAPMessage({ invalid: "message" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe('parseTAPMessage', () => {
    it('should parse valid messages', () => {
      const parsed = parseTAPMessage(validMessage);
      expect(parsed.type).toBe("https://tap.rsvp/schema/1.0#Transfer");
    });

    it('should throw for invalid messages', () => {
      expect(() => parseTAPMessage({ invalid: "message" })).toThrow();
    });
  });

  describe('isTAPMessage', () => {
    it('should return true for valid messages', () => {
      expect(isTAPMessage(validMessage)).toBe(true);
    });

    it('should return false for invalid messages', () => {
      expect(isTAPMessage({ invalid: "message" })).toBe(false);
      expect(isTAPMessage(null)).toBe(false);
      expect(isTAPMessage(undefined)).toBe(false);
    });
  });

  describe('Message-specific validators', () => {
    const validExchangeMessage = {
      id: "12345678-9abc-4def-a123-456789abcdef",
      type: "https://tap.rsvp/schema/1.0#Exchange",
      from: "did:example:requester",
      to: ["did:example:provider"],
      created_time: Date.now(),
      body: {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Exchange",
        fromAssets: ["USD"],
        toAssets: ["EUR"],
        fromAmount: "1000.00",
        requester: { "@id": "did:example:alice", name: "Alice" },
        agents: [{ "@id": "did:example:agent", for: "did:example:alice", name: "Agent" }]
      }
    };

    const validQuoteMessage = {
      id: "23456789-abcd-4ef0-a123-456789abcdef",
      type: "https://tap.rsvp/schema/1.0#Quote",
      from: "did:example:provider",
      to: ["did:example:requester"],
      thid: "12345678-9abc-4def-a123-456789abcdef",
      created_time: Date.now(),
      body: {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Quote",
        fromAsset: "USD",
        toAsset: "EUR",
        fromAmount: "1000.00",
        toAmount: "900.00",
        provider: { "@id": "did:example:provider", name: "Provider" },
        agents: [{ "@id": "did:example:agent", for: "did:example:provider", name: "Agent" }],
        expiresAt: "2025-07-21T00:00:00Z"
      }
    };

    const validEscrowMessage = {
      id: "34567890-bcde-4f01-a123-456789abcdef",
      type: "https://tap.rsvp/schema/1.0#Escrow",
      from: "did:example:originator",
      to: ["did:example:beneficiary"],
      created_time: Date.now(),
      body: {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Escrow",
        asset: "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        amount: "1000.00",
        originator: { "@id": "did:example:alice", name: "Alice" },
        beneficiary: { "@id": "did:example:bob", name: "Bob" },
        expiry: "2025-07-21T01:00:00Z",
        agents: [{ "@id": "did:example:agent", for: "did:example:alice", name: "Agent" }]
      }
    };

    const validCaptureMessage = {
      id: "45678901-cdef-4012-a123-456789abcdef",
      type: "https://tap.rsvp/schema/1.0#Capture",
      from: "did:example:releaser",
      to: ["did:example:originator"],
      thid: "34567890-bcde-4f01-a123-456789abcdef",
      created_time: Date.now(),
      body: {
        "@context": "https://tap.rsvp/schema/1.0",
        "@type": "Capture",
        amount: "500.00",
        settlementAddress: "eip155:1:0xabcdef0123456789abcdef0123456789abcdef01"
      }
    };

    it('should validate transfer messages', () => {
      const result = validateTransferMessage(validMessage);
      expect(result.success).toBe(true);
    });

    it('should validate exchange messages', () => {
      const result = validateExchangeMessage(validExchangeMessage);
      expect(result.success).toBe(true);
    });

    it('should validate quote messages', () => {
      const result = validateQuoteMessage(validQuoteMessage);
      expect(result.success).toBe(true);
    });

    it('should validate escrow messages', () => {
      const result = validateEscrowMessage(validEscrowMessage);
      expect(result.success).toBe(true);
    });

    it('should validate capture messages', () => {
      const result = validateCaptureMessage(validCaptureMessage);
      expect(result.success).toBe(true);
    });

    it('should reject non-transfer messages for transfer validator', () => {
      const authMessage = { ...validMessage, type: "https://tap.rsvp/schema/1.0#Authorize" };
      const result = validateTransferMessage(authMessage);
      expect(result.success).toBe(false);
    });

    it('should reject non-exchange messages for exchange validator', () => {
      const result = validateExchangeMessage(validMessage);
      expect(result.success).toBe(false);
    });

    it('should reject non-quote messages for quote validator', () => {
      const result = validateQuoteMessage(validMessage);
      expect(result.success).toBe(false);
    });

    it('should reject non-escrow messages for escrow validator', () => {
      const result = validateEscrowMessage(validMessage);
      expect(result.success).toBe(false);
    });

    it('should reject non-capture messages for capture validator', () => {
      const result = validateCaptureMessage(validMessage);
      expect(result.success).toBe(false);
    });
  });
});

describe('Edge Cases and Error Handling', () => {
  it('should handle null and undefined inputs', () => {
    expect(validateTAPMessage(null).success).toBe(false);
    expect(validateTAPMessage(undefined).success).toBe(false);
    expect(isTAPMessage(null)).toBe(false);
    expect(isTAPMessage(undefined)).toBe(false);
  });

  it('should handle empty objects', () => {
    expect(validateTAPMessage({}).success).toBe(false);
    expect(isTAPMessage({})).toBe(false);
  });

  it('should handle malformed JSON-like objects', () => {
    expect(validateTAPMessage({ randomField: "value" }).success).toBe(false);
    expect(isTAPMessage({ randomField: "value" })).toBe(false);
  });

  it('should provide detailed error messages', () => {
    const result = validateTAPMessage({ type: "invalid" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toBeDefined();
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
});