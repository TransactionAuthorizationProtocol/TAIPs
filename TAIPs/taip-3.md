---
taip: 3
title: Asset Transfer
status: Draft
type: Standard
author: Pelle Braendgaard <pelle@notabene.id>
created: 2024-01-12
updated: 2024-01-12
discussions-to: https://github.com/TransactionAuthorizationProtocol/TAIPs/pull/5
requires (*optional): 2,5,6
---
<!--You can leave these HTML comments in your merged EIP and delete the visible duplicate text guides, they will not appear and may be helpful to refer to if you edit it again. This is the suggested template for new EIPs. Note that an EIP number will be assigned by an editor. When opening a pull request to submit your EIP, please use an abbreviated title in the filename, `eip-draft_title_abbrev.md`. The title should be 44 characters or less.-->

## Simple Summary
<!--"If you can't explain it simply, you don't understand it well enough." Provide a simplified and layman-accessible explanation of the TAIP.-->
This provides the messaging details for a simple virtual asset transfer between two parties as part of a Transaction Authorization Protocol flow.

## Abstract
<!--A short (~200 word) description of the technical issue being addressed.-->
This provides transaction related metadata about a virtual asset transaction, for use as part of the Authorization Flow in TAP. It is primarily intended to support the transfer of an amount of a fungible or non fungible token from an originator to a beneficiary. This TAIP only specifies the specifics of a Transfer and not the full Authorization Flow which can be found in [TAIP-4](TAIP-4).

## Motivation
<!--The motivation is critical for TAIP. It should clearly explain why the state of the art is inadequate to address the problem that the TAIP solves. TAIP submissions without sufficient motivation may be rejected outright.-->
The Asset Transfer is a simple chain-agnostic representation of a typical virtual asset transaction and its parties. The vast majority of transactions performed by both custodial services and self-hosted wallets fall under this classification.

To support the widest amount of digital assets, it is based on existing [Chain Agnostic standards][ChainAgnostic] such as [CAIP-10 Account Identifiers][CAIP-10] and [CAIP-19 Asset Identifiers][CAIP-19]. For developers of new blockchain protocols and token standards, make sure that you implement these and list them on the [Chainagnostic Namespaces](https://namespaces.chainagnostic.org) page for reference.

## Specification
<!--The technical specification should describe the standard in detail. The specification should be detailed enough to allow competing, interoperable implementations. -->
Asset Transfers are implemented in the body of a [TAIP-2](TAIP-2) message.

### DIDComm type URI

The preliminary URI to be used in the [TAIP-2](TAIP-2) type header should be `https://tap.rsvp/schema/taip-3#Transfer`.

### Message Body

As specified in [TAIP-2](./taip-2.md) the message body is [JSON-LD](https://www.w3.org/TR/json-ld). The following attributes are defined:

* `@ctx` - REQUIRED the JSON-LD context `https://tap.rsvp/schema/1.0` (provisional)
* `@type` - REQUIRED the JSON-LD type `https://tap.rsvp/schema/1.0#Transfer` (provisional)
* `asset` - REQUIRED the [CAIP-19](CAIP-19) identifier of the asset
* `amountSubunits` - OPTIONAL for NFTs and REQUIRED for fungible tokens. Specified as a string with the full amount in integer in the smallest subunit of a token
* `originator` - OPTIONAL an object representing the originating (aka the sender) party (see [TAIP-6](TAIP-6))
* `beneficiary` - OPTIONAL an object representing the beneficiary (aka the recipient) party (see [TAIP-6](TAIP-6))
* `settlementAddress` - OPTIONAL a string representing the intended destination address of the transaction specified in [CAIP-10](CAIP-10) format.
* `settlementId` - OPTIONAL an identifier of the underlying settlement transaction on a blockchain. For more details see below.
* `agents` - REQUIRED an array of identity objects representing the agents who help execute the transaction. See [TAIP-5](TAIP-5) for more.

Many of the attributes are optional and through the process of authorization can be expanded and modified collaboratively by the agents of a transaction.
  
#### Transfer Amounts

The amount of a transfer is specified as `amountSubunits` as it is the most precise representation of an amount and is in most cases the same as used in the underlying blockchain protocol. For many application developers this can be error prone. It is the responsibility of library and tool developers to help educate and help convert between commonly used decimal amounts and the underlying sub unit.

As an example `ETH 1.23` should be encoded as `1230000000000000000`.

#### SettlementId

Use a simplified version of the format proposed by [CAIP-220](https://github.com/ChainAgnostic/CAIPs/pull/221/files)

```
block_address:        chain_id + ":" [ + "block:"]? + "txn/" + transaction_id?
chain_id:             [-a-z0-9]{3,8}:[-_a-zA-Z0-9]{1,32} (See [CAIP-2][])
transaction_id:       [-%a-zA-Z0-9]{1,128}
```

eg:

```
eip155:1:tx/0x3edb98c24d46d148eb926c714f4fbaa117c47b0c0821f38bfce9763604457c33
```

## Rationale
<!--The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work, e.g. how the feature is supported in other languages. The rationale may also provide evidence of consensus within the community, and should discuss important objections or concerns raised during discussion.-->
This particular Message type is designed to be as general and chainagnostic as possible and be compatible with as little meta-data as possible together with any required meta-data useful for improving usability, safety, and record keeping for a transaction.

Note this is designed to be used as an initial request message. The `body` attirbutes can be used a representation of internal state of a transaction by an agent, but do intentionally not represent shared state.

It is also not intended to cover more complex transaction use cases, such as non token transfer related smart contract calls. It is encouraged that this TAIP be cloned and modified to create similar requests for Swaps, lending, and other common use cases.

## Test Cases
<!--Please add diverse test cases here if applicable. Any normative definition of an interface requires test cases to be implementable. -->

The following is a minimal request for a transfer of 1.23 ETH from a trading firm to the ethereum wallet with the address `0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb`:

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
        "settlementAddress":"eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
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

The following is a request for a transfer of 1.23 ETH from a crypto exchange from a customer to the ethereum wallet with the address `0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb`:

```json
{
	"from":"did:web:originator.vasp",
	"type": "https://tap.rsvp/schema/1.0#Transfer"
    "id": "...",
	"to": ["did:web:beneficiary.vasp", "did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"]
	"body": {
		"@context": "https://tap.rsvp/schema/1.0",
		"@type": "https://tap.rsvp/schema/1.0#Transfer",
		"asset": "eip155:1/slip44:60",
        "settlementAddress":"eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
        "originator":{
            "@id":"did:eg:bob"
        },
		"amountSubunits": "1230000000000000000",
  		"agents":[
            {
  				"@id":"did:web:originator.vasp"
  			},
			{
				"@id":"did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"
			}
        ]
	}
}
```

The following is a request for a transfer of 1.23 ETH from a crypto exchange from a customer to a customer at another hosted wallet, which doesn't include any settlement information. This allows the parties negotiate settlement as part of the authorization flow:

```json
{
	"from":"did:web:originator.vasp",
	"type": "https://tap.rsvp/schema/1.0#Transfer"
    "id": "...",
	"to": ["did:web:beneficiary.vasp", "did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"]
	"body": {
		"@context": "https://tap.rsvp/schema/1.0",
		"@type": "https://tap.rsvp/schema/1.0#Transfer",
		"asset": "eip155:1/slip44:60",
        "originator":{
            "@id":"did:eg:bob"
        },
        "beneficiary":{
            "@id":"sms:+15105550101"
        }
		"amountSubunits": "1230000000000000000",
  		"agents":[
            {
				"@id":"did:web:originator.vasp"
			},
            {
                "@id":"did:web:beneficiary.vasp"
            }
        ]
	}
}
```

The following is an example of a fairly complete transaction that has already been settled. This could be used to start the process of backfilling information about an already settled transaction.

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
		"beneficiary":{"@id":"did:eg:alice"},
		"asset": "eip155:1/slip44:60",
		"amountSubunits": "1230000000000000000",
        "settlementAddress":"eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
        "settlementId":"eip155:1:tx/0x3edb98c24d46d148eb926c714f4fbaa117c47b0c0821f38bfce9763604457c33",
		"agents":[
			{
				"@id":"did:web:originator.vasp",
			},
			{
				"@id":"did:beneficiary.vasp",
			},
			{
				"@id":"did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb"
			}
		]
	}
}
```

## Security Considerations
<!--Please add an explicit list of intra-actor assumptions and known risk factors if applicable. Any normative definition of an interface requires these to be implementable; assumptions and risks should be at both individual interaction/use-case scale and systemically, should the interface specified gain ecosystem-namespace adoption. -->
It is important to understand that this represents a request to perform a transaction, and requires all parties to verify all information in it to safely authorize and settle a transaction. It is the responsibility of the agents to verify this information, even post settlement.

## Privacy Considerations
<!--Please add an explicit list of intra-actor assumptions and known risk factors if applicable. Any normative definition of an interface requires these to be implementable; assumptions and risks should be at both individual interaction/use-case scale and systemically, should the interface specified gain ecosystem-namespace adoption. -->
This message can contain PII about end-users. It is very important that agents understand the privacy duties they have under national law to safeguard their customers PII. It is recommended as part of a [TAIP-4][TAIP-4] authorization flow that a data privacy evaluation is made on each agent before sharing PII with them.

It is recommended that end-user PII is minimized in this particular message, but can be encrypted to specific trusted parties or agents separately. See [TAIP-8][TAIP-8] for more.

## References 
<!--Links to external resources that help understanding the TAIP better. This can e.g. be links to existing implementations. See CONTRIBUTING.md#style-guide . -->

- [TAIP-2][TAIP-2] Defines the TAP Message structure
- [TAIP-5][TAIP-4] Defines the TAP Authorization Flow
- [TAIP-5][TAIP-5] Describes transaction agents
- [TAIP-6][TAIP-6] Describes transaction parties
- [TAIP-8][TAIP-8] Selective disclosure of PII
- [CAIP-10][CAIP-10] Describes chainagnostic Account ID Specification
- [CAIP-19][CAIP-19] Describes transaction parties
  
[TAIP-2]: https://tap.rsvp/TAIPS/taip-2
[TAIP-4]: https://tap.rsvp/TAIPS/taip-4
[TAIP-5]: https://tap.rsvp/TAIPS/taip-5
[TAIP-6]: https://tap.rsvp/TAIPS/taip-6
[ChainAgnostic](https://chainagnostic.org)
[CAIP-10](https://chainagnostic.org/CAIPs/caip-10)
[CAIP-19](https://chainagnostic.org/CAIPs/caip-19)

## Copyright
Copyright and related rights waived via [CC0](../LICENSE).