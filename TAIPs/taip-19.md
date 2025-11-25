---
taip: 19
title: ISO 20022 Message Mapping
status: Draft
type: Standard
author: Pelle Braendgaard <pelle@notabene.id>
created: 2025-11-25
updated: 2025-11-25
description: Defines bidirectional mappings between ISO 20022 payment messages (PAIN, PACS, CAMT) and TAP messages, enabling interoperability between traditional financial messaging and blockchain transaction authorization.
requires: 2, 3, 4, 5, 6, 13, 14, 15, 16
---

## Simple Summary

This specification defines how ISO 20022 payment messages map to Transaction Authorization Protocol (TAP) messages, enabling seamless interoperability between traditional financial messaging infrastructure and blockchain-based transaction authorization.

## Abstract

ISO 20022 is the global standard for financial messaging, used by SWIFT, SEPA, Fedwire, and real-time payment systems worldwide. This TAIP establishes bidirectional mappings between ISO 20022 message families (PAIN, PACS, CAMT) and TAP messages ([TAIP-3], [TAIP-4], [TAIP-14], [TAIP-15]), allowing financial institutions and payment service providers to bridge traditional payment rails with blockchain settlement while maintaining regulatory compliance and operational consistency.

## Motivation

As virtual asset transactions become integrated into the broader financial ecosystem, interoperability with existing payment infrastructure becomes critical. Financial institutions already use ISO 20022 for:

- Cross-border payments (SWIFT gpi, TARGET2)
- Domestic real-time payments (FedNow, SEPA Instant, Faster Payments)
- Direct debit mandates and collections
- Payment status reporting and investigations

By mapping ISO 20022 messages to TAP, institutions can:

1. **Bridge payment systems**: Route payments between traditional rails and blockchain settlement
2. **Maintain compliance**: Preserve structured data required for regulatory reporting
3. **Leverage existing infrastructure**: Reuse ISO 20022-compliant systems for virtual asset transactions
4. **Enable hybrid flows**: Support payment initiation on one system with settlement on another

The November 2025 SWIFT migration deadline makes ISO 20022 the dominant messaging standard, making this mapping essential for TAP adoption by regulated financial institutions.

## Specification

### Core Mapping Principles

The mapping follows these design principles:

1. **PACS = Backend Settlement**: Inter-bank clearing messages (pacs.*) map to [TAIP-3] Transfer for backend settlement between agents
2. **PAIN = Customer Initiation**: Payment initiation messages (pain.*) map to [TAIP-14] Payment for customer-facing requests or [TAIP-15] Connect for mandate establishment
3. **CAMT = Investigation/Recall**: Cash management messages (camt.*) map to [TAIP-4] Cancel and Revert flows
4. **Direction determines type**: The initiating party determines whether a message is a Transfer (originator-initiated) or Payment (beneficiary-initiated)
5. **payto:// for traditional accounts**: Use [RFC 8905] payto URIs to represent IBAN, BBAN, and other traditional account identifiers in TAP settlement addresses

### Message Type Mappings

#### PAIN Messages (Payment Initiation)

| ISO 20022 | Name | TAP Message | Notes |
|-----------|------|-------------|-------|
| pain.001 | Customer Credit Transfer Initiation | [TAIP-14] Payment | Customer instructs payment to creditor |
| pain.002 | Payment Status Report | [TAIP-4] Authorize/Reject/Settle | Status response to initiation |
| pain.008 | Customer Direct Debit Initiation | [TAIP-14] Payment | Collection against mandate; `pthid` references Connect |
| pain.009 | Mandate Initiation Request | [TAIP-15] Connect | Establishes direct debit mandate |
| pain.010 | Mandate Amendment Request | [TAIP-15] Connect | Amends existing mandate constraints |
| pain.011 | Mandate Cancellation Request | [TAIP-4] Cancel | Terminates mandate; `by: principal` |
| pain.012 | Mandate Acceptance Report | [TAIP-4] Authorize/Reject | Response to mandate request |
| pain.013 | Creditor Payment Activation Request | [TAIP-14] Payment | Request to Pay (RfP) |
| pain.014 | Creditor Payment Activation Request Status | [TAIP-4] responses | Response to RfP |
| pain.016 | Payment Cancellation Request | [TAIP-4] Cancel | Cancel payment before settlement |
| pain.017 | Mandate Copy Request | *(informational)* | Out of scope for TAP |
| pain.018 | Mandate Suspension Request | [TAIP-4] Cancel | Temporary mandate suspension |

#### PACS Messages (Clearing & Settlement)

| ISO 20022 | Name | TAP Message | Notes |
|-----------|------|-------------|-------|
| pacs.002 | FI to FI Payment Status Report | [TAIP-4] Authorize/Reject/Settle | Settlement status |
| pacs.003 | FI to FI Customer Direct Debit | [TAIP-3] Transfer | Beneficiary-initiated settlement |
| pacs.004 | Payment Return | [TAIP-4] Revert + Settle | Return of settled funds |
| pacs.007 | FI to FI Payment Reversal | [TAIP-4] Revert | Reversal request before settlement |
| pacs.008 | FI to FI Customer Credit Transfer | [TAIP-3] Transfer | Originator-initiated settlement |
| pacs.009 | FI Credit Transfer | [TAIP-3] Transfer | Institution-level transfer |
| pacs.010 | FI Direct Debit | [TAIP-3] Transfer | Institution-level debit |

#### CAMT Messages (Cash Management)

| ISO 20022 | Name | TAP Message | Notes |
|-----------|------|-------------|-------|
| camt.029 | Resolution of Investigation | [TAIP-4] Authorize/Reject | Response to recall/investigation |
| camt.055 | Customer Payment Cancellation Request | [TAIP-4] Cancel | Customer-initiated recall |
| camt.056 | FI to FI Payment Cancellation Request | [TAIP-4] Cancel | Bank-initiated recall |

### Party and Agent Mappings

#### Party Roles

| ISO 20022 Element | TAP Equivalent | Description |
|-------------------|----------------|-------------|
| Debtor | `originator` ([TAIP-6]) | Party sending funds |
| Creditor | `beneficiary` ([TAIP-6]) | Party receiving funds |
| Ultimate Debtor | `originator` with additional party data | Original source of funds |
| Ultimate Creditor | `beneficiary` with additional party data | Final recipient of funds |

#### Agent Roles

| ISO 20022 Element | TAP Equivalent | Description |
|-------------------|----------------|-------------|
| Debtor Agent | Agent with `for: originator` | Originator's financial institution |
| Creditor Agent | Agent with `for: beneficiary` | Beneficiary's financial institution |
| Instructing Agent | Agent in `agents` array | Intermediate processing agent |
| Instructed Agent | Message recipient | Target agent of instruction |
| Intermediary Agent | Agent in `agents` array | Correspondent/clearing agent |

#### Institutional Identifiers

Service providers converting between ISO 20022 and TAP are responsible for resolving agent DIDs from institutional identifiers. The DID resolution is handled out-of-band and is an implementation detail of the conversion service.

| ISO 20022 Element | TAP Location | Notes |
|-------------------|--------------|-------|
| `FinInstnId/BICFI` | Agent `@id` | Service provider resolves BIC to DID |
| `FinInstnId/LEI` | Agent `@id` + `leiCode` | Service provider resolves LEI to DID; preserve LEI in metadata |
| `FinInstnId/Nm` | Agent `name` | Institution name |
| `FinInstnId/PstlAdr` | Agent `geographicAddress` | [IVMS101] format |

**DID Resolution:**

The service provider maintains mappings between institutional identifiers (BIC, LEI) and DIDs. This allows standard ISO 20022 messages to flow through RTP systems unchanged, with DID resolution happening at the TAP gateway.

Example TAP agent with institutional identifiers:

```json
{
  "@id": "did:web:bank.example",
  "@type": "https://schema.org/Organization",
  "name": "Example Bank AG",
  "leiCode": "969500KN90DZLPGW6898",
  "for": "did:eg:customer",
  "geographicAddress": [{
    "addressType": "BIZZ",
    "streetName": "Bahnhofstrasse",
    "buildingNumber": "1",
    "postCode": "8001",
    "townName": "Zurich",
    "country": "CH"
  }]
}
```

### Account and Address Mappings

Traditional account identifiers MUST be represented using [RFC 8905] payto URIs in TAP `settlementAddress` fields:

| Account Type | payto:// Format | Example |
|--------------|-----------------|---------|
| IBAN | `payto://iban/{iban}` | `payto://iban/XX00EXAMPLE0000012345` |
| BBAN | `payto://bban/{bban}?authority={country}` | `payto://bban/EXAMPLE0000012345?authority=XX` |
| ACH (US) | `payto://ach/{routing}/{account}` | `payto://ach/123456789/987654321` |
| UPI (India) | `payto://upi/{vpa}` | `payto://upi/user@bank` |
| SWIFT BIC | `payto://swift/{bic}/{account}` | `payto://swift/EXMPLBNK/123456789` |
| Blockchain | [CAIP-10] format | `eip155:1:0x1234...` |

When mapping ISO 20022 account identifiers to TAP:

- `CdtrAcct/Id/IBAN` maps to `settlementAddress` as `payto://iban/{value}`
- `DbtrAcct/Id/IBAN` may be included as informational data in party metadata
- Proprietary account identifiers use `payto://void/?account={value}&institution={bic}`

### Status Code Mappings

#### ISO 20022 → TAP Response Messages

| ISO 20022 Status | Code | TAP Message | Notes |
|------------------|------|-------------|-------|
| AcceptedCustomerProfile | ACCP | Authorize | Validation passed |
| AcceptedTechnicalValidation | ACTC | Authorize | Technical checks passed |
| AcceptedSettlementInProgress | ACSP | Settle | Settlement initiated |
| AcceptedSettlementCompleted | ACSC | Settle | Include `settlementId` |
| Rejected | RJCT | Reject | Include reason code |
| Cancelled | CANC | Cancel | Cancelled by party |
| Pending | PDNG | AuthorizationRequired | Awaiting action |

#### TAP → ISO 20022 Status Codes

| TAP Message | ISO 20022 Status | Condition |
|-------------|------------------|-----------|
| Authorize | ACCP or ACTC | Before settlement |
| Authorize + settlementAddress | ACSP | Ready for settlement |
| Settle | ACSC | With `settlementId` |
| Settle (pending) | ACSP | Without `settlementId` |
| Reject | RJCT | Include mapped reason |
| Cancel | CANC | - |

### Detailed Field Mappings

#### pacs.008 (Credit Transfer) ↔ TAIP-3 Transfer

**ISO 20022 → TAP:**

| ISO 20022 Path | TAP Field | Notes |
|----------------|-----------|-------|
| `GrpHdr/MsgId` | DIDComm `id` | Message identifier |
| `GrpHdr/CreDtTm` | `created_time` | ISO 8601 timestamp |
| `CdtTrfTxInf/PmtId/EndToEndId` | `memo` | End-to-end reference |
| `CdtTrfTxInf/PmtId/TxId` | *(internal)* | Transaction reference |
| `CdtTrfTxInf/IntrBkSttlmAmt` | `amount` | Decimal string |
| `CdtTrfTxInf/IntrBkSttlmAmt@Ccy` | `asset` or `currency` | Map to [CAIP-19] or ISO 4217 |
| `CdtTrfTxInf/Dbtr` | `originator` | [TAIP-6] party |
| `CdtTrfTxInf/DbtrAgt/FinInstnId` | Agent `@id` | Resolve DID from BIC/LEI |
| `CdtTrfTxInf/Cdtr` | `beneficiary` | [TAIP-6] party |
| `CdtTrfTxInf/CdtrAgt/FinInstnId` | Agent `@id` | Resolve DID from BIC/LEI |
| `CdtTrfTxInf/CdtrAcct/Id/IBAN` | Agent `role: SettlementAddress` | `payto://iban/...` |
| `CdtTrfTxInf/Purp/Cd` | `purpose` | [TAIP-13] |
| `CdtTrfTxInf/CtgyPurp/Cd` | `categoryPurpose` | [TAIP-13] |

**Example pacs.008 → Transfer:**

ISO 20022 (simplified):
```xml
<CdtTrfTxInf>
  <PmtId>
    <EndToEndId>INV-2025-001</EndToEndId>
    <TxId>TXN123456</TxId>
  </PmtId>
  <IntrBkSttlmAmt Ccy="EUR">1000.00</IntrBkSttlmAmt>
  <Dbtr>
    <Nm>Alice Smith</Nm>
  </Dbtr>
  <DbtrAgt>
    <FinInstnId>
      <BICFI>EXMPLBANK</BICFI>
    </FinInstnId>
  </DbtrAgt>
  <CdtrAgt>
    <FinInstnId>
      <BICFI>SAMPLEBIC</BICFI>
    </FinInstnId>
  </CdtrAgt>
  <Cdtr>
    <Nm>Bob Jones</Nm>
  </Cdtr>
  <CdtrAcct>
    <Id>
      <IBAN>XX00SAMPLE0000001234567890</IBAN>
    </Id>
  </CdtrAcct>
  <Purp>
    <Cd>GDDS</Cd>
  </Purp>
</CdtTrfTxInf>
```

TAP Transfer:
```json
{
  "id": "TXN123456",
  "type": "https://tap.rsvp/schema/1.0#Transfer",
  "from": "did:web:originator-bank.example",
  "to": ["did:web:beneficiary-bank.example"],
  "created_time": 1732492800,
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Transfer",
    "asset": "iso4217:EUR",
    "amount": "1000.00",
    "memo": "INV-2025-001",
    "purpose": "GDDS",
    "originator": {
      "@id": "did:eg:alice",
      "name": "Alice Smith"
    },
    "beneficiary": {
      "@id": "did:eg:bob",
      "name": "Bob Jones"
    },
    "agents": [
      {
        "@id": "did:web:originator-bank.example",
        "for": "did:eg:alice"
      },
      {
        "@id": "did:web:beneficiary-bank.example",
        "for": "did:eg:bob"
      },
      {
        "@id": "payto://iban/XX00SAMPLE0000001234567890",
        "role": "SettlementAddress",
        "for": "did:web:beneficiary-bank.example"
      }
    ]
  }
}
```

#### pain.001 (Credit Transfer Initiation) ↔ TAIP-14 Payment

**ISO 20022 → TAP:**

| ISO 20022 Path | TAP Field | Notes |
|----------------|-----------|-------|
| `GrpHdr/MsgId` | DIDComm `id` | Message identifier |
| `GrpHdr/CreDtTm` | `created_time` | ISO 8601 timestamp |
| `PmtInf/ReqdExctnDt` | `expiry` | Requested execution date |
| `PmtInf/Dbtr` | `customer` | Paying party |
| `PmtInf/DbtrAgt` | Customer's Agent | Agent for customer |
| `PmtInf/CdtTrfTxInf/Amt/InstdAmt` | `amount` | Decimal string |
| `PmtInf/CdtTrfTxInf/Amt/InstdAmt@Ccy` | `currency` | ISO 4217 code |
| `PmtInf/CdtTrfTxInf/Cdtr` | `merchant` | Receiving party |
| `PmtInf/CdtTrfTxInf/CdtrAgt` | Merchant's Agent | Agent for merchant |
| `PmtInf/CdtTrfTxInf/CdtrAcct/Id/IBAN` | `fallbackSettlementAddresses` | payto:// URI |
| `PmtInf/CdtTrfTxInf/Purp/Cd` | `purpose` | [TAIP-13] |

#### pain.009 (Mandate Initiation) ↔ TAIP-15 Connect

**ISO 20022 → TAP:**

| ISO 20022 Path | TAP Field | Notes |
|----------------|-----------|-------|
| `GrpHdr/MsgId` | DIDComm `id` | Message identifier |
| `Mndt/MndtId` | *(reference)* | Mandate identifier |
| `Mndt/Tp/SvcLvl/Cd` | `constraints.categoryPurposes` | Service level |
| `Mndt/Tp/LclInstrm/Cd` | `constraints.purposes` | Local instrument |
| `Mndt/Ocrncs/SeqTp` | *(constraint type)* | RCUR=recurring, OOFF=one-off |
| `Mndt/Ocrncs/Frqcy` | *(frequency)* | Collection frequency |
| `Mndt/MaxAmt` | `constraints.limits.per_transaction` | Maximum amount |
| `Mndt/Cdtr` | `requester` | Creditor party |
| `Mndt/CdtrAgt` | Requester's Agent | Creditor's agent |
| `Mndt/Dbtr` | `principal` | Debtor party |
| `Mndt/DbtrAgt` | Principal's Agent | Debtor's agent |
| `Mndt/DbtrAcct/Id/IBAN` | `constraints.allowedSettlementAddresses` | payto:// URI |

**Example pain.009 → Connect:**

```json
{
  "id": "mandate-001",
  "type": "https://tap.rsvp/schema/1.0#Connect",
  "from": "did:web:subscription-service.com",
  "to": ["did:web:customer-bank.com"],
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Connect",
    "requester": {
      "@id": "did:web:subscription-service.com",
      "name": "Streaming Service Inc"
    },
    "principal": {
      "@id": "did:eg:customer"
    },
    "agents": [
      {
        "@id": "did:web:subscription-service.com",
        "for": "did:web:subscription-service.com"
      }
    ],
    "constraints": {
      "purposes": ["SUBS"],
      "limits": {
        "per_transaction": "19.99",
        "per_month": "19.99",
        "currency": "EUR"
      },
      "allowedSettlementAddresses": [
        "payto://iban/XX00EXAMPLE0000012345"
      ]
    },
    "agreement": "https://subscription-service.com/terms"
  }
}
```

### Flow Diagrams

#### Credit Transfer Flow

```
ISO 20022 Side                          TAP Side
──────────────────                      ──────────────────

Customer                                Customer
    │                                       │
    ▼                                       ▼
pain.001 ─────────────────────────────► TAIP-14 Payment
(Credit Transfer Initiation)            (merchant-initiated request)
    │                                       │
    ▼                                       ▼
Debtor Bank                             Customer Wallet Agent
    │                                       │
    ▼                                       ▼
pacs.008 ─────────────────────────────► TAIP-3 Transfer
(FI Credit Transfer)                    (settlement instruction)
    │                                       │
    ▼                                       ▼
Creditor Bank                           Merchant Agent
    │                                       │
    ▼                                       ▼
pacs.002 ◄───────────────────────────── TAIP-4 Settle
(Status Report: ACSC)                   (with settlementId)
```

#### Direct Debit Mandate and Collection Flow

```
1. MANDATE SETUP:

pain.009 ─────────────────────────────► TAIP-15 Connect
(Mandate Initiation Request)            (establish constraints)
    │                                       │
    ▼                                       ▼
pain.012 ◄───────────────────────────── TAIP-4 Authorize
(Mandate Acceptance Report)             (principal approves)


2. COLLECTION:

pain.008 ─────────────────────────────► TAIP-14 Payment
(Direct Debit Initiation)               (pthid → Connect id)
    │                                       │
    ▼                                       ▼
pacs.003 ─────────────────────────────► TAIP-3 Transfer
(FI Direct Debit)                       (settlement)
    │                                       │
    ▼                                       ▼
pacs.002 ◄───────────────────────────── TAIP-4 Settle
(Status Report: ACSC)                   (with settlementId)
```

#### Request to Pay Flow

```
pain.013 ─────────────────────────────► TAIP-14 Payment
(Creditor Payment Activation Request)   (merchant requests payment)
    │                                       │
    ▼                                       ▼
pain.014 ◄───────────────────────────── TAIP-4 Authorize
(Status: customer approves)             (customer's wallet)
    │                                       │
    ▼                                       ▼
pacs.008 ─────────────────────────────► TAIP-3 Transfer
(FI Credit Transfer)                    (settlement)
    │                                       │
    ▼                                       ▼
pacs.002 ◄───────────────────────────── TAIP-4 Settle
(Status Report: ACSC)                   (completion)
```

#### Payment Recall Flow

```
camt.056 ─────────────────────────────► TAIP-4 Revert
(FI Payment Cancellation Request)       (request return)
    │                                       │
    ▼                                       ▼
camt.029 ◄───────────────────────────── TAIP-4 Authorize/Reject
(Resolution of Investigation)           (accept/decline recall)
    │                                       │
    ▼ (if accepted)                         ▼
pacs.004 ─────────────────────────────► TAIP-4 Settle
(Payment Return)                        (return funds)
```

### Reverse Mapping (TAP → ISO 20022)

When generating ISO 20022 messages from TAP flows:

#### TAIP-3 Transfer → pacs.008

| TAP Field | ISO 20022 Path | Notes |
|-----------|----------------|-------|
| DIDComm `id` | `GrpHdr/MsgId` | Truncate to 35 chars |
| `created_time` | `GrpHdr/CreDtTm` | ISO 8601 |
| `amount` | `CdtTrfTxInf/IntrBkSttlmAmt` | Numeric value |
| `asset` (if [CAIP-19]) | *(custom handling)* | Map to equivalent currency |
| `currency` (if ISO 4217) | `IntrBkSttlmAmt@Ccy` | Direct mapping |
| `originator.name` | `CdtTrfTxInf/Dbtr/Nm` | Party name |
| `beneficiary.name` | `CdtTrfTxInf/Cdtr/Nm` | Party name |
| Agent with `role: SettlementAddress` | `CdtTrfTxInf/CdtrAcct/Id/IBAN` | Extract from payto:// |
| `purpose` | `CdtTrfTxInf/Purp/Cd` | [TAIP-13] code |
| `memo` | `CdtTrfTxInf/PmtId/EndToEndId` | Reference |

#### TAIP-4 Authorize → pacs.002

| TAP Field | ISO 20022 Path | Notes |
|-----------|----------------|-------|
| DIDComm `id` | `GrpHdr/MsgId` | Status message ID |
| `thid` | `OrgnlGrpInfAndSts/OrgnlMsgId` | Original message reference |
| *(Authorize)* | `TxInfAndSts/TxSts` | ACCP or ACTC |
| `settlementAddress` | `TxInfAndSts/StsRsnInf` | Include address info |

#### TAIP-4 Settle → pacs.002

| TAP Field | ISO 20022 Path | Notes |
|-----------|----------------|-------|
| DIDComm `id` | `GrpHdr/MsgId` | Status message ID |
| `thid` | `OrgnlGrpInfAndSts/OrgnlMsgId` | Original message reference |
| *(Settle)* | `TxInfAndSts/TxSts` | ACSC |
| `settlementId` | `TxInfAndSts/OrgnlTxRef/PmtTpInf` | Settlement reference |

### Service Provider DID Resolution

Service providers acting as TAP gateways are responsible for maintaining mappings between institutional identifiers (BIC, LEI) and DIDs. This resolution happens out-of-band and does not require modifications to ISO 20022 messages.

**Resolution approaches:**

1. **Internal registry**: Service provider maintains a lookup table mapping BIC/LEI to DIDs
2. **External registry**: Query a shared BIC-to-DID or LEI-to-DID registry service
3. **DID Document discovery**: Resolve `did:web:` from institution's known domain

**Reverse mapping (TAP → ISO 20022):**

When converting TAP messages back to ISO 20022, the service provider looks up the BIC/LEI associated with the agent DID and populates the standard `FinInstnId` fields.

This approach allows standard RTP flows to operate unchanged, with the TAP gateway handling all DID resolution transparently.

## Rationale

The mapping design prioritizes:

1. **Semantic preservation**: ISO 20022's structured data model (parties, agents, accounts, purpose codes) maps cleanly to TAP's JSON-LD structure
2. **Bidirectionality**: Institutions need to both consume and produce ISO 20022 messages
3. **Regulatory compliance**: Travel Rule data in [TAIP-6] uses [IVMS101], which aligns with ISO 20022's party identification structures
4. **Purpose code reuse**: [TAIP-13] already uses ISO 20022 external code sets, enabling direct mapping
5. **Account flexibility**: payto:// URIs ([RFC 8905]) provide a standardized way to represent any account type

The distinction between PAIN (initiation) and PACS (clearing) maps naturally to TAP's Payment/Transfer separation, where Payment represents a request and Transfer represents actual settlement instruction.

## Test Cases

### pacs.008 → Transfer Validation

Given a pacs.008 message with:
- Amount: EUR 1000.00
- Debtor: "Alice Smith"
- Creditor: "Bob Jones"
- Creditor IBAN: XX00SAMPLE0000001234567890
- Purpose: GDDS

The resulting Transfer MUST have:
- `amount`: "1000.00"
- `asset`: "iso4217:EUR" or equivalent [CAIP-19]
- `originator.name`: "Alice Smith"
- `beneficiary.name`: "Bob Jones"
- Agent with `role: SettlementAddress` containing `payto://iban/XX00SAMPLE0000001234567890`
- `purpose`: "GDDS"

### pain.009 → Connect Validation

Given a mandate initiation with:
- Max Amount: EUR 50.00
- Sequence Type: RCUR (recurring)
- Creditor: "Subscription Co"
- Debtor IBAN: XX00EXAMPLE0000012345

The resulting Connect MUST have:
- `constraints.limits.per_transaction`: "50.00"
- `constraints.limits.currency`: "EUR"
- `requester.name`: "Subscription Co"
- `constraints.allowedSettlementAddresses` containing `payto://iban/XX00EXAMPLE0000012345`

## Security Considerations

1. **BIC/DID trust**: The mapping from BIC to DID requires trust in the resolution mechanism; implementations SHOULD verify DID ownership through domain control
2. **Account validation**: payto:// URIs should be validated against expected formats; malformed URIs could indicate tampering
3. **Message integrity**: ISO 20022 messages often use XML signatures; TAP messages use DIDComm signatures - both must be validated in bridging scenarios
4. **Replay protection**: Message IDs must be tracked across both systems to prevent replay attacks

## Privacy Considerations

1. **Data minimization**: Only map fields required for the specific use case; ISO 20022 messages may contain more data than needed for TAP
2. **Party identification**: Full IVMS101 data should use [TAIP-8] selective disclosure rather than embedding in messages
3. **Account privacy**: Settlement addresses (IBAN, blockchain) should be treated as sensitive data
4. **Cross-border transfers**: Different jurisdictions have different requirements for data sharing; the mapping should support configurable field inclusion

## References

* [TAIP-2] TAP Messaging
* [TAIP-3] Asset Transfer
* [TAIP-4] Transaction Authorization Protocol
* [TAIP-5] Transaction Agents
* [TAIP-6] Transaction Parties
* [TAIP-8] Selective Disclosure
* [TAIP-13] Transaction Purpose Codes
* [TAIP-14] Payments
* [TAIP-15] Agent Connection Protocol
* [ISO 20022] ISO 20022 Universal Financial Industry Message Scheme
* [RFC 8905] The 'payto' URI Scheme for Payments
* [CAIP-10] Account ID Specification
* [CAIP-19] Asset Type and Asset ID Specification
* [IVMS101] InterVASP Messaging Standard

[TAIP-2]: ./taip-2
[TAIP-3]: ./taip-3
[TAIP-4]: ./taip-4
[TAIP-5]: ./taip-5
[TAIP-6]: ./taip-6
[TAIP-8]: ./taip-8
[TAIP-13]: ./taip-13
[TAIP-14]: ./taip-14
[TAIP-15]: ./taip-15
[ISO 20022]: https://www.iso20022.org
[RFC 8905]: https://datatracker.ietf.org/doc/rfc8905/
[CAIP-10]: https://chainagnostic.org/CAIPs/caip-10
[CAIP-19]: https://chainagnostic.org/CAIPs/caip-19
[IVMS101]: https://www.intervasp.org
[schema.org]: https://schema.org

## Copyright

Copyright and related rights waived via [CC0](../LICENSE).
