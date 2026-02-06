import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Document } from '../../document/entities/document.entity';

interface Contacto {
  nombre: string;
  telefono: string;
  email: string;
}

export interface ProviderCreationAttrs {
  nombre_legal: string;
  nombre_comercial: string;
  rfc: string;
  direccion: string;
  telefono: string;
  email: string;
  contacto: Contacto;
  estado_proveedor: string;
  monto_estimado_anual: number;
  requiere_aprobacion_adicional: boolean;
}

@Table({ tableName: 'providers' })
export class Provider extends Model<Provider, ProviderCreationAttrs> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column(DataType.TEXT) declare nombre_legal: string;
  @Column(DataType.TEXT) declare nombre_comercial: string;
  @Column(DataType.TEXT) declare rfc: string;
  @Column(DataType.TEXT) declare direccion: string;
  @Column(DataType.TEXT) declare telefono: string;
  @Column(DataType.TEXT) declare email: string;

  @Column(DataType.JSON) declare contacto: Contacto;

  @Column(DataType.DECIMAL) declare monto_estimado_anual: number;

  @Column(DataType.TEXT) declare estado_proveedor: string;

  @Column(DataType.BOOLEAN) declare requiere_aprobacion_adicional: boolean;

  @HasMany(() => Document)
  declare documentos: Document[];
}
