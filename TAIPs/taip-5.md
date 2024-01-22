---
taip: 5
title: Transaction Agents
author: Pelle Braendgaard <pelle@notabene.id>, Andrés Junge <andres@notabene.id>, Richard Crosby <richard@notabene.id>
status: Draft
type: Standard
created: 2024-01-22
updated: 2024-01-22
discussions-to: https://github.com/TransactionAuthorizationProtocol/TAIPs/pull/7
requires: 2
---

<!--You can leave these HTML comments in your merged EIP and delete the visible duplicate text guides, they will not appear and may be helpful to refer to if you edit it again. This is the suggested template for new EIPs. Note that an EIP number will be assigned by an editor. When opening a pull request to submit your EIP, please use an abbreviated title in the filename, `eip-draft_title_abbrev.md`. The title should be 44 characters or less.-->
## Simple Summary
<!--"If you can't explain it simply, you don't understand it well enough." Provide a simplified and layman-accessible explanation of the TAIP.-->
Agents are services involved in executing a transactions. They can be commercial services such as exchanges and custodial wallet services. They could also be wallets, blockchain addresses, DeFi Protocols, bridges, and other services directly involved in a transaction.

## Abstract
<!--A short (~200 word) description of the technical issue being addressed.-->
This is specifies how agents can represent themselves in a [Transaction Authorization Protocol Flow][TAIP-4], update details about themselves and interact implemented using a small set of [TAIP-2 Messages][TAIP-2] between each others.

Agents can be centralized services, software applications running on end-user devices, or decentralized protocols such as DEXes and Bridges.

## Motivation
<!--The motivation is critical for TAIP. It should clearly explain why the state of the art is inadequate to address the problem that the TAIP solves. TAIP submissions without sufficient motivation may be rejected outright.-->
Traditional payment authorization protocols such as [ISO-20022] or [ISO-8583] only support centralized financial institutions as agents and do not work well with self-hosted or decentralized participants.

For virtual asset transactions to become a core part of the worlds financial infrastructure, it is vital that all three kinds of agents can participate equally in the authorization flow of a transaction.

## Specification

### Representing Agents

Agents are identified using [Decentralized Identifiers (DIDs)][DID]. This provides a very useful identifier that can identify both centralized services, as well as blockchain specific services such as wallets and DeFi protocols. Agents are represented in TAP in very simple JSON-LD node syntax:

```json
{
  "@id": "did:web:vasp.com"
}
```

The following example shows it's use in a [TAIP-3] message:

```json
{
 "from":"did:web:originator.sample",
 "type": "https://tap.rsvp/schema/1.0#Transfer",
 "id": "...",
 "to": ["did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"],
 "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Transfer",
    "asset": "eip155:1/slip44:60",
    "originator":{
      "@id":"did:web:originator.sample"
    },
    "amountSubunits": "1230000000000000000",
    "agents":[
      {
        "@id":"did:web:originator.sample"
      },
      {
        "@id":"did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"
      }
    ]
  }
}
```

Future TAIPs are encouraged to extend the agent model with additional functionality.

### Agent Interaction Types

There are three primary ways of interacting with agents:

* Centralized Agents, who can interact in real-time with [TAIP-2 DIDComm Messages][TAIP-2] through a server endpoint defined in the [DIDComm Transports][DIDCommTransports]
* End-user controlled software such as self-hosted wallets, that can receive [TAIP-2 DIDComm Messages][TAIP-2] in an interactive User Interface using [DIDComm Out of Band][DIDCommOOB]
* Decentralized Protocol agents, such as DeFi protocols that can only communicate through blockchain transactions, possibly through an implementation of [CAIP-74]

### Identifying Agents

DID Methods, implement different ways of creating and modifying Decentralized Identifiers. The recommendation is to use the following two DID Methods:

* [WEB-DID] For centralized services, allowing them to be identified by their domain name.
* [PKH-DID] For agent identified by a [CAIP-10] blockchain address. As an example these could be both self-hosted and custodial wallets, but also allows us to identify DeFi protocols

### Web DID for Centralized Services

Centralized Agents creating DIDs and implementing TAP SHOULD create a [WEB-DID] containing the following required sections in the [DIDDoc](https://www.w3.org/TR/did-core/#dfn-did-documents):

* [service containing a DID endpoint](https://www.w3.org/TR/did-core/#dfn-service)
* [verificationMethod section containing public keys used for validating DIDComm message signatures](https://www.w3.org/TR/did-core/#verification-methods)
* [keyAgreement section containing public keys used for encrypted DIDComm messages](https://www.w3.org/TR/did-core/#key-agreement)


```json
{
  "did": "did:web:example.com",
  "verificationMethod": [
    {
      "id":"did:web:example.com#key-1",
      "type": "Ed25519VerificationKey2020",
      "controller": "did:web:example.com",
      "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
    }
  ],
  "keyAgreement":[
    {
     "id":"did:example:example.com#key-x25519-1",
     "type":"JsonWebKey2020",
     "controller":"did:example:example.com",
     "publicKeyJwk":{
        "kty":"OKP",
        "crv":"X25519",
        "x":"avH0O2Y4tqLAq8y9zpianr8ajii5m4F_mICrzNlatXs"
     }
    }
  ],
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


### PKH-DID's for Blockchain addresses

Since every wallet address has a blockchain account address, self-hosted wallets should be represented as a [PKH DID](https://github.com/w3c-ccg/did-pkh/blob/main/did-pkh-method-draft.md) using [CAIP-10](https://chainagnostic.org/CAIPs/caip-10) identifiers.

For example, the Ethereum address can be represented as:

```json
{
  "@id": "did:pkh:eip155:1:0xab16a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"
}
```

### Ordering 

TODO replace using types

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

## Security Considerations
<!--Please add an explicit list of intra-actor assumptions and known risk factors if applicable. Any normative definition of an interface requires these to be implementable; assumptions and risks should be at both individual interaction/use-case scale and systemically, should the interface specified gain ecosystem-namespace adoption. -->

## Privacy Considerations
<!--Please add an explicit list of intra-actor assumptions and known risk factors if applicable. Any normative definition of an interface requires these to be implementable; assumptions and risks should be at both individual interaction/use-case scale and systemically, should the interface specified gain ecosystem-namespace adoption. -->

## References
<!--Links to external resources that help understanding the TAIP better. This can e.g. be links to existing implementations. See CONTRIBUTING.md#style-guide . -->

* [TAIP-2] Defines the TAP Message structure
* [TAIP-3] Asset Transfer Message
* [TAIP-4] Transaction Authorization Protocol
* [TAIP-6] Transaction Parties
* [TAIP-7] Policies
* [CAIP-10] Describes chainagnostic Account ID Specification
* [CAIP-74] CACAO 
* [ISO-20022] ISO-20022 Universal Financial Industry message scheme
* [ISO-8583] ISO-8683 Financial-transaction-card-originated messages
* [DID] W3C Decentralized Identifiers
* [DIDComm] DIDComm Messaging
* [DIDCommTransports] DIDComm Transports
* [DIDCommOOB] DIDComm Out-of-Band
* [PKH-DID] `did:pkh` specification
* [WEB-DID] `did:web` specificatiokn
  
[TAIP-2]: ./taip-2
[TAIP-3]: ./taip-3
[TAIP-4]: ./taip-4
[TAIP-6]: ./taip-6
[TAIP-7]: ./taip-7
[DID]: https://www.w3.org/TR/did-core/
[DIDComm]: https://identity.foundation/didcomm-messaging/spec/v2.1/
[DIDCommTransports]: <https://identity.foundation/didcomm-messaging/spec/v2.1/#transports>
[DIDCommOOB]: <https://identity.foundation/didcomm-messaging/spec/v2.1/#out-of-band-messages>
[PKH-DID]: <https://github.com/w3c-ccg/did-pkh/blob/main/did-pkh-method-draft.md>
[WEB-DID]: <https://www.w3.org/did-method-web/>
[ISO-20022]: <https://www.iso20022.org>
[ISO-8583]: <https://en.wikipedia.org/wiki/ISO_8583>
[CAIP-10]: <https://chainagnostic.org/CAIPs/caip-10>
[CAIP-74]: <https://chainagnostic.org/CAIPs/caip-74>

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
