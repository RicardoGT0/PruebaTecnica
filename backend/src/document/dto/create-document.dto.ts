import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty()
  tipo: string;
  @ApiProperty()
  nombre_archivo: string;
  @ApiProperty()
  meta: string;
  @ApiProperty()
  fecha_emision: Date;
  @ApiProperty()
  fecha_vencimiento: Date;
  @ApiProperty()
  comentario_revisor: string;
  @ApiProperty()
  estado: string;
}
