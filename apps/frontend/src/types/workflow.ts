export interface Workflow {
  _id: string;
  name: string;
  description?: string;
  nodes: any[];
  edges: any[];
  config?: Record<string, any>;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWorkflowDto {
  name: string;
  description?: string;
  nodes?: any[];
  edges?: any[];
  config?: Record<string, any>;
  version?: string;
}
