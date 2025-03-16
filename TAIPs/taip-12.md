---
taip: 12
title: Hashed Participant Name sharing in TAP messages
status: Draft
type: Standard
author: Pelle Braendgaard <pelle@notabene.id>
created: 2024-03-21
updated: 2024-03-21
requires: 2, 3, 6, 7, 8
---

## Simple Summary

Defines an optional **hashed name** field for originator and beneficiary party data in the Transaction Authorization Protocol. By hashing customer names using the same normalization and SHA-256 method as VerifyVASP, VASPs can verify counterparty identities without exposing personal information in plaintext.

## Abstract

This proposal introduces an optional **hashed name** field for originator and beneficiary party data in the Transaction Authorization Protocol. By hashing customer names using the same normalization and SHA-256 method as VerifyVASP, VASPs can verify counterparty identities without exposing personal information in plaintext. The hashed name field is **optional** in messages (preserving current flows), but agents may **require it via policy** for enhanced privacy. [TAIP-12] aims to improve Travel Rule compliance interoperability with networks like VerifyVASP and the Global Travel Rule (GTR) alliance, while allowing VASPs not using hashes to continue standard procedures.

## Motivation

FATF's Travel Rule (Recommendation 16) mandates that VASPs **collect, verify, and exchange** specific customer information (e.g. names of originators and beneficiaries) before a virtual asset transfer [FATF-R16]. Traditionally, this means transmitting personal data (PII) as part of the transaction message. However, sharing PII in cleartext raises privacy and security concerns, and may conflict with data protection laws [TAIP-8]. Existing Travel Rule protocols often include names and other PII directly in the transfer request, which **risks exposing sensitive data** to intermediaries or breaches [TAIP-8].

At the time of writing most virtual asset transactions are first-party transfers and originator and beneficiary only need to confirm it is indeed the same person. This eliminates the need for the customers PII to be sent as both sides have performed KYC on their mutual customer and thus already have access to their PII. Third party transfers still do require full Travel Rule exchange of Originator and Beneficiary data since they do not have access to that data and will need it for sanctions screening and record keeping purposes.

Several industry solutions have emerged to reconcile compliance and privacy. For example, VerifyVASP's network uses encrypted or hashed identity data to **securely verify customer information without revealing it** [VerifyVASP]. Binance's Global Travel Rule (GTR) alliance similarly follows FATF guidelines while only disclosing **minimal required customer data** on a need-to-know basis [GTR]. These approaches show that it's possible to comply with the Travel Rule in a privacy-preserving way.

**Hashed names** offer a simple but effective solution: instead of sending a customer's actual name, VASPs exchange a cryptographic hash of the name. This enables the receiving VASP to confirm a match against their records, fulfilling the "verify and exchange customer information" requirement, but **without transmitting the name itself in plaintext**. It improves privacy (no directly identifiable name is shared) and still allows compliance checks (the hash can be compared to the beneficiary's KYC data). It also reduces friction in cross-platform interoperability – if all parties use the same hashing method, verification can be automated across different Travel Rule solutions.

In summary, [TAIP-12] is motivated by the need to **protect PII** during Travel Rule exchanges and to **enable seamless interoperability** between TAP and other Travel Rule implementations. It allows VASPs to adopt the hashed name technique proven in VerifyVASP and GTR, while remaining backward-compatible: those who do not use hashed names can continue to exchange names via existing standardized procedures (e.g. direct sharing or selective disclosure). This optional feature empowers each institution to enhance privacy as needed, and agents can enforce its use through policy if required for risk or compliance reasons.

## Specification

**Hashed Name Field:** [TAIP-12] defines a new optional field `nameHash` in the `originator` and `beneficiary` party objects of an Asset Transfer message [TAIP-3]. The `nameHash` is a string representing the SHA-256 hash of the party's name, computed after a specific normalization of the name. This field MAY be included to convey a cryptographic identifier for the person or entity's name, in lieu of sending the actual name.

- **Normalization and Hashing Method:** To ensure consistency (and align with VerifyVASP), the name string MUST be normalized by **removing all whitespace** characters and converting all letters to **uppercase** before hashing. The normalized name is then encoded in UTF-8 and hashed using the SHA-256 algorithm. The resulting 256-bit hash value SHOULD be encoded as a hexadecimal string (64 hex characters) for inclusion in the message. This algorithm is identical to the one used by VerifyVASP's system for name verification, ensuring cross-platform compatibility. For example, the name "Alice Lee" would be normalized to "ALICELEE" (uppercase, no spaces). Its SHA-256 hash (in hex) would be: `b117f44426c9670da91b563db728cd0bc8bafa7d1a6bb5e764d1aad2ca25032e`.

- **Originator vs. Beneficiary Usage:** When present, `originator.nameHash` represents a hash of the originator's name (as per that VASP's KYC records), and `beneficiary.nameHash` represents a hash of the beneficiary's name (as per the beneficiary VASP's records). Typically, the Originator VASP will include the `originator.nameHash` in the initial transfer request message, allowing the Beneficiary VASP to later verify the originator's identity if needed. Likewise, the Beneficiary VASP can provide `beneficiary.nameHash` to allow the Originator side to confirm the beneficiary's identity matches expectations. Inclusion of the beneficiary's hashed name may occur in a response or as part of a multi-step flow (since the originator may not know the beneficiary's name upfront). Both fields are optional: a message **may include one, both, or neither** hashed names, depending on the context and what is known at each step.

- **Data Model:** The `nameHash` field is defined as an **additional attribute** in the JSON-LD party object structure defined by TAIP-6. As noted in TAIP-6, party objects can be extended with extra data as long as they are properly contextualized [TAIP-6]. For interoperability and to avoid context confusion, this proposal uses the canonical field name `nameHash` (no custom context URI is required beyond the TAP default context). This field, when present, MUST be interpreted as the SHA-256 hash of that party's name, normalized as described above. It applies to both natural persons and legal persons: for individuals, the name should include given and surname (and any middle names) concatenated without spaces; for entities, the full legal name should be used (and any internal spaces removed). **No other transformations (such as removing punctuation or special characters)** are applied by this standard, to keep the algorithm simple – aside from whitespace removal and case folding – so VASPs should ensure the name is recorded consistently. (If two VASPs have minor differences in punctuation or formatting of the name, they may need to coordinate or use policy-based alternatives to resolve mismatches.)

- **First-party Example:** An example Asset Transfer message with hashed names included is shown below. This assumes a transfer of 100 tokens from an originator customer "Alice Lee" at ExampleVASP their account at OtherVASP. Both VASPs support TAIP-12. The message includes each party's DID (`@id`) and their `nameHash`.

```json
{
  "@context": "https://tap.rsvp/schema/1.0",
  "@type": "https://tap.rsvp/schema/1.0#Transfer",
  "asset": "eip155:1/slip44:60",  
  "amount": "100.00",
  "originator": {
    "@id": "did:web:examplevasp.com:alice123",
    "nameHash": "b117f44426c9670da91b563db728cd0bc8bafa7d1a6bb5e764d1aad2ca25032e"
  },
  "agents": [
    {
      "@id": "did:web:examplevasp.com",
      "policies": [
        {
          "@type":"RequireAuthorization",
          "fromAgent":"beneficiary"
        }
      ]
    },
    {
      "@id": "did:web:othervasp.com"
    },
    {
      "@id":"did:pkh:eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb",
      "role":"settlementAddress"
    }
  ]
}
```

In this JSON example, the `nameHash` value is the SHA-256 hashes of "ALICELEE". Upon receiving this information, OtherVASP can compare the provided originator hash to the hash of the beneficiary owner of the blockchain address `0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb`. If the hashes match the names each VASP has on file, the transaction can proceed without ever exposing the actual names in the message. If there is a mismatch, the VASPs may request additional information through an `UpdatePolicies` [TAIP-7] message containing a `RequirePresentation` [TAIP-8] policy to obtain more detailed name for further verification or simply reject the transfer per their compliance procedures.


- **Third-party Example:** An example Asset Transfer message with hashed names included is shown below. This assumes a transfer of 100 tokens from an originator customer "Alice Lee" at ExampleVASP to a beneficiary customer "Bob Smith" at OtherVASP. Both VASPs support TAIP-12. The message includes each party's DID (`@id`) and their `nameHash`.

```json
{
  "@context": "https://tap.rsvp/schema/1.0",
  "@type": "https://tap.rsvp/schema/1.0#Transfer",
  "asset": "eip155:1/slip44:60",  
  "amount": "100.00",
  "settlementAddress":"eip155:1:0x1234a96D359eC26a11e2C2b3d8f8B8942d5Bfcdb", /*CAIP-2 account address */
  "originator": {
    "@id": "did:web:examplevasp.com:alice123",
    "nameHash": "b117f44426c9670da91b563db728cd0bc8bafa7d1a6bb5e764d1aad2ca25032e"
  },
  "beneficiary": {
    "@id": "did:web:othervasp.com:bob456",
    "nameHash": "5432e86b4d4a3a2b4be57b713b12c5c576c88459fe1cfdd760fd6c99a0e06686"
  },
  "agents": [
    {
      "@id": "did:web:examplevasp.com",
      "policies": [ … ]
    },
    {
      "@id": "did:web:othervasp.com"
    }
  ]
}
```

In this JSON example, the `nameHash` values are the SHA-256 hashes of "ALICELEE" and "BOBSMITH" respectively. Upon receiving this information, OtherVASP can compare the provided originator hash to the hash of the name on Alice's account sent by ExampleVASP. Likewise, ExampleVASP can verify that the beneficiary's hash matches "Bob Smith" (the expected beneficiary name) by asking their user or via prior agreement. If the hashes match the names each VASP has on file, the transaction can proceed without ever exposing the actual names in the message. If there is a mismatch, the VASPs may request additional information through an `UpdatePolicies` [TAIP-7] message containing a `RequirePresentation` [TAIP-8] policy to obtain more detailed name for further verification or simply reject the transfer per their compliance procedures.

**Optional but Policy-Controlled:** Including `nameHash` is not mandatory in all cases; it is an opt-in enhancement. However, an agent (VASPs acting as originator or beneficiary) **can require hashed names via policy**. [TAIP-7] allows agents to declare requirements/policies for a transaction. For instance, a VASP concerned about privacy might advertise a policy that **hashed names must be provided** before it will authorize a transfer. This proposal does not define a new policy type in [TAIP-7], but such a requirement could be implemented via a custom policy or through bilateral agreement. An example policy could be a boolean flag like `RequireHashedName` in the agent's policy list, indicating that the counterparty should include the `nameHash` field for their customer. If the counterparty cannot comply (e.g. they have not implemented [TAIP-12]), the initiating agent may refuse to proceed or fall back to requesting the full name via a secure channel (such as [TAIP-8] selective disclosure).

## Interoperability Considerations

**VerifyVASP Alignment:** The hashing scheme chosen (SHA-256 over uppercase, whitespace-stripped UTF-8 name) is exactly the scheme used by VerifyVASP's API for name verification. This means a VASP using TAP with TAIP-12 can interoperate seamlessly with a VASP using VerifyVASP. For example, if one party is on the VerifyVASP network, they may already expect a hashed name for confirming the counterparty's identity. By including `nameHash` in the TAP message, the TAP-originating VASP can directly supply the needed information in the format the VerifyVASP participant expects. Essentially, TAIP-12 **bridges the TAP format with VerifyVASP's verification method**, avoiding duplicate logic or conversions. This interoperability extends to any Travel Rule Service Provider that has adopted the VerifyVASP methodology (some TRSPs offer multi-protocol support and will recognize the hashed name field). The result is faster, automated counterparty verification – the hashed name from a TAP message can be fed into VerifyVASP's process to get an instant match result, or vice versa.

**Global Travel Rule (GTR) and Others:** The Global Travel Rule alliance, founded by Binance, also emphasizes standardized secure data exchange. GTR's design follows FATF guidance and only discloses the minimal necessary PII for compliance [GTR]. While details of GTR's protocol are proprietary, it is understood that member VASPs exchange identity information in a way that can be reconciled with hashed verification. By using the same hashing technique, TAIP-12 ensures that if a TAP message is forwarded into the GTR network (or if one counterparty uses TAP and the other uses GTR), the name hashes can be compared on both sides without conflict. In practice, a VASP on GTR could generate a hashed name for "Alice Lee" and send it; a VASP on TAP-12 would generate their own hash of "Alice Lee" – because both followed the same algorithm, the hashes would match, confirming the identity. This common approach **prevents fragmentation** where each network might otherwise use a different hash or format.

**Legacy and Other Protocols:** Many current Travel Rule protocols (OpenVASP, TRISA, TRP, etc.) rely on IVMS-101 data fields for names and typically exchange them either encrypted or in clear text [IVMS-101]. [TAIP-12]'s hashed name can be seen as a **layer on top of IVMS-101**: the underlying standard (IVMS-101) still defines the name fields and verification processes, but we transmit a hash rather than the raw name. VASPs not supporting [TAIP-12] can ignore the `nameHash` fields – they are optional and don't break the message structure – and proceed to request the actual name through existing means. For example, if a VASP receives a TAP message with a `nameHash` but does not understand it, it will simply treat it as an unrecognized JSON-LD extension and can fall back to asking for the name via a separate secure channel. Thus, [TAIP-12] is **backward-compatible**: it does not disrupt interoperability with VASPs or protocols that don't implement it. Those parties can still execute Travel Rule exchanges using either direct PII exchange or [TAIP-8] selective disclosure (e.g. sending a Verifiable Credential with the name). Companies not using hashed names can continue to apply their standard Travel Rule procedures (manual name exchange, encrypted email, etc.), and only those who mutually support [TAIP-12] will utilize the hash field.

**Cross-Protocol Mapping:** Should a need arise to map a TAIP-12 message to another protocol message, the hashed name can be translated accordingly. For instance, if converting to an IVMS101 message format (commonly used in Travel Rule systems), the `nameHash` has no direct IVMS101 equivalent; however, it can be used internally by the receiving system to check against the IVMS101 name fields. Conversely, if a VASP receives an IVMS101-based request (with a plaintext name) and wants to respond via TAP with hashed name, they can hash the provided name to populate `beneficiary.nameHash`. These strategies ensure that TAIP-12 acts as an **interoperable extension** rather than a fork in the ecosystem. The primary objective is that whether a counterparty is using TAP/TATP, VerifyVASP, GTR, or any other Travel Rule solution, the presence of a hashed name using this standard will be understood and usable for verification. By converging on a single hashing approach, the industry moves closer to **universal Travel Rule interoperability**, where different compliance systems can trust and verify each other's data with minimal adaptation [VerifyVASP].

## Security and Privacy Considerations

The introduction of hashed name fields directly addresses privacy concerns by significantly limiting exposure of personal data. A SHA-256 hash of a name is essentially impossible to reverse into the original name (due to the one-way, preimage-resistant nature of SHA-256 [SHA-256]). Thus, even if the transaction message were intercepted or leaked, an attacker would not learn the actual name from the hash alone. This lowers the risk profile for VASPs when sharing customer information – they are sharing **proof of identity** rather than identity itself. As noted in TAIP-8, removing PII from core transaction metadata is beneficial for users and reduces legal liability for institutions [TAIP-8]. Hashed names achieve a similar goal: the **personal identifiable info is never in the clear** on the wire. In jurisdictions with strict data protection or banking secrecy laws, this can help VASPs remain compliant (since the customer's name is not revealed to third parties, only a pseudonymous token is).

**Verification and Accuracy:** The security of this scheme relies on both parties using the exact same normalization and hashing procedure. If one VASP accidentally includes an extra space or doesn't uppercase a letter, the hash will differ and might lead to a false "mismatch" result. To mitigate this, the normalization rules are kept very simple (uppercase and strip whitespace only) and well-defined in this specification. These rules should be applied consistently to the **exact name as recorded in KYC**. VASPs must also be cautious about differences in naming conventions: e.g., if one system stores "Bob Smith Jr." and another stores "Bob Smith", their hashes will differ. In such cases, the Travel Rule compliance officers should fall back to exchanging the name through other means to reconcile the discrepancy. Nonetheless, for the vast majority of cases (where the legal names match exactly on both sides), the hash comparison will succeed and automate what would otherwise be a manual verification step.

**Collision Resistance:** SHA-256 is a collision-resistant hash function, meaning it's computationally infeasible to find two different names that produce the same hash. The probability that two distinct legal names (especially including first and last names) collide in SHA-256 is astronomically low. This ensures that a matching hash strongly implies a matching name. For added assurance, VASPs could compare multiple data points (for example, name hash and date-of-birth hash) to virtually eliminate any chance of false positive – however, TAIP-12 for now focuses only on names. The 256-bit hash space provides a very large margin of security; there are no known practical attacks that could derive or guess a person's full name from the hash alone, short of brute-forcing all possible names (which is impractical given the huge search space and the fact that names are not simple numbers).

**Pseudonymization and Data Protection:** Regulators may consider hashed personal data as "pseudonymized" data. It is not directly identifiable, but it's derived from PII. If an adversary had a specific guess (e.g., suspecting the person's name is "Alice Lee"), they could hash that guess and compare it to the intercepted hash. This is only a concern if the attacker already has reason to suspect the identity; it's not a bulk privacy leak vector. Nonetheless, VASPs should handle name hashes with care similar to other customer data. They should not publish or reuse these hashes outside of compliance purposes. TAIP-12 is intended to keep hashes confined to authorized communications between VASPs. Additionally, after verification, the receiving VASP already knows their customer's real name (from their own KYC) and now has confirmation that the sender's record matches, so they do not gain any new personal data – just assurance. The originating VASP similarly doesn't learn new PII about the beneficiary beyond what they may have already been given by their customer (or by the beneficiary VASP in a confirmation). In effect, **no new PII is exchanged**, only cryptographic evidence of existing PII. This dramatically limits the privacy impact and aligns with principles of data minimization.

**Fallback and Failure Modes:** If a counterparty does not support hashed names or if a hash comparison fails, the VASPs should resort to the traditional methods of information exchange (which might involve using TAIP-8 to request a Verifiable Credential containing the full name, or using an out-of-band encrypted channel to send the name). TAIP-12 does not remove or replace those mechanisms; it only adds a privacy-preserving option. VASPs implementing TAIP-12 should have logic to handle these cases gracefully. A mismatch (hash doesn't verify) could indicate a typo or slight discrepancy in the name on one side; it doesn't necessarily imply wrongdoing. Policies can dictate whether a mismatch triggers an automatic rejection or a manual review. Since this hashed approach is mostly to streamline confirmations, VASPs may choose to follow up with a direct request for the name if automated matching fails, thus ensuring compliance is ultimately met one way or another.

In terms of security, exchanging hashes does not introduce new attack surfaces to the core TAP messaging (the field is inert data). The hashing operation should be done with well-vetted libraries to avoid any implementation bugs. Also, since `nameHash` is optional, an attacker could attempt a denial-of-service by stripping it out if they were intercepting messages – but an agent that requires it via policy would notice it missing and abort, no worse than if an attacker stripped out a required field of any kind. End-to-end encryption of TAP messages (e.g., via DIDComm channels) further protects the integrity of the hashed name data in transit.

## Reference Implementation

As a reference, developers can implement the hashed name feature as follows:

1. **Generate Name Hash:** When preparing an Asset Transfer message ([TAIP-3]) for a transaction, take the customer name from your user database. Normalize it by removing all whitespace characters and converting it to upper-case. Then compute the SHA-256 hash of the UTF-8 encoding of that normalized string. For example, using a pseudocode:

   ```python
   name = "Alice Lee"
   normalized = name.replace(" ", "").upper()    # "ALICELEE"
   name_hash = SHA256(normalized.encode("utf-8"))
   name_hash_hex = name_hash.hex()  # 64-character hex string
   ```

   Include this hex string in the JSON-LD payload as `"nameHash": "<hash>"` under the appropriate party (originator or beneficiary). If the customer has only a single name field (common in many systems), use that. If the name is stored in multiple parts (first name, last name), it should be concatenated (e.g., first + last) with no spaces for hashing. **Do not include titles, prefixes, or other non-name components.** The goal is to replicate exactly how the counterparty will hash their version of the name.

2. **Policy Enforcement (if needed):** If your institution **requires** incoming transfers to include hashed names, you can declare an agent policy (per [TAIP-7]) and check incoming messages for the presence of `nameHash`. For example, if a Transfer request arrives without `beneficiary.nameHash` and your policy mandates it, your system should respond with a refusal or a request for compliance (perhaps via a `RequirePresentation` of the full name using [TAIP-8]). Similarly, if you are the originator side and you require the beneficiary's hashed name in the response, you should not finalize the transfer until it's provided. In practice, such policy could be pre-negotiated with counterparties or enforced through network rules (e.g., some Travel Rule networks might only operate with hashed identities enabled).

3. **Comparison Logic:** Upon receiving a message with a `nameHash`, perform the same normalization and hashing on your local record of that customer's name. Compare the hex digest strings. If they are identical, record a positive verification (you have high confidence the names match) – this could fulfill the "verify beneficiary name" step required by your Travel Rule procedure. If they differ, trigger a manual review or a request for the actual name. It's important to log these events appropriately (a matched hash can be logged as a successful verification without storing the actual name from the counterparty). Note that hashing should ignore case and spaces, so differences in capitalization or spacing will not cause a false mismatch; however, differences in spelling or inclusion of middle names will. Decide how to handle those according to risk appetite. Some implementations might even attempt a few variations (e.g., include/exclude middle name or initials) if a mismatch occurs, but such heuristic approaches are beyond the scope of this standard.

4. **Format and Integration:** Ensure that the JSON-LD context used in your TAP implementation is updated to recognize the `nameHash` term. In the provided context (`https://tap.rsvp/schema/1.0`), new terms can be added. It may be advisable to extend the context or coordinate with the TAP schema maintainers to officially include `nameHash`. This will avoid the field being treated as an undefined extension. However, even without a context update, including the raw field as shown in the example is still JSON-LD valid (it will be treated as a property in the default namespace). Testing with counterparties in a sandbox environment is recommended to confirm that both sides interpret the field correctly.

5. **Fallback Handling:** Implement logic such that if a `nameHash` is expected but not present, your system either (a) uses [TAIP-8] to request the missing info, or (b) falls back to legacy procedures (e.g., halting the automated flow and sending a manual inquiry). Likewise, if you receive only a hash but prefer direct data, know that you can request the actual IVMS-101 name fields via selective disclosure if needed – the presence of a hash doesn't preclude later obtaining the cleartext through proper channels.

By following this reference implementation approach, developers can add hashed name support to their TAP-based transaction flows with minimal disruption to existing logic, achieving immediate privacy gains and compatibility with VerifyVASP/GTR peers.

## References

* [TAIP-2] TAP Messaging
* [TAIP-3] Asset Transfer
* [TAIP-6] Transaction Parties
* [TAIP-7] Agent Policies
* [TAIP-8] Selective Disclosure
* [TAIP-12] Hashed Name Information
* [IVMS-101] InterVASP IVMS-101 Standard
* [VerifyVASP] VerifyVASP Travel Rule Solution
* [GTR] Global Travel Rule Documentation
* [FATF-R16] FATF Recommendation 16
* [SHA-256] SHA-2 Wikipedia
* [CC0] Creative Commons CC0 License

[TAIP-2]: ./taip-2 "TAP Messaging"
[TAIP-3]: ./taip-3 "Asset Transfer"
[TAIP-6]: ./taip-6 "Transaction Parties"
[TAIP-7]: ./taip-7 "Agent Policies"
[TAIP-8]: ./taip-8 "Selective Disclosure"
[TAIP-12]: ./taip-12 "Hashed Name Information"
[IVMS-101]: https://intervasp.org/wp-content/uploads/2020/05/IVMS101-interVASP-data-model-standard-issue-1-FINAL.pdf "InterVASP IVMS-101 Standard"
[VerifyVASP]: https://verifyvasp.com "VerifyVASP Travel Rule Solution"
[GTR]: https://www.globaltravelrule.com/documentation/ "Global Travel Rule Documentation"
[FATF-R16]: https://notabene.id/crypto-travel-rule-101/what-is-the-crypto-travel-rule#what-are-the-fatf-travel-rule-requirements "FATF Recommendation 16"
[SHA-256]: https://en.wikipedia.org/wiki/SHA-2 "SHA-2 Wikipedia"
[CC0]: ../LICENSE "Creative Commons CC0 License"

## Copyright

Copyright and related rights waived via [CC0].

