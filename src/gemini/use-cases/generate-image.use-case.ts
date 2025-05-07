import * as path from "path";
import * as fs from 'node:fs';

import { 
    ContentListUnion, 
    createPartFromUri, 
    GenerateContentParameters, 
    GoogleGenAI, 
    Modality,
} from "@google/genai";

import { v4 as uuidV4 } from 'uuid';

import { geminiUploadFiles } from "../helpers/gemini-upload-file";
import { GenerateImageDto } from "../dtos/generate-image.dto";

const AI_IMAGES_PATH = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'public/ai-images',
);

type Options = Partial<Omit<GenerateContentParameters, 'contents'>>;

interface GenerateImageOptions extends Options {};

export interface GenerateImageResponse {
    imageUrl:   string;
    text:       string;
};

export const generateImageUseCase = async ( 
    ai: GoogleGenAI,
    generateImageDto: GenerateImageDto,
    options?: GenerateImageOptions,
): Promise<GenerateImageResponse> => {
    const { model = "gemini-2.0-flash-exp-image-generation" } = options ?? {};

    const { prompt, files = [] } = generateImageDto;

    const config = { ...options?.config };

    const contents: ContentListUnion = [{ text: prompt }];
        
    const uploadedFiles = await geminiUploadFiles( ai, files, { transformToPNG: true });

    uploadedFiles.forEach( file => contents.push( createPartFromUri( file.uri ?? '', file.mimeType ?? '' )));
    
    const response = await ai.models.generateContent({
        model,
        contents: contents,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
          ...config,
          systemInstruction: 'Los textos o mensajes que devuelvas siempre en español.'
        },
    });

    let imageUrl = '';
    let text = '';
    const imageId = uuidV4();

    for ( const part of response.candidates?.[0].content?.parts ?? [] ) {
        if( part.text ) {
            text = part.text;
            continue;
        };
        
        if( !part.inlineData ) continue;

        const imageData = part.inlineData.data!;
        const buffer = Buffer.from( imageData, 'base64' );
        
        const imagePath = path.join(AI_IMAGES_PATH, `${ imageId }.png`);

        fs.writeFileSync( imagePath, buffer );

        imageUrl = `${ process.env.API_BASE_URL }/ai-images/${ imageId }.png`;
    };

    return { imageUrl, text };
};