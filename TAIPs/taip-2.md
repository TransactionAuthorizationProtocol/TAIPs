---
taip: 2
title: Messaging
status: Review
type: Standard
author: Pelle Braendgaard <pelle@notabene.id>, Richard Crosby <richard@notabene.id>
created: 2024-01-09
updated: 2025-03-07
discussions-to: https://github.com/TransactionAuthorizationProtocol/TAIPs/pull/4
---
# Messaging

## Summary

TAIP-2 defines the messaging structure in the Transaction Authorization Protocol (TAP)](<https://tap.rsvp>) that allows agents and parties identified through Decentralized Identifiers ([DIDs][DID]) to securely communicate about a digital asset transaction before settlement on a blockchain.

## Abstract

TAIP-2 sets up the primary method for agents identified by [DIDs][DID] to communicate securely and privately directly with each other. At its core, it uses [DIDComm Messaging][DIDComm] and sets up some minimum requirements for DIDComm Messages utilized within the context of TAP.

## Motivation

The primary communication method on blockchains today is through public, shared, and immutable transactions. To be able to authorize blockchain transactions, parties, being end-users or businesses, may need to exchange sensitive private information with each other.

## Specification

### Messaging Encoding

TAP messages MUST be encoded in [JSON] format.

### Messaging Methodology

TAP messages should adhere to the [DIDComm-V2 specification][DIDComm], benefiting from its security, privacy, decentralization, and transport independence.

The following attributes from DIDComm are used in TAP:

* `id` - REQUIRED. The message id, MUST be unique to the sender.
* `type` - REQUIRED. A URI that associates the `type` of message being sent in the body. A URI that associates the body of a plaintext message with a published and versioned schema. Core TAP Messages defined as part of TAIPs SHOULD be use an URI in the `https://tap.rsvp/taips/N` namespace.
* `from` - REQUIRED. The DID of the sender
* `to` - REQUIRED. An array containing the DIDs of the recipients
* `thid` - OPTIONAL. Thread identifier. Uniquely identifies the thread that the message belongs to. If not included, the id property of the message MUST be treated as the value of the thid. 
* `pthid` - OPTIONAL. Parent thread identifier. If the message is a child of a thread the pthid will uniquely identify which thread is the parent.
* `body` - REQUIRED. The message body, which MUST contain a valid [JSON-LD] object.
* `created_time` - REQUIRED. The time the message was created.
* `expires_time` - OPTIONAL. The time the message expires. A recipient MUST ignore the message after this time.

### Message Signing

TAP messages MUST be signed using the [JSON Web Signature (JWS)][JWS] standard, as specified in [DIDComm Signed Messages](https://identity.foundation/didcomm-messaging/spec/v2.1/#message-signing).

#### Signing Algorithms

Message signing SHOULD use one of the following algorithms, that are commonly used in blockchain applications today:

* EdDSA (with crv=Ed25519) - Elliptic curve digital signature with Edwards curves and SHA-512
* ES256K - Elliptic curve digital signature with Secp256k1 keys

#### Verification of a Signed Message 

Public key resolution should be performed as specified in DIDComm by looking up the messages `kid` in the senders [DID Document](https://www.w3.org/TR/did-core/#authentication).


For illustrative purposes, this and other TAIPs will present [Plaintext Messages](https://identity.foundation/didcomm-messaging/spec/v2.1/#plaintext-message-structure)

### Message Encryption

Certain types of messages can perform additional end-to-end encryption over transport level encryption. When encrypted TAP messages MUST be encrypted according to the [JSON Web Encryption (JWE)][JWE] standard, using methods specified in [DIDComm Encrypted Messages](https://identity.foundation/didcomm-messaging/spec/v2.1/#message-encryption).

See DIDComm specification for details on key resolution throught the senders and recipients DID documents.

### Sending and Receiving messages

## Rationale

This TAIP is based on existing standards like JWE and JWS. It is designed to be decentralized and tightly tied to decentralized identifies for each party involved. While centralized services can actively play a part in TAP, it is never a requirement.

* [JSON Web Encryption (JWE)][JWE] is a widely adopted method for representing encrypted JSON structures
* [JSON Web Signature (JWS)][JWS] is also widely adopted method for representing JSON structures secured with digital signatures
* [DIDComm Messaging][DIDComm] provides the semantics to enabled secure, private and decentralized messages between TAP participants.
* [JSON-LD] provides a well-adopted open standard for representing linked JSON structures that pairs well with the [TAP](https://tap.rspv) decentralized messaging standard.

## Test Cases

The following shows a minimal example of a valid DIDComm Plaintext Message following DIDComm spec.

```json
{
  "id": "abcdefg",
  "type": "https://tap.rvsp/messages/example",
  "from": "did:example:alice",
  "to": ["did:example:bob"],
  "created_time": 1516269022,
  "expires_time": 1516385931,
  "body": {
    "@context":"https://tap.rvsp/messages/example"
    /* ... TAP message body */
  }
}
```

## Security Concerns

DIDComm builds on established standards for message signing and encryption. The security of it depends primarily on the security of the underlying DID methods used to identify participants and key resolution used.

## Privacy Considerations

DIDComm is designed to handle sensitive data such as PII in a decentralized context. When interacting with a party through their DID endpoint, the underlying privacy depends on each party having implemented adequate data security and privacy concerns.

Doing this evaluation is out of the scope of TAIP-2 and must be handled by each participant in a TAIP-2 message. A future TAIP could be written to provide more detailed guidelines on this.

## References
<!--Links to external resources that help understanding the TAIP better. This can e.g. be links to existing implementations. See CONTRIBUTING.md#style-guide . -->

* [DID][DID] W3C Decentralized Identifiers
* [DIDComm][DIDComm] DIDComm Messaging
* [JSON][JSON] JavaScript Object Notation
* [JSON-LD][JSON-LD] JSON Linked Data

[DID]: https://www.w3.org/TR/did-core/
[DIDComm]: https://identity.foundation/didcomm-messaging/spec/v2.1/
[JSON]: https://datatracker.ietf.org/doc/html/rfc8259
[JSON-LD]: https://www.w3.org/TR/json-ld
[JWE]: https://www.rfc-editor.org/rfc/rfc7516.html
[JWS]: https://www.rfc-editor.org/rfc/rfc7515
