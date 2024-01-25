---
taip: 
title: Selective Disclosure
author: Pelle Braendgaard <pelle@notabene.id>, Andrés Junge <andres@notabene.id>, Richard Crosby <richard@notabene.id>
status: Draft
type: Standard
created: 2024-01-24
updated: 2024-01-24
discussions-to: https://github.com/TransactionAuthorizationProtocol/TAIPs/pull/9
requires: 2, 5, 6, 7
---

<!--You can leave these HTML comments in your merged EIP and delete the visible duplicate text guides, they will not appear and may be helpful to refer to if you edit it again. This is the suggested template for new EIPs. Note that an EIP number will be assigned by an editor. When opening a pull request to submit your EIP, please use an abbreviated title in the filename, `eip-draft_title_abbrev.md`. The title should be 44 characters or less.-->
## Simple Summary
<!--"If you can't explain it simply, you don't understand it well enough." Provide a simplified and layman-accessible explanation of the TAIP.-->
Provides a simple and secure method for Transaction Agents to share Verifiable Credentials Identifying themselves or Transaction Parties to help comply with their policies.

## Abstract
<!--A short (~200 word) description of the technical issue being addressed.-->
Transaction Agents may have a requirement to identify certain aspects of another Transaction Participant before they can Authorize or Settle a transactions according to the [Transaction Authorization Flow][TAIP-4]. They present these as [TAIP-7 Agent Policies][TAIP-7]. This provides a simple method to securely share required information as [Verified Presentations][VP] over End-to-End encrypted [DIDComm].

## Motivation
<!--The motivation is critical for TAIP. It should clearly explain why the state of the art is inadequate to address the problem that the TAIP solves. TAIP submissions without sufficient motivation may be rejected outright.-->
There are strong regulatory requirements for exchanging PII of transaction parties within the context of a transaction, such as complying with Sanctions Name Screening requirements and FATF's Travel Rule. Highlighting the identity of the parties and providing the data to the counterparties of the transaction, also improves UX, reduces risk of fraud, and ties transactions into business workflows such as payroll and e-commerce.

Many other Transaction Authorization Protocols including [iso20022], and most Crypto Travel Rule Protocols based on [IVMS-101] exchange transmit the PII inline with the transfer request itself, which lends themselves to major risk of PII exposure. This is not only bad for end-users, but can expose significant legal liability for Transaction Agents handling this.

The approach taken here is to remove any PII from the core transaction meta-data that all agents require, and only exchange the minimum required information directly between the specific Agents that have a requirement for it. By allowing Transaction Agents to publish their policies up-front through [TAIP-7], other Agents can separately take a risk-based approach to complying and exchanging the PII. It allows Agents to asses privacy policies, regulations etc for the Agent requiring the PII before exchanging it.

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
* `purpose` - OPTIONAL Human readable string about what the purpose is for this requirement
* `credentials` - REQUIRED [JSON-LD] Object containing requested credentials for each accepted `@type` of party

The `credentials` object has key's for each acceptable [JSON-LD] Type together with an array of required attributes as strings.

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

This example requests verified information about the `originator` party from the Agent of the `originator`. The specific data requested is `firstName`, `lastName`, and `nationalId` for natural persons and an `leiCode` for legal entities:

```json
{
  "@type":"RequirePresentation",
  "@context":["https://schema.org/Person", "https://www.gleif.org/ontology/Base/Entity"],
  "fromAgent":"originator",
  "aboutParty":"originator",
  "credentials": {
    "Person": ["firstName","lastName","nationalId"],
    "Entity": ["leiCode"]
  }
}
```

### Present Proof Test Case

TODO Update with actual Transaction related examples. this is copied from [WACIPEx].

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
      "media_type": "application/ld+json",
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
          "holder": "did:example:123",
          "verifiableCredential": [
            {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://w3id.org/vaccination/v1",
                "https://w3id.org/security/bbs/v1"
              ],
              "id": "urn:uvci:af5vshde843jf831j128fj",
              "type": [
                "VerifiableCredential",
                "VaccinationCertificate"                
              ],
              "description": "COVID-19 Vaccination Certificate",
              "name": "COVID-19 Vaccination Certificate",
              "expirationDate": "2029-12-03T12:19:52Z",
              "issuanceDate": "2019-12-03T12:19:52Z",
              "issuer": "did:example:456",
              "credentialSubject": {
                "id": "urn:bnid:_:c14n2",
                "type": "VaccinationEvent",
                "batchNumber": "1183738569",
                "countryOfVaccination": "NZ"
              },
              "proof": {
                "type": "BbsBlsSignatureProof2020",
                "created": "2021-02-18T23:04:28Z",
                "nonce": "JNGovx4GGoi341v/YCTcZq7aLWtBtz8UhoxEeCxZFevEGzfh94WUSg8Ly/q+2jLqzzY=",
                "proofPurpose": "assertionMethod",
                "proofValue": "AB0GQA//jbDwMgaIIJeqP3fRyMYi6WDGhk0JlGJc/sk4ycuYGmyN7CbO4bA7yhIW/YQbHEkOgeMy0QM+usBgZad8x5FRePxfo4v1dSzAbJwWjx87G9F1lAIRgijlD4sYni1LhSo6svptDUmIrCAOwS2raV3G02mVejbwltMOo4+cyKcGlj9CzfjCgCuS1SqAxveDiMKGAAAAdJJF1pO6hBUGkebu/SMmiFafVdLvFgpMFUFEHTvElUQhwNSp6vxJp6Rs7pOVc9zHqAAAAAI7TJuDCf7ramzTo+syb7Njf6ExD11UKNcChaeblzegRBIkg3HoWgwR0hhd4z4D5/obSjGPKpGuD+1DoyTZhC/wqOjUZ03J1EtryZrC+y1DD14b4+khQVLgOBJ9+uvshrGDbu8+7anGezOa+qWT0FopAAAAEG6p07ghODpi8DVeDQyPwMY/iu2Lh7x3JShWniQrewY2GbsACBYOPlkNNm/qSExPRMe2X7UPpdsxpUDwqbObye4EXfAabgKd9gCmj2PNdvcOQAi5rIuJSGa4Vj7AtKoW/2vpmboPoOu4IEM1YviupomCKOzhjEuOof2/y5Adfb8JUVidWqf9Ye/HtxnzTu0HbaXL7jbwsMNn5wYfZuzpmVQgEXss2KePMSkHcfScAQNglnI90YgugHGuU+/DQcfMoA0+JviFcJy13yERAueVuzrDemzc+wJaEuNDn8UiTjAdVhLcgnHqUai+4F6ONbCfH2B3ohB3hSiGB6C7hDnEyXFOO9BijCTHrxPv3yKWNkks+3JfY28m+3NO0e2tlyH71yDX0+F6U388/bvWod/u5s3MpaCibTZEYoAc4sm4jW03HFYMmvYBuWOY6rGGOgIrXxQjx98D0macJJR7Hkh7KJhMkwvtyI4MaTPJsdJGfv8I+RFROxtRM7RcFpa4J5wF/wQnpyorqchwo6xAOKYFqCqKvI9B6Y7Da7/0iOiWsjs8a4zDiYynfYavnz6SdxCMpHLgplEQlnntqCb8C3qly2s5Ko3PGWu4M8Dlfcn4TT8YenkJDJicA91nlLaE8TJbBgsvgyT+zlTsRSXlFzQc+3KfWoODKZIZqTBaRZMft3S/",
                "verificationMethod": "did:example:123#key-1"
              }
            }
          ],
          "presentation_submission": {
            "id": "1d257c50-454f-4c96-a273-c5368e01fe63",
            "definition_id": "32f54163-7166-48f1-93d8-ff217bdb0654",
            "descriptor_map": [
              {
                "id": "vaccination_input",
                "format": "ldp_vp",
                "path": "$.verifiableCredential[0]"
              }
            ]
          },
          "proof": {
            "type": "Ed25519Signature2018",
            "verificationMethod": "did:example:123#key-0",
            "created": "2021-05-14T20:16:29.565377",
            "proofPurpose": "authentication",
            "challenge": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
            "jws": "eyJhbGciOiAiRWREU0EiLCAiYjY0IjogZmFsc2UsICJjcml0IjogWyJiNjQiXX0..7M9LwdJR1_SQayHIWVHF5eSSRhbVsrjQHKUrfRhRRrlbuKlggm8mm_4EI_kTPeBpalQWiGiyCb_0OWFPtn2wAQ"
          }
        }
      }
    }
  ]
}
```

## Security Considerations
<!--Please add an explicit list of intra-actor assumptions and known risk factors if applicable. Any normative definition of an interface requires these to be implementable; assumptions and risks should be at both individual interaction/use-case scale and systemically, should the interface specified gain ecosystem-namespace adoption. -->
The underlying technical security of this depends on the security of the underlying [DID] model and [DIDComm] itself. Applying this to real-world use cases it is intended to be used in an adversarial world with untrusted participants.

Before exchanging any PII you MUST trust this party enough to be able to share that information. What is the legal purpose for sharing the information? Is this actually the Agent you expect it to be.

When receiving any Presentation Proof it is important to perform the following:

* The **Verifier** MUST Verify the signature of the message
* The **Verifier** MUST Verify the signer of the DIDComm Message belongs to the DID of the Agent expected to Present the information to you.
* The **Verifier** MUST Verify the signer of the attached [VP] belongs to the DID of the Agent expected to Present the information to you.
* The **Verifier** MUST Verify the signer of the [VC] included in the attached [VP] belongs to the DID of the Agent expected to Present the information to you.

## Privacy Considerations
<!--Please add an explicit list of intra-actor assumptions and known risk factors if applicable. Any normative definition of an interface requires these to be implementable; assumptions and risks should be at both individual interaction/use-case scale and systemically, should the interface specified gain ecosystem-namespace adoption. -->
TODO Update this with GDPR

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
  
[TAIP-2]: ./taip-2
[TAIP-3]: ./taip-3
[TAIP-4]: ./taip-4
[TAIP-5]: ./taip-5
[TAIP-6]: ./taip-6
[TAIP-7]: ./taip-7

[DID]: <https://www.w3.org/TR/did-core/>
[DIDComm]: https://identity.foundation/didcomm-messaging/spec/v2.1/
[PEx]: https://identity.foundation/presentation-exchange/spec/v2.0.0/#presentation-definition
[WACIPEx]: <https://identity.foundation/waci-didcomm/>
[VCModel]: <https://www.w3.org/TR/vc-data-model-2.0/>
[VC]: <https://www.w3.org/TR/vc-data-model-2.0/#credentials>
[VP]: <https://www.w3.org/TR/vc-data-model-2.0/#presentations>

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
