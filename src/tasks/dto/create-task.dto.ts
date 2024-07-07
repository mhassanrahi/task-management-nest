import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({
    message: 'Please enter a title',
  })
  title: string;

  @IsNotEmpty({
    message: 'Please enter a description',
  })
  description: string;
}
