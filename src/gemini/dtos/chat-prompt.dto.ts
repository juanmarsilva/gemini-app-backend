import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from "class-validator";

export class ChatPromptDto {
    @IsString()
    @IsNotEmpty()
    prompt:         string;

    @IsArray()
    @IsOptional()
    files:           Array<Express.Multer.File>;

    @IsUUID()
    chatId:         string;
};