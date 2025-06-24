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
              id: 'nl',
              oid: '2.16.528',
              name: 'Netherlands',
              children: [
                {
                  id: 'nl-1',
                  oid: '2.16.528.1',
                  name: 'Dutch Organizations',
                  children: [
                    {
                      id: 'nl-healthcare',
                      oid: '2.16.528.1.1003',
                      name: 'Dutch Healthcare',
                      description: 'OID arc for Dutch healthcare organizations',
                      children: [
                        {
                          id: 'nl-healthcare-1',
                          oid: '2.16.528.1.1003.1',
                          name: 'Healthcare Providers',
                          description: 'Dutch healthcare provider organizations',
                        },
                        {
                          id: 'nl-healthcare-2',
                          oid: '2.16.528.1.1003.2',
                          name: 'Healthcare Systems',
                          description: 'Dutch healthcare information systems',
                        },
                        {
                          id: 'nl-healthcare-3',
                          oid: '2.16.528.1.1003.3',
                          name: 'Custom Healthcare Arc',
                          description: 'Your custom OID arc for healthcare applications',
                          children: [
                            {
                              id: 'your-org',
                              oid: '2.16.528.1.1003.3.1',
                              name: 'Your Organization',
                              description: 'Your organization\'s OID namespace',
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
    totalNodes: 26,
    maxDepth: 8,
    lastUpdated: new Date().toISOString(),
  },
};