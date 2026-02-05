import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Node, NodeDocument } from './schemas/node.schema';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';

@Injectable()
export class NodesService {
  constructor(@InjectModel(Node.name) private nodeModel: Model<NodeDocument>) {}

  async create(createNodeDto: CreateNodeDto): Promise<Node> {
    const createdNode = new this.nodeModel(createNodeDto);
    return createdNode.save();
  }

  async findAll(): Promise<Node[]> {
    return this.nodeModel.find().exec();
  }

  async findOne(id: string): Promise<Node> {
    const node = await this.nodeModel.findById(id).exec();
    if (!node) {
      throw new NotFoundException(`Node with ID ${id} not found`);
    }
    return node;
  }

  async update(id: string, updateNodeDto: UpdateNodeDto): Promise<Node> {
    const updatedNode = await this.nodeModel
      .findByIdAndUpdate(id, updateNodeDto, { new: true })
      .exec();
    if (!updatedNode) {
      throw new NotFoundException(`Node with ID ${id} not found`);
    }
    return updatedNode;
  }

  async remove(id: string): Promise<void> {
    const result = await this.nodeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Node with ID ${id} not found`);
    }
  }
}
