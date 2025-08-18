/**
 * @fileoverview TAIP-12 Name Hashing Implementation
 * 
 * This module provides utilities for generating SHA-256 hashes of participant names
 * according to the TAIP-12 specification for privacy-preserving name matching.
 * 
 * The implementation follows the exact normalization and hashing method used by
 * VerifyVASP and GTR networks to ensure cross-platform compatibility.
 * 
 * @see {@link https://github.com/TransactionAuthorizationProtocol/TAIPs/blob/main/TAIPs/taip-12.md | TAIP-12: Privacy-Preserving Name Matching}
 */

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
 * Generates a SHA-256 hash of a normalized name according to TAIP-12 specification.
 * 
 * This function:
 * 1. Normalizes the name (removes whitespace, converts to uppercase)
 * 2. Encodes the normalized string as UTF-8
 * 3. Computes SHA-256 hash
 * 4. Returns the hash as a lowercase hexadecimal string (64 characters)
 * 
 * The implementation uses runtime detection to support both browser and Node.js environments:
 * - Uses Web Crypto API (`globalThis.crypto.subtle`) when available (browsers, Node.js 15+)
 * - Falls back to Node.js built-in `crypto` module for older Node.js versions
 * 
 * @param name - The name to hash (will be normalized automatically)
 * @returns Promise that resolves to the SHA-256 hash as a lowercase hex string
 * @throws Error if no crypto implementation is available
 * 
 * @example
 * ```typescript
 * // These examples match the TAIP-12 specification test vectors
 * await generateNameHash("Alice Lee")  // Returns "b117f44426c9670da91b563db728cd0bc8bafa7d1a6bb5e764d1aad2ca25032e"
 * await generateNameHash("Bob Smith")  // Returns "5432e86b4d4a3a2b4be57b713b12c5c576c88459fe1cfdd760fd6c99a0e06686"
 * 
 * // Usage in TAP message
 * const originator: Person = {
 *   "@id": "did:example:alice",
 *   "@type": "https://schema.org/Person",
 *   nameHash: await generateNameHash("Alice Lee")
 * };
 * ```
 */
export async function generateNameHash(name: string): Promise<string> {
  const normalized = normalizeForHashing(name);
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