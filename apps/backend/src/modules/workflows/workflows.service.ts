import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workflow, WorkflowDocument } from './schemas/workflow.schema';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(@InjectModel(Workflow.name) private workflowModel: Model<WorkflowDocument>) {}

  async create(createWorkflowDto: CreateWorkflowDto): Promise<Workflow> {
    const createdWorkflow = new this.workflowModel(createWorkflowDto);
    return createdWorkflow.save();
  }

  async findAll(): Promise<Workflow[]> {
    return this.workflowModel.find().exec();
  }

  async findOne(id: string): Promise<Workflow> {
    const workflow = await this.workflowModel.findById(id).exec();
    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }
    return workflow;
  }

  async update(id: string, updateWorkflowDto: UpdateWorkflowDto): Promise<Workflow> {
    const updatedWorkflow = await this.workflowModel
      .findByIdAndUpdate(id, updateWorkflowDto, { new: true })
      .exec();
    if (!updatedWorkflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }
    return updatedWorkflow;
  }

  async remove(id: string): Promise<void> {
    const result = await this.workflowModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }
  }

  async publish(id: string): Promise<Workflow> {
    const draft = await this.findOne(id);

    // Check if a production version already exists for this workflow
    const existingProduction = await this.workflowModel
      .findOne({ parentId: id, version: 'production' })
      .exec();

    if (existingProduction) {
      // Update existing production version
      existingProduction.name = draft.name;
      existingProduction.description = draft.description;
      existingProduction.nodes = draft.nodes;
      existingProduction.edges = draft.edges;
      existingProduction.config = draft.config;
      existingProduction.updatedAt = new Date();
      return existingProduction.save();
    } else {
      // Create new production version
      const production = new this.workflowModel({
        name: draft.name,
        description: draft.description,
        nodes: draft.nodes,
        edges: draft.edges,
        config: draft.config,
        version: 'production',
        parentId: id,
      });
      return production.save();
    }
  }
}
