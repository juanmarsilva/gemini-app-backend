import { IsString, IsNotEmpty } from "class-validator";

export class PokemonHelperDto {
    @IsString()
    @IsNotEmpty()
    name:            string;
};


