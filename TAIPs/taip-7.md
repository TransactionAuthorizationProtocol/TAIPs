---
taip: 7
title: Agent Policies
author: Pelle Braendgaard <pelle@notabene.id>, Andrés Junge <andres@notabene.id>, Richard Crosby <richard@notabene.id>
status: Draft
type: Standard
created: 2024-01-23
updated: 2024-01-23
discussions-to: https://github.com/TransactionAuthorizationProtocol/TAIPs/pull/8
requires: 2, 4
---

<!--You can leave these HTML comments in your merged EIP and delete the visible duplicate text guides, they will not appear and may be helpful to refer to if you edit it again. This is the suggested template for new EIPs. Note that an EIP number will be assigned by an editor. When opening a pull request to submit your EIP, please use an abbreviated title in the filename, `eip-draft_title_abbrev.md`. The title should be 44 characters or less.-->
## Simple Summary
<!--"If you can't explain it simply, you don't understand it well enough." Provide a simplified and layman-accessible explanation of the TAIP.-->
Agents as specified in [TAIP-5] are services, often run by businesses who have business, contractual, and regulatory reasons for managing risk regarding transactions. Individuals may also create their own policies to protect themselves from unwanted liability and security risks. As part of [TAIP-4] they can declare their own requirements for authorizing a transaction as policies.

## Abstract
<!--A short (~200 word) description of the technical issue being addressed.-->
This allows [TAIP-5 Agents][TAIP-5] to specify their requirements  to authorize a transaction as part of the [Transaction Authorization Protocol Flow][TAIP-4]. These policies can be used to negotiate the exchange of information each Agent requires to be able to swiftly authorize or reject a transaction.

## Motivation
<!--The motivation is critical for TAIP. It should clearly explain why the state of the art is inadequate to address the problem that the TAIP solves. TAIP submissions without sufficient motivation may be rejected outright.-->
Traditional centrally managed Payment Associations issue shared guidelines and policies as part of their membership agreements, that makes sure information requirements are standardized regionally and globally. [TAP][TAIP-4] was designed to work in a decentralized ecosystem based on public blockchains, with no centralized association to design a set of policies.

Use cases and regulation is rapidly expanding around the world, and some jurisdictions have stricter requirements than others. E-commerce and trading use-cases also have different requirements, so can't be standardized in a global set of policies for everyone to implement.

The approach proposed here allows each agent to declare their policies, and allow each agent to decide if they want to comply with them based on balancing risk and business value. This allows a market based approach to rolling out policies, instead of a top down policy by a national or trans-national organization.

## Specification

### Policy types

Policies are listed in the optional `policies` attribute of a [TAIP-5] object. Policies are implemented as [JSON-LD] objects with a specific type. This allows future Policies to easily be expanded and linked to.

In the following example an Agent has included their policies:

```json
{
  "@id":"did:web:originator.vasp",
  "policies": [
    {
      "@type":"RequireAuthorization",
      "fromAgent":"beneficiary"
    },
    {
      "@type":"RequireBeneficiaryCheck",
      "fromAgent":"beneficiary"
    },
    {
      "@type":"RequireProofOfControl",
      "fromRole":"SettlementAddress"
    }
  ]
}
```

A policy is a [JSON-LD] object and has the following required attribute:

- `@type` - REQUIRED the Type of the policy, which should be defined in a context defined in the containing [JSON-LD] document. The TAP Vocabulary contains a few standard ones to be covered below

Since a policy is defined by it's [JSON-LD] Type it can contain additional required or optional attributes. The standard TAP Vocabulary contains the following:
  
- `from` - OPTIONAL a string or an array of [DID]s representing parties or agent in a transaction
- `fromRole` - OPTIONAL a string or an array of strings of `role` as specified for the particular kind of transaction. Eg. `SettlementAddress` for [TAIP-3]
- `fromAgent` - OPTIONAL from an Agent representing a party in the transaction. Eg. `originator` or `beneficiary` in [TAIP-3]

### `RequireAuthorization`

An agent requires an `authorize` action before they will settle a transaction. If no additional parameters are provided, it requires each agent to `authorize` a transaction. They can use `from`, `fromRole`, or `fromAgent` as defined above to limit this requirement.

- `@type` - REQUIRED `RequireAuthorization`
- `from` - OPTIONAL a string or an array of [DID]s representing parties or agent in a transaction
- `fromRole` - OPTIONAL a string or an array of strings of `role` as specified for the particular kind of transaction. Eg. `SettlementAddress` for [TAIP-3]
- `fromAgent` - OPTIONAL from an Agent representing a party in the transaction. Eg. `originator` or `beneficiary` in [TAIP-3]


```json
{
  "@type":"RequireAuthorization",
  "fromAgent":"beneficiary"
}
```

### `RequirePresentation`

This is a generic way of requesting a selected [Verifiable Presentation][VP] from another agent in the transaction of a particular identity information regarding a party or agent.

- `@type` - REQUIRED `RequirePresentation`
- `fromAgent` - REQUIRED Requesting presentation from an Agent representing the party in the transaction. Eg. `originator` or `beneficiary` in [TAIP-3]
- `about` - OPTIONAL Requesting presentation about a string or an array of [DID]s representing specific parties or agent in a transaction.
- `aboutParty` - OPTIONAL Requesting presentation about a specific party in the transaction. Eg. `originator` or `beneficiary` in [TAIP-3]
- `aboutAgent` - OPTIONAL Requesting presentation about a specific Agent representing a party in the transaction. Eg. `originator` or `beneficiary` in [TAIP-3]
- `credentials` - REQUIRED [JSON-LD] Object containing requested credentials for each accepted `@type` of party


```json
{
  "@type":"RequirePresentation",
  "@context":["https://schema.org/Person", "https://www.gleif.org/ontology/Base/Entity"],
  "fromAgent":"originator",
  "aboutParty":"originator",
  "credentials": {
    "Person": ["firstName","lastName","nationalId"],
    "Entity": ["LEI"]
  }
}
```


See [TAIP-8] for more details about how the requested presentation is presented.


### `RequireProofOfControl`

An agent likely on the originator side could require that prior to settling funds to a customer or providing originator PII, that an beneficiary performs an address ownership proof, and what standard to use. For illustrative purposes this could be presented using a message `proof-of-control`.

- `@type` - REQUIRED `RequireProofOfControl`
- `from` - OPTIONAL a string or an array of [DID]s representing parties or agent in a transaction
- `fromRole` - OPTIONAL a string or an array of strings of `role` as specified for the particular kind of transaction. Eg. `SettlementAddress` for [TAIP-3]
- `fromAgent` - OPTIONAL from an Agent representing a party in the transaction. Eg. `originator` or `beneficiary` in [TAIP-3]


See [TAIP-9] for more details.

### Agent Policy Object

In parallel with the [Authorization Flow][TAIP-4] agents can send [TAIP-2] messages to other participants to provide or prove additional details about themselves or other participants. This allows agents to collaborate together to fulfill each others policies, so the can succesfully authorize a transaction.

Please note that like any [TAIP-2] messages, these are just messages sent by an agent. For security purposes a receiving Agent MUST determine if they can trust the sender for the information provided.

Any Agent can send one of the following messages:

- `AddAgents` - Adds one or more additional agents to the transaction
- `ReplaceAgent` - Replace an agent with another agent
- `RemoveAgent` - Removes an agent from transaction

#### UpdatePolicy

In parallel with the [Authorization Flow][TAIP-4] agents can send [TAIP-2] messages to other participants to provide or prove additional details about their policy. This allows them to dynamically update requirements based on changing risk in real-time.

Please note that like any [TAIP-2] messages, these are just messages sent by an agent. For security purposes a receiving Agent MUST determine if they can trust the sender for the information provided.

Any agent can add additional agents to a transaction by replying as a thread to the initial message. The following shows the attributes of the `body` object:

- `@context` - REQUIRED the JSON-LD context `https://tap.rsvp/schema/1.0` (provisional)
- `@type` - REQUIRED the JSON-LD type `https://tap.rsvp/schema/1.0#UpdatePolicy` (provisional)
- `policies` - REQUIRED an array of Policies to replace the current set of policies

If an existing transaction agent is included in the list of `agents` an Agent SHOULD update their internal record for this agent with any additional data provided in this message.

Any new agents added should be included in the `to` recipient list of the message.

## Rationale


## Test Cases

Provide here any test cases that will help implementers of the TAIP to validate their implementation.

### Specific Policies

### TAIP-3 Asset Transfers

#### Missing Nodes

See the following [TAIP-3] message outlining a typical Asset Transfer where a customer is asking to transfer funds to a blockchain address:

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
    "amountSubunits": "1230000000000000000",
    "settlementId":"eip155:1:tx/0x3edb98c24d46d148eb926c714f4fbaa117c47b0c0821f38bfce9763604457c33",
    "agents":[
      {
        "@id":"did:web:originator.vasp",
        "for":"did:eg:bob"
      },
      {
        "@id":"did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
        "role":"SettlementAddress"
      }
    ]
  }
}
```

#### Complete example showing VASP to VASP third party Asset Transfer

After completing the discovery aspects  of TAP the Asset Transfer could look like this with a third party beneficiary and a VASP controlling the Settlement Address:

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
      "@id":"did:eg:alice"
    },
    "asset": "eip155:1/slip44:60",
    "amountSubunits": "1230000000000000000",
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
        "for":"did:eg:alice"
      },
      {
        "@id":"did:web:walletapi.sample",
        "for":"did:web:beneficiary.vasp"
      },
      {
        "@id":"did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
        "for":"did:web:walletapi.sample",
        "role":"SettlementAddress"
      }
    ]
  }
}
```

#### Complete example showing VASP to first party self-hosted wallet Asset Transfer

After completing the discovery aspects of TAP we discover the Asset Transfer goes to the customer's own self-hosted wallet address:

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
      "@id":"did:eg:bob",
    },
    "asset": "eip155:1/slip44:60",
    "amountSubunits": "1230000000000000000",
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


### UpdatePolicy Messages

The following are example plaintext messages. See [TAIP-2] for how to sign the messages.

#### AddAgents

```json
{
 "from":"did:web:beneficiary.vasp",
  "type": "https://tap.rsvp/schema/1.0#UpdatePolicy",
  "thid":"ID of transfer request",
  "to": ["did:web:originator.vasp"],
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#UpdatePolicy",
    "agents":[
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

## Security Considerations
<!--Please add an explicit list of intra-actor assumptions and known risk factors if applicable. Any normative definition of an interface requires these to be implementable; assumptions and risks should be at both individual interaction/use-case scale and systemically, should the interface specified gain ecosystem-namespace adoption. -->
As in any decentralized messaging protocol, it is paramount that the recipient of messages trust the senders in the context of a particular transaction.

TODO specify in more detail

## Privacy Considerations
<!--Please add an explicit list of intra-actor assumptions and known risk factors if applicable. Any normative definition of an interface requires these to be implementable; assumptions and risks should be at both individual interaction/use-case scale and systemically, should the interface specified gain ecosystem-namespace adoption. -->

## References
<!--Links to external resources that help understanding the TAIP better. This can e.g. be links to existing implementations. See CONTRIBUTING.md#style-guide . -->

- [TAIP-2] Defines the TAP Message structure
- [TAIP-3] Asset Transfer Message
- [TAIP-4] Transaction Authorization Protocol
- [TAIP-5] Agents
- [TAIP-6] Transaction Parties
- [TAIP-8] Selective Disclosure
- [TAIP-9] Proof of Control
- [CAIP-10] Describes chainagnostic Account ID Specification
- [CAIP-74] CACAO
- [ISO-20022] ISO-20022 Universal Financial Industry message scheme
- [ISO-8583] ISO-8683 Financial-transaction-card-originated messages
- [DID] W3C Decentralized Identifiers
- [DIDComm] DIDComm Messaging
- [DIDCommTransports] DIDComm Transports
- [DIDCommOOB] DIDComm Out-of-Band
- [VCModel] W3C Verifiable Credentials Data Model
- [VC] Verifiable Credentials
- [VP] Verifiable Presentation
- [PKH-DID] `did:pkh` specification
- [WEB-DID] `did:web` specification
  
[TAIP-2]: ./taip-2
[TAIP-3]: ./taip-3
[TAIP-4]: ./taip-4
[TAIP-5]: ./taip-5
[TAIP-6]: ./taip-6
[TAIP-8]: ./taip-8
[TAIP-9]: ./taip-9

[DID]: https://www.w3.org/TR/did-core/
[DIDComm]: https://identity.foundation/didcomm-messaging/spec/v2.1/
[DIDCommTransports]: <https://identity.foundation/didcomm-messaging/spec/v2.1/#transports>
[DIDCommOOB]: <https://identity.foundation/didcomm-messaging/spec/v2.1/#out-of-band-messages>
[VCModel]: <https://www.w3.org/TR/vc-data-model-2.0/>
[VC]: <https://www.w3.org/TR/vc-data-model-2.0/#credentials>
[VP]: <https://www.w3.org/TR/vc-data-model-2.0/#presentations>
[PKH-DID]: <https://github.com/w3c-ccg/did-pkh/blob/main/did-pkh-method-draft.md>
[WEB-DID]: <https://www.w3.org/did-method-web/>
[ISO-20022]: <https://www.iso20022.org>
[ISO-8583]: <https://en.wikipedia.org/wiki/ISO_8583>
[CAIP-10]: <https://chainagnostic.org/CAIPs/caip-10>
[CAIP-74]: <https://chainagnostic.org/CAIPs/caip-74>

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
