# Transaction Authorization Messaging

## Details

| TAIP | Authors                                                                                                                                | Status | Created       | Updated       |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------- | ------------- |
| 2    | [Richard Crosby](mailto:richard@notabene.id), [Andres Junge](mailto:andres@notabene.id), [Pelle Braendgaard](mailto:pelle@notabene.id) | Draft  | 12th Dec 2023 | 12th Dec 2023 |

## Summary

TAIP-2 defines the structure of [TAP](https://rspv.tap) messages that enables multi-party, non-deterministic authorization in real-world transactions.

## Abstract

Existing crypto Travel Rule implementations are implemented in a deterministic manner which results in risky, slow or failed authorizations between transaction parties.

## Motivation

TODO

## Specification

### Messaging Encoding

TAP messages MUST be encoded in [JSON-LD](https://json-ld.org/) format.

### Message Encryption

TAP messages MUST be encrypted according to the [JSON Web Encryption (JWE)](https://www.rfc-editor.org/rfc/rfc7516.html) standard.

### Message Signing

TAP messages MUST be signed using the [JSON Web Signature (JWS)](https://www.rfc-editor.org/rfc/rfc7515) standard.

### Messaging Methodology

TAP messages should adhere to the [DIDComm-V2 specification](https://identity.foundation/didcomm-messaging/spec/v2.0/) benefiting from it's security, privacy, decentralization and transport independence.

### Create Transfer

The create transfer message payload takes the following format:

```json
{
  "@context": "https://tap.rspv/schema/1.0",
  "@type": "CreateTransfer",
  "originator": "mailto:bob@example.com",
  "beneficiary": "mailto:alice@example.com",
  "asset": "bip122:000000000019d6689c085ae165831e93/slip44:0",
  "amount": "0.5122",
  "agents": {
    "@list": [
      {
        "@id": "did:pkh:eip155:1:0xab16a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"
      },
      {
        "@id": "did:web:vaspa.sample"
      },
      {
        "@id": "did:web:vaspb.sample"
      },
      {
        "@id": "did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"
      }
    ]
  }
}
```

- `@context` - A [JSON-LD Context](https://www.w3.org/TR/json-ld/#the-context) referring to the TAP context being used
- `@type` - The [JSON-LD Type](https://www.w3.org/TR/json-ld/#specifying-the-type) for `CreateTransfer` from the active context
- `originator` - The ultimate originator of the transaction. MUST be represented as IRIs and more specifically SHOULD be represented as a [DID](https://www.w3.org/TR/did-core/).
- `beneficiary` - The ultimate beneficiary of the transaction. Similar to `originator` MUST be an IRI and SHOULD be a [DID](https://www.w3.org/TR/did-core/).
- `asset` - A [CAIP-19](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-19.md) representation of the asset being transferred.
- `amount` - A string representation of the transfer amount in the asset's respective smallest denomination
- `agents` - A [JSON-LD Ordered List](https://www.w3.org/TR/json-ld/#lists) of transaction agents. As per [TAIP-1](./taip-1.md) each agent is represented as by a [JSON-LD Node Identifier](https://www.w3.org/TR/json-ld/#node-identifiers) that MUST be a [DID](https://www.w3.org/TR/did-core/).

## Rationale

- [JSON Web Encryption (JWE)](https://www.rfc-editor.org/rfc/rfc7516.html) is a widely adopted method for representing encrypted JSON structures
- [JSON Web Signature (JWS)](https://www.rfc-editor.org/rfc/rfc7515) is also widely adopted method for representing JSON structures secured with digital signatures
- [DIDComm-V2 specification](https://identity.foundation/didcomm-messaging/spec/v2.0/) provides the semantics to enabled secure, private and decentralized messages between TAP participants.
- [JSON-LD](https://www.w3.org/TR/json-ld) provides a well-adopted open standard for representing linked JSON structures that pairs well with the [TAP](https://tap.rspv) decentralized messaging standard.

## Test Cases

Provide here any test cases that will help implementers of the TAIP to validate their implementation.

## Security Concerns

Are there any security concerns that this TAIP addresses or that implementers should be aware of?

## Privacy Considerations

Are there any privacy considerations that need to be considered by implementers when implementing this TAIP?

## Backwards Compatibility

Does this TAIP introduce any backwards incompatible changes?
