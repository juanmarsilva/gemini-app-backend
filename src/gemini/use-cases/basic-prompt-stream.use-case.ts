import { createPartFromUri, createUserContent, GenerateContentParameters, GoogleGenAI } from "@google/genai";

import { BasicPromptDto } from "../dtos/basic-prompt.dto";
import { geminiUploadFiles } from "../helpers/gemini-upload-file";

type Options = Partial<Omit<GenerateContentParameters, 'contents'>>; 

export const basicPromptStreamUseCase = async ( ai: GoogleGenAI, basicPromptDto: BasicPromptDto, options?: Options ) => {
    const { model = "gemini-2.0-flash" } = options ?? {};
 
    const { prompt, files = [] } = basicPromptDto;
   
    const images = await geminiUploadFiles( ai, files );

    const response = await ai.models.generateContentStream({
        model,
        contents: [
            createUserContent([
                prompt,

                // Imagenes o archivos
                ...images.map((image) => createPartFromUri( image.uri ?? '', image.mimeType ?? ''))
            ])
        ],
        config: {
            systemInstruction: 'Responde unicamente en español, en formato markdown',
        },
    });

    return response;
};