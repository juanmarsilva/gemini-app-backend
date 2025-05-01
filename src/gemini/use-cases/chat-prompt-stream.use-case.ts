import { Content, createPartFromUri, GenerateContentParameters, GoogleGenAI } from "@google/genai";

import { ChatPromptDto } from "../dtos/chat-prompt.dto";
import { geminiUploadFiles } from "../helpers/gemini-upload-file";

type Options = Partial<Omit<GenerateContentParameters, 'contents'>>;

interface ChatPropmptOptions extends Options {
  history: Array<Content>;
}

export const chatPromptStreamUseCase = async ( ai: GoogleGenAI, chatPromptDto: ChatPromptDto, options?: ChatPropmptOptions ) => {
  const { model = "gemini-2.0-flash", history = [] } = options ?? {};

  const { prompt, files = [] } = chatPromptDto;

  const config = {
    systemInstruction: 'Responde unicamente en español, en formato markdown',
    ...options?.config,
  };

  const uploadedFiles = await geminiUploadFiles( ai, files );

  const chat = ai.chats.create({
    model,
    config,
    history,
  });
  
  return chat.sendMessageStream({
    message: [
      prompt,
      ...uploadedFiles.map((file) => createPartFromUri(
          file.uri ?? '',
          file.mimeType ?? '',
      )),
    ]
  });
};