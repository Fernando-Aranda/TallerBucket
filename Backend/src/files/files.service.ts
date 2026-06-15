import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import 'multer';

@Injectable()
export class FilesService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow<string>('AWS_BUCKET_NAME');

    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>('AWS_REGION'),
      endpoint: this.configService.getOrThrow<string>('AWS_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
      },
      forcePathStyle: true,
    });
  }

  // 1. Subir archivo a S3
  async uploadFile(file: Express.Multer.File) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(command);
      return { message: 'Archivo cargado con éxito', filename: file.originalname };
    } catch (error) {
      throw new InternalServerErrorException('Error al subir el archivo a LocalStack', error.message);
    }
  }

  // 2. Obtener los últimos 3 archivos ordenados por fecha de modificación
  async getLatestFiles() {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
    });

    try {
      const response = await this.s3Client.send(command);
      const objects = response.Contents || [];

      // Solución: Usamos ?. y || 0 para evitar errores si LastModified es undefined
      return objects
        .sort((a, b) => (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0))
        .slice(0, 3)
        .map((obj) => ({
          name: obj.Key,
          size: obj.Size,
          lastModified: obj.LastModified,
        }));
    } catch (error) {
      throw new InternalServerErrorException('Error al listar archivos', error.message);
    }
  }

  // 3. Descargar un archivo (retorna el Stream)
  async downloadFile(key: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      const response = await this.s3Client.send(command);
      return response.Body as Readable;
    } catch (error) {
      throw new InternalServerErrorException('Error al descargar el archivo', error.message);
    }
  }
}