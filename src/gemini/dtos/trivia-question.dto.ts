import { IsString, IsNotEmpty } from "class-validator";

export class TriviaQuestionDto {
    @IsString()
    @IsNotEmpty()
    topic:            string;
};


