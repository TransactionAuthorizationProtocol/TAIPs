# TAIPs

Transaction Authorization Improvement Proposals (TAIPs) provide standards for the [Transaction Authorization Protocol (TAP)](https://tap.rsvp).

Please read the [TAP Whitepaper](https://hubs.ly/Q03BPp1k0) for more context.

> [TAP](https://tap.rsvp) is a decentralized protocol allowing multiple participants in real-world transactions to identify each other and collaborate with the goal of authorizing them safely.

The purpose of TAIPs is to provide the community with a means to propose enhancements to [TAP](https://tap.rsvp) extending it's capabilities to unique transaction scenarios.

## Documentation

- [Message Types and Data Structures](./messages.md) - Comprehensive documentation of all TAP message types and data structures
- [Developer Resources](./developers.md) - Quick start guide for developers with examples and usage instructions
- [JSON Schemas](./schemas/) - Machine-readable JSON Schema definitions for all TAP messages
- [TypeScript Types](./packages/typescript/) - TypeScript type definitions (`@taprsvp/types` npm package)
- [Changelog](./CHANGELOG.md) - History of structural changes, new TAIPs, and message format updates

## TAIP Statuses

- **Draft** - A TAIP currently in development
- **Review** - A TAIP that is currently being reviewed by the TAIP Working Group
- **Accepted** - A TAIP that has been reviewed, accepted and assigned a number

## TAIPs

| TAIP | Description                                                            |
|------|------------------------------------------------------------------------|
| 1    | [Transaction Authorization Improvement Proposals](./TAIPs/taip-1.md)   |
| 2    | [Messaging](./TAIPs/taip-2.md)                                         |
| 3    | [Virtual Asset Transfer](./TAIPs/taip-3.md)                            |
| 4    | [Transaction Authorization Protocol](./TAIPs/taip-4.md)                |
| 5    | [Transaction Agents](./TAIPs/taip-5.md)                                |
| 6    | [Transaction Parties](./TAIPs/taip-6.md)                               |
| 7    | [Agent Policies](./TAIPs/taip-7.md)                                    |
| 8    | [Selective Disclosure](./TAIPs/taip-8.md)                              |
| 9    | [Proof of Relationship](./TAIPs/taip-9.md)                             |
| 10   | [IVMS101 for Travel Rule](./TAIPs/taip-10.md)                          |
| 11   | [Legal Entity Identifier (LEI) to Identify institutional participants in TAP Messages](./TAIPs/taip-11.md) |
| 12   | [Hashed Participant Name sharing in TAP messages](./TAIPs/taip-12.md)  |
| 13   | [Transaction Purpose Codes](./TAIPs/taip-13.md)                        |
| 14   | [Payment Requests](./TAIPs/taip-14.md)                                 |
| 15   | [Agent Connection Protocol](./TAIPs/taip-15.md)                         |
| 16   | [Invoices](./TAIPs/taip-16.md)                                         |
| 17   | [Composable Escrow](./TAIPs/taip-17.md)                                |

## Implementation Resources

### JSON Schemas
All TAP message types have corresponding JSON Schema definitions available at:
- **Base URL**: https://taips.tap.rsvp/schemas/
- **Local Path**: [./schemas/](./schemas/)

Example schemas:
- Transfer Message: https://taips.tap.rsvp/schemas/messages/transfer.json
- Payment Message: https://taips.tap.rsvp/schemas/messages/payment.json
- Party Structure: https://taips.tap.rsvp/schemas/data-structures/party.json

### TypeScript Types
Official TypeScript type definitions are available as an npm package:
- **Package**: `@taprsvp/types`
- **Source**: [./packages/typescript/](./packages/typescript/)
- **Installation**: `npm install @taprsvp/types`

The package exports:
- All TAP message type interfaces
- Data structure types (Party, Agent, Policy, etc.)
- Common types (CAIP identifiers, ISO types, etc.)
- Full TypeScript support with comprehensive JSDoc comments

## Inspiration

TAIPs are heavily inspired by [TAIPs](https://github.com/ChainAgnostic/CAIPs) which in turn were heavily inspired by [bips](https://github.com/bitcoin/bips).


## License

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://tap.rsvp">Transaction Authorization Protocol</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://notabene.id">Notabene, Inc.</a> is licensed under <a href="http://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-SA 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"></a></p>
