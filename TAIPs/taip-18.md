---
taip: 18
title: Asset Exchange
status: Draft
type: Standard
author: Tarek Mohammad <tarek.mohammad@notabene.id>, Pelle Braendgaard <pelle@notabene.id>
created: 2025-07-20
updated: 2025-08-23
description: Defines Exchange and Quote message types for requesting and executing token swaps and price quotations. Enables cross-asset quotes, swap route approval, and settlement with minimal trust assumptions while maintaining composability with existing TAP messages.
requires: 2, 3, 4, 5, 6, 7, 8, 9, 14, 17
---

# TAIP-18: Asset Exchange

## Simple Summary

A standard for requesting and executing asset exchanges and price quotations for blockchain-based payment settlement. Enables wallets and orchestrators to request cross-asset quotes, approve swap routes, and settle in compatible assets with minimal trust assumptions.

## Abstract

TAIP-18 introduces an Exchange message format for initiating cross-asset quotes (e.g., from USDC to EURC, USD to USDC, or across chains) and defines optional settlement support for accepted quotes. It is designed for composability with existing TAP messages like Payment ([TAIP-14]) and Transfer ([TAIP-3]). TAIP-18 formalizes the message exchange required to:

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

TAIP-18 defines two new message types for quote negotiation (`Exchange` and `Quote`) and reuses existing [TAIP-4] messages (`Authorize` and `Settle`) for quote acceptance and swap settlement:

### 1. `Exchange`

An **Exchange** is a [DIDComm] message (per [TAIP-2]) sent by the party initiating an exchange request. Like all TAP messages, it follows the DIDComm v2 message structure with the TAP-specific body format.

The exchange request identifies the parties involved in the potential transaction and the agents acting on their behalf. The `requester` party represents the entity seeking the exchange. The optional `provider` party represents a specific liquidity provider being engaged; when omitted, the Exchange message can be broadcast through a centralized service or sent to multiple providers who can each choose to respond with a Quote. The `agents` array lists all software agents involved in processing this exchange request, including their roles and the parties they represent.

The DIDComm message envelope contains:

- **`from`** – REQUIRED [DID] of the initiating agent
- **`to`** – REQUIRED Array containing [DID] of the liquidity providers or orchestrators
- **`type`** – REQUIRED Message type: `"https://tap.rsvp/schema/1.0#Exchange"`
- **`id`** – REQUIRED Unique message identifier
- **`thid`** – OPTIONAL Thread identifier for related messages (e.g., a Payment from [TAIP-14])
- **`created_time`** – REQUIRED Message creation timestamp
- **`expires_time`** – OPTIONAL Message expiration timestamp

The message `body` contains:

- **`@context`** – REQUIRED JSON-LD context: `"https://tap.rsvp/schema/1.0"`
- **`@type`** – REQUIRED Type identifier: `"https://tap.rsvp/schema/1.0#Exchange"`
- **`fromAsset`** – REQUIRED [CAIP-19], DTI, or [ISO-4217] currency code for the source asset
- **`toAsset`** – REQUIRED [CAIP-19], DTI, or [ISO-4217] currency code for the target asset
- **`amount`** – REQUIRED Amount to convert (string decimal)
- **`requester`** – REQUIRED The party requesting the exchange (Party object per [TAIP-6])
- **`provider`** – OPTIONAL The preferred liquidity provider party (Party object per [TAIP-6]). When omitted, the Exchange message can be broadcast to multiple providers
- **`agents`** – REQUIRED Array of agents involved in the exchange request per [TAIP-5]
- **`policies`** – OPTIONAL Compliance or presentation requirements per [TAIP-7]

### 2. `Quote`

A **Quote** is a [DIDComm] message sent by the liquidity provider or orchestrator in response to an Exchange request.

The DIDComm message envelope contains:

- **`from`** – REQUIRED [DID] of the liquidity provider or orchestrator
- **`to`** – REQUIRED Array containing [DID] of the original requester
- **`type`** – REQUIRED Message type: `"https://tap.rsvp/schema/1.0#Quote"`
- **`id`** – REQUIRED Unique message identifier
- **`thid`** – REQUIRED Thread identifier linking to the original Exchange request
- **`created_time`** – REQUIRED Message creation timestamp

The message `body` contains:

- **`@context`** – REQUIRED JSON-LD context: `"https://tap.rsvp/schema/1.0"`
- **`@type`** – REQUIRED Type identifier: `"https://tap.rsvp/schema/1.0#Quote"`
- **`fromAsset`** – REQUIRED Source asset (copied from request)
- **`toAsset`** – REQUIRED Target asset (copied from request)
- **`amount`** – REQUIRED Amount to convert (copied from request)
- **`rate`** – REQUIRED Exchange rate (e.g., "0.91" meaning 1 fromAsset = 0.91 toAsset)
- **`fee`** – REQUIRED Fee amount (string decimal)
- **`path`** – OPTIONAL Array of assets/chains in the routing path
- **`provider`** – REQUIRED [DID] of the quoting entity
- **`expiresAt`** – REQUIRED ISO 8601 timestamp when quote expires

### 3. Authorization and Settlement

TAIP-18 reuses the existing `Authorize` and `Settle` messages from [TAIP-4] for quote acceptance and swap settlement. This ensures consistency across the TAP protocol and enables seamless integration with existing authorization flows.

#### Using `Authorize` for Quote Acceptance

When accepting a quote, agents send an `Authorize` message (per [TAIP-4]) with the following considerations:

- **`thid`** links to the Quote message ID
- **`settlementAddress`** specifies where to receive the swapped assets
- **`settlementAsset`** confirms the asset being received (from `toAsset` in the quote)
- **`amount`** confirms the expected amount to receive based on the quote

#### Using `Settle` for Swap Settlement

When the swap is executed, the liquidity provider sends a `Settle` message (per [TAIP-4]) with:

- **`thid`** links to the authorization or original quote thread
- **`settlementAddress`** indicates where funds were sent
- **`settlementId`** contains the blockchain transaction hash in [CAIP-220] format
- **`amount`** specifies the actual settled amount

## Example Messages

### Exchange Example

This example shows a complete DIDComm message requesting an exchange from USDC to EURC:

```json
{
  "id": "exchange-request-123",
  "type": "https://tap.rsvp/schema/1.0#Exchange",
  "from": "did:web:wallet.example",
  "to": ["did:web:lp.example", "did:web:lp2.example"],
  "created_time": 1719226800,
  "expires_time": 1719313200,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Exchange",
    "fromAsset": "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "toAsset": "eip155:1/erc20:0xB00b00b00b00b00b00b00b00b00b00b00b00b00b",
    "amount": "1000.00",
    "requester": {
      "@id": "did:web:business.example"
    },
    "provider": {
      "@id": "did:web:liquidity.provider"
    },
    "agents": [
      {
        "@id": "did:web:wallet.example",
        "for": "did:web:business.example",
        "role": "requester"
      },
      {
        "@id": "did:web:lp.example",
        "for": "did:web:liquidity.provider",
        "role": "provider"
      }
    ]
  }
}
```

### Quote Example

```json
{
  "id": "quote-456",
  "type": "https://tap.rsvp/schema/1.0#Quote",
  "from": "did:web:lp.example",
  "to": ["did:web:wallet.example"],
  "thid": "exchange-request-123",
  "created_time": 1719226850,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Quote",
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

### Authorize Example (Quote Acceptance)

This example shows accepting a quote using the standard `Authorize` message from [TAIP-4]:

```json
{
  "id": "authorize-quote-789",
  "type": "https://tap.rsvp/schema/1.0#Authorize",
  "from": "did:web:wallet.example",
  "to": ["did:web:lp.example"],
  "thid": "quote-456",
  "created_time": 1719226900,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Authorize",
    "settlementAddress": "eip155:1:0xabcdef0123456789abcdef0123456789abcdef01",
    "settlementAsset": "eip155:1/erc20:0xB00b00b00b00b00b00b00b00b00b00b00b00b00b",
    "amount": "909.50"
  }
}
```

### Settle Example (Swap Settlement)

This example shows swap settlement using the standard `Settle` message from [TAIP-4]:

```json
{
  "id": "settle-swap-999",
  "type": "https://tap.rsvp/schema/1.0#Settle",
  "from": "did:web:lp.example",
  "to": ["did:web:wallet.example"],
  "thid": "authorize-quote-789",
  "created_time": 1719227000,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Settle",
    "settlementAddress": "eip155:1:0xabcdef0123456789abcdef0123456789abcdef01",
    "settlementId": "eip155:1:tx/0xdeadbeef1234567890abcdef1234567890abcdef1234567890abcdef123456",
    "amount": "909.50"
  }
}
```

### Example: Fiat to Crypto Quote

This example shows an exchange request from USD fiat to USDC stablecoin:

```json
{
  "id": "fiat-exchange-request-111",
  "type": "https://tap.rsvp/schema/1.0#Exchange",
  "from": "did:web:user.wallet",
  "to": ["did:web:onramp.provider"],
  "created_time": 1719230000,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Exchange",
    "fromAsset": "USD",
    "toAsset": "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "amount": "1000.00",
    "requester": {
      "@id": "did:web:user.entity"
    },
    "provider": {
      "@id": "did:web:onramp.company"
    },
    "agents": [
      {
        "@id": "did:web:user.wallet",
        "for": "did:web:user.entity",
        "role": "requester"
      },
      {
        "@id": "did:web:onramp.provider",
        "for": "did:web:onramp.company",
        "role": "provider"
      }
    ]
  }
}
```

Response:

```json
{
  "id": "fiat-quote-222",
  "type": "https://tap.rsvp/schema/1.0#Quote",
  "from": "did:web:onramp.provider",
  "to": ["did:web:user.wallet"],
  "thid": "fiat-exchange-request-111",
  "created_time": 1719230050,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Quote",
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

### Example: Broadcast Exchange Request

This example shows an Exchange request broadcast to multiple providers without specifying a particular provider:

```json
{
  "id": "broadcast-exchange-456",
  "type": "https://tap.rsvp/schema/1.0#Exchange",
  "from": "did:web:wallet.example",
  "to": ["did:web:exchange.platform", "did:web:lp1.example", "did:web:lp2.example"],
  "created_time": 1719228000,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Exchange",
    "fromAsset": "eip155:1/erc20:0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "toAsset": "eip155:137/erc20:0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    "amount": "5000.00",
    "requester": {
      "@id": "did:web:business.example"
    },
    "agents": [
      {
        "@id": "did:web:wallet.example",
        "for": "did:web:business.example",
        "role": "requester"
      }
    ]
  }
}
```

### Example: Cross-Currency FX Quote

This example shows a pure FX exchange request between fiat currencies:

```json
{
  "id": "fx-exchange-request-333",
  "type": "https://tap.rsvp/schema/1.0#Exchange",
  "from": "did:web:bank.example",
  "to": ["did:web:fx.provider"],
  "created_time": 1719231000,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Exchange",
    "fromAsset": "USD",
    "toAsset": "EUR",
    "amount": "1000.00",
    "requester": {
      "@id": "did:web:bank.entity"
    },
    "provider": {
      "@id": "did:web:fx.company"
    },
    "agents": [
      {
        "@id": "did:web:bank.example",
        "for": "did:web:bank.entity",
        "role": "requester"
      },
      {
        "@id": "did:web:fx.provider",
        "for": "did:web:fx.company",
        "role": "provider"
      }
    ]
  }
}
```

## Flow

1. Wallet or orchestrator sends `Exchange` request for USDC → EURC
2. LP or route engine replies with `Quote`
3. Wallet sends `Authorize` (per [TAIP-4]) to accept the quote
4. LP executes swap and sends `Settle` (per [TAIP-4]) with transaction details
5. Settlement may trigger downstream [TAIP-3] Transfer for fund distribution

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
* [TAIP-5] Transaction Agents
* [TAIP-6] Transaction Parties
* [TAIP-7] Agent Policies
* [TAIP-8] Selective Disclosure
* [TAIP-9] DIDComm Integration
* [TAIP-14] Payment Request
* [TAIP-17] Composable Escrow
* [CAIP-10] Account ID Specification
* [CAIP-19] Asset Type and Asset ID Specification
* [CAIP-220] Transaction Identifier Specification
* [DTI] Digital Token Identifier
* [ISO-4217] ISO 4217 Currency Codes
* [DID] Decentralized Identifiers
* [DIDComm] DIDComm Messaging

[TAIP-2]: ./taip-2
[TAIP-3]: ./taip-3
[TAIP-4]: ./taip-4
[TAIP-5]: ./taip-5
[TAIP-6]: ./taip-6
[TAIP-7]: ./taip-7
[TAIP-8]: ./taip-8
[TAIP-9]: ./taip-9
[TAIP-14]: ./taip-14
[TAIP-17]: ./taip-17
[CAIP-10]: https://chainagnostic.org/CAIPs/caip-10
[CAIP-19]: https://chainagnostic.org/CAIPs/caip-19
[CAIP-220]: https://github.com/ChainAgnostic/CAIPs/pull/221
[DTI]: https://www.dtif.org/
[ISO-4217]: https://www.iso.org/iso-4217-currency-codes.html
[DID]: https://www.w3.org/TR/did-core/
[DIDComm]: https://identity.foundation/didcomm-messaging/spec/

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
