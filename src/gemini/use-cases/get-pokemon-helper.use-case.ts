import { GoogleGenAI } from "@google/genai";

import { PokemonHelperDto } from "../dtos/pokemon-helper.dto";

export interface PokemonResponse {
    [pokemonId: string]: string;
};

export const getPokemonHelperUseCase = async ( ai: GoogleGenAI, pokemonHelperDto: PokemonHelperDto ) => {
    const { name } = pokemonHelperDto;

    const geminiResponse = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `El pokemon a vencer es ${ name }`,
        config: {
            responseMimeType: 'application/json',
            systemInstruction: `
                Eres un Pokedex, que da recomendaciones de Pokémon para combatir contra otros Pokémon.
                Responde en un JSON, con el ID del pokemon y un ataque súper efectivo contra el Pokémon que se te da.
                Siempre responde 4 pokemons
                Este es el formato de respuesta:
                {
                1: 'tackle',
                20: 'quick-attack',
                23: 'thunderbolt',
                25: 'thunder'
                }
                
                Sólo retorna el objeto JSON, no des explicaciones ni nada más.
            `,
        },
    });

    const response = JSON.parse( geminiResponse.text ?? '{}' );

    return response as PokemonResponse;
};