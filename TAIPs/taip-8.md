---
taip: 8
title: Selective Disclosure
author: Pelle Braendgaard <pelle@notabene.id>, Andrés Junge <andres@notabene.id>, Richard Crosby <richard@notabene.id>
status: Review
type: Standard
created: 2024-01-24
updated: 2025-03-07
description: Defines a secure method for transaction agents to exchange verified credentials and personally identifiable information (PII) using W3C Verifiable Credentials and DIDComm encrypted messaging. Enables regulatory compliance with data protection laws through selective disclosure that minimizes PII exposure and allows agents to verify transaction counterparties while maintaining privacy.
discussions-to: https://github.com/TransactionAuthorizationProtocol/TAIPs/pull/10
requires: 2, 5, 6, 7
---

<!--You can leave these HTML comments in your merged EIP and delete the visible duplicate text guides, they will not appear and may be helpful to refer to if you edit it again. This is the suggested template for new EIPs. Note that an EIP number will be assigned by an editor. When opening a pull request to submit your EIP, please use an abbreviated title in the filename, `eip-draft_title_abbrev.md`. The title should be 44 characters or less.-->
## Simple Summary
<!--"If you can't explain it simply, you don't understand it well enough." Provide a simplified and layman-accessible explanation of the TAIP.-->
Provides a simple and secure method for transaction agents to share verified credentials identifying themselves or transaction parties to help comply with their policies.

## Abstract
<!--A short (~200 word) description of the technical issue being addressed.-->
Transaction Agents may have a requirement to identify specific aspects of another Transaction Participant before they can Authorize or Settle transactions according to the [Transaction Authorization Flow][TAIP-4]. They present these as [TAIP-7 Agent Policies][TAIP-7]. This provides a simple method to securely share required information as [Verified Presentations][VP] over End-to-End encrypted [DIDComm].

## Motivation
<!--The motivation is critical for TAIP. It should clearly explain why the state of the art is inadequate to address the problem that the TAIP solves. TAIP submissions without sufficient motivation may be rejected outright.-->
There are strict regulatory requirements for exchanging PII of transaction parties within the context of a transaction, such as complying with Sanctions Name Screening requirements, FATF’s Travel Rule, and various international data protection legislation.

Highlighting the identity of the parties and providing the data to the transaction counterparties also improves UX, reduces the risk of fraud, and ties transactions into business workflows such as payroll and e-commerce.
Many other Transaction Authorization Protocols, including [iso20022], and most Crypto Travel Rule Protocols based on [IVMS-101] exchange transmit the PII in line with the transfer request itself, which lends themselves to a significant risk of PII exposure.

This is bad for end-users and can expose significant legal liability for Transaction Agents handling this.
The approach taken here is to remove any PII from the core transaction meta-data that all agents require, and only exchange the minimum required information directly between the specific Agents requiring it. By allowing transaction agents to publish their policies up-front through [TAIP-7], other agents can take a risk-based approach to comply with and exchange the PII separately. It allows Agents to asses privacy policies, regulations, etc, for the Agent requiring the PII before exchanging it.

## Specification

This specification is a simplified subset of the [PEx] and [WACIPEx] specifications that are designed to request and present [Verifiable Credentials][VC] between parties.

### Relation to Verifiable Credentials Model

In the context of the [W3C Verifiable Credential Model][VCModel] the following parties are defined:

* **Subject** - An entity about which claims are made. In the context of [TAIP-4] this MUST be a [Party][TAIP-6] or [Agent][TAIP-5] to the transaction.
* **Issuer** - A role of an entity that asserts claims about the **Subject** into [VC]. In the context of [TAIP-4] this could be an [Agent][TAIP-5] to the transaction, but as portable KYC becomes more prevalent it doesn't have to be.
* **Verifier** - A role of an entity that requests and receives [Verifiable Presentations][VP] containing [Verifiable Credentials][VC] for a particular purpose. In the context of [TAIP-4] this MUST be an [Agent][TAIP-5] to the transaction.
* **Holder** - A role for an entity that holds a combination of [Verifiable Credentials][VC] and generate [Verifiable Presentations][VP] based on requests from **Verifiers**.  In the context of [TAIP-4] this MUST be an [Agent][TAIP-5] to the transaction. 
 
Within TAP the **Holder** and **Issuer** are often the same.

### `RequirePresentation` policy

Any [Agent][TAIP-5] to the Transaction can declare their requirements as a `RequirePresentation` policy. See [TAIP-7] for more details.

This is a generic way of requesting a selected [Verifiable Presentation][VP] from another agent in the transaction of a particular identity information regarding a party or agent.

* `@type` - REQUIRED `RequirePresentation`
* `fromAgent` - REQUIRED Requesting presentation from an Agent representing the party in the transaction. Eg. `originator` or `beneficiary` in [TAIP-3]. In the context of the [VCModel] this Agent is the **Holder** of the Identity Claims.
* `about` - OPTIONAL Requesting presentation about a string or an array of [DID]s representing  specific parties or agent in a transaction as the **Subject**.
* `aboutParty` - OPTIONAL Requesting presentation about a specific party in the transaction. Eg. `originator` or `beneficiary` in [TAIP-3] as the **Subject**.
* `aboutAgent` - OPTIONAL Requesting presentation about a specific Agent representing a party in the transaction. Eg. `originator` or `beneficiary` in [TAIP-3] as the **Subject**.
* `presentationDefinition` - REQUIRED a URL to a [Presentation Definition][PExDef] defining required information

### Present Proof

This is implemented as the [WACI Present Proof](https://identity.foundation/waci-didcomm/#step-4-present-proof) message.

* `type` - REQUIRED `https://didcomm.org/present-proof/3.0/presentation`
* `id` - REQUIRED. The message id, must be unique to the sender.
* `thid` - REQUIRED. Thread identifier. Uniquely identifies the transaction thread that the message belongs to.
* `from` - REQUIRED. The DID of the **Holder**
* `to` - REQUIRED. An array containing the DIDs of the recipients. This MUST only contain the DIDs of Agents who require this information
* `body` - REQUIRED. An empty object `{}`
* `attachments` - REQUIRED. An array containing at least one containing a [Verifable Presentation][VP]
The message MUST be sent as [DIDComm Encrypted Messages](https://identity.foundation/didcomm-messaging/spec/v2.1/#didcomm-encrypted-messages).

## Rationale

It is intended for this model to be both support low latency transaction authorization while at the same time minimizing the exposure of PII. It is also designed to be built on existing emerging standards for secure identity verification.

## Test Cases

Provide here any test cases that will help implementers of the TAIP to validate their implementation.

### `RequirePresentation` examples

This example requests verified information about the `originator` party from the Agent of the `originator`. The specific data requested is specified in [PExDef]:

```json
{
  "@type":"RequirePresentation",
  "@context":["https://schema.org/Person", "https://www.gleif.org/ontology/Base/Entity"],
  "fromAgent":"originator",
  "aboutParty":"originator",
  "presentationDefinition": "https://tap.rsvp/presentation-definitions/ivms-101/eu/tfr"
}
```

### Presentation Definition Test Case

The following is a presentation definition for an IVMS-101 name for a natural person:

```json
{
  "presentation_definition": {
    "id": "32f54163-7166-48f1-93d8-ff217bdb0653",
    "input_descriptors": [
       {
        "id": "primaryIdentifier",
        "name": "Family Name",
        "purpose": "To comply with FATF Travel Rule",
        "constraints": {
          "fields": [
            {
              "path": [
                "$.vc.credentialSubject.familyName"
              ]
            }
          ]
        }
      },{
        "id": "secondaryIdentifier",
        "name": "Given Name",
        "purpose": "To comply with FATF Travel Rule",
        "constraints": {
          "fields": [
            {
              "path": [
                "$.vc.credentialSubject.givenName"
              ]
            }
          ]
        }
      }
    ],
    "format": {
      "jwt": {
        "alg": ["EdDSA", "ES256K", "ES384"]
      },
      "jwt_vc": {
        "alg": ["ES256K", "ES384"]
      },
      "jwt_vp": {
        "alg": ["EdDSA", "ES256K"]
      }
    }
  }
}
```

### Present Proof Test Case

TODO Create real test vectors

```json
{
  "type": "https://didcomm.org/present-proof/3.0/presentation",
  "id": "f1ca8245-ab2d-4d9c-8d7d-94bf310314ef",
  "thid": "95e63a5f-73e1-46ac-b269-48bb22591bfa",
  "from": "did:web:originator.vasp",
  "to": [
    "did:web:beneficiary.vasp"
  ],
  "body": {},
  "attachments": [
    {
      "id": "2a3f1c4c-623c-44e6-b159-179048c51260",
      "media_type": "application/json",
      "format": "dif/presentation-exchange/submission@v1.0",
      "data": {
        "json": {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://identity.foundation/presentation-exchange/submission/v1"
          ],
          "type": [
            "VerifiablePresentation",
            "PresentationSubmission"
          ],
          "presentation_submission": {
            "id": "a30e3b91-fb77-4d22-95fa-871689c322e2",
            "definition_id": "32f54163-7166-48f1-93d8-ff217bdb0653",
            "descriptor_map": [
              {
                "id": "beneficiary_vp",
                "format": "jwt_vc",
                "path": "$.verifiableCredential[0]"
              }
            ]
          },
          "verifiableCredential": [
            {
              "comment": "IN REALWORLD VPs, THIS WILL BE A BIG UGLY OBJECT INSTEAD OF THE DECODED JWT PAYLOAD THAT FOLLOWS",
              "vc": {
                "@context": ["https://www.w3.org/2018/credentials/v1","https://schema.org/Person"],
                "type": ["Person"],
                "issuer": "did:web:originator.vasp",
                "issuanceDate": "2010-01-01T19:73:24Z",
                "credentialSubject": {
                  "id": "did:eg:bob",
                  "givenName":"Bob",
                  "familyName":"Smith"
                }
              }
            }
          ],
        }
      }
    }
  ]
}
```

## Security Considerations
<!--Please add an explicit list of intra-actor assumptions and known risk factors if applicable. Any normative definition of an interface requires these to be implementable; assumptions and risks should be at both individual interaction/use-case scale and systemically, should the interface specified gain ecosystem-namespace adoption. -->
The underlying technical security of this depends on the security of the underlying [DID] model and [DIDComm] itself. It is intended to be used in an adversarial world with untrusted participants.

Before exchanging any PII, you MUST trust this party enough to be able to share that information. What is the legal purpose for sharing the information? Is this the Agent you expect it to be?

When receiving any Presentation Proof, it is essential to perform the following:

* The **Verifier** MUST Verify the signature of the message
* The **Verifier** MUST Verify the signer of the DIDComm Message belongs to the DID of the Agent expected to Present the information to you.
* The **Verifier** MUST Verify the signer of the attached [VP] belongs to the DID of the Agent expected to Present the information to you.
* The **Verifier** MUST Verify the signer of the [VC] included in the attached [VP] belongs to the DID of the Agent expected to Present the information to you.

## Privacy Considerations
<!--Please add an explicit list of intra-actor assumptions and known risk factors if applicable. Any normative definition of an interface requires these to be implementable; assumptions and risks should be at both individual interaction/use-case scale and systemically, should the interface specified gain ecosystem-namespace adoption. -->
Privacy legislation, such as the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), enforce well-established privacy principles such as ‘Data Minimization’ and ‘Purpose Limitation.’

In analyzing Personally Identifiable Information (PII) to comply with the Financial Action Task Force’s (FATF) travel rule requirements, each Agent must only process the minimum amount of data required. TAIP-8 supports data protection legislation by giving each Agent granular control over their PII requests and provides travel rule creators with increased control to carefully consider whether it’s safe to share PII with a counterparty.

## References
<!--Links to external resources that help understanding the TAIP better. This can e.g. be links to existing implementations. See CONTRIBUTING.md#style-guide . -->

* [TAIP-2] Defines the TAP Message structure
* [TAIP-3] Asset Transfer Message
* [TAIP-4] Transaction Authorization Protocol
* [TAIP-5] Agents
* [TAIP-6] Transaction Parties
* [TAIP-7] Agent Policies
* [DID] W3C Decentralized Identifiers
* [DIDComm] DIDComm Messaging
* [PEx] Presentation Exchange
* [WACIPEx] Wallet and Credential Interaction (WACI) Protocols for both Issuance and Presentation Exchange
* [VCModel] W3C Verifiable Credentials Data Model
* [VC] Verifiable Credentials
* [VP] Verifiable Presentation
* [IVMS-101] interVASP Messaging Standard 101 (IVMS 101)
  
[TAIP-2]: ./taip-2
[TAIP-3]: ./taip-3
[TAIP-4]: ./taip-4
[TAIP-5]: ./taip-5
[TAIP-6]: ./taip-6
[TAIP-7]: ./taip-7

[DID]: <https://www.w3.org/TR/did-core/>
[DIDComm]: https://identity.foundation/didcomm-messaging/spec/v2.1/
[PExDef]: https://identity.foundation/presentation-exchange/spec/v2.0.0/#presentation-definition
[WACIPEx]: <https://identity.foundation/waci-didcomm/>
[VCModel]: <https://www.w3.org/TR/vc-data-model-2.0/>
[VC]: <https://www.w3.org/TR/vc-data-model-2.0/#credentials>
[VP]: <https://www.w3.org/TR/vc-data-model-2.0/#presentations>
[IVMS-101]: <https://www.intervasp.org>

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
