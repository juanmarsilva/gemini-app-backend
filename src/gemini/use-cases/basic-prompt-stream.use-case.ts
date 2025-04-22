import { GenerateContentParameters, GoogleGenAI } from "@google/genai";

import { BasicPromptDto } from "../dtos/basic-prompt.dto";

type Options = Partial<Omit<GenerateContentParameters, 'contents'>>; 

export const basicPromptStreamUseCase = async ( ai: GoogleGenAI, basicPromptDto: BasicPromptDto, options?: Options ) => {
    const { model = "gemini-2.0-flash" } = options ?? {};

    const response = await ai.models.generateContentStream({
        model,
        contents: basicPromptDto.prompt,
        config: {
            systemInstruction: 'Responde unicamente en español, en formato markdown',
        },
    });

    return response;
};