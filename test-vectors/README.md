# TAP Protocol Test Vectors

This directory contains test vectors for validating implementations of the Transaction Authorization Protocol (TAP). These test vectors provide comprehensive coverage of protocol requirements and edge cases.

## Structure

The test vectors are organized by message type and concern:

```
/test-vectors/
├── transfer/              # Transfer message test vectors
├── authorize/             # Authorize message test vectors
├── reject/                # Reject message test vectors
├── settle/                # Settle message test vectors
├── presentation/          # Presentation message test vectors
├── add-agents/            # AddAgents message test vectors
├── replace-agent/         # ReplaceAgent message test vectors
├── remove-agent/          # RemoveAgent message test vectors
├── update-policies/       # UpdatePolicies message test vectors
├── confirm-relationship/  # ConfirmRelationship message test vectors
├── error/                 # Error message test vectors
├── didcomm/               # DIDComm envelope test vectors
├── caip-identifiers/      # CAIP identifier validation
├── agent-management/      # Agent management scenarios
└── policy-management/     # Policy management scenarios
```

## Test Vector Format

Each test vector is a JSON file with the following structure:

```json
{
  "description": "Short description of the test case",
  "purpose": "Explanation of what this test case validates",
  "shouldPass": true|false,
  "version": "1.0.0",
  "taips": ["taip-2", "taip-3"],
  "message": {
    // The actual message to be tested
  },
  "expectedResult": {
    // Expected result or error information
  }
}
```

## DIDComm Test Vectors

The `/didcomm/` directory contains test vectors specifically for DIDComm message envelope creation and processing. These vectors demonstrate:

1. How to structure cryptographic keys for DIDComm messaging using `did:key` format
2. How to sign and encrypt TAP messages using DIDComm v2 in JSON serialization format
3. How to verify and decrypt DIDComm messages to extract TAP content

### DIDComm Serialization Format

The DIDComm test vectors use the JSON Serialization format as defined in the official DIDComm specification:

**JSON JWS Format:**
```json
{
  "payload": "base64url-encoded-payload",
  "signatures": [
    {
      "protected": "base64url-encoded-protected-header",
      "signature": "base64url-encoded-signature",
      "header": {
        "kid": "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK#key-1"
      }
    }
  ]
}
```

**JSON JWE Format:**
```json
{
  "protected": "base64url-encoded-protected-header",
  "recipients": [
    {
      "header": {
        "kid": "did:key:z6MkmxgacQRvJBzBremEzYdpZeGJpE9FHfvq6NvBFrgaQXTb#key-2"
      },
      "encrypted_key": "base64url-encoded-encrypted-key"
    }
  ],
  "iv": "base64url-encoded-iv",
  "ciphertext": "base64url-encoded-ciphertext",
  "tag": "base64url-encoded-tag"
}
```

For detailed examples and implementation guidance, see the `/didcomm/example-usage.md` file.

## Usage

Test vectors can be used to validate TAP implementations:

1. Parse the test vector JSON file
2. Apply the validation logic from your implementation to the `message`
3. Check if the validation result matches the `shouldPass` flag
4. For negative tests, verify that the expected error is thrown

## Versioning

Test vectors follow semantic versioning:
- Major version: Breaking changes to test vector format
- Minor version: New test vectors added
- Patch version: Corrections to existing test vectors

## Contributing

To contribute new test vectors:
1. Follow the established format
2. Ensure test vectors are complete and self-contained
3. Include both positive and negative test cases
4. Document the expected behavior clearly 