---
taip: TAIP-19
title: Fee Allocation
author: Onuwa Nnachi Isaac <isaac.onuwa@notabene.id>
discussions-to: https://github.com/TransactionAuthorizationProtocol/TAIPs/discussions/19
status: Draft
type: Standard
created: 2025-09-14
updated: 2025-09-14
requires: [1,7,8,12]
---

## Simple Summary

A specification for allocating, recording, and settling service fees among TAP agents.
Defines FeeReceipt and FeeBatch messages to ensure predictable, auditable, and fair incentives for authorization, routing, and execution agents.
Enables interoperability and composability across TAP flows.

## Abstract

TAIP-19 introduces FeeReceipt and FeeBatch message types for allocating, recording, and settling service fees among TAP agents.
The proposal establishes a standardized schema for fee calculation, signature verification, batching, and reconciliation.
FeeReceipts represent single fee obligations signed using [EIP-712].
FeeBatches aggregate receipts into Merkle proofs for scalable settlement.
This ensures transparent and predictable incentives for agents, while maintaining composability with existing TAP flows.

## Motivation

As TAP adoption grows, agents play critical roles in authorization, routing, compliance checks, and execution.
Without a standard schema for fees, participants face inconsistent compensation, risk of disputes, and lack of transparency.
This proposal establishes a uniform fee allocation system, integrating with existing TAP messaging while remaining settlement-agnostic.

## Specification

### Fee Types

- **Authorization Fee**: for validating or approving a transaction request [TAIP-8].
- **Routing Fee**: for forwarding or relaying a transaction message [TAIP-12].
- **Execution Fee**: for finalizing a transaction on a target blockchain or service.

### Payment Unit

- Fees may be denominated in ERC-20 tokens, stablecoins, or fiat currency codes [ISO-4217].
- Agents must declare supported units during registration [TAIP-7].
- Conversion into settlement assets is out of scope.

### Message Types

- **FeeReceipt**: describes a single fee obligation, including payer, payee, fee type, amount, unit, reference, and timestamp.
- **FeeBatch**: aggregates multiple FeeReceipts and includes a Merkle root for verification.

### Signing and Verification

- FeeReceipts must be signed using [EIP-712] typed data.
- Signatures must bind to [CAIP-10] agent identifiers.
- Nonce or transaction reference prevents replay.

### Settlement

- TAP does not prescribe the settlement rails.
- Fees may be settled off-chain via fiat, custodial ledgers, or blockchain payments.
- FeeBatch provides an auditable record of obligations to support reconciliation between parties.

### Governance Parameters

- Governance may define maximum fee percentages relative to transaction value.
- Governance may approve or revoke supported tokens.
- Governance may require reporting intervals for FeeBatches.

## Rationale

Anchoring fee allocation in [TAIP-7], [TAIP-8], and [TAIP-12] ensures only valid, authorized agents may receive fees.
Using [EIP-712] signatures ensures compatibility with wallets and SDKs.
Merkle batching provides scalability and auditability without requiring all receipts to be stored on chain.

Explicitly out of scope are: settlement rails, asset conversion, and dispute resolution — these depend on governance or bilateral agreements.

## Test Cases

- Generate a FeeReceipt with valid [EIP-712] signature and verify against the payee’s [CAIP-10] identifier.
- Reject FeeReceipts with duplicate nonces (replay prevention).
- Aggregate multiple FeeReceipts into a FeeBatch, compute Merkle root, and verify inclusion proof for each receipt.
- Verify that `totalAmount` in FeeBatch equals the sum of all included FeeReceipts.

## Security Considerations

- Replay prevention enforced with nonces or unique references.
- FeeReceipts must be signed to ensure non-repudiation.
- [CAIP-10] identifiers must be validated to prevent impersonation.
- Forged Merkle roots in FeeBatch must be detectable via proof verification.

## Privacy Considerations

- FeeReceipts and FeeBatches may reveal payer–payee relationships.
- Use of pseudonymous DIDs may mitigate linkage risk.
- Aggregation in FeeBatch reduces exposure of individual receipts but does not eliminate metadata disclosure.

## Backwards Compatibility

TAP systems that do not implement fee allocation may ignore FeeReceipts and FeeBatches.
Existing TAP message flows remain unaffected.

## References

- [TAIP-1] Process
- [TAIP-7] Agent Policies
- [TAIP-8] Selective Disclosure and Authorization
- [TAIP-12] Transaction Execution
- [EIP-712] Typed Structured Data Hashing and Signing
- [ERC-20] Token Standard
- [CAIP-10] Account ID Specification
- [ISO-4217] Currency Codes

[TAIP-1]: https://tap.rsvp/TAIPs/taip-1
[TAIP-7]: https://tap.rsvp/TAIPs/taip-7
[TAIP-8]: https://tap.rsvp/TAIPs/taip-8
[TAIP-12]: https://tap.rsvp/TAIPs/taip-12
[EIP-712]: https://eips.ethereum.org/EIPS/eip-712
[ERC-20]: https://eips.ethereum.org/EIPS/eip-20
[CAIP-10]: https://chainagnostic.org/CAIPs/caip-10
[ISO-4217]: https://www.iso.org/iso-4217-currency-codes.html

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
