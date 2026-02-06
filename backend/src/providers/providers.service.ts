import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';
import { Document } from '../document/entities/document.entity';
import { CreateDocumentDto } from '../document/dto/create-document.dto';

@Injectable()
export class ProvidersService {
  providerModel = Provider;
  documentModel = Document;

  async createDraft(dto: CreateProviderDto) {
    const provider = await this.providerModel.create({
      ...dto,
      estado_proveedor: 'Pendiente',
      requiere_aprobacion_adicional: dto.monto_estimado_anual > 500000,
    });

    return provider;
  }

  async update(id: string, dto: UpdateProviderDto) {
    const provider = await this.providerModel.findByPk(id);
    if (!provider) throw new BadRequestException('Provider not found');

    await provider.update(dto);

    return provider;
  }

  async findAll() {
    return await this.providerModel.findAll({ include: { all: true } });
  }

  async findOneWithRelations(id: string) {
    const provider = await this.providerModel.findByPk(id, {
      include: { all: true },
    });
    return provider;
  }

  async submit(id: string) {
    const provider = await this.providerModel.findByPk(id);
    if (!provider) throw new BadRequestException('Proveedor no encontrado');

    if (provider.estado_proveedor !== 'Pendiente')
      throw new BadRequestException('No se puede enviar');

    // Validaciones mínimas
    if (!provider.rfc) throw new BadRequestException('RFC requerido');

    provider.estado_proveedor = 'Pendiente';
    await provider.save();

    return provider;
  }

  async addDocument(id: string, dto: CreateDocumentDto) {
    const doc = await this.documentModel.create({
      provider_id: id,
      ...dto,
      estado: 'Pendiente',
    });

    return doc;
  }

  async validateDocument(
    docId: string,
    dto: { estado: string; comentario: string },
  ) {
    const doc = await this.documentModel.findByPk(docId);
    if (!doc) throw new BadRequestException('Documento no encontrado');

    doc.estado = dto.estado;
    doc.comentario_revisor = dto.comentario;
    await doc.save();

    return doc;
  }

  async approve(id: string) {
    const provider = await this.providerModel.findByPk(id, {
      include: [Document],
    });
    if (!provider) throw new BadRequestException('Proveedor no encontrado');

    const invalid = provider.documentos.some((d) => d.estado !== 'VALIDO');
    if (invalid) throw new BadRequestException('Documentos incompletos');

    provider.estado_proveedor = 'Activo';
    await provider.save();

    return provider;
  }

  async reject(id: string) {
    const provider = await this.providerModel.findByPk(id);
    if (!provider) throw new BadRequestException('Proveedor no encontrado');

    provider.estado_proveedor = 'Rechazado';
    await provider.save();

    return provider;
  }

  async returnToDraft(id: string) {
    const provider = await this.providerModel.findByPk(id);
    if (!provider) throw new BadRequestException('Proveedor no encontrado');

    provider.estado_proveedor = 'Pendiente';
    await provider.save();

    return provider;
  }
}
