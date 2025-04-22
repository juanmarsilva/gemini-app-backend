import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';

import { GeminiService } from './gemini.service';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { Response } from 'express';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('basic-prompt')
  async basicPrompt( @Body() basicPromptDto: BasicPromptDto ) {
    return this.geminiService.basicPrompt( basicPromptDto );
  }
  
  @Post('basic-prompt-stream')
  async basicPromptStream( 
    @Body() basicPromptDto: BasicPromptDto,
    @Res() res: Response,

    // todo: files
  ) {
    const stream = await this.geminiService.basicPromptStream( basicPromptDto );

    res.setHeader('Content-Type', 'text/plain');
    res.status(HttpStatus.OK);

    for await ( const chunk of stream ) {
      const piece = chunk.text;
      res.write(piece);
    };

    res.end();
  }
}
