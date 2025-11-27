export interface OidEntry {
  oid: string
  name: string
  description?: string
  comments?: string
  asnNotation?: string
  iriNotation?: string
  createdAt: string
  modifiedAt: string
}

export interface OidDataStore {
  version: string
  lastModified: string
  entries: OidEntry[]
}

export interface OidTreeNode {
  oid: string
  name: string
  entry?: OidEntry
  children: OidTreeNode[]
  expanded: boolean
}
