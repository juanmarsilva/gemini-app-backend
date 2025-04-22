import { Injectable } from '@nestjs/common';

import { GoogleGenAI } from "@google/genai";

import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { basicPromptUseCase } from './use-cases/basic-prompt.use-case';
import { basicPromptStreamUseCase } from './use-cases/basic-prompt-stream.use-case';


@Injectable()
export class GeminiService {
    
    private ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    async basicPrompt( basicPromptDto: BasicPromptDto ) {
        return basicPromptUseCase( this.ai, basicPromptDto );
    };
    
    async basicPromptStream( basicPromptDto: BasicPromptDto ) {
        return basicPromptStreamUseCase( this.ai, basicPromptDto );
    };

}
