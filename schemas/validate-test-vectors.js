#!/usr/bin/env node

/**
 * Validation script for TAP JSON schemas against test vectors
 * 
 * This script:
 * 1. Loads all JSON schemas from the schemas directory
 * 2. Loads all test vectors from the test-vectors directory
 * 3. Validates each test vector against its corresponding schema
 * 4. Reports validation results
 */

const fs = require('fs');
const path = require('path');
const Ajv2020 = require('ajv/dist/2020');
const addFormats = require('ajv-formats');

// Initialize AJV with 2020-12 draft support
const ajv = new Ajv2020({
  strict: false,
  allErrors: true,
  verbose: true,
  loadSchema: loadSchema
});

// Add format validators (email, date-time, etc.)
addFormats(ajv);

// Schema cache
const schemas = {};

/**
 * Load a schema by its $id
 */
async function loadSchema(uri) {
  // Check if it's a local schema reference
  if (uri.startsWith('https://taips.tap.rsvp/schemas/')) {
    const schemaPath = uri.replace('https://taips.tap.rsvp/schemas/', '');
    const fullPath = path.join(__dirname, schemaPath);
    
    if (fs.existsSync(fullPath)) {
      const schema = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      return schema;
    }
  }
  
  // For relative references within schemas
  if (uri.startsWith('../')) {
    // This will be resolved relative to the current schema being compiled
    // AJV handles this internally
    return null;
  }
  
  throw new Error(`Cannot load schema: ${uri}`);
}

/**
 * Load all schemas from the schemas directory
 */
function loadAllSchemas() {
  const schemasDir = __dirname;
  
  function loadSchemasFromDir(dir, basePath = '') {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const relativePath = path.join(basePath, file);
      
      if (fs.statSync(fullPath).isDirectory()) {
        // Skip node_modules
        if (file === 'node_modules') return;
        loadSchemasFromDir(fullPath, relativePath);
      } else if (file.endsWith('.json')) {
        try {
          const schema = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
          if (schema.$id && !schema.$id.includes('node_modules')) {
            schemas[schema.$id] = schema;
            ajv.addSchema(schema, schema.$id);
          }
        } catch (error) {
          console.error(`Error loading schema ${fullPath}:`, error.message);
        }
      }
    });
  }
  
  loadSchemasFromDir(schemasDir);
  console.log(`Loaded ${Object.keys(schemas).length} schemas`);
}

/**
 * Map test vector files to their corresponding schemas
 */
const testVectorToSchemaMap = {
  'valid-transfer.json': 'https://taips.tap.rsvp/schemas/messages/transfer.json',
  'valid-payment.json': 'https://taips.tap.rsvp/schemas/messages/payment.json',
  'valid-payment-fiat.json': 'https://taips.tap.rsvp/schemas/messages/payment.json',
  'valid-authorize.json': 'https://taips.tap.rsvp/schemas/messages/authorize.json',
  'valid-settle.json': 'https://taips.tap.rsvp/schemas/messages/settle.json',
  'valid-reject.json': 'https://taips.tap.rsvp/schemas/messages/reject.json',
  'valid-cancel.json': 'https://taips.tap.rsvp/schemas/messages/cancel.json',
  'valid-revert.json': 'https://taips.tap.rsvp/schemas/messages/revert.json',
  'valid-update-agent.json': 'https://taips.tap.rsvp/schemas/messages/update-agent.json',
  'valid-update-party.json': 'https://taips.tap.rsvp/schemas/messages/update-party.json',
  'valid-add-agents.json': 'https://taips.tap.rsvp/schemas/messages/add-agents.json',
  'valid-replace-agent.json': 'https://taips.tap.rsvp/schemas/messages/replace-agent.json',
  'valid-remove-agent.json': 'https://taips.tap.rsvp/schemas/messages/remove-agent.json',
  'valid-confirm-relationship.json': 'https://taips.tap.rsvp/schemas/messages/confirm-relationship.json',
  'valid-update-policies.json': 'https://taips.tap.rsvp/schemas/messages/update-policies.json',
  'valid-connect.json': 'https://taips.tap.rsvp/schemas/messages/connect.json',
  'valid-authorization-required.json': 'https://taips.tap.rsvp/schemas/messages/authorization-required.json',
  'valid-connection-termination.json': 'https://taips.tap.rsvp/schemas/messages/cancel.json',
};

/**
 * Validate test vectors
 */
async function validateTestVectors() {
  const testVectorsDir = path.join(__dirname, '..', 'test-vectors');
  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };
  
  const files = fs.readdirSync(testVectorsDir);
  
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    
    const schemaId = testVectorToSchemaMap[file];
    if (!schemaId) {
      console.log(`⚠️  Skipping ${file} - no schema mapping found`);
      results.skipped++;
      continue;
    }
    
    try {
      const testVectorPath = path.join(testVectorsDir, file);
      const testVector = JSON.parse(fs.readFileSync(testVectorPath, 'utf8'));
      
      // Get the compiled validator
      const validate = ajv.getSchema(schemaId);
      if (!validate) {
        throw new Error(`Schema ${schemaId} not found`);
      }
      
      // Validate the full DIDComm message
      const valid = validate(testVector);
      
      if (valid) {
        console.log(`✅ ${file} - PASSED`);
        results.passed++;
      } else {
        console.log(`❌ ${file} - FAILED`);
        console.log('   Errors:', JSON.stringify(validate.errors, null, 2));
        results.failed++;
        results.errors.push({
          file,
          errors: validate.errors
        });
      }
    } catch (error) {
      console.log(`❌ ${file} - ERROR: ${error.message}`);
      results.failed++;
      results.errors.push({
        file,
        error: error.message
      });
    }
  }
  
  return results;
}

/**
 * Main execution
 */
async function main() {
  console.log('TAP Schema Validation Tool');
  console.log('');
  
  console.log('Loading schemas...');
  loadAllSchemas();
  console.log('');
  
  console.log('Validating test vectors...');
  const results = await validateTestVectors();
  console.log('');
  
  console.log('==================================================');
  console.log('VALIDATION SUMMARY');
  console.log('==================================================');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️  Skipped: ${results.skipped}`);
  console.log(`📊 Total: ${results.passed + results.failed + results.skipped}`);
  
  if (results.errors.length > 0) {
    console.log('');
    console.log('ERRORS:');
    results.errors.forEach(({ file, errors, error }) => {
      console.log(`\n${file}:`);
      if (error) {
        console.log(`  ${error}`);
      } else if (errors) {
        errors.forEach(err => {
          console.log(`  - ${err.instancePath || '/'}: ${err.message}`);
          if (err.params) {
            console.log(`    params: ${JSON.stringify(err.params)}`);
          }
        });
      }
    });
  }
  
  // Exit with error code if there were failures
  if (results.failed > 0) {
    process.exit(1);
  }
}

// Run the validation
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});