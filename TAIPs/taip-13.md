---
taip: 13
title: Transaction Purpose Codes
author: Pelle Braendgaard <pelle@notabene.id>
discussions-to: https://github.com/TransactionAuthorizationProtocol/TAIPs/pull/21
status: Review
type: Standard
created: 2024-03-20
updated: 2024-03-20
requires: [3,7]
---

# TAIP-13: Purpose Codes

## Simple Summary

This proposal introduces two new optional fields, `purpose` and `categoryPurpose`, as top-level properties in **TAIP-3 Asset Transfer** messages. These fields carry standardized payment purpose codes (and category codes) following the ISO 20022 standard. Additionally, it defines a new **TAIP-7 Agent Policy** type, `RequirePurpose`, enabling agents to require the presence of a purpose code, a category purpose code, or both in a transaction. All values for `purpose` and `categoryPurpose` **must** use official ISO 20022 code lists, ensuring consistency and compliance with international payment standards ([BIS-Purpose]). This extension maintains backward compatibility with existing TAIP message formats and aligns with best practices for transaction metadata.

## Abstract

ISO 20022 defines structured codes to indicate the reason or category of a payment. This TAIP proposes adding `purpose` and `categoryPurpose` fields to the JSON structure of TAIP-3 messages, allowing participants to specify the underlying reason for a blockchain transaction in a standardized way. By requiring the use of ISO 20022 ExternalPurpose1Code and ExternalCategoryPurpose1Code values ([BIS-Purpose]), we ensure that these fields carry globally recognized meanings (e.g. "SALA" for salary payments, "TAXS" for tax payments). The proposal also introduces a corresponding agent policy (`RequirePurpose` in TAIP-7) so that agents (such as VASPs or other service providers) can enforce that incoming transactions include a purpose and/or category purpose code when needed (for compliance or business reasons). This improvement enhances interoperability with traditional financial systems and helps meet regulatory requirements without breaking existing TAP message workflows.

## Motivation

Blockchain transactions often lack context about their real-world purpose, which can hinder compliance and record-keeping. In traditional payment networks, sender and receiver banks use standardized purpose codes to indicate why a payment is made – for example, whether it's a salary, tax, or invoice payment ([BIS-Purpose]). Such information is crucial in certain jurisdictions for AML/CFT reporting, exchange control, or to trigger specific handling of the payment ([BIS-Purpose]).

Currently, [TAIP-3] Asset Transfer messages do not include dedicated fields to convey the payment's purpose. This omission makes it difficult for Transaction Authorization Protocol (TAP) participants to communicate the intent of a transfer, which is information often required by compliance policies or regulations. For instance, some countries **require** that cross-border payments include a purpose code, and may even reject transactions that lack one [BIS-Purpose]. By introducing `purpose` and `categoryPurpose` fields, we allow VASPs and other agents to embed this important context directly in the transaction metadata.

Using the internationally standardized ISO 20022 codes has several benefits. It avoids each entity using proprietary or inconsistent codes, instead leveraging a harmonized code set maintained by the ISO 20022 Registration Authority [ISO-External]. ISO 20022 Purpose Codes (ExternalPurpose1Code) define the *underlying reason* for a payment [EPC-Purpose], and Category Purpose Codes (ExternalCategoryPurpose1Code) specify a *high-level category* of the payment instruction [EPC-Category]. By adhering to these standards, a TAP transaction can be understood and processed in the same way as a corresponding payment message in traditional finance. This improves interoperability (e.g. mapping a crypto transfer to a bank payment message for off-ramping) and compliance (since regulators can interpret the purpose code).

Finally, introducing the `RequirePurpose` policy in [TAIP-7] addresses the need for flexibility in enforcement. Not all transactions will need a purpose code, but an agent in a stricter jurisdiction or a business with specific risk controls may *require* one. With this policy, agents can negotiate and enforce that a `purpose` and/or `categoryPurpose` is provided before they authorize a transfer, similar to how banks ensure required information is present. This decentralized, opt-in approach to policy enforcement is in line with TAP's design (each agent declares its requirements, rather than a centralized rule for all) [TAIP-7-Policies].

In summary, this proposal is motivated by real-world use cases like salary disbursements, tax payments, and invoice settlements where the *purpose of payment* needs to be communicated. It brings TAP messaging a step closer to the rich data standards of ISO 20022, helping parties on and off blockchain to "understand the intent... of the payment" ([ACI-ISO20022]).

## Specification

### New Top-Level Fields in TAIP-3 Messages

**TAIP-3 Asset Transfer** message bodies SHALL include two new optional fields at the top level:

- **`purpose`** – A code string (1 to 4 characters) indicating the underlying reason for the payment transaction ([EPC-Purpose]). This must be a valid ISO 20022 purpose code (ExternalPurpose1Code) as published in the external code list by ISO ([EPC-Purpose]). Examples: `"SALA"` for a salary payment, `"TAXS"` for a tax payment, `"GDDS"` for a payment related to goods purchase, etc. The purpose code provides a specific reason for the transfer, as understood by end-users and institutions. **No free-form text or proprietary codes are allowed** – only the standard ISO codes (the message must not use any proprietary value in the Purpose element ([BIS-Purpose])).

- **`categoryPurpose`** – A code string (1 to 4 characters) specifying the high-level category of the payment instruction ([EPC-Category]). This must be a valid ISO 20022 category purpose code (ExternalCategoryPurpose1Code) ([EPC-Category]). It classifies the transaction into a broader category for processing or regulatory reasons. Examples: `"SALA"` could denote the transaction is a salary/benefit payment (broad category), `"TAXS"` to categorize it as a tax-related payment, `"BENE"` for a benefit or welfare payment, etc. As with `purpose`, only standard ISO codes are permitted (no proprietary category codes) ([BIS-Purpose]).

Both fields are OPTIONAL in the message format. If provided, they **must** use uppercase alphanumeric codes from the official ISO 20022 lists. The ISO definitions for these elements are as follows:

- *Purpose:* "Underlying reason for the payment transaction, as published in an external purpose code list." ([EPC-Purpose]) In other words, the specific reason from the sender's perspective (e.g. *Salary payment*, *Invoice payment*, *Loan repayment*). This corresponds to the ISO 20022 `<Purp><Cd>` element in payment messages.

- *Category Purpose:* "Specifies the high level purpose of the instruction based on a set of pre-defined categories." ([EPC-Category]) This is a broader categorization (e.g. *Salary & Benefits*, *Tax*, *Trade Settlement*). It corresponds to the ISO 20022 `<CtgyPurp><Cd>` element. The categoryPurpose is often used by initiating parties or schemes to signal special handling (for example, using `"SALA"` in CategoryPurpose in a SEPA payment flags it as a salary, which might get fee exemptions or priority processing).

**Message Schema Changes:** In practice, the JSON-LD context for TAIP messages (e.g. `https://tap.rsvp/schema/1.0`) will be updated to include definitions for `purpose` and `categoryPurpose` in the Asset Transfer schema. They are top-level keys within the TAIP-3 message body JSON. If a TAIP-3 message already includes a `originator` and `beneficiary` (per TAIP-6) along with details like `asset` and `amount`, the new fields appear alongside those.

For example, an Asset Transfer message (TAIP-3) with a purpose code might look like:

```json
{
  "from": "did:web:payroll.vasp",
  "to": ["did:web:alicebank.vasp"],
  "type": "https://tap.rsvp/schema/1.0#Transfer",
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Transfer",
    "originator": { "@id": "eip155:1:0x1234567890123456789012345678901234567890" },
    "beneficiary": { "@id": "eip155:1:0xabcdef0123456789abcdef0123456789abcdef01" },
    "asset": "eip155:1/erc20:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "amount": "5000.00",
    "categoryPurpose": "SALA"
  }
}
```

In the above JSON example, the `purpose` of the transfer is `"SALA"`, which by the ISO 20022 code list stands for a general Tax Payment ([ISO-Purpose-Codes]). This indicates that Alice (the originator) is sending 2,500 units (e.g., USD or a stablecoin, if `asset` denotes an Ethereum token on mainnet in this case) as a tax payment. No `categoryPurpose` is included in this example, but if it were, it would appear at the same level as `purpose`.

An Asset Transfer message can include either field, both, or neither. Including these fields does **not** change the semantics of the transfer itself, but provides additional metadata to the receiving agent and any compliance processes.

**Data Validation:** Agents MUST validate that any provided `purpose` or `categoryPurpose` code is a legitimate ISO 20022 code (per the latest published external code sets). Codes are typically four-letter abbreviations (occasionally shorter) in uppercase. For instance, `"SALA"` is valid for Salary, but `"SALARY"` or `"salary"` would be invalid. If an unknown or invalid code is received, the agent should treat it as an error or reject the message, similar to how they would handle other schema violations. Per ISO 20022 guidelines, proprietary codes must not be used in these standard fields ([BIS-Purpose]) – meaning the JSON should not contain a structure like `{ "purpose": { "proprietary": "XYZ" } }`, only the standard code string.

### New Policy: `RequirePurpose` (TAIP-7 Agent Policies)

We introduce a new policy type in **TAIP-7 (Agent Policies)** called **`RequirePurpose`**. This policy allows an agent to declare that it requires a purpose code and/or category purpose code to be present in the transaction before it will authorize or process it.

**Policy Format:** `RequirePurpose` is a JSON-LD object with an `@type` of `"RequirePurpose"`. It may include the following attributes:

- `fields` – an array specifying which of the two fields are required. Possible values in the array are `"purpose"` and `"categoryPurpose"`.
  - If `fields: ["purpose"]`, the agent requires that a valid `purpose` code be provided in the TAIP-3 message.
  - If `fields: ["categoryPurpose"]`, it requires a `categoryPurpose` code.
  - If `fields: ["purpose", "categoryPurpose"]`, it requires **both** to be present.
  - (If the `fields` array is omitted or empty, the default interpretation SHOULD be that both are required, but explicitly listing the expected fields is recommended for clarity.)

- `fromAgent` – optional, to indicate which party's agent must supply the required information. In most cases this would be `"originator"` (meaning the originator's agent is expected to include the purpose fields in the transfer request) because the originator typically knows the payment reason. If not specified, it is assumed the requirement applies to the initiating party of the transfer by default.

Like other policies, `RequirePurpose` would be included in an agent's policy list (e.g. in an `UpdatePolicies` message) during the negotiation phase of TAP. When an agent (say, the beneficiary's VASP) sends `RequirePurpose` to the originator's VASP, it signals that the originator **must** provide the specified purpose information for the transaction to proceed. This could happen prior to the final authorization step, giving the originator a chance to add the fields if they were missing.

**Example Policy Usage:** A beneficiary agent that mandates purpose codes for all incoming transfers (perhaps due to local regulations) could advertise the following in its policies:

```json
{
  "@type": "RequirePurpose",
  "fromAgent": "originator",
  "fields": ["purpose", "categoryPurpose"]
}
```

This policy indicates that the originator's agent is required to include **both** a `purpose` and a `categoryPurpose` in the Asset Transfer message. If the originator's initial transfer request did not contain these, the beneficiary's agent will not authorize the transaction (it might respond with an error or a policy exception), in line with the TAP flow for policy enforcement ([BIS-Purpose]). The originator's agent could then resend or adjust the request with the needed fields, or the transaction will be aborted if it cannot comply.

Another example: if an agent only cares about having *some* purpose indicator but doesn't require both, it could set `"fields": ["purpose"]` to demand at least a specific purpose code, without a category. Conversely, a policy of `"fields": ["categoryPurpose"]` would insist on the category code but not the detailed purpose. This flexibility allows agents to enforce the level of detail they need.

**Enforcement in TAP Flow:** The presence of `RequirePurpose` in an agent's policy means that during the negotiation of a transaction, the `purpose` and/or `categoryPurpose` fields become effectively required data elements. If they are missing, the transaction is considered non-compliant with the policy. In the TAP message exchange, this would likely result in either:
- The transaction being rejected by the requiring agent (with a relevant error or refusal message), or
- A request for additional info (perhaps via an `UpdateParty` or similar message, though in this case it's about updating the transfer details, not party info).

Agents should include `RequirePurpose` policies only when necessary (to avoid over-burdening senders). For example, if a VASP operates in a jurisdiction where certain cross-border transfers must include a purpose code (per law or network rules), it would use this policy when dealing with transfers from abroad. This mechanism mirrors how some payment systems optionally enforce P/CP codes only for specific corridors ([BIS-Purpose]). Notably, *Nexus* (a BIS cross-border payments project) also allows that some countries mandate P/CP codes while others do not, and requires participants to handle both cases ([BIS-Purpose]). The `RequirePurpose` policy in TAP provides a similar capability in a decentralized manner.

### Compliance and Best Practices

- **Using Correct Codes:** Implementers should reference the latest ISO 20022 external code lists for allowable Purpose and CategoryPurpose codes. These lists are updated quarterly by ISO ([ISO-20022-Update]). Some example codes (with their meanings) relevant to common transactions:
  - **SALA** – Salary Payment (transaction is the payment of salaries) ([ISO-Purpose-Codes]).
  - **TAXS** – Tax Payment (payment of taxes, generic) ([ISO-Purpose-Codes]).
  - **INVC** – Invoice Payment (if defined; often invoices are covered under goods/services codes like GDDS or SCVE)
  - **GDDS** – Purchase/Sale of Goods (payment for goods purchase) ([ISO-Purpose-Codes]).
  - **BEXP** – Business Expenses (payment of business-related expenses) ([ISO-Purpose-Codes]).
  - **DIVD** – Dividend Payment (distribution of dividends to shareholders)
  - **CHAR** – Charity Payment (donation to charity)
  - **OTHR** – Other (payment purpose not specified elsewhere)

  Each code has a formal definition in the ISO list. It's recommended to include a code that best matches the actual purpose of the transfer. This helps the receiving side and any monitoring tools to understand the context of the transaction. **Do not** use codes arbitrarily; misuse of codes (e.g., labeling something as SALA when it's not actually a salary) could lead to compliance issues or confusion.

- **Category vs Purpose:** In general, the `categoryPurpose` field should carry a broad classification if one applies. For example, for a routine payroll payment, `categoryPurpose: "SALA"` is appropriate to mark it as a salary-related transfer. The `purpose` field can either be omitted if the category alone suffices, or it can provide a more specific context. In many cases, using one of the fields may be enough. However, providing both is useful when a transaction falls under a broad category but also has a specific subtype worth noting. For instance, a bonus payout could use `categoryPurpose: "SALA"` (since it's under salaries/benefits) and `purpose: "BONU"` (bonus payment) ([ISO-Purpose-Codes]). The TAP standard does not require sending redundant information, but it allows both fields in case they serve different needs. It is up to the initiating agent to decide whether to include one or both, unless constrained by a policy.

- **Optionality and Backward Compatibility:** By default, `purpose` and `categoryPurpose` are optional. Agents that do not understand these fields (e.g., older implementations) should safely ignore them, as they do with any unknown JSON-LD terms. This ensures backward compatibility — a TAIP-3 message with these fields still follows the overall message format and should not break JSON parsers. Nevertheless, all TAP implementations are encouraged to update to recognize these fields, even if they choose not to use them, to properly handle incoming transfers that include purpose codes. Notably, if an agent sends a `RequirePurpose` policy, it implicitly expects the counterparty to support these fields; thus, coordination or version negotiation may be needed in heterogeneous environments.

- **No Proprietary Fallback:** The ISO 20022 standard allows a choice between a coded value and a free-form proprietary text for purpose, but **TAP will not support proprietary text for `purpose` or `categoryPurpose`**. The policy is that if a purpose/category needs to be conveyed and no suitable ISO code exists, the sender should use the closest standard code (e.g., "OTHR") and rely on other data (like memo or invoice details outside the TAP message, if any) to convey specifics. This simplifies implementation and aligns with recommendations that purpose codes in ISO 20022 payments be restricted to the standard list ([BIS-Purpose]). Future code additions by ISO will cover new needs, and the TAP community can consider extending acceptable codes if a legitimate case arises that ISO has not yet covered.

## Rationale

The rationale for TAIP-13 is to enhance the **semantic richness** of transaction messages in a way that's compatible with both decentralized blockchain use cases and existing financial industry practices. By using ISO 20022 purpose codes, we leverage a **widely adopted global standard**. These codes are already used in SEPA payments, SWIFT cross-border payments, and domestic real-time payment systems to communicate why money is moving ([ACI-ISO20022]). Adopting them in TAP means VASPs and other agents don't have to reinvent a purpose taxonomy for crypto transactions; instead, they join a harmonized vocabulary that banks, regulators, and businesses understand ([BIS-Purpose]).

**Why both Purpose and CategoryPurpose?** ISO 20022 differentiates between a granular purpose and a broader category purpose to serve different needs, and we mirror that design. A *category purpose* might trigger certain processing rules (e.g., treat all payments marked as salaries in a special way), while the detailed *purpose* can give context to the beneficiary or compliance tools. For example, a receiving bank might not process fees on a transfer with category `"SALA"` or `"PENS"` (pension) because of legal protections for those payment types. Meanwhile, the business receiving a payment might care that the purpose is `"GDDS"` (goods purchase) to reconcile it against an invoice. Providing both levels of information when appropriate makes the system more flexible. However, we also acknowledge that not every transaction requires two codes – often one will do. This proposal doesn't force a message to always carry both, but allows it when needed (or when required by policy).

**Enforcing Standardization:** The decision to strictly require ISO 20022 codes (and forbid arbitrary strings) is intentional. It ensures **interoperability** and **predictability**. If one VASP sent `"salary payment"` and another sent `"SALA"`, a receiving agent would have to interpret both possibly differently. Standard codes remove ambiguity: `"SALA"` has a precise meaning in the ISO list ("Transaction is the payment of salaries" ([ISO-Purpose-Codes]). Moreover, as ISO updates the lists, the industry can converge on new codes for new purposes (for instance, new regulatory categories) without changing the TAP specification – we just pick up the new code. This approach follows the principle that external code sets can evolve independently ([ISO-20022-Update]), which is why ISO externalized them.

**Agent Policy Integration:** The `RequirePurpose` policy fits naturally into the TAP framework of bilateral/multilateral negotiation of transaction requirements ([TAIP-7]). It is analogous to existing policies like `RequireBeneficiaryCheck` or `RequireProofOfControl`, extending the idea to transaction metadata. The rationale for having such a policy is that **not all transactions need a purpose code, but when they do, it's often non-negotiable for compliance**. For instance, if a beneficiary VASP is in a country where incoming transfers must indicate if they are personal or business-related (which could be inferred from category purpose codes), that VASP must refuse a transfer lacking that info. Instead of blanketly rejecting, the TAP flow lets it communicate the requirement and give the originator a chance to comply. This dynamic requirement mechanism is one of TAP's strengths, enabling fine-grained control without a centralized rulebook. Our proposal extends that strength to purpose codes.

It's worth noting that purpose codes also help with **analytics and risk management**. An originator VASP might choose to always include a purpose code even if not asked, because it provides transparency. If misuse or suspicious activity is detected, having declared purposes can support investigations. The policy, on the other hand, is the **safety net** to ensure critical cases are covered (e.g., regulatorily required scenarios).

**Maintaining Simplicity:** We have chosen a relatively simple JSON representation for the policy (`fields` array) rather than introducing multiple separate policy types (like a `RequirePurposeCode` and a `RequireCategoryPurposeCode`). This keeps the number of policy types minimal and allows one policy to cover all variations. It also mirrors how an agent might phrase it in plain language: "I require a purpose code, and also a category code." The use of the plural "fields" is to easily extend if in future there were other related fields (though currently just two). We also considered backward compatibility: an agent not aware of `RequirePurpose` will simply ignore that policy object in the list, which is acceptable because then it wouldn't enforce it (but the sending agent that doesn't understand it likely wouldn't have included the fields either, leading to a failed transfer if the other side insists — essentially meaning both sides must support this feature to make use of it, which is expected as TAP evolves).

Finally, by integrating this proposal, the TAP messages become more self-descriptive. A year from now, looking at a saved TAIP-3 JSON message, one could tell what it was for ("Oh, this was marked as SALA – a salary payment from ACME Corp to Bob"). This is valuable for audit trails and could assist compliance with the Travel Rule and other regulations that increasingly expect more information to accompany virtual asset transfers. In essence, TAIP-13 helps bridge the gap between crypto transaction data and the richer context of traditional payments, which is a key goal of the Transaction Authorization Protocol initiative.

## Examples

Below are several examples illustrating how `purpose` and `categoryPurpose` can be used in real-world transaction scenarios, and how the `RequirePurpose` policy operates. These examples use fictitious DIDs and simplified data for clarity.

### 1. Salary Payment (CategoryPurpose Only)

**Scenario:** Alice's employer (originator) is paying out her monthly salary via a stablecoin transfer on Ethereum. The VASP sending the funds marks the transaction accordingly.

```json
{
  "from": "did:web:payroll.vasp",
  "to": ["did:web:alicebank.vasp"],
  "type": "https://tap.rsvp/schema/1.0#Transfer",
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Transfer",
    "originator": { "@id": "eip155:1:0x1234567890123456789012345678901234567890" },
    "beneficiary": { "@id": "eip155:1:0xabcdef0123456789abcdef0123456789abcdef01" },
    "asset": "eip155:1/erc20:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "amount": "5000.00",
    "categoryPurpose": "SALA"
  }
}
```

In this **salary payment** example, the `categoryPurpose` is set to `"SALA"`, indicating a Salary/Payroll related transfer, see: [ISO-Purpose-Codes]. The `purpose` field is not used here, since the category `"SALA"` already implicitly tells the high-level purpose (salary payment). The receiving agent (`alicebank.vasp`) can recognize this code and, for instance, treat it under a payroll processing workflow. Alice's employer's VASP decided that just the category was sufficient information in this case.

### 2. Tax Payment (Purpose Only)

**Scenario:** Bob is paying his quarterly income taxes by sending stablecoin from his wallet (through his VASP) to a government treasury wallet managed by another institution. The VASP includes a purpose code to denote this is a tax payment.

```json
{
  "from": "did:web:bobwallet.vasp",
  "to": ["did:web:taxauthority.vasp"],
  "type": "https://tap.rsvp/schema/1.0#Transfer",
  "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Transfer",
    "originator": { "@id": "eip155:1:0x2345678901234567890123456789012345678901" },
    "beneficiary": { "@id": "eip155:1:0xbcdef0123456789abcdef0123456789abcdef012" },
    "asset": "eip155:1/erc20:0x6b175474e89094c44da98b954eedeac495271d0f",
    "amount": "850.00",
    "purpose": "TAXS"
  }
}
```

Here, Bob's VASP tagged the transfer with `purpose: "TAXS"` ([ISO-Purpose-Codes]) to signify a tax payment. We did not use `categoryPurpose` in this instance. Often, tax payments might not require a special category beyond the fact that they are taxes (which the purpose code itself makes clear). The code `"TAXS"` stands for a generic Tax Payment (covering income tax, in this context) ([ISO-Purpose-Codes]). The receiving tax authority's agent, seeing this code, knows the funds are meant for taxes and can automate reconciliation with Bob's tax bill. If this transfer was cross-border, the presence of a proper ISO code would also satisfy any requirement by intermediary banks or regulators to have a purpose indicated for AML checks.

### 3. Invoice Settlement for Goods (Both Purpose and CategoryPurpose)

**Scenario:** Carol's company is paying an invoice to a supplier for goods delivered. Carol's VASP includes both a category and a specific purpose to fully describe the transaction.

```json
{
  "from": "did:web:carolbank.vasp",
  "to": ["did:web:supplier.vasp"],
  "type": "https://tap.rsvp/schema/1.0#Transfer",
  "id": "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Transfer",
    "originator": { "@id": "eip155:1:0x3456789012345678901234567890123456789012" },
    "beneficiary": { "@id": "eip155:1:0xcdef0123456789abcdef0123456789abcdef0123" },
    "asset": "eip155:1/erc20:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    "amount": "12345.67",
    "categoryPurpose": "BEXP",
    "purpose": "GDDS"
  }
}
```

In this **invoice payment** example, the transfer is marked with `categoryPurpose: "BEXP"` and `purpose: "GDDS"`.

- `"BEXP"` is the code for **Business Expenses**, a broad category indicating the payment is a business-related expense ([ISO-Purpose-Codes]). This fits since Carol's company is paying a supplier (it's an operational expense).
- `"GDDS"` stands for **Purchase of Goods**, denoting the specific underlying reason is to pay for goods purchased ([ISO-Purpose-Codes]). The invoice likely corresponds to goods delivered by the supplier, so this code is very apt.

By providing both, Carol's VASP gives full context: the payment is a business expense, specifically for goods. The supplier's VASP (or the supplier's accounting system, if it gets the info) can automatically categorize this payment in its records under sales of goods. If the supplier's VASP had a policy requiring a purpose code for B2B payments, this would fulfill it. This example shows how category and purpose can complement each other.

### 4. Agent Policy Requiring Purpose Codes

**Scenario:** The VASP receiving funds on behalf of a beneficiary (in any of the above examples) has a policy to require purpose information for compliance. It sends a `RequirePurpose` policy to the originator's agent at the start of the transaction negotiation.

```json
{
  "@type": "RequirePurpose",
  "fromAgent": "originator",
  "fields": ["purpose"]
}
```

This simple policy (part of a larger `policies` array perhaps) tells the originator's agent: "I need a `purpose` code in the transfer." In practice, if the originator's initial `Transfer` message didn't include a `purpose`, the beneficiary's agent would respond according to TAP with an error or a request for additional info, prompting the originator to resend the transfer with the `purpose` field populated.

For instance, if Carol's company initially tried to pay the supplier without any purpose specified, `supplier.vasp` might have a policy like the above. Carol's bank (originator agent) would then realize it must include something like `purpose: "GDDS"` (and possibly `categoryPurpose: "BEXP"` if required) to satisfy the policy. Only once the transfer message contains the needed fields would the supplier's agent proceed with authorization. This flow prevents situations where the beneficiary receives funds without knowing the reason, which could be problematic for compliance. It's analogous to a bank saying *"we will not accept this wire unless you provide a proper purpose code"*, automated through TAP.

If the policy had `"fields": ["purpose", "categoryPurpose"]`, then both fields would be expected. The originator's agent in that case should include both (as shown in Example 3) or else the transaction will not be approved. On the other hand, if an originator sees such a policy and truly cannot furnish the info (perhaps the user refused to state a purpose), it may choose to abort the transaction early instead of attempting to force it through.

These examples demonstrate how TAIP-13 can be used in practice for common payment types. By following the formats above, VASPs and other agents can seamlessly integrate purpose codes into their transaction flows, bringing greater transparency and alignment with global payment networks.

## Backwards Compatibility

TAIP-13 is designed to be backwards-compatible with existing TAIP implementations:
- Adding `purpose` and `categoryPurpose` as optional fields means that older software (that hasn't been updated for TAIP-13) will simply ignore these fields if they appear. The core transaction content (amount, asset, parties, etc.) remains unchanged, so legacy systems can still process the transfer, albeit without leveraging the new information.
- For systems that do not send these fields, nothing changes – the fields are optional and default to not present. Only when an agent has a `RequirePurpose` policy would an issue arise, and that scenario inherently implies both sides are aware of the concept (or the transaction won't complete). In other words, if one side is enforcing the presence of purpose codes, it is expected that the other side is capable of providing them; if not, that transaction may fail policy checks just as any other unfulfilled requirement.
- The introduction of `RequirePurpose` in TAIP-7 follows the same pattern as other policies. Agents that don't understand this policy type will ignore it, which could lead to a failure to meet the other agent's requirement – but that is an expected outcome (the transaction would not be authorized). This does not break the messaging protocol itself, which remains consistent. Over time, as all agents adopt TAIP-13, such incompatibilities will disappear.
- Critically, the TAIP envelope (`from`, `to`, `type`, etc.) and signing mechanism (per TAIP-2 messaging) are unaffected. The digital signature over the message (if applied) will now cover the new fields as well. Implementers should ensure their signature verification logic does not erroneously reject messages with extra fields. Using JSON-LD normalization (if applicable) will naturally include these fields. If an implementation uses a strict schema validation, it should update the schema to allow these fields; otherwise, the message could be rejected even if well-formed. This update should be straightforward given the fields' definition here.

In summary, TAIP-13 extends the protocol in a non-intrusive way. Parties that understand it gain additional functionality, while those that don't will operate as before (with the caveat that they might not be able to engage with parties that mandate the new info). This approach balances progress with compatibility, a core principle for evolving the TAP standard.

## Security Considerations

The introduction of purpose codes in transactions requires careful consideration of several security aspects:

1. **Code Validation**: Implementations must validate that provided purpose and category purpose codes are legitimate ISO 20022 codes. Invalid or malformed codes could be used to exploit systems expecting standard formats.

2. **Policy Enforcement**: When using `RequirePurpose` policies, agents must ensure proper validation and error handling to prevent bypass of the requirement through malformed messages.

3. **Code Misuse**: Systems should be aware that malicious actors might intentionally misuse purpose codes (e.g., marking illicit transactions as legitimate business payments). Purpose codes should be one of many data points in risk assessment.

4. **Version Compatibility**: Implementations should handle unknown fields gracefully to prevent denial of service when processing messages with purpose codes.

## Privacy Considerations

Purpose codes introduce additional metadata about transactions that requires privacy consideration:

1. **Transaction Context**: Purpose codes reveal the nature of transactions, which could be sensitive information. Agents should treat this data with appropriate confidentiality.

2. **Data Minimization**: Agents should only require purpose codes when necessary for regulatory compliance or legitimate business needs.

3. **Regulatory Compliance**: While purpose codes aid in compliance reporting, their storage and handling must comply with relevant data protection regulations.

## References

* [TAIP-3] Asset Transfer
* [TAIP-7] Agent Policies
* [ISO-20022-external-purpose-codes] ISO 20022 External Purpose Codes
* [ISO-20022-external-category-purpose-codes] ISO 20022 External Category Purpose Codes
* [BIS-Purpose] BIS Purpose Codes Documentation
* [ISO-External] ISO 20022 External Code Sets
* [EPC-Purpose] EPC SCT Purpose Codes
* [EPC-Category] EPC SCT Category Purpose Codes
* [TAIP-7-Policies] TAP Agent Policies
* [ACI-ISO20022] ACI ISO 20022 Blog
* [ISO-Purpose-Codes] RBA External Purpose Codes List
* [ISO-20022-Update] ISO 20022 Code Sets Update
* [BIS-Nexus] BIS Nexus Purpose Codes
* [CC0] Creative Commons CC0 License

[TAIP-3]: ./taip-3
[TAIP-7]: ./taip-7
[ISO-20022-external-purpose-codes]: https://raw.githubusercontent.com/TransactionAuthorizationProtocol/iso20022-external-code-sets/refs/heads/main/code_sets/external_purpose_code.json
[ISO-20022-external-category-purpose-codes]: https://raw.githubusercontent.com/TransactionAuthorizationProtocol/iso20022-external-code-sets/refs/heads/main/code_sets/external_category_purpose_code.json
[BIS-Purpose]: https://docs.bis.org/nexus/messaging-and-translation/purpose-codes
[ISO-External]: https://www.iso20022.org/catalogue-messages/additional-content-messages/external-code-sets
[EPC-Purpose]: https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2022-06/EPC115-06%20SCT%20Inter-PSP%20IG%202023%20V1.0.pdf
[EPC-Category]: https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2022-06/EPC115-06%20SCT%20Inter-PSP%20IG%202023%20V1.0.pdf
[TAIP-7-Policies]: https://tap.rsvp/TAIPs/taip-7#agent-policies
[ACI-ISO20022]: https://www.aciworldwide.com/blog/iso-20022-expanding-like-no-tomorrow
[ISO-Purpose-Codes]: https://www.rba.hr/documents/20182/183267/External+purpose+codes+list/8a28f888-1f83-5e29-d6ed-fce05f428689?version=1.1
[ISO-20022-Update]: https://www.iso20022.org/catalogue-messages/additional-content-messages/external-code-sets
[BIS-Nexus]: https://docs.bis.org/nexus/messaging-and-translation/purpose-codes
[CC0]: ../LICENSE

## Copyright
Copyright and related rights waived via [CC0](../LICENSE).
