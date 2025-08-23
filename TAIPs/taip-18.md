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

Sent by the party initiating a quote. Includes:

* `@type`: `QuoteRequest`
* `fromAsset`: [CAIP-19], DTI, or [ISO-4217] currency code (e.g., "USD", "EUR") for the source asset
* `toAsset`: [CAIP-19], DTI, or [ISO-4217] currency code for the target asset
* `amount`: amount to convert (string decimal)
* `expiry`: optional, how long the quote is valid for
* `policies`: optional; compliance or presentation requirements
* `preferredProvider`: optional, LP to prioritize

### 2. `QuoteResponse`

Sent by the liquidity provider or orchestrator in response to a QuoteRequest.

* `@type`: `QuoteResponse`
* `fromAsset`, `toAsset`, `amount`: copied from request
* `rate`: exchange rate (e.g., 1 USDC = 0.91 EURC)
* `fee`: quoted fee
* `path`: route of assets and chains
* `provider`: identifier of quoting entity
* `expiresAt`: timestamp
* `quoteId`: reference for settlement

### 3. `QuoteAccept`

Used to accept a quote and proceed with execution. Optional depending on flow type.

* `@type`: `QuoteAccept`
* `quoteId`: reference to accepted quote
* `payer`: optional address
* `receiver`: optional address

### 4. `SwapSettle`

Describes how the swap was executed, post-trade. May trigger downstream TAP-3 Transfer.

* `@type`: `SwapSettle`
* `quoteId`
* `txHash`
* `settledAmount`
* `settledAsset`: [CAIP-19], DTI, or [ISO-4217] currency code for the settled asset

## Example Messages

### QuoteRequest (Signed)

```json
{
  "@type": "QuoteRequest",
  "fromAsset": "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "toAsset": "eip155:1/erc20:0xB00b00b00b00b00b00b00b00b00b00b00b00b00b",
  "amount": "1000.00",
  "expiry": "2025-07-21T00:00:00Z",
  "preferredProvider": "did:example:lp-xyz"
}
```

### QuoteResponse

```json
{
  "@type": "QuoteResponse",
  "quoteId": "quote-abc-123",
  "fromAsset": "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "toAsset": "eip155:1/erc20:0xB00b00b00b00b00b00b00b00b00b00b00b00b00b",
  "amount": "1000.00",
  "rate": "0.91",
  "fee": "1.50",
  "path": ["USDC", "ETH", "EURC"],
  "provider": "did:example:lp-xyz",
  "expiresAt": "2025-07-21T00:00:00Z"
}
```

### QuoteAccept

```json
{
  "@type": "QuoteAccept",
  "quoteId": "quote-abc-123",
  "payer": "0x1234567890abcdef...",
  "receiver": "0xabcdef0123456789..."
}
```

### SwapSettle

```json
{
  "@type": "SwapSettle",
  "quoteId": "quote-abc-123",
  "txHash": "0xdeadbeef123...",
  "settledAmount": "909.50",
  "settledAsset": "eip155:1/erc20:0xB00b00b00b00b00b00b00b00b00b00b00b00b00b"
}
```

### Example: Fiat to Crypto Quote

This example shows a quote request from USD fiat to USDC stablecoin:

```json
{
  "@type": "QuoteRequest",
  "fromAsset": "USD",
  "toAsset": "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "amount": "1000.00",
  "expiry": "2025-07-21T00:00:00Z"
}
```

Response:

```json
{
  "@type": "QuoteResponse",
  "quoteId": "fiat-quote-456",
  "fromAsset": "USD",
  "toAsset": "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "amount": "1000.00",
  "rate": "0.998",
  "fee": "2.00",
  "provider": "did:web:onramp.provider",
  "expiresAt": "2025-07-21T00:00:00Z"
}
```

### Example: Cross-Currency FX Quote

This example shows a pure FX quote between fiat currencies:

```json
{
  "@type": "QuoteRequest",
  "fromAsset": "USD",
  "toAsset": "EUR",
  "amount": "1000.00"
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
* [CAIP-19] Asset Type and Asset ID Specification
* [DTI] Digital Token Identifier
* [ISO-4217] ISO 4217 Currency Codes

[TAIP-2]: ./taip-2
[TAIP-3]: ./taip-3
[TAIP-4]: ./taip-4
[TAIP-6]: ./taip-6
[TAIP-7]: ./taip-7
[TAIP-8]: ./taip-8
[TAIP-9]: ./taip-9
[TAIP-14]: ./taip-14
[TAIP-17]: ./taip-17
[CAIP-19]: https://chainagnostic.org/CAIPs/caip-19
[DTI]: https://www.dtif.org/
[ISO-4217]: https://www.iso.org/iso-4217-currency-codes.html

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
