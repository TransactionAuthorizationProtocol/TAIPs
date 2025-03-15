---
taip: 11
title: Legal Entity Identifier (LEI) to Identify institutional participants in TAP Messages
status: Draft
type: Standard
author: Pelle Braendgaard <pelle@notabene.id>
created: 2025-03-05
requires: 2, 5, 6, 7, 8
---

## Simple Summary

Defines how to use **Legal Entity Identifiers (LEIs)** as unique identifiers for institutional participants in the Transaction Authorization Protocol (TAP). By leveraging the globally recognized 20-character LEI code, TAP messages can unambiguously identify legal-entity participants (such as VASPs and other financial institutions) in a transaction, improving clarity and compliance.

## Abstract

This proposal introduces the use of the Legal Entity Identifier (LEI) within TAP message structures to **identify institutional parties** involved in a transaction. An LEI is a standardized 20-character alpha-numeric code that uniquely identifies a legal entity engaging in financial transactions [GLEIF]. Incorporating LEIs into TAP messages enables counterparties to instantly recognize the legal entities (e.g. originating or beneficiary institutions) behind identifiers like DIDs or addresses, without exchanging full detailed identity profiles. This TAIP specifies how an LEI should be included in TAP JSON-LD message payloads to represent an institution's identity, and provides examples for using LEIs in policy negotiation, transfer initialization, and credential presentation. By focusing solely on LEIs (and removing any dependence on the IVMS101 data model), this approach keeps TAP's core messages **lightweight and privacy-preserving** while still allowing institutions to comply with regulations that demand entity identification. Future integration of **verifiable LEIs (vLEIs)** is also discussed, highlighting how cryptographic credentials for LEIs could further enhance trust in institutional identity within TAP.

## Motivation

Global regulatory standards and industry best practices increasingly emphasize the need for reliable identification of financial institutions in digital transactions. The **Legal Entity Identifier (LEI)**, endorsed by the G20 and regulated through the Global LEI System, has emerged as the only global standard for legal entity identification [GLEIF]. Over **2 million LEIs** have been issued worldwide, and more than *200 regulations* now require or reference LEIs in various financial domains [RapidLEI]. In the context of cryptocurrency transactions and the FATF Travel Rule, VASPs (Virtual Asset Service Providers) must exchange originator and beneficiary institution information. Adopting LEIs in TAP provides a uniform, verifiable way to identify these institutions without ambiguity.

Unlike free-form names or local identifiers, LEIs are globally unique and can be cross-checked against an open data registry for details about the entity ("who is who" and "who owns whom" in corporate structures) [GLEIF]. This improves interoperability and reduces errors or confusion in identifying counterparties. It also streamlines compliance processes: for example, the Financial Stability Board (FSB) has identified the LEI as a key component for enhancing cross-border payment processes and recommended its inclusion in payment messaging standards [FSB]. By using LEIs, a receiving institution can automatically recognize the sending institution (and vice versa), facilitate due diligence (e.g. sanction screening by entity), and satisfy regulatory reporting requirements.

Importantly, focusing on LEIs helps **minimize the sharing of sensitive personal data**. Current Travel Rule solutions often transmit detailed personal information (names, addresses, etc.) about transacting parties alongside transfers, increasing privacy risks. In contrast, TAP's design (per [TAIP-8]) seeks to keep personally identifiable information out of the base transaction messages [TAIP-6-Parties]. Using an LEI to identify an institution achieves the compliance objective (identifying the financial institution) *without* exposing any personal data, thus aligning with data minimization principles. An LEI is public and non-sensitive, so including it in a TAP message does not, for example, reveal a customer's personal details. Should more information about a legal entity or its customer be required, it can be requested through a controlled credential exchange rather than automatically shared in every transaction.

Finally, adopting LEIs paves the way for future enhancements in trust and automation. While an LEI code itself uniquely identifies an entity, **possession of the code alone is not proof** that the party using it is actually that legal entity or an authorized representative (this is sometimes called the "trust gap" [AusPayNet-Trust]). The discussion of verifiable LEIs (vLEIs) in a later section addresses how this gap can be closed. In the interim, simply standardizing on LEI usage in TAP is a crucial first step to improve **interoperability, compliance, and clarity** when institutional participants transact.

## Specification

### LEI as an Identifier for Institutional Participants

In TAP message schemas (as defined in [TAIP-2]), each *Party* object that represents a **legal entity** SHOULD include that entity's LEI as an attribute. According to [TAIP-6], parties in a transaction are identified by an IRI (often a DID) as the `@id` of a JSON-LD object [TAIP-6-Parties]. This TAIP extends that model by adding a standard property for the LEI within the party's JSON-LD representation. The LEI property is included using a context definition for the LEI code, for example by leveraging the Schema.org vocabulary for LEI. In practice, an institution's party object can be structured as follows [TAIP-6-Parties]:

```json
{
  "@context": { "lei": "https://schema.org/leiCode" },
  "@id": "did:web:example.vasp.com",
  "lei:leiCode": "5493001KJTIIGC8Y1R12"
}
```

In this example, the party's decentralized identifier (DID) or other IRI remains the primary identifier for routing and reference (`@id`). The additional `"lei:leiCode"` field – introduced via the context alias `"lei"` – carries the institution's LEI (here represented by a 20-character code). By using a well-known ontology (Schema.org's `leiCode` property), any party receiving this data can interpret the LEI correctly. The LEI MUST be a 20-character alpha-numeric string conforming to the ISO 17442 standard format (no spaces or delimiters). If the sending institution has an LEI, it **MUST include** it in its party object. If a customer (originator or beneficiary) of a transaction is itself a legal entity (e.g. a business or organization), and has an LEI, that LEI SHOULD also be included in the relevant party object for the originator or beneficiary.

Per [TAIP-5], institutional participants in a transaction are often represented as *Agents* (e.g. a VASP acting on behalf of a customer). In such cases, the Agent can indicate the legal entity it represents by using the `for` attribute pointing to the Party (entity) object [TAIP-6-Parties]. The Party object for that institution would contain the LEI as shown above. For example, a VASP's Agent identified by a DID could have a corresponding Party entry that includes the VASP's LEI. This indirection allows the agent (which might be a specific service endpoint) to be linked to the broader legal entity identity. Implementations MAY also choose to include the LEI directly as part of an Agent's metadata, but the recommended approach is to use the Party construct so that the legal entity's details are cleanly separated.

Including an LEI in TAP messages does not fundamentally alter the TAP message structure; rather, it provides an **additional data point** within the existing JSON-LD envelope of a message. LEIs can appear in any TAP message where a party's identity is conveyed or updated. In particular, the **Asset Transfer** message ([TAIP-3]) that initiates a transaction can include the originator's and/or beneficiary's LEI if known. Additionally, the **UpdateParty** message (as defined in [TAIP-6]) can be used by either side to furnish the counterparty with a Party object that contains an LEI, if it wasn't provided initially. For instance, if an originator's request only included a blockchain address for the beneficiary, the beneficiary's Agent could respond with an `UpdateParty` message supplying the beneficiary's identity including its LEI (if the beneficiary is a legal entity).

### Examples

Below are examples of TAP messages incorporating LEIs in different scenarios:

#### Example 1: `UpdatePolicies` message requiring an LEI

An Agent can declare a policy that it requires the counterparty's institution to provide an LEI before proceeding. For example, the originator's VASP might update its policies to insist on knowing the beneficiary institution's LEI. This is expressed using a `RequirePresentation` policy (from [TAIP-7]) targeted at the beneficiary's agent. The policy requests a verifiable presentation of the beneficiary's **legal entity identity** (specifically, an LEI). The `UpdatePolicies` message carrying this policy could look like:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "type": "https://tap.rsvp/schema/1.0#UpdatePolicies",
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "from":"did:web:originator.vasp.com",
  "to": ["did:web:beneficiary.vasp.com"],
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#UpdatePolicies",
    "policies": [
      {
        "@type": "RequirePresentation",
        "@context": [
          "https://schema.org/Organization",
          "https://www.gleif.org/ontology/Base/Entity"
        ],
        "fromAgent": "beneficiary",
        "aboutAgent": "beneficiary",
        "purpose": "Require beneficiary institution LEI for compliance",
        "presentationDefinition": "https://tap.rsvp/definitions/lei/v1"
      }
    ]
  }
}
```

In this JSON snippet, the originator's agent sends an `UpdatePolicies` message to the beneficiary's agent. The `RequirePresentation` policy indicates that the originator **requires the beneficiary's agent** to present information proving the identity of the beneficiary institution. We include both the Schema.org Organization context and GLEIF's Entity ontology context to ensure the LEI and related organizational data can be understood semantically. The policy uses `"fromAgent": "beneficiary"` to specify that the beneficiary's agent must provide the presentation, and `"aboutAgent": "beneficiary"` to clarify that the subject of the requested information is the beneficiary agent itself (i.e. the institution on the beneficiary side). The `presentationDefinition` is a reference (URL) to a definition of what credential or data format is expected – in this case, a definition specifying an LEI credential. For example, this definition might require a verifiable credential asserting the agent's LEI. (Note: The exact contents of the presentation definition are out of scope for this TAIP, but it would likely conform to an emerging standard profile for requesting an LEI attestation.)

#### Example 2: `Transfer` message including an LEI

When initiating a transaction, if the originator's institution or the originator's customer is a legal entity with an LEI, that information can be embedded in the **Transfer** message. For instance, consider a scenario where ACME Corp (LEI: `3M5E1GQKGL17HI8CPN20`) is sending funds to an individual beneficiary. ACME Corp's VASP (originator agent) can include ACME's party details with its LEI in the `Transfer` message body:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "type": "https://tap.rsvp/schema/1.0#Transfer",
  "from": "did:web:originator.vasp.com",
  "to": [
    "did:web:beneficiary.vasp.com",
    "did:pkh:eip155:1:0xabc123...fdef"
  ],
  "body": {
    "@context": "https://tap.rsvp/schema/1.0",
    "@type": "https://tap.rsvp/schema/1.0#Transfer",
    "originator": {
      "@context": { "lei": "https://schema.org/leiCode" },
      "@id": "did:org:acmecorp-123",
      "lei:leiCode": "3M5E1GQKGL17HI8CPN20",
      "name": "ACME Corporation"
    },
    "beneficiary": {
      "@id": "did:pkh:eip155:1:0xabc123...fdef"
    },
    "asset": "bip122:000000000019d6689c085ae165831e93/slip44:0",
    "amount": "2500"
  }
}
```

Here, the `originator` field in the transfer's body is a Party object for ACME Corp. We provide a context for the LEI (`leiCode` from schema.org) and include the LEI value. We also included a `name` field for clarity in this example (the name "ACME Corporation"), though in practice the name could be derived from the LEI registry if needed – including it directly is optional and should be done in line with privacy considerations. The beneficiary in this case is identified only by a blockchain address (using a DID with the `did:pkh` method for an Ethereum address) and has no LEI (assuming the beneficiary is an individual). By having the originator's LEI in the message, the beneficiary's VASP immediately knows the sending entity is ACME Corp (and can look up details via the LEI if necessary) without needing a separate communication. If the beneficiary's VASP has a policy requiring the originator's information to be verified, it could request additional credentials (e.g. proof of ACME's registration or authorization of the person initiating the transfer) via the `RequirePresentation` mechanism.

It's worth noting that including an LEI in the initial transfer message is optional – if the LEI isn't known or provided, the counterparties can always fall back to an **UpdateParty** or **Presentation** exchange to share the LEI. However, providing it up front can expedite compliance checks. Because the LEI itself is not sensitive personal data, there is little downside to sharing it in the plaintext of a TAP message (unlike, say, a passport number or address which TAP avoids including in the clear).

#### Example 3: `Presentation` message providing an LEI

Continuing the Example 1 scenario: the originator's VASP requested the beneficiary's VASP to present its institution's LEI. The beneficiary's agent can fulfill this request by sending a **Presentation** message (as defined in the DIDComm Present Proof protocol) containing a verifiable proof of its LEI. In TAP, this would typically be an out-of-band DIDComm message in response to the policy requirement. For illustration, a simplified form of the Presentation message (with a verifiable credential for the LEI) might look like:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174002",
  "type": "https://didcomm.org/present-proof/3.0/presentation",
  "thid": "123e4567-e89b-12d3-a456-426614174000",
  "body": {
    "presentation": {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://schema.org",
        "https://www.gleif.org/ontology/Base/Entity"
      ],
      "type": ["VerifiablePresentation"],
      "verifiableCredential": [{
        "id": "123e4567-e89b-12d3-a456-426614174003",
        "type": ["VerifiableCredential", "LegalEntityCredential"],
        "issuer": "did:web:gleif.org",
        "credentialSubject": {
          "lei": "3M5E1GQKGL17HI8CPN20",
          "legalName": "Beneficiary VASP Ltd."
        },
        "proof": { /* digital signature proving authenticity */ }
      }]
    }
  }
}
```

In this example, the beneficiary's agent presents a **Verifiable Credential** attesting to its identity. The credential (which we label here as `"LegalEntityCredential"`) includes the entity's LEI and legal name as the subject, and is issued by a trusted authority (in this case, indicated by issuer `did:web:gleif.org`, representing the Global LEI Foundation or a Qualified vLEI Issuer). The Presentation message wraps this credential in a verifiable presentation, which is sent as a response in the same **thread** (`thid` references the original transfer or request thread). The originator's agent, upon receiving this, can verify the credential's signature and issuer to confirm that the LEI is authentic and belongs to the beneficiary's institution. This mechanism aligns with [TAIP-8] (Selective Disclosure), where sensitive identity information is exchanged as verifiable credentials rather than in the clear. In practice, the verifiable credential here could be a **vLEI credential** (discussed below) if such an ecosystem is in place. Even if not, the parties could use a simpler credential (e.g., a JSON Web Token or signed JSON) from a registry or bilateral agreement to assert the LEI. The end result is that the originator now has high assurance of the beneficiary institution's identity (e.g., "Beneficiary VASP Ltd, LEI X..."), meeting compliance requirements without a lengthy manual process.

### Backwards Compatibility

This TAIP is designed to be backwards-compatible with existing TAP message formats. LEI fields are added as optional **extensions** to Party objects. An implementation not aware of LEI data can safely ignore the extra `"lei:leiCode"` attribute in a Party object (JSON-LD allows unknown fields to be skipped). Thus, incorporating LEIs does not break interoperability with TAP agents that haven't yet implemented this proposal. However, for the benefits to be realized (mutual recognition of institutional identity), both sending and receiving agents in a transaction should implement LEI support. It is recommended that TAP implementations begin to **expect and parse LEI fields** in incoming messages, even if they do not require them, so that the information can be logged or used when present.

## Future Adoption of Verifiable LEIs (vLEIs)

While embedding the LEI in TAP messages improves identification, it does not by itself guarantee **trust** in the identity. In other words, an attacker could theoretically impersonate an institution by using that institution's LEI without authorization. The solution to this is the **verifiable LEI (vLEI)** – a cryptographically verifiable credential containing an entity's LEI and related identity information. The vLEI is a digital counterpart of the LEI being developed by GLEIF, based on self-sovereign identity principles. It enables automated, trust-minimized verification of a legal entity's identity between counterparties [RapidLEI].

In the context of TAP, future adoption of vLEIs would allow parties not only to exchange LEI codes but to **prove ownership and control** of those LEIs. A vLEI credential, issued by an accredited vLEI Issuer (and ultimately rooted in GLEIF's authority), binds the LEI to the organization's public key and the identities of its authorized representatives [AusPayNet]. By requesting a vLEI-based presentation (as in the Example 3 above), an agent can receive a cryptographically signed assertion that "This agent represents legal entity X, which has LEI code Y, and the credential is issued by a trusted authority." Verification of such a credential involves checking the digital signature and issuer chain (GLEIF acts as the root of trust in the vLEI ecosystem). If valid, the receiving agent gains a high level of assurance that the sending agent is in fact acting on behalf of the claimed legal entity.

**Benefits of vLEI integration:**

- *Enhanced Trust:* vLEIs close the trust gap by confirming that the party presenting an LEI is truly authorized by that legal entity [AusPayNet-Trust]. This prevents scenarios where a malicious actor might falsely claim a reputable institution's LEI. Each vLEI credential ties an organization to cryptographic keys controlled by that organization or its officers, making impersonation extremely difficult.

- *Streamlined Compliance Checks:* With vLEIs, compliance processes (KYC/KYB, sanctions screening, etc.) can be partly automated. For example, if both VASPs in a transaction present vLEI credentials to each other, each side instantly has a verified record of the other's legal identity and can log the LEI for regulatory reporting. This reduces the need for manual lookup of LEIs in databases or exchange of certificates through separate channels [RapidLEI-vLEI].

- *Delegated Authority:* The vLEI ecosystem not only verifies the entity but also can include the *roles/authority* of individuals acting on the entity's behalf [AusPayNet-Trust]. In practice, this means a vLEI credential could assert that "Alice is an authorized Compliance Officer of Bank XYZ (LEI: ...)" In TAP workflows, this could eventually allow not just machine-to-machine assurance, but also human-to-human trust (e.g., a compliance analyst at one institution trusting that the person they're dealing with at the counterparty is legitimately representing that firm). This level of detail is beyond the scope of basic TAP message exchange, but it indicates how vLEI could enhance the broader trust framework around TAP messages.

**Anticipated usage in TAP:** Once vLEI credentials become available and widely adopted, TAP agents could incorporate vLEI presentation as a standard step during the initialization of a transaction or during policy compliance checks. For instance, an agent's policy might directly request a "vLEI credential presentation" from the counterparty's agent, rather than just the raw LEI code. The exchange would then use the `RequirePresentation` mechanism to obtain a W3C Verifiable Presentation containing the vLEI. Because this is all based on open standards (DIDComm, W3C VC), it fits neatly into the existing TAP framework defined by [TAIP-7] and [TAIP-8].

It's expected that early on, not all institutions will have vLEIs. During that transition, some TAP transactions may use plain LEIs (possibly verified manually or via database lookups), while others use vLEIs where available. Over time, as regulators and industry bodies encourage vLEI usage, TAP could progressively move toward preferring verifiable credentials. This TAIP is designed to accommodate that evolution: it establishes the LEI as the identifier now, and is forward-compatible with exchanging that identifier in verifiable form. In summary, **vLEIs will greatly strengthen identity assurance in TAP** by providing cryptographic proof of an institution's identity and authority, building on the foundation of LEI introduced in this specification.

## Security Considerations

Including LEIs in TAP messages introduces minimal security risk on its own, since an LEI is a public identifier. However, relying on an LEI **without verification** could be problematic. Agents should not blindly trust an LEI string presented in a message unless it comes from a trusted source or is accompanied by proof (e.g. a vLEI credential). To mitigate impersonation risks prior to vLEI adoption, agents may cross-check the provided LEI against known information (such as the DID or domain of the counterparty, or out-of-band confirmation). For example, if a message claims an originator VASP's LEI is X, the beneficiary VASP could verify that the DID or endpoint of the sender is indeed associated with that LEI (perhaps by looking up the LEI's published registration information like legal name and seeing if it matches expectations or known certificates).

When vLEIs are used, standard verifiable credential security practices apply: verify digital signatures, issuer authenticity, and credential expiration or revocation status. Agents must ensure they trust the **issuing authorities** of vLEIs (which, under the GLEIF model, means trusting the chain anchored at GLEIF). Compromise of an agent's private keys could also allow an attacker to misuse that agent's LEI or vLEI credential, so maintaining strong key security is essential – but that is part of general TAP/DIDComm security practices.

In summary, the introduction of LEIs does not weaken TAP security; rather, it provides a hook to enhance trust. The main consideration is ensuring that the presence of an LEI is actually *meaningful*, i.e. that the LEI truly corresponds to the party using it. The **Future vLEI** approach addresses this. Until vLEIs are ubiquitous, implementers should treat an unverified LEI as **informational** and not as sole proof of identity, unless combined with other checks.

## Privacy Considerations

This proposal aligns with TAP's privacy-preserving approach by **limiting the exposure of personal data**. An LEI identifies a legal entity (organization), not a natural person, and is drawn from a public registry [GLEIF]. Including an LEI in a message therefore does not directly reveal personal information about any individual. It does, however, disclose the involvement of a particular institution in a transaction, which could be considered sensitive in certain business contexts (for example, a competitor learning that a company is transacting with a certain bank). TAP messages are generally exchanged privately between the parties involved in a transaction (over encrypted DIDComm channels), so this risk is minimal. Both sides of a TAP exchange are already aware of each other's identities by virtue of initiating the connection (e.g. through directory lookup or prior agreement), and the LEI simply formalizes that knowledge in a standard way.

By removing the need to send full IVMS101 datasets (which include names, physical addresses, ID numbers, etc.), using LEIs significantly reduces the amount of personally identifiable information shared in the transaction flow. This supports the principle of **data minimization** – only the necessary identity information (the institution's identifier) is shared by default, and anything beyond that (e.g. personal data about customers) is only shared selectively if required by policy [TAIP-8]. In jurisdictions with strict privacy laws (GDPR, CCPA, etc.), this approach helps TAP implementers avoid sending or storing unnecessary personal data, thereby reducing compliance burden and potential liability.

One consideration is that if a customer of a VASP is a legal entity and its LEI is shared, information about that customer (like its registered name, jurisdiction, etc.) can be looked up by the counterparty via the LEI. Again, since that information is public corporate data, this is usually acceptable and even desirable for due diligence. Organizations typically do not object to sharing their LEI, as it facilitates trust. Nevertheless, if there were a case where an entity's involvement needed to be kept confidential, the parties would need to handle that out-of-band, because TAP by design favors transparency of institutional identity for compliance reasons.

In summary, leveraging LEIs in TAP strikes a good balance between **transparency and privacy**: it reveals enough to satisfy regulatory and trust requirements (who is the financial institution behind a transfer) without divulging personal details about individuals, and it keeps any additional data exchanges (for personal or sensitive info) in a controlled, consent-based workflow (e.g. via verifiable credential presentations).

## References

[TAIP-2]: ./taip-2 "TAP Messaging"
[TAIP-3]: ./taip-3 "Asset Transfer"
[TAIP-5]: ./taip-5 "Transaction Agents"
[TAIP-6]: ./taip-6 "Transaction Parties"
[TAIP-7]: ./taip-7 "Agent Policies"
[TAIP-8]: ./taip-8 "Selective Disclosure"
[GLEIF]: https://www.gleif.org/en/about-lei/introducing-the-legal-entity-identifier-lei "GLEIF - Introducing the Legal Entity Identifier"
[RapidLEI]: https://rapidlei.com/vlei/ "RapidLEI - Verifiable LEI Overview"
[FSB]: https://www.fsb.org/2020/10/enhancing-cross-border-payments-stage-3-roadmap/ "FSB - Enhancing Cross-border Payments"
[AusPayNet]: https://www.auspaynet.com.au/insights/blog/LEI "AusPayNet - LEI Trust Framework"
[CAIP-10]: https://chainagnostic.org/CAIPs/caip-10 "Chain Agnostic Account ID Specification"
[CC0]: ../LICENSE "Creative Commons CC0 License"

## Copyright

Copyright and related rights waived via [CC0]. This work is marked with [CC0 1.0].
