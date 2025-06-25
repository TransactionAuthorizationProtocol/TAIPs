---
taip: 16
title: Invoices
status: Review
type: Standard
author: Pelle Braendgaard <pelle@notabene.id>
created: 2025-04-22
updated: 2025-05-31
description: Defines a structured Invoice object format for embedding detailed payment information with line items and tax data in TAIP-14 Payment Requests. Maps to established standards like UBL and W3C Payment Request for interoperability with existing business systems while supporting regulatory compliance requirements.
requires: 14
---

## Simple Summary

A standard for **Invoices** that defines a structured invoice object to be embedded in a TAIP-14 Payment Request. This proposal enables detailed invoice information to be included in payment requests while maintaining compatibility with established invoice standards like UBL and W3C Payment Request.

## Abstract

The Transaction Authorization Protocol (TAP) enables secure, privacy-preserving payment requests between merchants and customers. While TAIP-14 defines the core Payment Request message structure, it lacks a standardized way to include detailed invoice information. This proposal defines an `invoice` object that can be embedded in a TAIP-14 Payment Request, providing a structured format for invoice data that is transformable to and from UBL JSON Invoice or W3C Payment Request formats. The Invoice object includes essential elements such as line items, tax information, and totals, enabling more detailed payment contexts while leveraging the existing merchant and customer records from TAIP-14.

## Motivation

**Enhanced Payment Context:** Current TAIP-14 Payment Requests provide basic information about the amount and asset/currency, but lack structured invoice details that are common in traditional commerce. By standardizing an Invoice object, we enable merchants to provide detailed breakdowns of charges, line items, taxes, and other invoice information that helps customers understand exactly what they're paying for.

**Interoperability with Established Standards:** The business world already uses established invoice standards like Universal Business Language (UBL) and W3C Payment Request. By designing an Invoice object that can be transformed to and from these formats, we enable TAP to integrate with existing business systems and processes without requiring significant changes to backend infrastructure.

**Extensibility for Future Requirements:** While focusing on pragmatic implementation of core invoice functionality, the Invoice object is designed to be extensible, allowing for future expansion to support additional UBL functionality or other invoice requirements as the ecosystem evolves.

**Improved Compliance and Reporting:** Detailed invoice information is often required for business accounting, tax compliance, and financial reporting. By standardizing this information within TAP, we make it easier for businesses to maintain proper records and comply with regulatory requirements.

## Specification

### Invoice Object

An **Invoice** is an object that can be embedded in a TAIP-14 Payment Request to provide detailed invoice information. The Invoice object is included in the `invoice` field of the Payment Request's body. The structure is defined as follows (fields in **bold** are required):

- **`id`** – **Required**, **string** containing a unique identifier for the invoice (e.g., "INV001").
- **`issueDate`** – **Required**, **string** in ISO 8601 date format (YYYY-MM-DD) indicating when the invoice was issued.
- **`currencyCode`** – **Required**, **string** (ISO 4217 currency code, e.g., "USD" or "EUR") specifying the currency used for the invoice amounts. This should be consistent with the `currency` field in the Payment Request if present.
- **`lineItems`** – **Required**, **array of objects** representing the individual items being invoiced. Each line item object contains:
  - **`id`** – **Required**, **string** containing a unique identifier for the line item within the invoice.
  - **`description`** – **Required**, **string** describing the item or service.
  - **`quantity`** – **Required**, **number** indicating the quantity of the item.
  - **`unitCode`** – *Optional*, **string** representing the unit of measure using UBL Unit of Measure Code standard (e.g., "KGM" for kilogram, "LTR" for liter, "PCE" for piece, "EA" for each, "HUR" for hour).
  - **`unitPrice`** – **Required**, **number** representing the price per unit.
  - **`lineTotal`** – **Required**, **number** representing the total amount for this line item (typically quantity × unitPrice).
  - **`taxCategory`** – *Optional*, **object** containing tax information for the line item:
    - **`id`** – **Required**, **string** representing the tax category code according to the [UN/ECE 5305 Tax Category Code] list (e.g., "S" for standard rate, "Z" for zero-rated, "E" for exempt).
    - **`percent`** – **Required**, **number** representing the tax rate percentage.
    - **`taxScheme`** – **Required**, **string** identifying the tax scheme according to the [UN/ECE 5305 Tax Type Code] list (e.g., "VAT", "GST", "SAL").
- **`taxTotal`** – *Optional*, **object** containing aggregate tax information:
  - **`taxAmount`** – **Required**, **number** representing the total tax amount for the invoice.
  - **`taxSubtotal`** – *Optional*, **array of objects** breaking down taxes by category:
    - **`taxableAmount`** – **Required**, **number** representing the amount subject to this tax.
    - **`taxAmount`** – **Required**, **number** representing the tax amount for this category.
    - **`taxCategory`** – **Required**, **object** containing:
      - **`id`** – **Required**, **string** identifying the tax category using UBL Tax Category Code standard.
      - **`percent`** – **Required**, **number** representing the tax rate percentage.
      - **`taxScheme`** – **Required**, **string** identifying the tax scheme.
- **`total`** – **Required**, **number** representing the total amount of the invoice, including taxes.
- **`subTotal`** – *Optional*, **number** representing the sum of line totals before taxes.
- **`dueDate`** – *Optional*, **string** in ISO 8601 date format (YYYY-MM-DD) indicating when payment is due.
- **`note`** – *Optional*, **string** containing additional notes or terms for the invoice.
- **`paymentTerms`** – *Optional*, **string** describing the terms of payment.
- **`accountingCost`** – *Optional*, **string** for buyer's accounting code, used to route costs to specific accounts.
- **`orderReference`** – *Optional*, **object** containing information about a related order:
  - **`id`** – **Required**, **string** containing the order identifier.
  - **`issueDate`** – *Optional*, **string** in ISO 8601 date format when the order was issued.
- **`additionalDocumentReference`** – *Optional*, **array of objects** referencing additional documents:
  - **`id`** – **Required**, **string** identifying the document.
  - **`documentType`** – *Optional*, **string** specifying the type of document using UBL Document Type Code standard (e.g., "Invoice", "CreditNote", "DebitNote", "Order", "Contract", "Timesheet").
  - **`url`** – *Optional*, **string** containing a URL where the document can be accessed.

### Integration with TAIP-14 Payment request

The Invoice object is embedded in a TAIP-14 Payment Request as follows:

```json
{
  "from": "did:web:merchant.vasp",
  "type": "https://tap.rsvp/schema/1.0#Payment",
  "id": "uuid:123e4567-e89b-12d3-a456-426614174000",
  "to": ["did:web:customer.vasp"],
  "body": {
    "@context": [
      "https://tap.rsvp/schema/1.0",
      "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
    ],
    "@type": "https://tap.rsvp/schema/1.0#Payment",
    "asset": "eip155:1/erc20:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "amount": "115.00",
    "merchant": {
      "@id": "did:web:merchant.vasp",
      "name": "Acme Corp",
      "mcc": "5411"
    },
    "customer": {
      "@id": "did:web:customer.vasp",
      "name": "Buyer Inc"
    },
    "invoice": {
      "id": "INV001",
      "issueDate": "2025-04-20",
      "currencyCode": "USD",
      "lineItems": [
        {
          "id": "1",
          "description": "Widget A",
          "quantity": 5,
          "unitCode": "EA",
          "unitPrice": 10.00,
          "lineTotal": 50.00
        },
        {
          "id": "2",
          "description": "Widget B",
          "quantity": 10,
          "unitCode": "EA",
          "unitPrice": 5.00,
          "lineTotal": 50.00
        }
      ],
      "taxTotal": {
        "taxAmount": 15.00,
        "taxSubtotal": [
          {
            "taxableAmount": 100.00,
            "taxAmount": 15.00,
            "taxCategory": {
              "id": "S",
              "percent": 15.0,
              "taxScheme": "VAT"
            }
          }
        ]
      },
      "total": 115.00
    }
  }
}
```

### Validation Rules

1. The `total` in the Invoice object MUST match the `amount` in the Payment Request body.
2. If both `currencyCode` in the Invoice and `currency` in the Payment Request are present, they MUST be consistent.
3. The sum of all `lineTotal` values in `lineItems` SHOULD equal the `subTotal` if present.
4. The `total` SHOULD equal the `subTotal` plus all tax amounts.
5. Each `lineTotal` SHOULD equal the `quantity` multiplied by the `unitPrice` for that line item.

### Transformation to UBL and W3C Payment Request

The Invoice object is designed to be transformable to and from UBL JSON Invoice and W3C Payment Request formats. The mapping between TAP Invoice and these formats is as follows:

#### UBL JSON Invoice Mapping

| TAP Invoice Field | UBL JSON Field |
|-------------------|----------------|
| id | Invoice/ID |
| issueDate | Invoice/IssueDate |
| currencyCode | Invoice/DocumentCurrencyCode |
| lineItems[].id | Invoice/InvoiceLine/ID |
| lineItems[].description | Invoice/InvoiceLine/Item/Description |
| lineItems[].quantity | Invoice/InvoiceLine/InvoicedQuantity |
| lineItems[].unitCode | Invoice/InvoiceLine/InvoicedQuantity/@unitCode |
| lineItems[].unitPrice | Invoice/InvoiceLine/Price/PriceAmount |
| lineItems[].lineTotal | Invoice/InvoiceLine/LineExtensionAmount |
| lineItems[].taxCategory.id | Invoice/InvoiceLine/TaxTotal/TaxSubtotal/TaxCategory/ID |
| lineItems[].taxCategory.percent | Invoice/InvoiceLine/TaxTotal/TaxSubtotal/TaxCategory/Percent |
| lineItems[].taxCategory.taxScheme | Invoice/InvoiceLine/TaxTotal/TaxSubtotal/TaxCategory/TaxScheme/ID |
| taxTotal.taxAmount | Invoice/TaxTotal/TaxAmount |
| taxTotal.taxSubtotal[].taxableAmount | Invoice/TaxTotal/TaxSubtotal/TaxableAmount |
| taxTotal.taxSubtotal[].taxAmount | Invoice/TaxTotal/TaxSubtotal/TaxAmount |
| taxTotal.taxSubtotal[].taxCategory.id | Invoice/TaxTotal/TaxSubtotal/TaxCategory/ID |
| taxTotal.taxSubtotal[].taxCategory.percent | Invoice/TaxTotal/TaxSubtotal/TaxCategory/Percent |
| taxTotal.taxSubtotal[].taxCategory.taxScheme | Invoice/TaxTotal/TaxSubtotal/TaxCategory/TaxScheme/ID |
| total | Invoice/LegalMonetaryTotal/PayableAmount |
| subTotal | Invoice/LegalMonetaryTotal/LineExtensionAmount |
| dueDate | Invoice/PaymentMeans/PaymentDueDate |
| note | Invoice/Note |
| paymentTerms | Invoice/PaymentTerms/Note |
| accountingCost | Invoice/AccountingCost |
| orderReference.id | Invoice/OrderReference/ID |
| orderReference.issueDate | Invoice/OrderReference/IssueDate |
| additionalDocumentReference[].id | Invoice/AdditionalDocumentReference/ID |
| additionalDocumentReference[].documentType | Invoice/AdditionalDocumentReference/DocumentType |
| additionalDocumentReference[].url | Invoice/AdditionalDocumentReference/Attachment/ExternalReference/URI |

#### W3C Payment Request Mapping

The W3C Payment Request API doesn't have a standardized invoice format, but the TAP Invoice object can be mapped to the `details` field of a Payment Request as follows:

```javascript
const paymentDetails = {
  total: {
    label: 'Total',
    amount: {
      currency: invoice.currencyCode,
      value: invoice.total.toString()
    }
  },
  displayItems: invoice.lineItems.map(item => ({
    label: item.description,
    amount: {
      currency: invoice.currencyCode,
      value: item.lineTotal.toString()
    }
  }))
};

if (invoice.taxTotal) {
  paymentDetails.displayItems.push({
    label: 'Tax',
    amount: {
      currency: invoice.currencyCode,
      value: invoice.taxTotal.taxAmount.toString()
    }
  });
}
```

## Rationale

The Invoice object design balances several considerations:

1. **Pragmatic Approach:** Rather than implementing the full UBL specification (which is extensive), we focus on the most commonly used invoice elements while ensuring extensibility for future needs.

2. **Compatibility:** The structure is designed to be easily transformable to and from established standards like UBL and W3C Payment Request, facilitating integration with existing systems.

3. **Consistency with TAIP-14:** The Invoice object leverages the merchant and customer information already present in the TAIP-14 Payment Request, avoiding duplication while providing additional invoice-specific details.

4. **Flexibility:** The design accommodates various business scenarios, from simple retail transactions to more complex B2B invoicing with tax categories, payment terms, and references to related documents.

## Test Cases

### Basic Invoice

```json
{
  "id": "INV001",
  "issueDate": "2025-04-20",
  "currencyCode": "USD",
  "lineItems": [
    {
      "id": "1",
      "description": "Product A",
      "quantity": 2,
      "unitCode": "EA",
      "unitPrice": 10.00,
      "lineTotal": 20.00
    }
  ],
  "total": 20.00
}
```

### Invoice with Multiple Items and Taxes

```json
{
  "id": "INV002",
  "issueDate": "2025-04-21",
  "currencyCode": "EUR",
  "lineItems": [
    {
      "id": "1",
      "description": "Service A",
      "quantity": 5,
      "unitCode": "HUR",
      "unitPrice": 100.00,
      "lineTotal": 500.00,
      "taxCategory": {
        "id": "S",
        "percent": 20.0,
        "taxScheme": "VAT"
      }
    },
    {
      "id": "2",
      "description": "Product B",
      "quantity": 10,
      "unitCode": "EA",
      "unitPrice": 50.00,
      "lineTotal": 500.00,
      "taxCategory": {
        "id": "S",
        "percent": 20.0,
        "taxScheme": "VAT"
      }
    },
    {
      "id": "3",
      "description": "Product C",
      "quantity": 1,
      "unitCode": "EA",
      "unitPrice": 200.00,
      "lineTotal": 200.00,
      "taxCategory": {
        "id": "Z",
        "percent": 0.0,
        "taxScheme": "VAT"
      }
    }
  ],
  "subTotal": 1200.00,
  "taxTotal": {
    "taxAmount": 200.00,
    "taxSubtotal": [
      {
        "taxableAmount": 1000.00,
        "taxAmount": 200.00,
        "taxCategory": {
          "id": "S",
          "percent": 20.0,
          "taxScheme": "VAT"
        }
      },
      {
        "taxableAmount": 200.00,
        "taxAmount": 0.00,
        "taxCategory": {
          "id": "Z",
          "percent": 0.0,
          "taxScheme": "VAT"
        }
      }
    ]
  },
  "total": 1400.00,
  "dueDate": "2025-05-21",
  "paymentTerms": "Net 30",
  "orderReference": {
    "id": "ORD123",
    "issueDate": "2025-04-15"
  }
}
```

### Invoice with Additional Document References

```json
{
  "id": "INV003",
  "issueDate": "2025-04-22",
  "currencyCode": "USD",
  "lineItems": [
    {
      "id": "1",
      "description": "Consulting Services",
      "quantity": 40,
      "unitCode": "HUR",
      "unitPrice": 150.00,
      "lineTotal": 6000.00
    }
  ],
  "taxTotal": {
    "taxAmount": 600.00,
    "taxSubtotal": [
      {
        "taxableAmount": 6000.00,
        "taxAmount": 600.00,
        "taxCategory": {
          "id": "S",
          "percent": 10.0,
          "taxScheme": "VAT"
        }
      }
    ]
  },
  "total": 6600.00,
  "note": "Please reference contract #ABC123 with payment",
  "accountingCost": "PROJ-2025-001",
  "additionalDocumentReference": [
    {
      "id": "CONTRACT-ABC123",
      "documentType": "Contract",
      "url": "https://example.com/contracts/ABC123"
    },
    {
      "id": "TIMESHEET-001",
      "documentType": "Timesheet",
      "url": "https://example.com/timesheets/001"
    }
  ]
}
```

## Security Considerations

The Invoice object inherits the security considerations from TAIP-14, particularly regarding message integrity and authentication. Additional considerations specific to invoices include:

1. **Data Validation:** Implementations should validate that invoice totals match the sum of line items and taxes to prevent manipulation of amounts.

2. **Consistency Checks:** The invoice currency and total should be consistent with the Payment Request's currency and amount to prevent discrepancies that could lead to disputes.

3. **Document References:** When including URLs to additional documents, implementations should ensure these links use secure protocols (HTTPS) and validate the authenticity of referenced documents.

4. **Tax Calculations:** Implementations should verify that tax calculations are accurate according to the specified rates and categories to prevent tax fraud or errors.

## Privacy Considerations

The Invoice object may contain business-sensitive information that requires privacy protection:

1. **Sensitive Business Data:** Invoice details may reveal business relationships, pricing strategies, or purchasing patterns. The DIDComm encryption used for TAIP-14 messages helps protect this information during transmission.

2. **Personal Information:** Invoices might include personal information in descriptions or references. Implementations should minimize personal data and ensure compliance with relevant privacy regulations.

3. **Document References:** Links to additional documents should be secured and access-controlled to prevent unauthorized access to potentially sensitive information.

4. **Storage and Retention:** Implementations should establish appropriate retention policies for invoice data, keeping it only as long as necessary for business and regulatory purposes.

## Backwards Compatibility

This TAIP extends TAIP-14 by defining the structure of the `invoice` field, which was previously mentioned but not fully specified. It maintains backward compatibility with existing TAIP-14 implementations as follows:

1. The `invoice` field in TAIP-14 was optional, so existing implementations that don't support detailed invoices can continue to function with just the basic payment information.

2. Implementations that already use the `invoice` field in a different way may need to adapt to this standardized format, but the transition should be straightforward as this proposal formalizes common invoice elements.

3. The Invoice object is designed to be extensible, allowing for additional fields to be added in future versions without breaking compatibility with current implementations.

## References

- [TAIP-14] Payments
- [UBL-2.1] Universal Business Language Version 2.1
- [W3C-PR] W3C Payment Request API
- [ISO-4217] Currency Codes
- [UN/ECE 5305 Tax Category Code]
- [UN/ECE 5305 Tax Type Code]

[TAIP-14]: ./taip-14 "Payments"
[UBL-2.1]: http://docs.oasis-open.org/ubl/UBL-2.1.html
[W3C-PR]: https://www.w3.org/TR/payment-request/
[ISO-4217]: https://www.iso.org/iso-4217-currency-codes.html

[UN/ECE 5305 Tax Category Code]: http://docs.oasis-open.org/ubl/os-UBL-2.1/cl/gc/default/TaxCategory-2.1.gc
[UN/ECE 5305 Tax Type Code]: http://docs.oasis-open.org/ubl/os-UBL-2.1/cl/gc/default/TaxScheme-2.1.gc


## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
