import { Injectable } from '@nestjs/common';

import { GoogleGenAI } from "@google/genai";

import { BasicPromptDto } from './dtos/basic-prompt.dto';


@Injectable()
export class GeminiService {
    
    private ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    async basicPrompt( basicPromptDto: BasicPromptDto ) {
        const response = await this.ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: basicPromptDto.prompt,
            config: {
                systemInstruction: 'Responde unicamente en español, en formato markdown',
            },
        });

        return response.text;
    }


}
