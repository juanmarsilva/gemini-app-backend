import { GoogleGenAI } from "@google/genai";

import { TriviaQuestionDto } from "../dtos/trivia-question.dto";

export interface TriviaQuestionResponse {
    question:        string;
    answers:         Array<string>;
    correctAnswer:   number;
};

export const getTriviaQuestionUseCase = async ( ai: GoogleGenAI, triviaQuestionDto: TriviaQuestionDto ) => {
    const { topic } = triviaQuestionDto;

    const geminiResponse = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Dame una pregunta de conocimiento general sobre el tema: ${ topic }`,
        config: {
            responseMimeType: 'application/json',
            systemInstruction: `
                Eres un generador de trivias, se te pedirán preguntas de conocimiento general
                y debes de generar 3 respuestas incorrectas y una correcta
                El indice debe de variar de posición, de vez en cuando genera una pregunta súper complicada de responder
                    {
                        question: "aquí es donde va la pregunta general"
                        answers: [
                            "answer 1",
                            "answer 2",
                            "answer 3",
                            "answer 4",
                        ],
                        correctAnswer: indice del arreglo
                    }
                Sólo retorna el objeto JSON, no des explicaciones ni nada más.
            `,
        },
    });

    const response = JSON.parse( geminiResponse.text ?? '{}' );

    return response as TriviaQuestionResponse;
};