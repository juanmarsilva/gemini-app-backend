import { IsString, IsNotEmpty, IsArray, IsOptional } from "class-validator";

export class GenerateImageDto {
    @IsString()
    @IsNotEmpty()
    prompt:            string;

    @IsArray()
    @IsOptional()
    files:              Array<Express.Multer.File>;
};