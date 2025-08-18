/**
 * @fileoverview Tests for TAIP-12 Name Hashing Implementation
 * 
 * These tests verify the name normalization and hashing functions comply with
 * the TAIP-12 specification and produce the correct hash values for interoperability
 * with VerifyVASP and GTR networks.
 */

import { describe, it, expect } from 'vitest';
import { normalizeForHashing, generateNameHash } from './nameHash';

describe('normalizeForHashing', () => {
  it('should remove all whitespace and convert to uppercase', () => {
    expect(normalizeForHashing('Alice Lee')).toBe('ALICELEE');
    expect(normalizeForHashing('Bob Smith')).toBe('BOBSMITH');
  });

  it('should handle multiple spaces and different whitespace types', () => {
    expect(normalizeForHashing(' Alice  Lee ')).toBe('ALICELEE');
    expect(normalizeForHashing('Bob\tSmith')).toBe('BOBSMITH');
    expect(normalizeForHashing('John\nDoe')).toBe('JOHNDOE');
    expect(normalizeForHashing('Jane\r\nSmith')).toBe('JANESMITH');
  });

  it('should preserve non-ASCII characters', () => {
    expect(normalizeForHashing('José María')).toBe('JOSÉMARÍA');
    expect(normalizeForHashing('François Müller')).toBe('FRANÇOISMÜLLER');
  });

  it('should handle non-Western scripts correctly', () => {
    // Arabic names
    expect(normalizeForHashing('محمد علي')).toBe('محمدعلي');
    expect(normalizeForHashing(' أحمد  محمد ')).toBe('أحمدمحمد');
    
    // Chinese names
    expect(normalizeForHashing('李 小明')).toBe('李小明');
    expect(normalizeForHashing('王小华')).toBe('王小华');
    
    // Korean names
    expect(normalizeForHashing('김 철수')).toBe('김철수');
    expect(normalizeForHashing('박지민')).toBe('박지민');
    
    // Japanese names  
    expect(normalizeForHashing('田中 太郎')).toBe('田中太郎');
    expect(normalizeForHashing('佐藤花子')).toBe('佐藤花子');
  });

  it('should handle edge cases', () => {
    expect(normalizeForHashing('')).toBe('');
    expect(normalizeForHashing('   ')).toBe('');
    expect(normalizeForHashing('A')).toBe('A');
    expect(normalizeForHashing('a')).toBe('A');
  });

  it('should handle names with middle names and initials', () => {
    expect(normalizeForHashing('Mary Jane Watson')).toBe('MARYJANEWATSON');
    expect(normalizeForHashing('John F. Kennedy')).toBe('JOHNF.KENNEDY');
  });
});

describe('generateNameHash', () => {
  it('should generate correct hash for TAIP-12 test vector "Alice Lee"', async () => {
    const hash = await generateNameHash('Alice Lee');
    expect(hash).toBe('b117f44426c9670da91b563db728cd0bc8bafa7d1a6bb5e764d1aad2ca25032e');
  });

  it('should generate correct hash for TAIP-12 test vector "Bob Smith"', async () => {
    const hash = await generateNameHash('Bob Smith');
    expect(hash).toBe('5432e86b4d4a3a2b4be57b713b12c5c576c88459fe1cfdd760fd6c99a0e06686');
  });

  it('should return consistent hashes for the same input', async () => {
    const hash1 = await generateNameHash('Alice Lee');
    const hash2 = await generateNameHash('Alice Lee');
    expect(hash1).toBe(hash2);
  });

  it('should produce different hashes for different names', async () => {
    const hash1 = await generateNameHash('Alice Lee');
    const hash2 = await generateNameHash('Bob Smith');
    expect(hash1).not.toBe(hash2);
  });

  it('should handle whitespace variations consistently', async () => {
    const hash1 = await generateNameHash('Alice Lee');
    const hash2 = await generateNameHash(' Alice  Lee ');
    const hash3 = await generateNameHash('Alice\tLee');
    
    expect(hash1).toBe(hash2);
    expect(hash1).toBe(hash3);
  });

  it('should handle case variations consistently', async () => {
    const hash1 = await generateNameHash('Alice Lee');
    const hash2 = await generateNameHash('alice lee');
    const hash3 = await generateNameHash('ALICE LEE');
    
    expect(hash1).toBe(hash2);
    expect(hash1).toBe(hash3);
  });

  it('should always return 64-character hex string', async () => {
    const testNames = [
      'A',
      'Alice Lee',
      'Very Long Name With Multiple Words',
      'José María García-González'
    ];

    for (const name of testNames) {
      const hash = await generateNameHash(name);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
      expect(hash.length).toBe(64);
    }
  });

  it('should handle empty string', async () => {
    const hash = await generateNameHash('');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash.length).toBe(64);
  });

  it('should handle non-ASCII characters', async () => {
    const hash1 = await generateNameHash('José María');
    const hash2 = await generateNameHash('François Müller');
    
    expect(hash1).toMatch(/^[0-9a-f]{64}$/);
    expect(hash2).toMatch(/^[0-9a-f]{64}$/);
    expect(hash1).not.toBe(hash2);
  });

  it('should handle non-Western names correctly', async () => {
    const testCases = [
      { name: 'محمد علي', description: 'Arabic name' },
      { name: '李小明', description: 'Chinese name' },
      { name: '김철수', description: 'Korean name' },
      { name: '田中太郎', description: 'Japanese name' },
      { name: 'أحمد محمد', description: 'Another Arabic name' },
      { name: '王小华', description: 'Another Chinese name' },
      { name: '박지민', description: 'Another Korean name' },
      { name: '佐藤花子', description: 'Another Japanese name' }
    ];

    const hashes = new Set<string>();
    
    for (const { name, description } of testCases) {
      const hash = await generateNameHash(name);
      
      // Verify hash format
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
      expect(hash.length).toBe(64);
      
      // Verify uniqueness (no collisions in our test set)
      expect(hashes.has(hash)).toBe(false);
      hashes.add(hash);
      
      // Test that normalization works consistently
      const hashWithSpaces = await generateNameHash(` ${name} `);
      const hashLowerCase = await generateNameHash(name.toLowerCase());
      
      expect(hash).toBe(hashWithSpaces);
      // Note: toLowerCase() behavior varies for non-Latin scripts, 
      // but our normalization uses toUpperCase() so we test that
      const hashUpperCase = await generateNameHash(name.toUpperCase());
      expect(hash).toBe(hashUpperCase);
    }
  });

  it('should handle special characters and punctuation', async () => {
    const hash1 = await generateNameHash("O'Connor");
    const hash2 = await generateNameHash('Smith-Jones');
    const hash3 = await generateNameHash('Dr. Watson');
    
    expect(hash1).toMatch(/^[0-9a-f]{64}$/);
    expect(hash2).toMatch(/^[0-9a-f]{64}$/);
    expect(hash3).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('TAIP-12 compliance', () => {
  it('should produce hashes compatible with VerifyVASP specification', async () => {
    // These test vectors should match the exact hashing algorithm used by VerifyVASP
    const testCases = [
      { name: 'Alice Lee', expected: 'b117f44426c9670da91b563db728cd0bc8bafa7d1a6bb5e764d1aad2ca25032e' },
      { name: 'Bob Smith', expected: '5432e86b4d4a3a2b4be57b713b12c5c576c88459fe1cfdd760fd6c99a0e06686' }
    ];

    for (const { name, expected } of testCases) {
      const hash = await generateNameHash(name);
      expect(hash).toBe(expected);
    }
  });

  it('should handle normalization exactly as specified in TAIP-12', async () => {
    // Test the specific normalization requirements from TAIP-12
    const variations = [
      'Alice Lee',
      ' Alice Lee ',
      '  Alice   Lee  ',
      'alice lee',
      'ALICE LEE'
    ];

    const expectedHash = 'b117f44426c9670da91b563db728cd0bc8bafa7d1a6bb5e764d1aad2ca25032e';
    
    for (const variation of variations) {
      const hash = await generateNameHash(variation);
      expect(hash).toBe(expectedHash);
    }
  });
});