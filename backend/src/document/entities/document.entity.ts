import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Provider } from '../../providers/entities/provider.entity';

export interface DocumentCreationAttrs {
  provider_id: string;
  tipo: string;
  nombre_archivo: string;
  meta: any;
  fecha_emision: Date;
  fecha_vencimiento: Date;
  comentario_revisor: string;
  estado: string;
}

@Table({ tableName: 'documents' })
export class Document extends Model<Document, DocumentCreationAttrs> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Provider)
  @Column(DataType.UUID)
  declare provider_id: string;

  @Column(DataType.TEXT) declare tipo: string;
  @Column(DataType.TEXT) declare nombre_archivo: string;
  @Column(DataType.JSON) declare meta: any;

  @Column(DataType.DATE) declare fecha_emision: Date;
  @Column(DataType.DATE) declare fecha_vencimiento: Date;

  @Column(DataType.TEXT) declare estado: string;
  @Column(DataType.TEXT) declare comentario_revisor: string;
}
