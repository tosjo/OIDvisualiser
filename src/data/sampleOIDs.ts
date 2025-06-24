import type { OIDTree } from '@/types';

export const sampleOIDTree: OIDTree = {
  roots: [
    {
      id: 'root-0',
      oid: '0',
      name: 'itu-t',
      description: 'ITU Telecommunication Standardization Sector',
    },
    {
      id: 'root-1',
      oid: '1',
      name: 'iso',
      description: 'International Organization for Standardization',
    },
    {
      id: 'root-2',
      oid: '2',
      name: 'joint-iso-itu-t',
      description: 'Joint ISO/ITU-T assignment',
      children: [
        {
          id: 'country',
          oid: '2.16',
          name: 'country',
          description: 'Country codes',
          children: [
            {
              id: 'nl',
              oid: '2.16.528',
              name: 'nl',
              description: 'Netherlands (the)',
              children: [
                {
                  id: 'nl-org',
                  oid: '2.16.528.1',
                  name: 'nederlandse-organisatie',
                  description: 'Dutch Organizations',
                  children: [
                    {
                      id: 'nl-overheid',
                      oid: '2.16.528.1.1003',
                      name: 'nederlandse-overheid',
                      description: 'Nederlandse overheid (Dutch Government) - Created 19 April 2001',
                      children: [
                        {
                          id: 'nl-pki',
                          oid: '2.16.528.1.1003.1',
                          name: 'pki-voor-de-overheid',
                          description: 'Public Key Infrastructure for the Dutch Government',
                        },
                        {
                          id: 'nl-belastingdienst',
                          oid: '2.16.528.1.1003.2',
                          name: 'belastingdienst',
                          description: 'Dutch Tax and Customs Administration',
                        },
                        {
                          id: 'nl-custom',
                          oid: '2.16.528.1.1003.3',
                          name: 'Your Custom Arc',
                          description: 'Available for your organization',
                          children: [],
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
              name: 'us',
              description: 'United States',
            },
          ],
        },
      ],
    },
  ],
  metadata: {
    totalNodes: 12,
    maxDepth: 7,
    lastUpdated: new Date().toISOString(),
  },
};