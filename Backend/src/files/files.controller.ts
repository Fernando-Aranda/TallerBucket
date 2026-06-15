import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

// 1. AÑADIMOS 'type' AQUÍ PARA SOLUCIONAR EL ERROR
import type { Response, Express } from 'express';

// 2. Mantenemos multer para que existan los tipos de archivo
import 'multer';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadFile(file);
  }

  @Get('latest')
  async getLatestFiles() {
    return this.filesService.getLatestFiles();
  }

  @Get('all')
  async getAllFiles() {
    return this.filesService.getAllFiles();
  }

  @Get('download/:key')
  async downloadFile(@Param('key') key: string, @Res({ passthrough: true }) res: Response) {
    const fileStream = await this.filesService.downloadFile(key);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${key}"`,
    });

    return new StreamableFile(fileStream);
  }
}