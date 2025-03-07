---
taip: 7
title: Agent Policies
author: Pelle Braendgaard <pelle@notabene.id>, Andrés Junge <andres@notabene.id>, Richard Crosby <richard@notabene.id>
status: Review
type: Standard
created: 2024-01-23
updated: 2025-03-07
discussions-to: https://github.com/TransactionAuthorizationProtocol/TAIPs/pull/9
requires: 2, 4, 5, 6
---

<!--You can leave these HTML comments in your merged EIP and delete the visible duplicate text guides, they will not appear and may be helpful to refer to if you edit it again. This is the suggested template for new EIPs. Note that an EIP number will be assigned by an editor. When opening a pull request to submit your EIP, please use an abbreviated title in the filename, `eip-draft_title_abbrev.md`. The title should be 44 characters or less.-->
## Simple Summary
<!--"If you can't explain it simply, you don't understand it well enough." Provide a simplified and layman-accessible explanation of the TAIP.-->
As specified in [TAIP-5], agents are services often run by businesses that have business, contractual, and regulatory reasons for managing risk regarding transactions. Individuals may also create policies to protect themselves from unwanted liability and security risks. As part of [TAIP-4] they can declare their requirements for authorizing a transaction as policies.

## Abstract
<!--A short (~200 word) description of the technical issue being addressed.-->
This specification allows [TAIP-5 Agents][TAIP-5] to specify their requirements to authorize a transaction as part of the [Transaction Authorization Protocol Flow][TAIP-4]. These policies are used to negotiate the exchange of information each Agent requires to be able to authorize or reject a transaction swiftly.

## Motivation
<!--The motivation is critical for TAIP. It should clearly explain why the state of the art is inadequate to address the problem that the TAIP solves. TAIP submissions without sufficient motivation may be rejected outright.-->
Traditional centrally managed Payment Associations issue shared guidelines and policies as part of their membership agreements, ensuring information requirements are standardized regionally and globally. [TAP][TAIP-4] was designed to work in a decentralized ecosystem based on public blockchains, with no centralized association to create a set of policies.

Use cases and regulations are rapidly expanding worldwide, and some jurisdictions have stricter requirements than others. E-commerce and trading use cases also have different requirements, so they can’t be standardized in a global set of policies for everyone to implement.

The approach proposed here allows each agent to declare their policies and will enable each agent to decide if they want to comply with them based on balancing risk and business value.

This method allows a market-based approach to rolling out policies instead of a top-down policy by a national or transnational organization.

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
      "@type":"RequireRelationshipConfirmation",
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
- `purpose` - OPTIONAL Human readable string about what the purpose is for this requirement


#### `RequireAuthorization`

An agent requires an `authorize` action before they will settle a transaction. If no additional parameters are provided, it requires each agent to `authorize` a transaction. They can use `from`, `fromRole`, or `fromAgent` as defined above to limit this requirement.

- `@type` - REQUIRED `RequireAuthorization`
- `from` - OPTIONAL a string or an array of [DID]s representing parties or agent in a transaction
- `fromRole` - OPTIONAL a string or an array of strings of `role` as specified for the particular kind of transaction. Eg. `SettlementAddress` for [TAIP-3]
- `fromAgent` - OPTIONAL from an Agent representing a party in the transaction. Eg. `originator` or `beneficiary` in [TAIP-3]
- `purpose` - OPTIONAL Human readable string about what the purpose is for this requirement


#### `RequirePresentation`

This is a generic way of requesting a selected [Verifiable Presentation][VP] from another agent in the transaction of a particular identity information regarding a party or agent.

- `@type` - REQUIRED `RequirePresentation`
- `fromAgent` - REQUIRED Requesting presentation from an Agent representing the party in the transaction. Eg. `originator` or `beneficiary` in [TAIP-3]
- `about` - OPTIONAL Requesting presentation about a string or an array of [DID]s representing specific parties or agent in a transaction.
- `aboutParty` - OPTIONAL Requesting presentation about a specific party in the transaction. Eg. `originator` or `beneficiary` in [TAIP-3]
- `aboutAgent` - OPTIONAL Requesting presentation about a specific Agent representing a party in the transaction. Eg. `originator` or `beneficiary` in [TAIP-3]
- `purpose` - OPTIONAL Human readable string about what the purpose is for this requirement
- `presentationDefinition` - REQUIRED a URL to a [Presentation Definition][PExDef] defining required information

See [TAIP-8] for more details about how the requested presentation is presented.

#### `RequireRelationshipConfirmation`

An Agent can request any other Agent signs a message proving they control a given agent. In most cases this would be useful to verify that a `SettlementAddress` is controlled by the Beneficiary or an Agent on behalf of the Beneficiary. This ensures that funds are sent to the correct address for the beneficiary to avoid loss of funds. It can also be used for an Agent to verify their relationship to a transaction, before receiving sensitive PII from another agent.

- `@type` - REQUIRED `RequireRelationshipConfirmation`
- `from` - OPTIONAL a string or an array of [DID]s representing parties or agent in a transaction
- `fromRole` - OPTIONAL a string or an array of strings of `role` as specified for the particular kind of transaction. Eg. `SettlementAddress` for [TAIP-3]
- `fromAgent` - OPTIONAL from an Agent representing a party in the transaction. Eg. `originator` or `beneficiary` in [TAIP-3]
- `nonce` - REQUIRED Randomized token to prevent signature replay attacks.
- `purpose` - OPTIONAL Human readable string about what the purpose is for this requirement

See [TAIP-9] for more details on how the proof is performed and shared.

### `UpdatePolicies` message

In parallel with the [Authorization Flow][TAIP-4] agents can send [TAIP-2] messages to other agents to update their policy. This allows them to dynamically update requirements based on changing risk in real-time.

Please note that like any [TAIP-2] messages, these are just messages sent by an agent. For security purposes a receiving Agent MUST determine if they can trust the sender for the information provided. Agents MUST only send `UpdatePolicies` on their own behalf. Other agents in a transaction MUST ignore `UpdatePolicies` messages from agents not know to be part of a transaction.

Any agent can add additional agents to a transaction by replying as a thread to the initial message. The following shows the attributes of the `body` object:

- `@context` - REQUIRED the JSON-LD context `https://tap.rsvp/schema/1.0`
- `@type` - REQUIRED the JSON-LD type `https://tap.rsvp/schema/1.0#UpdatePolicies`
- `policies` - REQUIRED an array of Policies to replace the current set of policies

## Rationale

Having centrally managed policies as found in most centralized payment systems, is not a good option for the decentralized aspect of crypto currency settlement. Allowing each Agent to declare their own policies and enforce them collaboratively is important for continued innovation in the space.

## Test Cases

Provide here any test cases that will help implementers of the TAIP to validate their implementation.

### Specific Policies

#### `RequireAuthorization` Examples

This policy requires that all agents in a [TAIP-3] transaction authorizes a transaction prior to settlement.

```json
{
  "@type":"RequireAuthorization"
}
```

This policy requires that a specific agent in a [TAIP-3] transaction authorizes a transaction prior to settlement.

```json
{
  "@type":"RequireAuthorization",
  "from":["did:web:beneficiary.vasp"],
  "purpose":"FATF Travel Rule Compliance",
}
```

This policy requires the direct agent of the beneficiary party in a [TAIP-3] transaction to authorize a transaction prior to settlement.

```json
{
  "@type":"RequireAuthorization",
  "fromAgent":"beneficiary"
}
```

#### `RequirePresentation` examples

This example requests verified information about the `originator` party from the Agent of the `originator`. The specifics of what is requested is defined in a URL to [Presentation Definition][PExDef]. These could be used to pre-define requirements under certain national regulations or be customized:

```json
{
  "@type":"RequirePresentation",
  "@context":["https://schema.org/Person", "https://www.gleif.org/ontology/Base/Entity"],
  "fromAgent":"originator",
  "aboutParty":"originator",
  "purpose":"EU TFR Compliance",
  "presentationDefinition": "https://tap.rsvp/presentation-definitions/ivms-101/eu/tfr"
}
```

This example requests verified information about the Agent of the `originator` from themselves.The specifics of what is requested is defined in a URL to [Presentation Definition][PExDef]:

```json
{
  "@type":"RequirePresentation",
  "@context":["https://schema.org/Person", "https://www.gleif.org/ontology/Base/Entity"],
  "fromAgent":"originator",
  "aboutAgent":"originator",
  "purpose":"GDPR compliance",
  "presentationDefinition": "https://tap.rsvp/presentation-definitions/eu/gdpr/dpa"
}
```

#### `RequireProofOfControl` examples

```json
{
  "@type":"RequireProofOfControl",
  "fromRole":"SettlementAddress",
  "purpose":"GDPR compliance",
  "nonce": 32891756
}
```

### UpdatePolicies Messages

The following are example plaintext messages. See [TAIP-2] for how to sign the messages.

```json
{
  "from":"did:web:beneficiary.vasp",
  "type": "https://tap.rsvp/schema/1.0#UpdatePolicies",
  "thid":"ID of transfer request",
  "to": ["did:web:originator.vasp"],
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#UpdatePolicies",
    "policies":[
      {
        "@type":"RequirePresentation",
        "@context":["https://schema.org/Person", "https://www.gleif.org/ontology/Base/Entity"],
        "fromAgent":"originator",
        "aboutParty":"originator",
        "credentials": {
          "Person": ["firstName","lastName","nationalId"],
          "Entity": ["leiCode"]
        }
      },
      {
        "@type":"RequireProofOfControl",
        "fromRole":"SourceAddress",
        "nonce": 32891756
      }
    ]
  }
}
```

## Security Considerations
<!--Please add an explicit list of intra-actor assumptions and known risk factors if applicable. Any normative definition of an interface requires these to be implementable; assumptions and risks should be at both individual interaction/use-case scale and systemically, should the interface specified gain ecosystem-namespace adoption. -->
As in any decentralized messaging protocol, it is paramount that the recipient of messages trust the senders in the context of a particular transaction. See [TAIP-5] for more details about how Agents build trust with each other.

The Policies specified here are paramount for building that trust in a scalable and automated way and should be seen as tools to help Agents gather and verify data to use within their own internal risk and security management frameworks.

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
- [PEx] Presentation Exchange
- [PExDef] Presentation Exchange - Presentation Definition
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
[PEx]: <https://identity.foundation/presentation-exchange/spec/v2.0.0/>
[PExDef]: <https://identity.foundation/presentation-exchange/spec/v2.0.0/#presentation-definition>
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
