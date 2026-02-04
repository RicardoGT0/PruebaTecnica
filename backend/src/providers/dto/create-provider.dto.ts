import { ApiProperty } from '@nestjs/swagger';

export class CreateProviderDto {
  @ApiProperty()
  nombre_legal: string;
  @ApiProperty()
  nombre_comercial: string;
  @ApiProperty()
  rfc: string;
  @ApiProperty()
  direccion: string;
  @ApiProperty()
  telefono: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  contacto: any;
  @ApiProperty()
  monto_estimado_anual: number;
  @ApiProperty()
  documentos: any;
  @ApiProperty()
  estado_proveedor: string;
  @ApiProperty()
  requiere_aprobacion_adicional: boolean;
}
