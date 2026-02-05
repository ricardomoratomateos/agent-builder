export interface Agent {
  _id: string;
  name: string;
  description?: string;
  config?: Record<string, any>;
  metadata?: Record<string, any>;
  status: string;
  workflowId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAgentDto {
  name: string;
  description?: string;
  config?: Record<string, any>;
  metadata?: Record<string, any>;
  status?: string;
  workflowId?: string;
}
