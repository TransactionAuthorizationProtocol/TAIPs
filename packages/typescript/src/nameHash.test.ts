/**
 * @fileoverview Tests for TAIP-12 Name Hashing Implementation
 * 
 * These tests verify the name normalization and hashing functions comply with
 * the TAIP-12 specification and produce the correct hash values for interoperability
 * with VerifyVASP and GTR networks.
 * 
 * Enhanced with fast-check property-based testing and IVMS101 integration tests.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as ivms101 from 'ivms101/src/arbitraries';
import { normalizeForHashing, generateNameHash } from './nameHash';
import type { IVMS101_2020, IVMS101_2023 } from 'ivms101';

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

describe('IVMS101 Integration', () => {
  describe('generateNameHash with IVMS101 2020 originators', () => {
    it('should handle natural person originators', async () => {
      const originator: IVMS101_2020.Originator = {
        originatorPersons: [
          {
            naturalPerson: {
              name: [
                {
                  primaryIdentifier: "Lee",
                  secondaryIdentifier: "Alice", 
                  nameIdentifierType: "LEGL"
                }
              ]
            }
          }
        ]
      };

      const hash = await generateNameHash(originator);
      const expectedHash = await generateNameHash("Alice Lee");
      expect(hash).toBe(expectedHash);
    });

    it('should handle legal person originators', async () => {
      const originator: IVMS101_2020.Originator = {
        originatorPersons: [
          {
            legalPerson: {
              name: [
                {
                  legalPersonName: "Acme Corporation",
                  legalPersonNameIdentifierType: "LEGL"
                }
              ]
            }
          }
        ]
      };

      const hash = await generateNameHash(originator);
      const expectedHash = await generateNameHash("Acme Corporation");
      expect(hash).toBe(expectedHash);
    });

    it('should handle multiple persons in originator', async () => {
      const originator: IVMS101_2020.Originator = {
        originatorPersons: [
          {
            naturalPerson: {
              name: [
                {
                  primaryIdentifier: "Smith",
                  secondaryIdentifier: "John",
                  nameIdentifierType: "LEGL"
                }
              ]
            }
          },
          {
            legalPerson: {
              name: [
                {
                  legalPersonName: "Tech Corp",
                  legalPersonNameIdentifierType: "LEGL"
                }
              ]
            }
          }
        ]
      };

      const hash = await generateNameHash(originator);
      const expectedHash = await generateNameHash("John Smith Tech Corp");
      expect(hash).toBe(expectedHash);
    });

    it('should prefer legal names over other name types', async () => {
      const originator: IVMS101_2020.Originator = {
        originatorPersons: [
          {
            naturalPerson: {
              name: [
                {
                  primaryIdentifier: "Doe",
                  secondaryIdentifier: "Johnny",
                  nameIdentifierType: "ALIA"
                },
                {
                  primaryIdentifier: "Doe",
                  secondaryIdentifier: "John",
                  nameIdentifierType: "LEGL"
                }
              ]
            }
          }
        ]
      };

      const hash = await generateNameHash(originator);
      const expectedHash = await generateNameHash("John Doe");
      expect(hash).toBe(expectedHash);
    });
  });

  describe('generateNameHash with IVMS101 2020 beneficiaries', () => {
    it('should handle natural person beneficiaries', async () => {
      const beneficiary: IVMS101_2020.Beneficiary = {
        beneficiaryPersons: [
          {
            naturalPerson: {
              name: [
                {
                  primaryIdentifier: "Smith",
                  secondaryIdentifier: "Bob",
                  nameIdentifierType: "LEGL"
                }
              ]
            }
          }
        ]
      };

      const hash = await generateNameHash(beneficiary);
      const expectedHash = await generateNameHash("Bob Smith");
      expect(hash).toBe(expectedHash);
    });

    it('should handle legal person beneficiaries', async () => {
      const beneficiary: IVMS101_2020.Beneficiary = {
        beneficiaryPersons: [
          {
            legalPerson: {
              name: [
                {
                  legalPersonName: "Global Bank Ltd",
                  legalPersonNameIdentifierType: "LEGL"
                }
              ]
            }
          }
        ]
      };

      const hash = await generateNameHash(beneficiary);
      const expectedHash = await generateNameHash("Global Bank Ltd");
      expect(hash).toBe(expectedHash);
    });
  });

  describe('generateNameHash with IVMS101 2023 structures', () => {
    it('should handle 2023 originator format', async () => {
      const originator: IVMS101_2023.Originator = {
        originatorPerson: [
          {
            naturalPerson: {
              name: [
                {
                  primaryIdentifier: "Williams",
                  secondaryIdentifier: "Sarah",
                  naturalPersonNameIdentifierType: "LEGL"
                }
              ]
            }
          }
        ]
      };

      const hash = await generateNameHash(originator);
      const expectedHash = await generateNameHash("Sarah Williams");
      expect(hash).toBe(expectedHash);
    });

    it('should handle 2023 beneficiary format', async () => {
      const beneficiary: IVMS101_2023.Beneficiary = {
        beneficiaryPerson: [
          {
            legalPerson: {
              name: [
                {
                  legalPersonName: "Future Finance Inc",
                  legalPersonNameIdentifierType: "LEGL"
                }
              ]
            }
          }
        ]
      };

      const hash = await generateNameHash(beneficiary);
      const expectedHash = await generateNameHash("Future Finance Inc");
      expect(hash).toBe(expectedHash);
    });
  });

  describe('edge cases', () => {
    it('should handle empty name arrays', async () => {
      const originator: IVMS101_2020.Originator = {
        originatorPersons: [
          {
            naturalPerson: {
              name: []
            }
          }
        ]
      };

      const hash = await generateNameHash(originator);
      const expectedHash = await generateNameHash(""); // Empty string hash
      expect(hash).toBe(expectedHash);
    });

    it('should handle missing name identifiers', async () => {
      const beneficiary: IVMS101_2020.Beneficiary = {
        beneficiaryPersons: [
          {
            naturalPerson: {
              name: [
                {
                  primaryIdentifier: "OnlyPrimary",
                  nameIdentifierType: "LEGL"
                }
              ]
            }
          }
        ]
      };

      const hash = await generateNameHash(beneficiary);
      const expectedHash = await generateNameHash("OnlyPrimary");
      expect(hash).toBe(expectedHash);
    });

    it('should throw error for invalid input types', async () => {
      await expect(generateNameHash({} as any)).rejects.toThrow(
        'Invalid input type. Expected string, IVMS101 Originator, or IVMS101 Beneficiary'
      );
    });
  });
});

describe('Property-Based Testing with IVMS101', () => {
  it('should always produce 64-character hex strings for generated originators', () => {
    fc.assert(
      fc.asyncProperty(ivms101.originator(), async (originator) => {
        const hash = await generateNameHash(originator);
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
        expect(hash.length).toBe(64);
      })
    );
  });

  it('should always produce 64-character hex strings for generated beneficiaries', () => {
    fc.assert(
      fc.asyncProperty(ivms101.beneficiary(), async (beneficiary) => {
        const hash = await generateNameHash(beneficiary);
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
        expect(hash.length).toBe(64);
      })
    );
  });

  it('should always produce 64-character hex strings for IVMS101 2023 originators', () => {
    fc.assert(
      fc.asyncProperty(ivms101.originator2023(), async (originator) => {
        const hash = await generateNameHash(originator);
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
        expect(hash.length).toBe(64);
      })
    );
  });

  it('should always produce 64-character hex strings for IVMS101 2023 beneficiaries', () => {
    fc.assert(
      fc.asyncProperty(ivms101.beneficiary2023(), async (beneficiary) => {
        const hash = await generateNameHash(beneficiary);
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
        expect(hash.length).toBe(64);
      })
    );
  });

  it('should produce consistent hashes for equivalent name strings', () => {
    fc.assert(
      fc.asyncProperty(ivms101.naturalPersonNameId(), async (nameId) => {
        // Build name string manually
        const parts: string[] = [];
        if (nameId.secondaryIdentifier) {
          parts.push(nameId.secondaryIdentifier);
        }
        parts.push(nameId.primaryIdentifier);
        const nameString = parts.join(' ');

        // Create IVMS101 structure with same name
        const originator: IVMS101_2020.Originator = {
          originatorPersons: [
            {
              naturalPerson: {
                name: [nameId]
              }
            }
          ]
        };

        const stringHash = await generateNameHash(nameString);
        const structureHash = await generateNameHash(originator);
        
        expect(stringHash).toBe(structureHash);
      })
    );
  });

  it('should handle all natural person name types correctly', () => {
    fc.assert(
      fc.asyncProperty(ivms101.naturalPerson(), async (naturalPerson) => {
        const originator: IVMS101_2020.Originator = {
          originatorPersons: [{ naturalPerson }]
        };

        const hash = await generateNameHash(originator);
        
        // Should always be a valid hash
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
        expect(hash.length).toBe(64);
        
        // Should be deterministic
        const hash2 = await generateNameHash(originator);
        expect(hash).toBe(hash2);
      })
    );
  });

  it('should handle all legal person name types correctly', () => {
    fc.assert(
      fc.asyncProperty(ivms101.legalPerson(), async (legalPerson) => {
        const beneficiary: IVMS101_2020.Beneficiary = {
          beneficiaryPersons: [{ legalPerson }]
        };

        const hash = await generateNameHash(beneficiary);
        
        // Should always be a valid hash
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
        expect(hash.length).toBe(64);
        
        // Should be deterministic
        const hash2 = await generateNameHash(beneficiary);
        expect(hash).toBe(hash2);
      })
    );
  });

  it('should normalize names consistently across input types', () => {
    fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        async (nameString) => {
          // Create an IVMS101 structure with the same name
          const originator: IVMS101_2020.Originator = {
            originatorPersons: [
              {
                naturalPerson: {
                  name: [
                    {
                      primaryIdentifier: nameString,
                      nameIdentifierType: "LEGL"
                    }
                  ]
                }
              }
            ]
          };

          const stringHash = await generateNameHash(nameString);
          const structureHash = await generateNameHash(originator);
          
          expect(stringHash).toBe(structureHash);
        }
      )
    );
  });
});

describe('Performance and Edge Cases', () => {
  it('should handle large numbers of persons efficiently', async () => {
    // Create an originator with many persons
    const manyPersons: IVMS101_2020.Person[] = Array.from({ length: 100 }, (_, i) => ({
      naturalPerson: {
        name: [
          {
            primaryIdentifier: `Person${i}`,
            nameIdentifierType: "LEGL"
          }
        ]
      }
    }));

    const originator: IVMS101_2020.Originator = {
      originatorPersons: manyPersons
    };

    const start = Date.now();
    const hash = await generateNameHash(originator);
    const duration = Date.now() - start;

    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(duration).toBeLessThan(1000); // Should complete within 1 second
  });

  it('should handle Unicode names correctly', async () => {
    const unicodeNames = [
      "李小明",      // Chinese
      "محمد علي",    // Arabic  
      "José María",  // Spanish
      "Владимир",    // Russian
      "田中太郎"      // Japanese
    ];

    for (const name of unicodeNames) {
      const originator: IVMS101_2020.Originator = {
        originatorPersons: [
          {
            naturalPerson: {
              name: [
                {
                  primaryIdentifier: name,
                  nameIdentifierType: "LEGL"
                }
              ]
            }
          }
        ]
      };

      const stringHash = await generateNameHash(name);
      const structureHash = await generateNameHash(originator);
      
      expect(stringHash).toBe(structureHash);
      expect(stringHash).toMatch(/^[0-9a-f]{64}$/);
    }
  });
});