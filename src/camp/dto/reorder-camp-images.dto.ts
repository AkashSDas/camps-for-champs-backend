import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class ReorderCampImagesDto {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
