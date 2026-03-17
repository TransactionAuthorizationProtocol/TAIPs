---
taip: 20
title: On-Chain Transfer Correlation via Memo Hash
status: Draft
type: Standard
author: Pelle Braendgaard <pelle@notabene.id>
created: 2026-03-17
updated: 2026-03-17
description: Defines a chain-agnostic method to tag settlement transactions with a SHA-256 digest of the TAP transfer identifier using memo/reference fields, enabling deterministic reconciliation between TAP and on-chain records.
requires: 3, 4
---

# TAIP-20: On-Chain Transfer Correlation via Memo Hash

## Simple Summary

When a TAP transfer settles on-chain, the payer should include a deterministic memo/reference value derived from the TAP transfer ID so anyone with TAP context can cryptographically link the TAP transfer and blockchain transaction.

## Abstract

Payment-focused blockchains commonly expose a transaction-level reference field (for example, `memo`, `reference`, `comment`, or protocol-specific tag fields) that institutions use for reconciliation. Existing behavior is fragmented across ecosystems: some chains support UTF-8 text memos, some support binary/hash memos, and others expose numeric destination tags.

This TAIP defines a single canonical correlation primitive for TAP: compute `sha256(transfer_id_utf8)` and place the resulting 32-byte digest (or its hex representation) into an on-chain memo/reference field. This creates a non-PII, deterministic linkage between TAP and settlement layers while preserving compatibility with heterogeneous chain memo semantics.

## Overview

TAIP-20 standardizes a deterministic cross-layer correlation value for TAP settlements: `SHA-256(UTF8(tap_transfer_id))`. The hash is then carried in chain-specific memo/reference fields using either a text profile (`tap:1:<64-hex>`) or a binary profile (raw 32-byte hash). This gives counterparties and compliance systems a consistent verification method across heterogeneous payment blockchains.


## Motivation

TAP already provides message IDs and thread IDs for protocol-level traceability, but settlement often occurs on independent networks where counterparties, PSPs, and compliance teams need a robust way to match:

- TAP transfer intent (`Transfer` / settlement flow metadata), and
- final on-chain movement of value.

A standardized memo-hash method improves:

- **Reconciliation:** deterministic matching without fragile text parsing.
- **Interoperability:** one rule across chains with different memo models.
- **Privacy:** avoids placing raw TAP IDs or user data on-chain.
- **Auditability:** supports independent verification by both counterparties.

### Observed Ecosystem Pattern

Across payment-centric ecosystems, implementations converge on attaching payment references to transactions:

- **Tempo (TIP-20):** Transfer parameters include memo support, enabling payment correlation metadata at transfer time ([TIP-20-Tempo]).
- **ARC-style payment APIs:** commonly expose optional payment parameters such as `memo` or `reference` for reconciliation metadata.
- **Stellar:** supports typed memos (`text`, `id`, `hash`, `return`) ([Stellar-Memos]).
- **XRP Ledger:** uses source/destination tags for account-level routing and reconciliation ([XRPL-Tags]).
- **Cosmos SDK chains:** include transaction-level `memo` in `TxBody` ([Cosmos-TxBody]).
- **EVM ecosystems:** commonly include references in calldata/events or memo-capable wrappers.

This TAIP builds on that shared pattern by standardizing the reference value format for TAP settlement correlation.

## Specification

### 1. Correlation Input

For a TAP transfer flow, define `tap_transfer_id` as:

1. `Transfer.id` when correlating directly to TAIP-3 Transfer, or
2. the active settlement thread identifier (`thid`) if the implementation's canonical business identifier is thread-based.

Implementations MUST use a stable identifier agreed by both counterparties for that transfer lifecycle.

### 2. Hash Derivation

Implementations MUST compute:

`tap_hash = SHA-256(UTF8(tap_transfer_id))`

Where:

- `SHA-256` is the FIPS 180-4 SHA-2 256-bit digest,
- `UTF8(...)` is the raw UTF-8 byte encoding of the identifier string,
- output is exactly 32 bytes.

### 3. Memo Encoding Profiles

To support heterogeneous chains, TAIP-20 defines two encoding profiles.

#### Profile A: Text Memo

For chains/wrappers where memo is UTF-8 text, implementations MUST encode:

`tap:1:<64-lowercase-hex-of-tap_hash>`

Example:

`tap:1:4d9e0c1d...` (64 hex chars)

Rules:

- prefix `tap:1:` is REQUIRED,
- hex MUST be lowercase,
- no truncation is allowed.

#### Profile B: Binary/Hash Memo

For chains that support fixed-length binary/hash memo fields, implementations SHOULD place the raw 32-byte `tap_hash` directly in the memo field.

If chain tooling requires hex/base64 wrappers, those wrappers MUST decode losslessly to the same 32-byte value.

### 4. Settlement Message Disclosure

When sending TAP settlement confirmations (e.g., `Settle`), implementations SHOULD include:

- `settlementId` (chain tx identifier), and
- `memo` (or implementation-defined extension field) containing either the text profile value or an unambiguous representation of the binary profile value.

### 5. Verification Procedure

A verifier with TAP message history and blockchain tx data performs:

1. Obtain `tap_transfer_id` from TAP context.
2. Compute `tap_hash = SHA-256(UTF8(tap_transfer_id))`.
3. Normalize on-chain memo according to the chain profile.
4. Compare values.
5. If equal, treat tx as cryptographically correlated to that TAP transfer.

### 6. Chain-Specific Adaptation Guidance

- **Text memo chains:** use Profile A unchanged.
- **Hash memo chains:** use Profile B.
- **Numeric-only reference fields (e.g., destination-tag-only flows):** TAIP-20 hash cannot fit directly; implementations MAY use an auxiliary mapping service, but such mapping is out of scope and MUST be documented by implementers.

## Rationale

- **Hash instead of raw TAP ID:** limits metadata leakage and avoids exposing business identifiers directly on-chain.
- **SHA-256:** ubiquitous, efficient, and available across payment and blockchain tooling.
- **Versioned prefix (`tap:1:`):** enables future upgrades (e.g., alternative digest algorithms) without ambiguity.
- **Dual profiles:** accommodates both text-centric and binary-centric memo implementations.

Alternative considered: using plain-text transfer IDs in memo. Rejected due to privacy leakage, inconsistent character limits, and non-uniform formatting across integrators.

## Example

Given:

- `tap_transfer_id = "3fa85f64-5717-4562-b3fc-2c963f66afa6"`

Compute:

- `tap_hash = SHA-256(UTF8(tap_transfer_id))`
- hex: `6f0f7e5f3f5e5a41f27d1d1f47d33a1260f2e0f6d96bd7fb7fdb3f5f8a2a9b3e` (example)

Profile A memo:

- `tap:1:6f0f7e5f3f5e5a41f27d1d1f47d33a1260f2e0f6d96bd7fb7fdb3f5f8a2a9b3e`

A counterparty recomputing from TAP messages can verify that the settlement transaction matches the intended transfer.

## Security Considerations

- SHA-256 preimage attacks are currently impractical, but implementations should monitor cryptographic guidance over time.
- Reused transfer identifiers across environments can cause false correlation; IDs MUST be globally unique per transfer context.
- Implementers should bind correlation checks to expected asset/amount/participants, not memo hash alone.

## Privacy Considerations

- Hashing reduces direct exposure of TAP identifiers but does not hide transaction graph data.
- If transfer IDs are low entropy or guessable, dictionary attacks are possible; implementations should prefer high-entropy identifiers (UUIDv4 or equivalent).

## Backwards Compatibility

This TAIP is additive. Existing TAP messages remain valid. Integrations can adopt TAIP-20 correlation without changing core TAIP-3/TAIP-4 semantics.

## References

- [TAIP-3: Virtual Asset Transfer][TAIP-3]
- [TAIP-4: Transaction Authorization Protocol][TAIP-4]
- [FIPS 180-4 Secure Hash Standard (SHA-2)][FIPS-180-4]
- [CAIP-220 Blockchain Transaction Identifier][CAIP-220]
- [Tempo TIP-20 Transfer Memos][TIP-20-Tempo]
- [Stellar Transaction Memos][Stellar-Memos]
- [XRPL Source and Destination Tags][XRPL-Tags]
- [Cosmos SDK TxBody `memo`][Cosmos-TxBody]

[TAIP-3]: https://tap.rsvp/TAIPs/taip-3
[TAIP-4]: https://tap.rsvp/TAIPs/taip-4
[FIPS-180-4]: https://csrc.nist.gov/publications/detail/fips/180/4/final
[CAIP-220]: https://namespaces.chainagnostic.org/caips/caip-220
[TIP-20-Tempo]: https://docs.tempo.xyz/protocol/tip20/overview#transfer-memos
[Stellar-Memos]: https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions#memo
[XRPL-Tags]: https://xrpl.org/docs/concepts/transactions/source-and-destination-tags
[Cosmos-TxBody]: https://docs.cosmos.network/main/learn/advanced/transactions

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
