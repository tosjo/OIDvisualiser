import type { OIDTree } from '@/types';

export const sampleOIDTree: OIDTree = {
  roots: [
    {
      id: 'iso',
      oid: '1',
      name: 'ISO',
      description: 'International Organization for Standardization',
      children: [
        {
          id: 'iso-member',
          oid: '1.2',
          name: 'ISO Member Body',
          children: [
            {
              id: 'iso-us',
              oid: '1.2.840',
              name: 'US (ANSI)',
              description: 'American National Standards Institute',
              children: [
                {
                  id: 'iso-us-company',
                  oid: '1.2.840.113549',
                  name: 'RSA Data Security Inc.',
                  children: [
                    {
                      id: 'pkcs',
                      oid: '1.2.840.113549.1',
                      name: 'PKCS',
                      description: 'Public Key Cryptography Standards',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'iso-org',
          oid: '1.3',
          name: 'ISO Identified Organization',
          children: [
            {
              id: 'dod',
              oid: '1.3.6',
              name: 'US Department of Defense',
              children: [
                {
                  id: 'internet',
                  oid: '1.3.6.1',
                  name: 'Internet',
                  children: [
                    {
                      id: 'private',
                      oid: '1.3.6.1.4',
                      name: 'Private',
                      children: [
                        {
                          id: 'enterprise',
                          oid: '1.3.6.1.4.1',
                          name: 'Enterprise',
                          description: 'Private enterprise OIDs',
                        },
                      ],
                    },
                    {
                      id: 'security',
                      oid: '1.3.6.1.5',
                      name: 'Security',
                      children: [
                        {
                          id: 'mechanisms',
                          oid: '1.3.6.1.5.5',
                          name: 'Security Mechanisms',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'itu-t',
      oid: '0',
      name: 'ITU-T',
      description: 'International Telecommunication Union - Telecommunication',
      children: [
        {
          id: 'recommendation',
          oid: '0.0',
          name: 'Recommendation',
          children: [
            {
              id: 'rec-a',
              oid: '0.0.1',
              name: 'A-Series',
              description: 'Organization of the work of ITU-T',
            },
          ],
        },
        {
          id: 'admin',
          oid: '0.2',
          name: 'Administration',
        },
      ],
    },
    {
      id: 'joint',
      oid: '2',
      name: 'Joint ISO/ITU-T',
      description: 'Joint assignments by ISO and ITU-T',
      children: [
        {
          id: 'country',
          oid: '2.16',
          name: 'Country',
          children: [
            {
              id: 'us',
              oid: '2.16.840',
              name: 'United States',
            },
          ],
        },
      ],
    },
  ],
  metadata: {
    totalNodes: 19,
    maxDepth: 6,
    lastUpdated: new Date().toISOString(),
  },
};