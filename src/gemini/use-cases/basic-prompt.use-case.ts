import { GenerateContentParameters, GoogleGenAI } from "@google/genai";

import { BasicPromptDto } from "../dtos/basic-prompt.dto";

type Options = Partial<Omit<GenerateContentParameters, 'contents'>>; 

export const basicPromptUseCase = async ( ai: GoogleGenAI, basicPromptDto: BasicPromptDto, options?: Options ) => {
    const { model = "gemini-2.0-flash" } = options ?? {};

    const response = await ai.models.generateContent({
        model,
        contents: basicPromptDto.prompt,
        config: {
            systemInstruction: 'Responde unicamente en español, en formato markdown',
        },
    });

    return response.text;
};