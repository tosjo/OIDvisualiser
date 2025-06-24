export interface OIDNode {
  id: string;
  oid: string;
  name: string;
  description?: string;
  children?: OIDNode[];
  parent?: string;
}
