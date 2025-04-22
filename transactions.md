---
layout: page
title: TAP Transaction Types
permalink: /transactions/
---

The Transaction Authorization Protocol (TAP) supports two primary transaction message types: **Transfer** and **Payment**. Both enable compliant blockchain transactions, but they serve different business needs and workflows.

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
- **Flexible Settlement**: Supports optional partial payments through the **Complete** message, allowing merchants to adjust final amounts
- **Invoice Support**: Includes comprehensive invoice functionality as defined in [TAIP-16](/TAIPs/taip-16.md), supporting detailed line items, tax information, and payment terms

### Complete Message

The **Complete** message is a crucial part of the Payment flow, sent by the merchant's agent to indicate that the transaction is ready for settlement:

- **Settlement Readiness**: Clearly signals that the merchant has finished all necessary checks and is ready to receive payment
- **Address Provision**: Provides the blockchain address where funds should be sent
- **Optional Amount Adjustment**: Allows merchants to specify a final amount (which must be less than or equal to the original requested amount), enabling scenarios like partial fulfillment or applied discounts
- **Settlement Guidance**: When an amount is specified in the Complete message, the customer's agent must use that exact amount in the subsequent Settle message. If omitted, the full amount from the original Payment message is implied

## Business Differences

| Aspect | Transfer | Payment |
|--------|----------|---------------|
| **Initiator** | Originator (sender) | Beneficiary (receiver) |
| **Flow Direction** | Push (send) | Pull (request) |
| **Primary Use Case** | VASP-to-VASP transfers | Merchant payments |
| **Compliance Focus** | Travel Rule, sanction screening | Merchant authentication, consumer protection |
| **User Experience** | Institutional/business-oriented | Consumer/customer-oriented |
| **Settlement Timing** | Typically immediate after authorization | May include payment terms/deadlines |
| **Supporting Data** | Focuses on compliance data | Focuses on commercial transaction details |

## Implementation Considerations

When implementing TAP, organizations should consider which transaction type best fits their business model:

- **Financial Institutions** typically focus on the Transfer message type to support customer withdrawals and institutional transfers
- **Merchants and Service Providers** benefit from implementing the Payment flow to collect payments
- **Full-Service Platforms** may implement both to support various business scenarios

For technical details on these message types, including required attributes and examples, see the [full message reference](/messages/#transaction-message).
