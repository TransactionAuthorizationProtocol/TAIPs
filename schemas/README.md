# TAP JSON Schemas

This directory contains JSON Schema definitions for all Transaction Authorization Protocol (TAP) message types and data structures.

## Overview

The schemas are organized into three main categories:

- **`/common`** - Base type definitions (CAIP types, DID types, base structures)
- **`/data-structures`** - Reusable data structures (Party, Agent, Policy, etc.)
- **`/messages`** - Message type schemas for all TAP messages

All schemas are publicly accessible via GitHub Pages at:
- Base URL: `https://taips.tap.rsvp/schemas/`
- Example: `https://taips.tap.rsvp/schemas/messages/transfer.json`

## Schema Standards

All schemas follow:
- JSON Schema draft 2020-12
- Use `$id` for unique identification
- Include detailed descriptions
- Reference common definitions to avoid duplication

## Message Types

The following TAP message types have schemas defined:

### Transaction Messages
- `transfer.json` - Initiates a virtual asset transfer
- `payment.json` - Payment request with optional invoice

### Authorization Flow
- `authorize.json` - Authorization request/response
- `settle.json` - Settlement confirmation
- `reject.json` - Transaction rejection
- `cancel.json` - Transaction cancellation
- `revert.json` - Transaction reversal request

### Agent Management
- `update-agent.json` - Update agent details
- `update-party.json` - Update party information
- `add-agents.json` - Add new agents
- `replace-agent.json` - Replace existing agent
- `remove-agent.json` - Remove agent from transaction

### Relationship & Policy
- `confirm-relationship.json` - Confirm party-agent relationship
- `update-policies.json` - Update agent policies

### Connection Management
- `connect.json` - Establish TAP connection
- `authorization-required.json` - Request authorization
- `out-of-band-invitation.json` - Out-of-band connection invitation

## Validation

To validate test vectors against schemas:

```bash
# Install dependencies
npm install

# Run validation
npm run validate
```

The validation script will:
1. Load all schemas
2. Validate test vectors from `/test-vectors`
3. Report validation results

## Usage Example

```javascript
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const transferSchema = require('./messages/transfer.json');

const ajv = new Ajv();
addFormats(ajv);

const validate = ajv.compile(transferSchema);
const valid = validate(transferMessage);

if (!valid) {
  console.log(validate.errors);
}
```

## Schema Development

When creating or modifying schemas:

1. Follow the existing pattern and structure
2. Use `$ref` to reference common definitions
3. Include comprehensive descriptions
4. Test against relevant test vectors
5. Ensure TypeScript types match the schema

## References

- [JSON Schema Specification](https://json-schema.org/)
- [TAP Documentation](https://github.com/TransactionAuthorizationProtocol/TAIPs)
- [CAIP Standards](https://github.com/ChainAgnostic/CAIPs)