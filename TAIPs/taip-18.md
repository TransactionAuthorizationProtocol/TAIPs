# **TAIP-18: Quote & Swap**

 Type: Standard
 Created: 2025-07-20
 Updated: 2025-07-20
 Requires: 2, 3, 4, 6, 7, 8, 9, 14, 16

## **Simple Summary**

A standard for requesting and executing token swaps and price quotations for blockchain-based payment settlement. Enables wallets and orchestrators to request cross-asset quotes, approve swap routes, and settle in compatible assets with minimal trust assumptions.

## **Abstract**

TAIP-18 introduces a QuoteRequest message format for initiating cross-asset quotes (e.g., from USDC to EURC, or across chains) and defines optional settlement support for accepted quotes. It is designed for composability with existing TAP messages like Payment (TAIP-14), Transfer (TAIP-3), and Invoices (TAIP-16). TAIP-18 formalizes the message exchange required to:

* Quote and approve stablecoin swaps

* Discover on-/off-ramp pricing

* Execute FX transactions

* Bridge assets or stablecoins across chains

It enables wallets, liquidity providers (LPs), and orchestrators to collaborate on a unified quoting and swap interface.

## **Motivation**

Stablecoin-based payments often require conversion between tokens, chains, or currencies. For example:

* A business receives an invoice in EURC but only holds USDC

* A wallet provider wants to settle in native stablecoins across chains

* A PSP requires a cross-currency quote (e.g. USD to GBP)

Today, such flows are fragmented across centralized off-ramps, AMMs, and FX providers, with no standard message structure to request, negotiate, and execute swaps.

TAIP-18 solves this by creating a compliant, composable quote & swap framework that plugs into existing TAP flows. It abstracts complexity and adds identity-layered trust for regulatory-grade financial activity.

## **Specification**

TAIP-18 defines the following primary message types:

### **1\. `QuoteRequest`**

Sent by the party initiating a quote. Includes:

* `@type`: `QuoteRequest`

* `fromAsset`: CAIP-19 or DTI

* `toAsset`: CAIP-19 or DTI

* `amount`: amount of `fromAsset` to convert

* `expiry`: optional, how long the quote is valid for

* `policies`: optional; compliance or presentation requirements

* `preferredProvider`: optional, LP to prioritize

### **2\. `QuoteResponse`**

Sent by the liquidity provider or orchestrator in response to a QuoteRequest.

* `@type`: `QuoteResponse`

* `fromAsset`, `toAsset`, `amount`: copied from request

* `rate`: exchange rate (e.g., 1 USDC \= 0.91 EURC)

* `fee`: quoted fee

* `path`: route of assets and chains

* `provider`: identifier of quoting entity

* `expiresAt`: timestamp

* `quoteId`: reference for settlement

### **3\. `QuoteAccept`**

Used to accept a quote and proceed with execution. Optional depending on flow type.

* `@type`: `QuoteAccept`

* `quoteId`: reference to accepted quote

* `payer`: optional address

* `receiver`: optional address

### **4\. `SwapSettle`**

Describes how the swap was executed, post-trade. May trigger downstream TAP-3 Transfer.

* `@type`: `SwapSettle`

* `quoteId`

* `txHash`

* `settledAmount`

* `settledAsset`

## **Example Messages**

### **QuoteRequest (Signed)**

```json
{
  "@type": "QuoteRequest",
  "fromAsset": "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "toAsset": "eip155:1/erc20:0xB00b00b00b00b00b00b00b00b00b00b00b00b00b",
  "amount": "1000",
  "expiry": "2025-07-21T00:00:00Z",
  "preferredProvider": "did:example:lp-xyz"
}
```

### **QuoteResponse**

```json
{
  "@type": "QuoteResponse",
  "quoteId": "quote-abc-123",
  "fromAsset": "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "toAsset": "eip155:1/erc20:0xB00b00b00b00b00b00b00b00b00b00b00b00b00b",
  "amount": "1000",
  "rate": "0.91",
  "fee": "1.50",
  "path": ["USDC", "ETH", "EURC"],
  "provider": "did:example:lp-xyz",
  "expiresAt": "2025-07-21T00:00:00Z"
}
```

### **QuoteAccept**

```json
{
  "@type": "QuoteAccept",
  "quoteId": "quote-abc-123",
  "payer": "0x1234567890abcdef...",
  "receiver": "0xabcdef0123456789..."
}
```

### **SwapSettle**

```json
{
  "@type": "SwapSettle",
  "quoteId": "quote-abc-123",
  "txHash": "0xdeadbeef123...",
  "settledAmount": "909.50",
  "settledAsset": "eip155:1/erc20:0xB00b00b00b00b00b00b00b00b00b00b00b00b00b"
}
```

## **Flow**

1. Wallet or orchestrator sends `QuoteRequest` for USDC → EURC

2. LP or route engine replies with `QuoteResponse`

3. Wallet sends `QuoteAccept`

4. LP executes swap, sends `SwapSettle`

5. Settlement triggers TAP-3 Transfer

## **Composability**

TAIP-18 is typically embedded as a subflow in:

* `Payment` workflows (TAIP-14) for invoice settlement

* `Receivables` APIs via TAIP-16 (e.g., EURC invoice settled in USDC)

* Off-chain FX coordination between wallets and LPs

## **Security Considerations**

* Quote expiry timestamps prevent stale pricing abuse

* Settlement verification via txHash

* Swap routed through identity-bound agents

## **Privacy Considerations**

* Quotes do not reveal identity unless policies require

* Presentation of verifiable credentials is optional via RequirePresentation (TAIP-8)

## **References**

* TAIP-2 Messaging

* TAIP-3 Transfer

* TAIP-14 Payments

* TAIP-16 Invoices

* CAIP-19 Asset IDs

* DTI Stablecoin Identifiers

* TAP Schema Definitions
