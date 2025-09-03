/**
 * @fileoverview TAIP-12 Name Hashing Implementation
 * 
 * This module provides utilities for generating SHA-256 hashes of participant names
 * according to the TAIP-12 specification for privacy-preserving name matching.
 * 
 * The implementation follows the exact normalization and hashing method used by
 * VerifyVASP and GTR networks to ensure cross-platform compatibility.
 * 
 * Enhanced to support IVMS101 originator/beneficiary structures for seamless
 * integration with travel rule compliance systems.
 * 
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-12.md | TAIP-12: Privacy-Preserving Name Matching}
 */

import type { IVMS101_2020, IVMS101_2023 } from 'ivms101';

// Type declaration for Node.js crypto module to avoid dependency on @types/node
declare function require(name: string): any;

/**
 * Normalizes a name string for hashing according to TAIP-12 specification.
 * 
 * The normalization process:
 * 1. Removes ALL whitespace characters (spaces, tabs, newlines, etc.)
 * 2. Converts all letters to uppercase
 * 
 * This ensures consistent hashing across different systems and data formats.
 * 
 * @param name - The name string to normalize
 * @returns The normalized name string (uppercase, no whitespace)
 * 
 * @example
 * ```typescript
 * normalizeForHashing("Alice Lee")     // Returns "ALICELEE"
 * normalizeForHashing(" Bob  Smith ")  // Returns "BOBSMITH"
 * normalizeForHashing("maría garcía")  // Returns "MARÍAGARCÍA"
 * ```
 */
export function normalizeForHashing(name: string): string {
  return name.replace(/\s+/g, '').toUpperCase();
}

/**
 * Extracts the full name from an IVMS101 natural person structure.
 * 
 * Combines the primaryIdentifier and secondaryIdentifier from the first
 * name entry with nameIdentifierType of "LEGL" (legal name), falling back
 * to the first available name entry if no legal name is found.
 * 
 * @param naturalPerson - IVMS101 natural person object
 * @returns The full name string or empty string if no name is found
 * 
 * @example
 * ```typescript
 * const person: IVMS101_2020.NaturalPerson = {
 *   name: [
 *     {
 *       primaryIdentifier: "Smith",
 *       secondaryIdentifier: "John",
 *       nameIdentifierType: "LEGL"
 *     }
 *   ]
 * };
 * 
 * extractNaturalPersonName(person); // Returns "John Smith"
 * ```
 */
function extractNaturalPersonName(naturalPerson: IVMS101_2020.NaturalPerson | IVMS101_2023.NaturalPerson): string {
  if (!naturalPerson.name || naturalPerson.name.length === 0) {
    return '';
  }

  // Prefer legal name (LEGL) if available
  const legalName = naturalPerson.name.find(n => n.nameIdentifierType === 'LEGL');
  const nameEntry = legalName || naturalPerson.name[0];

  const parts: string[] = [];
  if (nameEntry.secondaryIdentifier) {
    parts.push(nameEntry.secondaryIdentifier);
  }
  parts.push(nameEntry.primaryIdentifier);

  return parts.join(' ');
}

/**
 * Extracts the legal person name from an IVMS101 legal person structure.
 * 
 * Uses the legalPersonName from the first entry with legalPersonNameIdentifierType
 * of "LEGL" (legal name), falling back to the first available name entry.
 * 
 * @param legalPerson - IVMS101 legal person object
 * @returns The legal person name or empty string if no name is found
 * 
 * @example
 * ```typescript
 * const entity: IVMS101_2020.LegalPerson = {
 *   name: [
 *     {
 *       legalPersonName: "Acme Corporation Ltd",
 *       legalPersonNameIdentifierType: "LEGL"
 *     }
 *   ]
 * };
 * 
 * extractLegalPersonName(entity); // Returns "Acme Corporation Ltd"
 * ```
 */
function extractLegalPersonName(legalPerson: IVMS101_2020.LegalPerson | IVMS101_2023.LegalPerson): string {
  if (!legalPerson.name || legalPerson.name.length === 0) {
    return '';
  }

  // Prefer legal name (LEGL) if available
  const legalName = legalPerson.name.find(n => n.legalPersonNameIdentifierType === 'LEGL');
  const nameEntry = legalName || legalPerson.name[0];

  return nameEntry.legalPersonName;
}

/**
 * Extracts names from all persons in an IVMS101 2020 originator structure.
 * 
 * @param originator - IVMS101 2020 originator object
 * @returns Array of name strings from all persons in the originator
 * 
 * @example
 * ```typescript
 * const originator: IVMS101_2020.Originator = {
 *   originatorPersons: [
 *     {
 *       naturalPerson: {
 *         name: [{ primaryIdentifier: "Smith", secondaryIdentifier: "John", nameIdentifierType: "LEGL" }]
 *       }
 *     }
 *   ]
 * };
 * 
 * extractOriginatorNames(originator); // Returns ["John Smith"]
 * ```
 */
function extractOriginatorNames(originator: IVMS101_2020.Originator | IVMS101_2023.Originator): string[] {
  const persons = 'originatorPersons' in originator ? originator.originatorPersons : originator.originatorPerson;
  
  return persons.map(person => {
    if (person.naturalPerson) {
      return extractNaturalPersonName(person.naturalPerson);
    } else if (person.legalPerson) {
      return extractLegalPersonName(person.legalPerson);
    }
    return '';
  }).filter(name => name.length > 0);
}

/**
 * Extracts names from all persons in an IVMS101 2020 beneficiary structure.
 * 
 * @param beneficiary - IVMS101 2020 beneficiary object
 * @returns Array of name strings from all persons in the beneficiary
 * 
 * @example
 * ```typescript
 * const beneficiary: IVMS101_2020.Beneficiary = {
 *   beneficiaryPersons: [
 *     {
 *       legalPerson: {
 *         name: [{ legalPersonName: "Acme Corp", legalPersonNameIdentifierType: "LEGL" }]
 *       }
 *     }
 *   ]
 * };
 * 
 * extractBeneficiaryNames(beneficiary); // Returns ["Acme Corp"]
 * ```
 */
function extractBeneficiaryNames(beneficiary: IVMS101_2020.Beneficiary | IVMS101_2023.Beneficiary): string[] {
  const persons = 'beneficiaryPersons' in beneficiary ? beneficiary.beneficiaryPersons : beneficiary.beneficiaryPerson;
  
  return persons.map(person => {
    if (person.naturalPerson) {
      return extractNaturalPersonName(person.naturalPerson);
    } else if (person.legalPerson) {
      return extractLegalPersonName(person.legalPerson);
    }
    return '';
  }).filter(name => name.length > 0);
}

/**
 * Generates a SHA-256 hash of a normalized name according to TAIP-12 specification.
 * 
 * This function supports three input types:
 * 1. String names (original functionality)
 * 2. IVMS101 originator structures (extracts names from all persons)
 * 3. IVMS101 beneficiary structures (extracts names from all persons)
 * 
 * For IVMS101 structures with multiple persons, it combines all extracted names
 * with spaces and then normalizes the result.
 * 
 * The implementation uses runtime detection to support both browser and Node.js environments:
 * - Uses Web Crypto API (`globalThis.crypto.subtle`) when available (browsers, Node.js 15+)
 * - Falls back to Node.js built-in `crypto` module for older Node.js versions
 * 
 * @param input - The name string or IVMS101 originator/beneficiary structure to hash
 * @returns Promise that resolves to the SHA-256 hash as a lowercase hex string
 * @throws Error if no crypto implementation is available
 * 
 * @example
 * ```typescript
 * // String names (TAIP-12 test vectors)
 * await generateNameHash("Alice Lee")  // "b117f44426c9670da91b563db728cd0bc8bafa7d1a6bb5e764d1aad2ca25032e"
 * await generateNameHash("Bob Smith")  // "5432e86b4d4a3a2b4be57b713b12c5c576c88459fe1cfdd760fd6c99a0e06686"
 * 
 * // IVMS101 originator
 * const originator: IVMS101_2020.Originator = {
 *   originatorPersons: [
 *     {
 *       naturalPerson: {
 *         name: [{ primaryIdentifier: "Lee", secondaryIdentifier: "Alice", nameIdentifierType: "LEGL" }]
 *       }
 *     }
 *   ]
 * };
 * await generateNameHash(originator)  // Same hash as "Alice Lee"
 * 
 * // IVMS101 beneficiary  
 * const beneficiary: IVMS101_2020.Beneficiary = {
 *   beneficiaryPersons: [
 *     {
 *       legalPerson: {
 *         name: [{ legalPersonName: "Acme Corporation", legalPersonNameIdentifierType: "LEGL" }]
 *       }
 *     }
 *   ]
 * };
 * await generateNameHash(beneficiary)  // Hash of "Acme Corporation"
 * ```
 */
export async function generateNameHash(
  input: string | IVMS101_2020.Originator | IVMS101_2023.Originator | IVMS101_2020.Beneficiary | IVMS101_2023.Beneficiary
): Promise<string> {
  let nameToHash: string;

  if (typeof input === 'string') {
    nameToHash = input;
  } else if ('originatorPersons' in input || 'originatorPerson' in input) {
    // IVMS101 Originator structure
    const names = extractOriginatorNames(input);
    nameToHash = names.join(' ');
  } else if ('beneficiaryPersons' in input || 'beneficiaryPerson' in input) {
    // IVMS101 Beneficiary structure  
    const names = extractBeneficiaryNames(input);
    nameToHash = names.join(' ');
  } else {
    throw new Error('Invalid input type. Expected string, IVMS101 Originator, or IVMS101 Beneficiary');
  }

  const normalized = normalizeForHashing(nameToHash);
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  
  let hash: ArrayBuffer;
  
  // Check for Web Crypto API (modern browsers and Node.js 15+)
  if (typeof globalThis !== 'undefined' && 
      'crypto' in globalThis && 
      globalThis.crypto && 
      'subtle' in globalThis.crypto) {
    hash = await globalThis.crypto.subtle.digest('SHA-256', data);
  } 
  // Fallback to Node.js crypto module for older Node.js versions
  else {
    try {
      // Check if we're in Node.js environment and import crypto
      // Use eval to avoid TypeScript compile-time module resolution
      const importFunc = new Function('specifier', 'return import(specifier)');
      const crypto = await importFunc('crypto');
      const hashBuffer = crypto.createHash('sha256').update(data).digest();
      hash = hashBuffer.buffer.slice(hashBuffer.byteOffset, hashBuffer.byteOffset + hashBuffer.byteLength);
    } catch (error) {
      throw new Error('No crypto implementation available. This environment does not support Web Crypto API or Node.js crypto module.');
    }
  }
  
  // Convert ArrayBuffer to lowercase hex string
  return Array.from(new Uint8Array(hash))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}