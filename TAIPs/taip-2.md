---
taip: 2
title: Messaging
status: Draft
type: Standard
author: Pelle Braendgaard <pelle@notabene.id>, Richard Crosby <richard@notabene.id>
created: 2024-01-09
updated: 2024-01-09
discussions-to: https://github.com/TransactionAuthorizationProtocol/TAIPs/pull/4
---
# Messaging

## Summary

TAIP-2 defines the structure of messaging in the [Transaction Authorization Protocol (TAP)](https://tap.rsvp) that allows agents and parties identified through Decentralized Identifiers ([DIDs](https://www.w3.org/TR/did-core/)) to securely communicate about a digital asset transaction prior to settlement on a blockchain.

## Abstract

TAIP-2 sets up the basic method for agents identified by [DIDs](https://www.w3.org/TR/did-core/) to securely and privately communicate directly between each other. At it's core it uses [DIDComm Messaging](https://identity.foundation/didcomm-messaging/spec/v2.1/) and sets up som minimum requirements for DIDComm Messages used within the context of TAP.

## Motivation

The primary method for communicating on blockchains today is through transactions that are public, shared, and immutable. To be able to authorize a blockchain transactions, parties being end-users or businesses may need to exchange sensitive private information between each other.

## Specification

### Messaging Encoding

TAP messages MUST be encoded in [JSON](https://datatracker.ietf.org/doc/html/rfc8259) format.

### Messaging Methodology

TAP messages should adhere to the [DIDComm-V2 specification](https://identity.foundation/didcomm-messaging/spec/v2.0/) benefiting from it's security, privacy, decentralization and transport independence.

The following attributes from DIDComm are used in TAP:

* `id` - REQUIRED. The message id, must be unique to the sender.
* `type` - REQUIRED. A URI that associates the `type` of message being sent in the body. A URI that associates the body of a plaintext message with a published and versioned schema. Core TAP Messages defined as part of TAIPs SHOULD be defined using an URI in the `http://tap.rsvp/taips/N` namespace.
* `from` - REQUIRED. The DID of the sender
* `to` - REQUIRED. An array containing the DIDs of the recipients
* `thd` - OPTIONAL. Thread identifier. Uniquely identifies the thread that the message belongs to. If not included, the id property of the message MUST be treated as the value of the thid. 
* `pthd` - OPTIONAL. Parent thread identifier. If the message is a child of a thread the pthid will uniquely identify which thread is the parent.
* `body` - REQUIRED. The message body, which MUST contain a valid [JSON-LD](https://json-ld.org/) object.
* `created-time` - REQUIRED. The message id, must be unique to the sender.
* `expires-time` - OPTIONAL. The message id, must be unique to the sender.

### Message Signing

TAP messages MUST be signed using the [JSON Web Signature (JWS)](https://www.rfc-editor.org/rfc/rfc7515) standard, as specified in [DIDComm Signed Messages](https://identity.foundation/didcomm-messaging/spec/v2.1/#message-signing).

#### Signing Algorithms

Message signing SHOULD use one of the following algorithms, that are commonly used in blockchain applications today:

* EdDSA (with crv=Ed25519) - Elliptic curve digital signature with Edwards curves and SHA-512
* ES256K - Elliptic curve digital signature with Secp256k1 keys

#### Verification of a Signed Message 

Public key resolution should be performed as specified in DIDComm by looking up the messages `kid` in the senders [DID Document](https://www.w3.org/TR/did-core/#authentication).


For illustrative purposes, this and other TAIPs will present [Plaintext Messages](https://identity.foundation/didcomm-messaging/spec/v2.1/#plaintext-message-structure)

### Message Encryption

Certain types of messages can perform additional end-to-end encryption over transport level encryption. When encrypted TAP messages MUST be encrypted according to the [JSON Web Encryption (JWE)](https://www.rfc-editor.org/rfc/rfc7516.html) standard, using methods specified in [DIDComm Encrypted Messages](https://identity.foundation/didcomm-messaging/spec/v2.1/#message-encryption).

See DIDComm specification for details on key resolutiokn throught the senders and recipients DID documents.

### Sending and Receiving messages

## Rationale

- [JSON Web Encryption (JWE)](https://www.rfc-editor.org/rfc/rfc7516.html) is a widely adopted method for representing encrypted JSON structures
- [JSON Web Signature (JWS)](https://www.rfc-editor.org/rfc/rfc7515) is also widely adopted method for representing JSON structures secured with digital signatures
- [DIDComm-V2.1 specification](https://identity.foundation/didcomm-messaging/spec/v2.1/) provides the semantics to enabled secure, private and decentralized messages between TAP participants.
- [JSON-LD](https://www.w3.org/TR/json-ld) provides a well-adopted open standard for representing linked JSON structures that pairs well with the [TAP](https://tap.rspv) decentralized messaging standard.

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

DIDComm is designed to handle sensitive data such as PII in a decentralized context. When interacting with a party through their DID endpoint, the underlying privacy depends on each party having adequate data security and privacy concerns implemented.

Doing this evaluation is out of scope of TAIP-2 and must be handled by each participant in a TAIP-2 message. A future TAIP could be written to provide more detailed guidelines on this.

## Backwards Compatibility

Does this TAIP introduce any backwards incompatible changes?
