export interface Node {
  _id: string;
  type: string;
  name: string;
  description?: string;
  config?: Record<string, any>;
  position: { x: number; y: number };
  inputs: string[];
  outputs: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNodeDto {
  type: string;
  name: string;
  description?: string;
  config?: Record<string, any>;
  position?: { x: number; y: number };
  inputs?: string[];
  outputs?: string[];
}
