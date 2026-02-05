import { Injectable } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';

@Injectable()
export class VectorService {
  private client: QdrantClient;

  constructor() {
    this.client = new QdrantClient({
      url: process.env.QDRANT_URL || 'http://localhost:6333',
      apiKey: process.env.QDRANT_API_KEY,
    });
  }

  async createCollection(collectionName: string, vectorSize: number) {
    return await this.client.createCollection(collectionName, {
      vectors: { size: vectorSize, distance: 'Cosine' },
    });
  }

  async upsertPoints(collectionName: string, points: any[]) {
    return await this.client.upsert(collectionName, {
      wait: true,
      points,
    });
  }

  async search(collectionName: string, vector: number[], limit: number = 10) {
    return await this.client.search(collectionName, {
      vector,
      limit,
    });
  }

  async deleteCollection(collectionName: string) {
    return await this.client.deleteCollection(collectionName);
  }
}
