# Agents

## Details

| TAIP | Authors        | Status | Created    | Updated    |
| ---- | -------------- | ------ | ---------- | ---------- |
| 5    | Richard Crosby | Draft  | 12/19/2023 | 12/19/2023 |

## Summary

Agents are the wallets, exchanges and other services directly involved in a transaction. To authorize a transaction, the full chain of transaction participants must be represented and given an opportunity to authorize.

## Abstract

## Motivation

Existing attempts at representing transaction participants authorizing crypto transactions have focused narrowly on the FATF Travel Rule originator VASP and beneficiary VASP concepts. By introducing the concept of Agents, TAP is able to capture all participants in a transaction, including ones that don't necessarily represent the ultimate originator and beneficiary.

Representing the full chain of agents in a transaction, enables risk management, trust and compliance through the full chain.

## Specification

### Identifying Agents

Agents are identified using Decentralized Identifiers (DIDs).

Agents creating DIDs and implementing TAP should publish [a service](https://www.w3.org/TR/did-core/#dfn-service) to the [DIDDoc](https://www.w3.org/TR/did-core/#dfn-did-documents):

```json
{
  "did": "did:web:tap.rsvp",
  ...
  "service": [
    {
      "id": "did:web:tap.rsvp#tap",
      "type": "DIDCommMessaging",
      "serviceEndpoint":  {
        "uri": "https://tap.rsvp/didcomm"
      }
    }
  ]
}
```

### Representing Agents

Agents are represented in TAP in very simple JSON-LD node syntax:

```json
{
  "@id": "did:web:vasp.com"
}
```

Future TAIPs are encouraged to extend the agent model with additional functionality.

### Centralized Agents

Centralized agents such as VASPs, Custodial Wallet APIs, Payment Providers, or any other public service providers should use [Web DIDs](https://w3c-ccg.github.io/did-method-web/).

Web DIDs have an important property that permits passive agents to be represented in a transaction. Since centralized agents nearly always have a domain name, other active agents using TAP may add these agents without their active involvement.

### Self-Hosted Wallets

Since every wallet address has a blockchain account address, self-hosted wallets should be represented as a [PKH DID](https://github.com/w3c-ccg/did-pkh/blob/main/did-pkh-method-draft.md) using [CAIP-10](https://chainagnostic.org/CAIPs/caip-10) identifiers.

For example, the Ethereum address can be represented as:

```json
{
  "@id": "did:pkh:eip155:1:0xab16a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"
}
```

### Ordering

Agents should be represented as an ordered list that represents the full chain of a transaction. To do so, lists of Agents should be represented using [JSON-LD List](https://www.w3.org/TR/json-ld11/#lists) syntax:

```json
"agents": {
  "@list": [
    {
      "@id": "did:pkh:eip155:1:0xab16a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"
    },
    {
      "@id": "did:web:vasp-a.com"
    },
    {
      "@id": "did:web:vasp-b.com"
    },
    {
      "@id": "did:pkh:eip155:1:0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
    },
  ]
}
```

## Rationale

Why were certain design decisions made? References to alternatives and why the proposed solution addresses the problem better should also be added here. Any notable objections/concerns should also be noted here for future reference.

## Test Cases

Provide here any test cases that will help implementers of the TAIP to validate their implementation.

## Security Concerns

Are there any security concerns that this TAIP addresses or that implementers should be aware of?

## Privacy Considerations

Are there any privacy considerations that need to be considered by implementers when implementing this TAIP?

## Backwards Compatibility

Does this TAIP introduce any backwards incompatible changes?
