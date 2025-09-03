/**
 * @fileoverview Fast-Check Arbitraries for TAP Message Types
 * 
 * This module provides fast-check arbitraries that can generate valid TAP data structures
 * for property-based testing.
 */

import * as fc from "fast-check";
import type {
  DID,
  IRI, 
  CAIP10,
  CAIP19,
  Amount,
  Participant,
  Person,
  Organization,
  Agent,
  Transfer,
  Payment,
  Exchange,
  Quote,
  Escrow,
  Capture,
  Authorize,
  Connect,
  Settle,
  Reject,
  Cancel,
  Revert,
  TransferMessage,
  PaymentMessage,
  ExchangeMessage,
  QuoteMessage,
  EscrowMessage,
  CaptureMessage,
  AuthorizeMessage,
  ConnectMessage,
  SettleMessage,
  RejectMessage,
  CancelMessage,
  RevertMessage,
  TAPMessage,
  TransactionConstraints,
} from "./tap";
import type { IsoCurrency } from "./currencies";
import * as ivms101 from 'ivms101/src/arbitraries';

// ============================================================================
// FUNDAMENTAL TYPE ARBITRARIES
// ============================================================================

export const did = (): fc.Arbitrary<DID> =>
  fc.record({
    method: fc.constantFrom("web", "key", "example", "peer", "ethr"),
    identifier: fc.string({ minLength: 10, maxLength: 50 }).filter(s => /^[a-zA-Z0-9._%-]+$/.test(s))
  }).map(({ method, identifier }) => `did:${method}:${identifier}` as DID);

export const iri = (): fc.Arbitrary<IRI> =>
  fc.oneof(
    fc.webUrl() as fc.Arbitrary<IRI>,
    fc.record({
      scheme: fc.constantFrom("mailto", "urn", "tel"),
      path: fc.string({ minLength: 5, maxLength: 50 })
    }).map(({ scheme, path }) => `${scheme}:${path}` as IRI)
  );

export const uuid = (): fc.Arbitrary<string> =>
  fc.uuid();

export const caip10 = (): fc.Arbitrary<CAIP10> =>
  fc.record({
    namespace: fc.constantFrom("eip155", "bip122", "cosmos", "polkadot"),
    reference: fc.string({ minLength: 1, maxLength: 32, unit: fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', '-') }),
    address: fc.string({ minLength: 16, maxLength: 64, unit: fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f') })
  }).map(({ namespace, reference, address }) => `${namespace}:${reference}:${address}` as CAIP10);

export const caip19 = (): fc.Arbitrary<CAIP19> =>
  fc.record({
    namespace: fc.constantFrom("eip155", "bip122"),
    reference: fc.string({ minLength: 1, maxLength: 32, unit: fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', '-') }),
    assetName: fc.constantFrom("erc20", "slip44"),
    assetId: fc.string({ minLength: 32, maxLength: 42, unit: fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f') })
  }).map(({ namespace, reference, assetName, assetId }) => 
    `${namespace}:${reference}/${assetName}:${assetId}` as CAIP19
  );

export const amount = (): fc.Arbitrary<Amount> =>
  fc.float({ min: Math.fround(0.01), max: Math.fround(1000000) })
    .map(n => n.toFixed(2))
    .filter(s => /^\d+\.\d{2}$/.test(s)) as fc.Arbitrary<Amount>;

export const isoCurrency = (): fc.Arbitrary<IsoCurrency> =>
  fc.constantFrom("USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD");

// ============================================================================
// PARTICIPANT ARBITRARIES
// ============================================================================

export const participant = (): fc.Arbitrary<Participant> =>
  fc.record({
    "@id": did(),
    name: fc.constantFrom("Alice Smith", "Bob Jones", "Carol Davis", "Dave Miller", "Eva Brown", "Frank Wilson", "Grace Taylor", "Henry Johnson"),
    email: fc.option(fc.emailAddress(), { nil: undefined }),
    telephone: fc.option(fc.string({ minLength: 10, maxLength: 15 }), { nil: undefined })
  });

export const person = (): fc.Arbitrary<Person> =>
  fc.record({
    "@id": did(),
    "@type": fc.constant("https://schema.org/Person" as const),
    name: fc.constantFrom("Alice Smith", "Bob Jones", "Carol Davis", "Dave Miller", "Eva Brown"),
    givenName: fc.option(fc.string({ minLength: 2, maxLength: 25 }), { nil: undefined }),
    familyName: fc.option(fc.string({ minLength: 2, maxLength: 25 }), { nil: undefined }),
    email: fc.option(fc.emailAddress(), { nil: undefined })
  });

export const organization = (): fc.Arbitrary<Organization> =>
  fc.record({
    "@id": did(),
    "@type": fc.constant("https://schema.org/Organization" as const),
    name: fc.constantFrom("Acme Corp", "TechStart Inc", "Global Bank", "Crypto Exchange", "Payment Services"),
    legalName: fc.option(fc.string({ minLength: 2, maxLength: 100 }), { nil: undefined }),
    url: fc.option(fc.webUrl(), { nil: undefined })
  });

export const party = () => fc.oneof(person(), organization());

export const agent = (): fc.Arbitrary<Agent> =>
  fc.record({
    "@id": did(),
    for: did(),
    name: fc.constantFrom("Wallet Agent", "Exchange Agent", "Bank Agent", "Payment Agent", "Trading Bot"),
    role: fc.option(fc.constantFrom("PaymentProcessor", "WalletProvider", "Exchange", "Bank"), { nil: undefined })
  });

// ============================================================================
// MESSAGE BODY ARBITRARIES
// ============================================================================

export const transfer = (): fc.Arbitrary<Transfer> =>
  fc.record({
    "@context": fc.constant("https://tap.rsvp/schema/1.0" as const),
    "@type": fc.constant("Transfer" as const),
    asset: caip19(),
    amount: amount(),
    originator: party(),
    beneficiary: party(),
    agents: fc.array(agent(), { minLength: 1, maxLength: 3 }),
    purposeCode: fc.option(fc.constantFrom("TRAD", "SALA", "RENT", "INTC", "SUPP"), { nil: undefined })
  });

export const payment = (): fc.Arbitrary<Payment> =>
  fc.record({
    "@context": fc.constant("https://tap.rsvp/schema/1.0" as const),
    "@type": fc.constant("Payment" as const),
    amount: amount(),
    currency: isoCurrency(),
    payer: party(),
    payee: party(),
    merchant: fc.option(party(), { nil: undefined }),
    agents: fc.array(agent(), { minLength: 1, maxLength: 3 }),
    purposeCode: fc.option(fc.constantFrom("TRAD", "SALA", "RENT", "INTC", "SUPP"), { nil: undefined })
  });

export const exchange = (): fc.Arbitrary<Exchange> =>
  fc.oneof(
    fc.record({
      "@context": fc.constant("https://tap.rsvp/schema/1.0" as const),
      "@type": fc.constant("Exchange" as const),
      fromAssets: fc.array(fc.oneof(caip19(), isoCurrency()), { minLength: 1, maxLength: 5 }),
      toAssets: fc.array(fc.oneof(caip19(), isoCurrency()), { minLength: 1, maxLength: 5 }),
      fromAmount: amount(),
      requester: party(),
      provider: fc.option(party(), { nil: undefined }),
      agents: fc.array(agent(), { minLength: 1, maxLength: 3 })
    }),
    fc.record({
      "@context": fc.constant("https://tap.rsvp/schema/1.0" as const),
      "@type": fc.constant("Exchange" as const),
      fromAssets: fc.array(fc.oneof(caip19(), isoCurrency()), { minLength: 1, maxLength: 5 }),
      toAssets: fc.array(fc.oneof(caip19(), isoCurrency()), { minLength: 1, maxLength: 5 }),
      toAmount: amount(),
      requester: party(),
      provider: fc.option(party(), { nil: undefined }),
      agents: fc.array(agent(), { minLength: 1, maxLength: 3 })
    })
  );

export const quote = (): fc.Arbitrary<Quote> =>
  fc.record({
    "@context": fc.constant("https://tap.rsvp/schema/1.0" as const),
    "@type": fc.constant("Quote" as const),
    fromAsset: fc.oneof(caip19(), isoCurrency()),
    toAsset: fc.oneof(caip19(), isoCurrency()),
    fromAmount: amount(),
    toAmount: amount(),
    provider: party(),
    agents: fc.array(agent(), { minLength: 1, maxLength: 3 }),
    expiresAt: fc.date({ min: new Date(), max: new Date(Date.now() + 86400000) }).map(d => d.toISOString())
  });

export const escrow = (): fc.Arbitrary<Escrow> =>
  fc.record({
    "@context": fc.constant("https://tap.rsvp/schema/1.0" as const),
    "@type": fc.constant("Escrow" as const),
    asset: caip19(),
    amount: amount(),
    originator: party(),
    beneficiary: party(),
    expiry: fc.date({ min: new Date(), max: new Date(Date.now() + 86400000) }).map(d => d.toISOString()),
    agents: fc.array(agent(), { minLength: 1, maxLength: 3 }),
    agreement: fc.option(fc.webUrl(), { nil: undefined })
  });

export const capture = (): fc.Arbitrary<Capture> =>
  fc.record({
    "@context": fc.constant("https://tap.rsvp/schema/1.0" as const),
    "@type": fc.constant("Capture" as const),
    amount: fc.option(amount(), { nil: undefined }),
    settlementAddress: fc.option(caip10(), { nil: undefined })
  });

export const authorize = (): fc.Arbitrary<Authorize> =>
  fc.record({
    "@context": fc.constant("https://tap.rsvp/schema/1.0" as const),
    "@type": fc.constant("Authorize" as const),
    decision: fc.constantFrom("approve", "deny"),
    reason: fc.option(fc.string({ minLength: 10, maxLength: 100 }), { nil: undefined })
  });

export const connect = (): fc.Arbitrary<Connect> =>
  fc.record({
    "@context": fc.constant("https://tap.rsvp/schema/1.0" as const),
    "@type": fc.constant("Connect" as const),
    requester: party(),
    principal: party(),
    agents: fc.array(agent(), { minLength: 1, maxLength: 3 }),
    constraints: fc.record({
      purposes: fc.option(fc.array(fc.constantFrom("TRAD", "SALA", "RENT", "INTC", "SUPP"), { minLength: 1, maxLength: 5 }), { nil: undefined })
    })
  });

export const settle = (): fc.Arbitrary<Settle> =>
  fc.record({
    "@context": fc.constant("https://tap.rsvp/schema/1.0" as const),
    "@type": fc.constant("Settle" as const),
    txHash: fc.string({ minLength: 64, maxLength: 64, unit: fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f') }),
    settlementAddress: caip10()
  });

export const reject = (): fc.Arbitrary<Reject> =>
  fc.record({
    "@context": fc.constant("https://tap.rsvp/schema/1.0" as const),
    "@type": fc.constant("Reject" as const),
    reason: fc.string({ minLength: 10, maxLength: 100 })
  });

export const cancel = (): fc.Arbitrary<Cancel> =>
  fc.record({
    "@context": fc.constant("https://tap.rsvp/schema/1.0" as const),
    "@type": fc.constant("Cancel" as const),
    by: did(),
    reason: fc.option(fc.string({ minLength: 10, maxLength: 100 }), { nil: undefined })
  });

export const revert = (): fc.Arbitrary<Revert> =>
  fc.record({
    "@context": fc.constant("https://tap.rsvp/schema/1.0" as const),
    "@type": fc.constant("Revert" as const),
    settlementAddress: caip10(),
    reason: fc.string({ minLength: 10, maxLength: 100 })
  });

// ============================================================================
// DIDCOMM MESSAGE ARBITRARIES
// ============================================================================

export const didcommMessage = <T>(bodyArb: fc.Arbitrary<T>) =>
  fc.record({
    id: uuid(),
    type: fc.string({ minLength: 10, maxLength: 100 }),
    from: did(),
    to: fc.array(did(), { minLength: 1, maxLength: 3 }),
    created_time: fc.integer({ min: Date.now() - 86400000, max: Date.now() }),
    body: bodyArb,
    thid: fc.option(uuid(), { nil: undefined })
  });

export const didcommReply = <T>(bodyArb: fc.Arbitrary<T>) =>
  fc.record({
    id: uuid(),
    type: fc.string({ minLength: 10, maxLength: 100 }),
    from: did(),
    to: fc.array(did(), { minLength: 1, maxLength: 3 }),
    created_time: fc.integer({ min: Date.now() - 86400000, max: Date.now() }),
    thid: uuid(),
    body: bodyArb
  });

export const transferMessage = (): fc.Arbitrary<TransferMessage> =>
  fc.record({
    id: uuid(),
    type: fc.constant("https://tap.rsvp/schema/1.0#Transfer" as const),
    from: did(),
    to: fc.array(did(), { minLength: 1, maxLength: 1 }),
    created_time: fc.integer({ min: Date.now() - 86400000, max: Date.now() }),
    body: transfer(),
    thid: fc.option(uuid(), { nil: undefined })
  });

export const paymentMessage = (): fc.Arbitrary<PaymentMessage> =>
  fc.record({
    id: uuid(),
    type: fc.constant("https://tap.rsvp/schema/1.0#Payment" as const),
    from: did(),
    to: fc.array(did(), { minLength: 1, maxLength: 1 }),
    created_time: fc.integer({ min: Date.now() - 86400000, max: Date.now() }),
    body: payment(),
    thid: fc.option(uuid(), { nil: undefined })
  });

export const exchangeMessage = (): fc.Arbitrary<ExchangeMessage> =>
  fc.record({
    id: uuid(),
    type: fc.constant("https://tap.rsvp/schema/1.0#Exchange" as const),
    from: did(),
    to: fc.array(did(), { minLength: 1, maxLength: 1 }),
    created_time: fc.integer({ min: Date.now() - 86400000, max: Date.now() }),
    body: exchange(),
    thid: fc.option(uuid(), { nil: undefined })
  });

export const quoteMessage = (): fc.Arbitrary<QuoteMessage> =>
  fc.record({
    id: uuid(),
    type: fc.constant("https://tap.rsvp/schema/1.0#Quote" as const),
    from: did(),
    to: fc.array(did(), { minLength: 1, maxLength: 1 }),
    created_time: fc.integer({ min: Date.now() - 86400000, max: Date.now() }),
    thid: uuid(),
    body: quote()
  });

export const escrowMessage = (): fc.Arbitrary<EscrowMessage> =>
  fc.record({
    id: uuid(),
    type: fc.constant("https://tap.rsvp/schema/1.0#Escrow" as const),
    from: did(),
    to: fc.array(did(), { minLength: 1, maxLength: 1 }),
    created_time: fc.integer({ min: Date.now() - 86400000, max: Date.now() }),
    body: escrow(),
    thid: fc.option(uuid(), { nil: undefined })
  });

export const captureMessage = (): fc.Arbitrary<CaptureMessage> =>
  fc.record({
    id: uuid(),
    type: fc.constant("https://tap.rsvp/schema/1.0#Capture" as const),
    from: did(),
    to: fc.array(did(), { minLength: 1, maxLength: 1 }),
    created_time: fc.integer({ min: Date.now() - 86400000, max: Date.now() }),
    thid: uuid(),
    body: capture()
  });

export const authorizeMessage = (): fc.Arbitrary<AuthorizeMessage> =>
  fc.record({
    id: uuid(),
    type: fc.constant("https://tap.rsvp/schema/1.0#Authorize" as const),
    from: did(),
    to: fc.array(did(), { minLength: 1, maxLength: 1 }),
    created_time: fc.integer({ min: Date.now() - 86400000, max: Date.now() }),
    thid: uuid(),
    body: authorize()
  });

export const connectMessage = (): fc.Arbitrary<ConnectMessage> =>
  fc.record({
    id: uuid(),
    type: fc.constant("https://tap.rsvp/schema/1.0#Connect" as const),
    from: did(),
    to: fc.array(did(), { minLength: 1, maxLength: 1 }),
    created_time: fc.integer({ min: Date.now() - 86400000, max: Date.now() }),
    body: connect(),
    thid: fc.option(uuid(), { nil: undefined })
  });

export const settleMessage = (): fc.Arbitrary<SettleMessage> =>
  fc.record({
    id: uuid(),
    type: fc.constant("https://tap.rsvp/schema/1.0#Settle" as const),
    from: did(),
    to: fc.array(did(), { minLength: 1, maxLength: 1 }),
    created_time: fc.integer({ min: Date.now() - 86400000, max: Date.now() }),
    thid: uuid(),
    body: settle()
  });

export const rejectMessage = (): fc.Arbitrary<RejectMessage> =>
  fc.record({
    id: uuid(),
    type: fc.constant("https://tap.rsvp/schema/1.0#Reject" as const),
    from: did(),
    to: fc.array(did(), { minLength: 1, maxLength: 1 }),
    created_time: fc.integer({ min: Date.now() - 86400000, max: Date.now() }),
    thid: uuid(),
    body: reject()
  });

export const cancelMessage = (): fc.Arbitrary<CancelMessage> =>
  fc.record({
    id: uuid(),
    type: fc.constant("https://tap.rsvp/schema/1.0#Cancel" as const),
    from: did(),
    to: fc.array(did(), { minLength: 1, maxLength: 1 }),
    created_time: fc.integer({ min: Date.now() - 86400000, max: Date.now() }),
    thid: uuid(),
    body: cancel()
  });

export const revertMessage = (): fc.Arbitrary<RevertMessage> =>
  fc.record({
    id: uuid(),
    type: fc.constant("https://tap.rsvp/schema/1.0#Revert" as const),
    from: did(),
    to: fc.array(did(), { minLength: 1, maxLength: 1 }),
    created_time: fc.integer({ min: Date.now() - 86400000, max: Date.now() }),
    thid: uuid(),
    body: revert()
  });

export const tapMessage = (): fc.Arbitrary<TAPMessage> =>
  fc.oneof(
    transferMessage(),
    paymentMessage(), 
    exchangeMessage(),
    quoteMessage(),
    escrowMessage(),
    captureMessage(),
    authorizeMessage(),
    connectMessage(),
    settleMessage(),
    rejectMessage(),
    cancelMessage(),
    revertMessage()
  );

// ============================================================================
// GROUPED EXPORT
// ============================================================================

export const arbitraries = {
  // Fundamental types
  fundamental: {
    did: () => did(),
    iri: () => iri(),
    uuid: () => uuid(),
    caip10: () => caip10(),
    caip19: () => caip19(),
    amount: () => amount(),
    isoCurrency: () => isoCurrency(),
  },
  
  // Participants
  participants: {
    participant: () => participant(),
    person: () => person(),
    organization: () => organization(),
    party: () => party(),
    agent: () => agent(),
  },
  
  // Message bodies
  messageBodies: {
    transfer: () => transfer(),
    payment: () => payment(),
    exchange: () => exchange(),
    quote: () => quote(),
    escrow: () => escrow(),
    capture: () => capture(),
    authorize: () => authorize(),
    connect: () => connect(),
    settle: () => settle(),
    reject: () => reject(),
    cancel: () => cancel(),
    revert: () => revert(),
  },
  
  // DIDComm messages
  messages: {
    transferMessage: () => transferMessage(),
    paymentMessage: () => paymentMessage(),
    exchangeMessage: () => exchangeMessage(),
    quoteMessage: () => quoteMessage(),
    escrowMessage: () => escrowMessage(),
    captureMessage: () => captureMessage(),
    authorizeMessage: () => authorizeMessage(),
    connectMessage: () => connectMessage(),
    settleMessage: () => settleMessage(),
    rejectMessage: () => rejectMessage(),
    cancelMessage: () => cancelMessage(),
    revertMessage: () => revertMessage(),
    tapMessage: () => tapMessage(),
  },
} as const;