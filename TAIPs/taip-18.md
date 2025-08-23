---
taip: 18
title: Quote & Swap
status: Draft
type: Standard
author: Tarek Mohammad <tarek.mohammad@notabene.id>, Pelle Braendgaard <pelle@notabene.id>
created: 2025-07-20
updated: 2025-08-23
description: Defines QuoteRequest, QuoteResponse, QuoteAccept, and SwapSettle message types for requesting and executing token swaps and price quotations. Enables cross-asset quotes, swap route approval, and settlement with minimal trust assumptions while maintaining composability with existing TAP messages.
requires: 2, 3, 4, 6, 7, 8, 9, 14, 17
---

# TAIP-18: Quote & Swap

## Simple Summary

A standard for requesting and executing token swaps and price quotations for blockchain-based payment settlement. Enables wallets and orchestrators to request cross-asset quotes, approve swap routes, and settle in compatible assets with minimal trust assumptions.

## Abstract

TAIP-18 introduces a QuoteRequest message format for initiating cross-asset quotes (e.g., from USDC to EURC, USD to USDC, or across chains) and defines optional settlement support for accepted quotes. It is designed for composability with existing TAP messages like Payment ([TAIP-14]) and Transfer ([TAIP-3]). TAIP-18 formalizes the message exchange required to:

* Quote and approve stablecoin swaps
* Discover on-/off-ramp pricing
* Execute FX transactions
* Bridge assets or stablecoins across chains

It enables wallets, liquidity providers (LPs), and orchestrators to collaborate on a unified quoting and swap interface.

## Motivation

Stablecoin-based payments often require conversion between tokens, chains, or currencies. For example:

* A business receives an invoice in EURC but only holds USDC
* A wallet provider wants to settle in native stablecoins across chains
* A PSP requires a cross-currency quote (e.g., USD to GBP)

Today, such flows are fragmented across centralized off-ramps, AMMs, and FX providers, with no standard message structure to request, negotiate, and execute swaps.

TAIP-18 solves this by creating a compliant, composable quote & swap framework that plugs into existing TAP flows. It abstracts complexity and adds identity-layered trust for regulatory-grade financial activity.

## Specification

TAIP-18 defines the following primary message types:

### 1. `QuoteRequest`

A **QuoteRequest** is a [DIDComm] message (per [TAIP-2]) sent by the party initiating a quote. Like all TAP messages, it follows the DIDComm v2 message structure with the TAP-specific body format.

The DIDComm message envelope contains:

- **`from`** – REQUIRED [DID] of the initiating agent
- **`to`** – REQUIRED Array containing [DID] of the liquidity providers or orchestrators
- **`type`** – REQUIRED Message type: `"https://tap.rsvp/schema/1.0#QuoteRequest"`
- **`id`** – REQUIRED Unique message identifier
- **`thid`** – OPTIONAL Thread identifier for related messages (e.g., a Payment from [TAIP-14])
- **`created_time`** – REQUIRED Message creation timestamp
- **`expires_time`** – OPTIONAL Message expiration timestamp

The message `body` contains:

- **`@context`** – REQUIRED JSON-LD context: `"https://tap.rsvp/schema/1.0"`
- **`@type`** – REQUIRED Type identifier: `"https://tap.rsvp/schema/1.0#QuoteRequest"`
- **`fromAsset`** – REQUIRED [CAIP-19], DTI, or [ISO-4217] currency code for the source asset
- **`toAsset`** – REQUIRED [CAIP-19], DTI, or [ISO-4217] currency code for the target asset
- **`amount`** – REQUIRED Amount to convert (string decimal)
- **`policies`** – OPTIONAL Compliance or presentation requirements per [TAIP-7]
- **`preferredProvider`** – OPTIONAL [DID] of preferred liquidity provider

### 2. `QuoteResponse`

A **QuoteResponse** is a [DIDComm] message sent by the liquidity provider or orchestrator in response to a QuoteRequest.

The DIDComm message envelope contains:

- **`from`** – REQUIRED [DID] of the liquidity provider or orchestrator
- **`to`** – REQUIRED Array containing [DID] of the original requester
- **`type`** – REQUIRED Message type: `"https://tap.rsvp/schema/1.0#QuoteResponse"`
- **`id`** – REQUIRED Unique message identifier
- **`thid`** – REQUIRED Thread identifier linking to the original QuoteRequest
- **`created_time`** – REQUIRED Message creation timestamp

The message `body` contains:

- **`@context`** – REQUIRED JSON-LD context: `"https://tap.rsvp/schema/1.0"`
- **`@type`** – REQUIRED Type identifier: `"https://tap.rsvp/schema/1.0#QuoteResponse"`
- **`fromAsset`** – REQUIRED Source asset (copied from request)
- **`toAsset`** – REQUIRED Target asset (copied from request)
- **`amount`** – REQUIRED Amount to convert (copied from request)
- **`rate`** – REQUIRED Exchange rate (e.g., "0.91" meaning 1 fromAsset = 0.91 toAsset)
- **`fee`** – REQUIRED Fee amount (string decimal)
- **`path`** – OPTIONAL Array of assets/chains in the routing path
- **`provider`** – REQUIRED [DID] of the quoting entity
- **`expiresAt`** – REQUIRED ISO 8601 timestamp when quote expires

### 3. `QuoteAccept`

A **QuoteAccept** is a [DIDComm] message used to accept a quote and proceed with execution. This message is optional depending on the flow type.

The DIDComm message envelope contains:

- **`from`** – REQUIRED [DID] of the accepting agent
- **`to`** – REQUIRED Array containing [DID] of the liquidity provider
- **`type`** – REQUIRED Message type: `"https://tap.rsvp/schema/1.0#QuoteAccept"`
- **`id`** – REQUIRED Unique message identifier
- **`thid`** – REQUIRED Thread identifier linking to the QuoteResponse
- **`created_time`** – REQUIRED Message creation timestamp

The message `body` contains:

- **`@context`** – REQUIRED JSON-LD context: `"https://tap.rsvp/schema/1.0"`
- **`@type`** – REQUIRED Type identifier: `"https://tap.rsvp/schema/1.0#QuoteAccept"`
- **`payer`** – OPTIONAL [CAIP-10] address of the payer
- **`receiver`** – OPTIONAL [CAIP-10] address of the receiver

### 4. `SwapSettle`

A **SwapSettle** is a [DIDComm] message that describes how the swap was executed, post-trade. It may trigger a downstream [TAIP-3] Transfer.

The DIDComm message envelope contains:

- **`from`** – REQUIRED [DID] of the liquidity provider or settlement agent
- **`to`** – REQUIRED Array containing [DID] of involved parties
- **`type`** – REQUIRED Message type: `"https://tap.rsvp/schema/1.0#SwapSettle"`
- **`id`** – REQUIRED Unique message identifier
- **`thid`** – REQUIRED Thread identifier linking to the QuoteAccept or QuoteResponse
- **`created_time`** – REQUIRED Message creation timestamp

The message `body` contains:

- **`@context`** – REQUIRED JSON-LD context: `"https://tap.rsvp/schema/1.0"`
- **`@type`** – REQUIRED Type identifier: `"https://tap.rsvp/schema/1.0#SwapSettle"`
- **`txHash`** – REQUIRED Transaction hash on the blockchain
- **`settledAmount`** – REQUIRED Amount that was settled (string decimal)
- **`settledAsset`** – REQUIRED [CAIP-19], DTI, or [ISO-4217] currency code for the settled asset

## Example Messages

### QuoteRequest Example

This example shows a complete DIDComm message requesting a quote from USDC to EURC:

```json
{
  "id": "quote-request-123",
  "type": "https://tap.rsvp/schema/1.0#QuoteRequest",
  "from": "did:web:wallet.example",
  "to": ["did:web:lp.example", "did:web:lp2.example"],
  "created_time": 1719226800,
  "expires_time": 1719313200,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#QuoteRequest",
    "fromAsset": "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "toAsset": "eip155:1/erc20:0xB00b00b00b00b00b00b00b00b00b00b00b00b00b",
    "amount": "1000.00",
    "preferredProvider": "did:web:lp.example"
  }
}
```

### QuoteResponse Example

```json
{
  "id": "quote-response-456",
  "type": "https://tap.rsvp/schema/1.0#QuoteResponse",
  "from": "did:web:lp.example",
  "to": ["did:web:wallet.example"],
  "thid": "quote-request-123",
  "created_time": 1719226850,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#QuoteResponse",
    "fromAsset": "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "toAsset": "eip155:1/erc20:0xB00b00b00b00b00b00b00b00b00b00b00b00b00b",
    "amount": "1000.00",
    "rate": "0.91",
    "fee": "1.50",
    "path": ["USDC", "ETH", "EURC"],
    "provider": "did:web:lp.example",
    "expiresAt": "2025-07-21T00:00:00Z"
  }
}
```

### QuoteAccept Example

```json
{
  "id": "quote-accept-789",
  "type": "https://tap.rsvp/schema/1.0#QuoteAccept",
  "from": "did:web:wallet.example",
  "to": ["did:web:lp.example"],
  "thid": "quote-response-456",
  "created_time": 1719226900,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#QuoteAccept",
    "payer": "eip155:1:0x1234567890abcdef1234567890abcdef12345678",
    "receiver": "eip155:1:0xabcdef0123456789abcdef0123456789abcdef01"
  }
}
```

### SwapSettle Example

```json
{
  "id": "swap-settle-999",
  "type": "https://tap.rsvp/schema/1.0#SwapSettle",
  "from": "did:web:lp.example",
  "to": ["did:web:wallet.example"],
  "thid": "quote-accept-789",
  "created_time": 1719227000,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#SwapSettle",
    "txHash": "0xdeadbeef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    "settledAmount": "909.50",
    "settledAsset": "eip155:1/erc20:0xB00b00b00b00b00b00b00b00b00b00b00b00b00b"
  }
}
```

### Example: Fiat to Crypto Quote

This example shows a quote request from USD fiat to USDC stablecoin:

```json
{
  "id": "fiat-quote-request-111",
  "type": "https://tap.rsvp/schema/1.0#QuoteRequest",
  "from": "did:web:user.wallet",
  "to": ["did:web:onramp.provider"],
  "created_time": 1719230000,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#QuoteRequest",
    "fromAsset": "USD",
    "toAsset": "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "amount": "1000.00"
  }
}
```

Response:

```json
{
  "id": "fiat-quote-response-222",
  "type": "https://tap.rsvp/schema/1.0#QuoteResponse",
  "from": "did:web:onramp.provider",
  "to": ["did:web:user.wallet"],
  "thid": "fiat-quote-request-111",
  "created_time": 1719230050,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#QuoteResponse",
    "fromAsset": "USD",
    "toAsset": "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "amount": "1000.00",
    "rate": "0.998",
    "fee": "2.00",
    "provider": "did:web:onramp.provider",
    "expiresAt": "2025-07-21T00:00:00Z"
  }
}
```

### Example: Cross-Currency FX Quote

This example shows a pure FX quote between fiat currencies:

```json
{
  "id": "fx-quote-request-333",
  "type": "https://tap.rsvp/schema/1.0#QuoteRequest",
  "from": "did:web:bank.example",
  "to": ["did:web:fx.provider"],
  "created_time": 1719231000,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#QuoteRequest",
    "fromAsset": "USD",
    "toAsset": "EUR",
    "amount": "1000.00"
  }
}
```

## Flow

1. Wallet or orchestrator sends `QuoteRequest` for USDC → EURC
2. LP or route engine replies with `QuoteResponse`
3. Wallet sends `QuoteAccept`
4. LP executes swap, sends `SwapSettle`
5. Settlement triggers [TAIP-3] Transfer

## Composability

TAIP-18 can be embedded as a subflow in:

* `Payment` workflows ([TAIP-14]) for invoice settlement
* `Escrow` workflows ([TAIP-17]) for guaranteed payment with FX conversion
* On-ramp/off-ramp flows between fiat and crypto assets
* Cross-border remittance with currency conversion
* Multi-asset portfolio rebalancing

## Security Considerations

* Quote expiry timestamps prevent stale pricing abuse
* Settlement verification via txHash
* Swap routed through identity-bound agents

## Privacy Considerations

* Quotes do not reveal identity unless policies require
* Presentation of verifiable credentials is optional via RequirePresentation ([TAIP-8])

## References

* [TAIP-2] TAP Messaging
* [TAIP-3] Asset Transfer
* [TAIP-4] Transaction Authorization Protocol
* [TAIP-6] Transaction Parties
* [TAIP-7] Agent Policies
* [TAIP-8] Selective Disclosure
* [TAIP-9] DIDComm Integration
* [TAIP-14] Payment Request
* [TAIP-17] Composable Escrow
* [CAIP-10] Account ID Specification
* [CAIP-19] Asset Type and Asset ID Specification
* [DTI] Digital Token Identifier
* [ISO-4217] ISO 4217 Currency Codes
* [DID] Decentralized Identifiers
* [DIDComm] DIDComm Messaging

[TAIP-2]: ./taip-2
[TAIP-3]: ./taip-3
[TAIP-4]: ./taip-4
[TAIP-6]: ./taip-6
[TAIP-7]: ./taip-7
[TAIP-8]: ./taip-8
[TAIP-9]: ./taip-9
[TAIP-14]: ./taip-14
[TAIP-17]: ./taip-17
[CAIP-10]: https://chainagnostic.org/CAIPs/caip-10
[CAIP-19]: https://chainagnostic.org/CAIPs/caip-19
[DTI]: https://www.dtif.org/
[ISO-4217]: https://www.iso.org/iso-4217-currency-codes.html
[DID]: https://www.w3.org/TR/did-core/
[DIDComm]: https://identity.foundation/didcomm-messaging/spec/

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
