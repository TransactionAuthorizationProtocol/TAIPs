---
taip: 6
title: Transaction Parties
author: Pelle Braendgaard <pelle@notabene.id>, Andrés Junge <andres@notabene.id>, Richard Crosby <richard@notabene.id>
status: Draft
type: Standard
created: 2024-01-22
updated: 2024-01-22
discussions-to: https://github.com/TransactionAuthorizationProtocol/TAIPs/pull/8
requires: 2
---

<!--You can leave these HTML comments in your merged EIP and delete the visible duplicate text guides, they will not appear and may be helpful to refer to if you edit it again. This is the suggested template for new EIPs. Note that an EIP number will be assigned by an editor. When opening a pull request to submit your EIP, please use an abbreviated title in the filename, `eip-draft_title_abbrev.md`. The title should be 44 characters or less.-->
## Simple Summary
<!--"If you can't explain it simply, you don't understand it well enough." Provide a simplified and layman-accessible explanation of the TAIP.-->
Parties are the real-world entities involved with a transaction. It could be either legal or natural persons. Parties can control Agents who are part of performing a transaction but are distinct from, for example, a software wallet they control.

## Abstract
<!--A short (~200 word) description of the technical issue being addressed.-->
This specification defines how parties are represented in a [Transaction Authorization Protocol Flow][TAIP-4] and their relationships with one or more agents.

## Motivation
<!--The motivation is critical for TAIP. It should clearly explain why the state of the art is inadequate to address the problem that the TAIP solves. TAIP submissions without sufficient motivation may be rejected outright.-->
Blockchains often use blockchain addresses instead of the ultimate parties to a transaction. They are missing the context required to tie a transaction into a real-world use case, such as an e-commerce payment, payroll, or other transactions requiring record keeping, legal recourse, and risk mitigation based on real-world counterparties.

## Specification

### Representing Parties

Parties are identified using an [IRI] as the @id attribute in a [JSON-LD] object. IRIs are the internationalized updated version of URIs that most people know today. IRI’s typically used as identifiers today represent [email addresses][MAILTO] and [phone numbers][SMS]. Modern [Decentralized Identifiers (DIDs)][DID], which allow users to create and manage their own identities in a decentralized manner, are also recommended.

Parties represented in [TAIP-2] messages using a straightforward [JSON-LD] node syntax with the following attributes

* `@id` - REQUIRED the [IRI] of the Party

```json
{
  "@id": "did:web:vasp.com"
}
```

#### Specifying additional information about a party

Additional details can be submitted within a party object, using [JSON-LD] to add other meta-data. This MUST not be used to provide private verified information about a natural person such as that obtained through a KYC process. See the Privacy Considerations section below for more. This information can be requested and exchanged using [TAIP-8 Selective Disclosure][TAIP-8].

As an example you could add information about the country of a party like this:

```json
{
  "@context":{"cc":"https://schema.org/addressCountry"},
  "@id":"did:eg:bob",
  "cc:addressCountry":"de"
}
```

Or add the [LEI](https://www.gleif.org/en/about-lei/introducing-the-legal-entity-identifier-lei) of an institution like this:

```json
{
  "@context":{
    "lei":"https://schema.org/leiCode"
   },
  "@id":"did:web:sample.com",
  "lei:leiCode":"..."
}
```

Future TAIPs can add additional attributes to parties. Since it is JSON-LD, you could add additional data from other contexts.

### Types of Parties

Each transaction type can specify different methods of naming the attribute used to be semantically correct within the context of it's scope.

For example parties in a [TAIP-3] message consist of the following two attributes in it's `body`:

* `originator` representing the originator (or sender) of the Asset Transfer
* `beneficiary` representing the beneficiary (or recipient) of the Asset Transfer

Future TAIPs can define additional types of parties. Examples.

* `issuer` of a real world asset
* `trustee`, `grantor`, `beneficiary` for a trust
* `buyer`, `seller` for a sales contract
 
### Agents for Parties

Any Agent can add a `for` attibute to their Agent object (see [TAIP-5]). This specifies that the agent is an agent for the [DID] or [IRI] for a particular party.

Any Agent can send one of the following messages:

* `UpdateParty` - Adds one or updates a party to a transaction

#### UpdateParty

Any agent can update a party to a transaction by replying as a thread to the initial message. The following shows the attributes of the `body` object:

* `@context` - REQUIRED the JSON-LD context `https://tap.rsvp/schema/1.0` (provisional)
* `@type` - REQUIRED the JSON-LD type `https://tap.rsvp/schema/1.0#UpdateParty` (provisional)
* `partyType` - REQUIRED a string indicating the type of party to be updated. Eg. for [TAIP-3] this could be `originator` or `beneficiary`
* `party` - REQUIRED a Party Object to be added to the transaction.

If an existing transaction party is already included in the transaction an Agent SHOULD update their internal record for this party with any additional data provided in this message.

## Rationale

TODO

## Test Cases

Provide here any test cases that will help implementers of the TAIP to validate their implementation.

### TAIP-3 Asset Transfers

#### Missing Beneficiary Information

See the following [TAIP-3] message outlining a typical Asset Transfer where a customer asks to transfer funds to a blockchain address. It misses information about who the beneficiary is, which has to be discovered to complete the transaction::

```json
{
  "from":"did:web:originator.vasp",
  "type": "https://tap.rsvp/schema/1.0#Transfer",
  "id": "...",
  "to": ["did:web:beneficiary.vasp", "did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"],
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Transfer",
    "originator":{
      "@id":"did:eg:bob",
    },
    "asset": "eip155:1/slip44:60",
    "amount": "1.23",
    "settlementId":"eip155:1:tx/0x3edb98c24d46d148eb926c714f4fbaa117c47b0c0821f38bfce9763604457c33",
    "agents":[
      {
        "@id":"did:web:originator.vasp",
        "for":"did:eg:bob",
      },
      {
        "@id":"did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
        "role":"SettlementAddress"
      }
    ]
  }
}
```

#### Complete example showing VASP to VASP third-party Asset Transfer

After completing the discovery aspects of TAP, the Asset Transfer could look like this with a third-party beneficiary and a VASP controlling the Settlement Address. It now has all the required information to complete it:

```json
{
  "from":"did:web:originator.vasp",
  "type": "https://tap.rsvp/schema/1.0#Transfer",
  "id": "...",
  "to": ["did:web:beneficiary.vasp", "did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"],
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Transfer",
    "originator":{
      "@id":"did:eg:bob",
    },
    "beneficiary":{
      "@id":"did:eg:alice",
    },
    "asset": "eip155:1/slip44:60",
    "amount": "1.23",
    "settlementId":"eip155:1:tx/0x3edb98c24d46d148eb926c714f4fbaa117c47b0c0821f38bfce9763604457c33",
    "agents":[
      {
        "@id":"did:pkh:eip155:1:0xabcda96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
        "for":"did:web:originator.vasp",
        "role":"SourceAddress"
      },
      {
        "@id":"did:web:originator.vasp",
        "for":"did:eg:bob",
      },
      {
        "@id":"did:web:beneficiary.vasp",
        "for":"did:eg:alice",
      },
      {
        "@id":"did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
        "for":"did:web:beneficiary.vasp",
        "role":"SettlementAddress"
      }
    ]
  }
}
```

#### Complete example showing VASP to first-party self-hosted wallet Asset Transfer

After completing the discovery aspects of TAP, we discover the Asset Transfer goes to the customer’s self-hosted wallet address:

```json
{
  "from":"did:web:originator.vasp",
  "type": "https://tap.rsvp/schema/1.0#Transfer",
  "id": "...",
  "to": ["did:web:beneficiary.vasp", "did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"],
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Transfer",
    "originator":{
      "@id":"did:eg:bob"
    },
    "beneficiary":{
      "@id":"did:eg:bob",
    },
    "asset": "eip155:1/slip44:60",
    "amount": "1.23",
    "settlementId":"eip155:1:tx/0x3edb98c24d46d148eb926c714f4fbaa117c47b0c0821f38bfce9763604457c33",
    "agents":[
      {
        "@id":"did:pkh:eip155:1:0xabcda96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
        "for":"did:web:originator.vasp",
        "role":"SourceAddress"
      },
      {
        "@id":"did:web:originator.vasp",
        "for":"did:eg:bob"
      },
      {
        "@id":"did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
        "for":"did:eg:bob",
        "role":"SettlementAddress"
      }
    ]
  }
}
```

### Party specific messages

The following are example plaintext messages. See [TAIP-2] for how to sign the messages.

#### UpdateParty example

```json
{
 "from":"did:web:beneficiary.vasp",
  "type": "https://tap.rsvp/schema/1.0#AddAgents",
  "thid":"ID of transfer request",
  "to": ["did:web:originator.vasp"],
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#UpdateParty",
    "partyType":"beneficiary",
    "party": {
      "@context":{"iso":"https://schema.org/addressCountry"},
      "@id":"did:eg:bob",
      "iso:addressCountry":"de"
    }
  }
}
```


## Security Considerations
<!--Please add an explicit list of intra-actor assumptions and known risk factors if applicable. Any normative definition of an interface requires these to be implementable; assumptions and risks should be at both individual interaction/use-case scale and systemically, should the interface specified gain ecosystem-namespace adoption. -->
As in any decentralized messaging protocol, it is paramount that the recipient of messages trust the senders in the context of a particular transaction.

TODO specify in more detail.

## Privacy Considerations
<!--Please add an explicit list of intra-actor assumptions and known risk factors if applicable. Any normative definition of an interface requires these to be implementable; assumptions and risks should be at both individual interaction/use-case scale and systemically, should the interface specified gain ecosystem-namespace adoption. -->
Parties represent real-world entities, both natural and legal persons. For this reason, it is essential to take privacy concerns very seriously. [TAIP-2] supports encrypted messages, and the message content can be end-to-end encrypted. Not all recipients need access to the PII of an ultimate party to a transaction.

We are proposing a privacy-preserving Selective Disclosure scheme in [TAIP-8] designed to minimize the exposure of PII to a minimum and also consider the managing process of requesting and responding to required PII.

## References
<!--Links to external resources that help understanding the TAIP better. This can e.g. be links to existing implementations. See CONTRIBUTING.md#style-guide . -->

* [TAIP-2] Defines the TAP Message structure
* [TAIP-3] Asset Transfer Message
* [TAIP-4] Transaction Authorization Protocol
* [TAIP-5] Transaction Agents
* [TAIP-8] Selective Disclosure
* [CAIP-10] Describes chainagnostic Account ID Specification
* [ISO-20022] ISO-20022 Universal Financial Industry message scheme
* [ISO-8583] ISO-8683 Financial-transaction-card-originated messages
* [IRI] Internationalized Resource Identifiers
* [MAILTO] The `mailto` URI scheme
* [SMS] The `sms` URI Scheme for Global System for Mobile Communications (GSM) Short Message Service (SMS)
* [DID] W3C Decentralized Identifiers
* [DIDComm] DIDComm Messaging
* [DIDCommTransports] DIDComm Transports
* [DIDCommOOB] DIDComm Out-of-Band
* [PKH-DID] `did:pkh` specification
* [WEB-DID] `did:web` specification
* [JSON-LD][JSON-LD] JSON Linked Data

[TAIP-2]: ./taip-2
[TAIP-3]: ./taip-3
[TAIP-4]: ./taip-4
[TAIP-5]: ./taip-5
[TAIP-8]: ./taip-8
[IRI]: https://datatracker.ietf.org/doc/rfc3987/
[DID]: https://www.w3.org/TR/did-core/
[MAILTO]: https://www.iana.org/go/rfc6068
[SMS]: https://www.rfc-editor.org/rfc/rfc5724.html
[JSON-LD]: https://www.w3.org/TR/json-ld
[DIDComm]: https://identity.foundation/didcomm-messaging/spec/v2.1/
[DIDCommTransports]: <https://identity.foundation/didcomm-messaging/spec/v2.1/#transports>
[DIDCommOOB]: <https://identity.foundation/didcomm-messaging/spec/v2.1/#out-of-band-messages>
[PKH-DID]: <https://github.com/w3c-ccg/did-pkh/blob/main/did-pkh-method-draft.md>
[WEB-DID]: <https://www.w3.org/did-method-web/>
[ISO-20022]: <https://www.iso20022.org>
[ISO-8583]: <https://en.wikipedia.org/wiki/ISO_8583>
[CAIP-10]: <https://chainagnostic.org/CAIPs/caip-10>

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
