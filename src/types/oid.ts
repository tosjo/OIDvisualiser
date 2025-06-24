import { z } from 'zod';

// OID validation pattern: numbers separated by dots
const oidPattern = /^(\d+\.)*\d+$/;

// Recursive Zod schema for OID nodes
export const OIDNodeSchema: z.ZodType<OIDNode> = z.lazy(() =>
  z.object({
    id: z.string().min(1, 'ID is required'),
    oid: z.string().regex(oidPattern, 'Invalid OID format'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    children: z.array(OIDNodeSchema).optional(),
    parent: z.string().optional(),
  })
);

// TypeScript type inferred from Zod schema
export type OIDNode = {
  id: string;
  oid: string;
  name: string;
  description?: string;
  children?: OIDNode[];
  parent?: string;
};

// Schema for tree data structure
export const OIDTreeSchema = z.object({
  roots: z.array(OIDNodeSchema),
  metadata: z.object({
    totalNodes: z.number().min(0),
    maxDepth: z.number().min(0),
    lastUpdated: z.string().datetime().optional(),
  }).optional(),
});

export type OIDTree = z.infer<typeof OIDTreeSchema>;

// Schema for search results
export const OIDSearchResultSchema = z.object({
  node: OIDNodeSchema,
  path: z.array(z.string()),
  matchType: z.enum(['exact', 'name', 'oid', 'description']),
});

export type OIDSearchResult = z.infer<typeof OIDSearchResultSchema>;
