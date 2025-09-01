---
layout: page
title: TAP Transaction Types
permalink: /transactions/
---

The Transaction Authorization Protocol (TAP) supports four primary transaction message types: **Transfer**, **Payment**, **Exchange**, and **Escrow**. All enable compliant blockchain transactions, but they serve different business needs and workflows.

## Transfer

The **Transfer** message type is the foundation of TAP, designed for direct crypto asset transfers between parties.

### Business Use Cases

- **VASP-to-VASP Transfers**: Enables regulated crypto businesses to exchange customer asset transfers with required compliance data
- **Business-to-Business Payments**: Allows organizations to send crypto payments to vendors, suppliers, or partners
- **Corporate Treasury Operations**: Facilitates moving funds between company-controlled wallets
- **Exchange Withdrawals**: Supports customer withdrawals from exchanges to external wallets

### Key Characteristics

- **Originator Initiated**: The sending party (originator) initiates the transfer
- **Push-Based Model**: Assets are "pushed" from the originator to the beneficiary
- **Pre-Transaction Authorization**: Compliance checks occur before settlement on the blockchain
- **Compliance Data Exchange**: Allows sharing of identity information, purpose codes, and other compliance data
- **Purpose Code Support**: Includes optional ISO 20022 `purpose` and `categoryPurpose` fields to indicate the reason for payment (e.g., "SALA" for salary payments, "SUPP" for supplier payments) as defined in [TAIP-13](/TAIPs/taip-13.md)

## Payment

The **Payment** message type extends TAP to support merchant payment scenarios where the receiver initiates the request.

### Business Use Cases

- **Merchant Payments**: Enables businesses to request payment from customers
- **Invoice Collection**: Allows service providers to request payment for completed work
- **Recurring Payments**: Supports subscription-based business models
- **Donation Collection**: Enables charities and non-profits to request and track donations

### Key Characteristics

- **Beneficiary Initiated**: The receiving party (merchant/beneficiary) initiates the request
- **Pull-Based Model**: Beneficiary requests the customer to "pull" funds from their wallet
- **Enhanced Metadata**: Supports additional information like invoices, items, and payment terms
- **Customer Experience Focus**: Designed for consumer-friendly payment flows with clear merchant identification
- **Merchant Classification**: Supports ISO 18245 Merchant Category Codes (MCC) for business type identification (e.g., restaurants, grocery stores)
- **Flexible Settlement**: Supports flexible asset selection through the `supportedAssets` field, allowing customers to choose their preferred payment method
- **Fallback Settlement Options**: Includes `fallbackSettlementAddresses` field supporting both blockchain (CAIP-10) and traditional payment systems (RFC 8905 PayTo URIs) for redundancy
- **Invoice Support**: Includes comprehensive invoice functionality as defined in [TAIP-16](/TAIPs/taip-16.md), supporting detailed line items, tax information, and payment terms
- **Policy Support**: Can include policy requirements (e.g., RequirePresentation) for customer information needed for the transaction

## Exchange

The **Exchange** message type enables asset swaps and cross-asset quotations, facilitating conversion between different cryptocurrencies or between fiat and crypto assets.

### Business Use Cases

- **Cross-Asset Payments**: Enables paying in one asset while settling in another (e.g., pay USD, settle in USDC)
- **Currency Exchange**: Supports FX transactions between different stablecoins or fiat currencies
- **On/Off-Ramp Services**: Facilitates conversion between fiat money and cryptocurrency
- **Cross-Chain Bridging**: Enables moving assets between different blockchain networks
- **Liquidity Provision**: Allows market makers to provide quotes for asset conversions

### Key Characteristics

- **Quote-Based Model**: Uses a two-step process with Exchange request and Quote response
- **Multi-Asset Support**: Handles arrays of source and target assets for flexible routing
- **Rate Discovery**: Enables competitive pricing through multiple provider quotes
- **Settlement Flexibility**: Can be combined with existing Authorize/Settle flows from [TAIP-4](/TAIPs/taip-4.md)
- **Escrow Integration**: Can leverage escrow mechanisms from [TAIP-17](/TAIPs/taip-17.md) for counterparty risk management
- **Provider Agnostic**: Supports both centralized liquidity providers and decentralized protocols

## Escrow

The **Escrow** message type enables third-party custody of assets with conditional release, providing security guarantees for complex transactions.

### Business Use Cases

- **High-Value Transfers**: Provides security for large transactions where parties want guarantees before settlement
- **Cross-Border Payments**: Enables conditional releases based on regulatory compliance verification
- **Contract-Based Payments**: Supports milestone-based payments where funds are released upon completion
- **Dispute Resolution**: Allows neutral third parties to hold funds during dispute resolution processes
- **Asset Swaps**: Facilitates atomic swaps between different assets with escrow protection
- **Marketplace Transactions**: Enables secure payments in peer-to-peer marketplaces

### Key Characteristics

- **Third-Party Custody**: Requires a trusted escrow agent to hold assets temporarily
- **Conditional Release**: Assets are released only when specific conditions are met
- **Automatic Expiration**: Includes built-in expiry mechanisms to prevent indefinite fund locks
- **Agreement Support**: Can reference external terms and conditions governing the escrow
- **Multi-Party Security**: Protects both originator and beneficiary through neutral custody
- **Capture Mechanism**: Uses separate Capture messages to authorize fund release
- **Integration Ready**: Works seamlessly with other TAP message types for complex workflows

## Business Differences

| Aspect | Transfer | Payment | Exchange | Escrow |
|--------|----------|---------|----------|--------|
| **Initiator** | Originator (sender) | Beneficiary (receiver) | Requester (either party) | Any party (typically beneficiary) |
| **Flow Direction** | Push (send) | Pull (request) | Quote-based (negotiate) | Conditional hold (escrow) |
| **Primary Use Case** | VASP-to-VASP transfers | Merchant payments | Asset swaps, FX | High-value, conditional payments |
| **Compliance Focus** | Travel Rule, sanction screening | Merchant authentication, consumer protection | Liquidity provider verification, asset compliance | Escrow agent verification, conditional compliance |
| **User Experience** | Institutional/business-oriented | Consumer/customer-oriented | Quote discovery, price comparison | Security-focused, trust minimization |
| **Settlement Timing** | Typically immediate after authorization | May include payment terms/deadlines | Immediate after quote acceptance | Conditional upon escrow release |
| **Supporting Data** | Focuses on compliance data | Focuses on commercial transaction details | Focuses on exchange rates and asset metadata | Focuses on escrow terms and release conditions |

## Implementation Considerations

When implementing TAP, organizations should consider which transaction type best fits their business model:

- **Financial Institutions** typically focus on the Transfer message type to support customer withdrawals and institutional transfers
- **Merchants and Service Providers** benefit from implementing the Payment flow to collect payments
- **Liquidity Providers and Exchanges** use the Exchange flow to offer asset conversion services
- **Escrow Services and High-Value Transaction Facilitators** implement Escrow flows to provide security guarantees
- **Full-Service Platforms** may implement all four to support various business scenarios including payments, transfers, asset exchanges, and conditional transactions

For technical details on these message types, including required attributes and examples, see the [full message reference](/messages/#transaction-message).
