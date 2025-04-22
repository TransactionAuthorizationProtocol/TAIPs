---
layout: page
title: Overview
permalink: /overview/
---

# Transaction Authorization Protocol (TAP): Bridging Traditional Finance and Blockchain

## What is TAP?

The Transaction Authorization Protocol (TAP) is a messaging framework that enables secure, compliant, and flexible transaction authorization between parties before settlement on a blockchain. TAP creates a separate "authorization layer" that operates independently from the blockchain "settlement layer," allowing participants to exchange necessary information, perform risk assessments, and implement compliance checks before funds move.

## Motivation for Creating TAP

### The Problem with Current Crypto Transactions

Today's cryptocurrency transactions face several challenges:

- **Unilateral authorization**: Only the sender authorizes a transaction using their private key
- **Irreversibility**: Once confirmed on a blockchain, transactions cannot be reversed
- **Limited beneficiary input**: Recipients have no way to approve/reject incoming transactions
- **Compliance gaps**: Meeting regulatory requirements like Travel Rule is difficult
- **Coordination challenges**: Various parties involved in a transaction need a standardized way to communicate

TAP bridges these gaps by creating an authorization framework that works with existing blockchain infrastructure without requiring protocol changes.

## Transaction Parties and Agents

### Transaction Parties

Transaction parties are the entities involved in a transaction:

- **Originator**: The party sending assets
- **Beneficiary**: The party receiving assets
- **Intermediaries**: Other parties involved in facilitating the transaction

### Transaction Agents

Agents are intermediary applications, financial institutions or other service providers acting on behalf of transaction parties or other agents:

- **VASP Agents**: Represent virtual asset service providers
- **Wallet Agents**: Interface with blockchain wallets
- **Custody Agents**: Manage secure storage
- **Compliance/Risk Agents**: Perform checks and verifications
- **AI/Application Agents**: Automated systems acting on behalf of a party

Agents can negotiate different aspects of the transaction (KYC, compliance, risk) without forcing a single deterministic flow, giving flexibility while maintaining compliance.

## Transaction Workflow

The TAP workflow is intentionally non-deterministic, allowing multiple agents to collaborate in various sequences. The core message types are:

1. **Transfer**: Initiates a transaction request
2. **Authorize**: Signals approval to proceed
3. **Settle**: Announces intention to execute on blockchain and provides settlement ID
4. **Reject**: Signals disapproval of the transaction
5. **Cancel**: Ends a transaction by request of a party
6. **Revert**: Requests return of funds after settlement

For example, a basic flow might look like:
1. Originating Agent sends Transfer request to Beneficiary Agent
2. Beneficiary Agent sends Authorize with settlement address
3. Originating Agent sends Settle with blockchain transaction ID

However, the protocol is flexible enough to accommodate more complex flows with multiple agents, allowing each to perform their specific functions without a rigid sequence.

## Payment Request Flow

TAP introduces a **Payment** flow that enables merchants to request payments from customers, simulating familiar e-commerce and invoicing experiences. This "pull payment" model complements the standard "push payment" approach of cryptocurrencies.

### How Payment Requests Work

1. A merchant initiates by sending a **Payment** message that specifies:
   - Amount due (in either crypto asset or fiat currency)
   - Acceptable payment assets (if priced in fiat)
   - Optional expiry time
   - Information requirements from the customer
   - Optional detailed invoice with line items, taxes, and payment terms (as defined in TAIP-16)

2. The customer's wallet displays the request, allowing the customer to:
   - Review payment details and invoice information
   - Provide any requested information (securely via selective disclosure)
   - Approve or decline the payment

3. If approved, the standard TAP authorization flow begins:
   - The merchant's agent sends a **Complete** message with a settlement address and optional final amount
   - The customer's wallet executes the blockchain transaction
   - Settlement confirmation is exchanged via a **Settle** message

4. Either party can cancel the request at any time before settlement

This approach brings familiar payment experiences to blockchain transactions, with added privacy protection for customer information and flexibility in payment methods. It's particularly valuable for e-commerce, subscriptions, and B2B invoicing with detailed invoice support.

## Agent Connection Protocol

For ongoing business relationships, TAP offers a standard **Connect** protocol that allows agents to establish authorized connections with predefined constraints. This is particularly important for enabling AI agents, applications, and B2B services to perform transactions on behalf of customers.

### How Connect Works

1. An agent (like an AI service or B2B application) sends a **Connect** request to another agent (like a VASP or wallet), specifying:
   - Who they represent (their customer)
   - What types of transactions they want to perform
   - Optional transaction limits (e.g., maximum amounts)

2. The receiving agent manages authorization through:
   - Direct authorization (for existing customers)
   - OAuth-style flow with an authorization URL
   - Out-of-band customer notification

3. The customer reviews and approves the connection, including:
   - Which agent is requesting access
   - What permissions they're requesting
   - Any transaction limits or constraints

4. Once approved, the connection is established with a unique identifier, enabling:
   - Future transactions without repeated authorization
   - Enforcement of agreed constraints
   - Monitoring and management of the connection

5. Either party can cancel the connection at any time

This protocol creates a secure framework for delegation, allowing third-party services to initiate transactions while maintaining customer control and risk management. It's crucial for enabling AI agents to make payments on behalf of users, B2B service integration, and automated payment flows.

## Comparison to Traditional Systems

### Blockchain Transactions
- **Standard blockchain**: Sender authorizes → transaction submitted → confirmed → irreversible
- **With TAP**: Multi-party authorization → compliance checks → settlement address exchange → blockchain execution → potential reversion mechanisms

### Credit Card Transactions
- **Credit card**: Authorization → clearing → settlement (can be reversed through chargebacks)
- **TAP**: Similar multi-step authorization process but with distributed responsibilities among agents

### Cross-border Payments
- **Traditional**: Correspondent banking with multiple intermediaries and days-long settlement
- **TAP**: Direct agent-to-agent communication with faster settlement while maintaining compliance

## How AI Agents Can Participate

AI agents can connect to the TAP ecosystem to perform:

- Automated compliance checks
- Risk scoring of counterparties
- Transaction monitoring
- Metered payments for services
- Automated authorization based on predefined rules

The messaging-based nature of TAP allows AI systems to plug in as agents that can evaluate transactions, make decisions, and communicate with other agents in the network.

By using the Connect protocol, AI services can obtain pre-authorized permission to make payments on behalf of users, enabling automated subscription payments, usage-based billing, and intelligent financial operations without compromising security or control.

## Key Benefits

- **Regulatory compliance**: Built-in support for Travel Rule and other regulations
- **Risk mitigation**: Pre-authorization checks before funds move
- **Flexibility**: Adapts to different business requirements and regulatory environments
- **Interoperability**: Works across different blockchains and with existing systems
- **Extension**: Framework can adapt to new requirements and use cases

TAP creates a middle ground between traditional financial guardrails and blockchain innovation, enabling safer, more compliant crypto transactions without sacrificing the benefits of decentralized settlement. 