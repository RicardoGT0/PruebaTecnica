import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { CreateDocumentDto } from '../document/dto/create-document.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear proveedor en estado Borrador' })
  @ApiHeader({ name: 'x-user-role', required: false })
  @ApiResponse({ status: 200, description: 'Proveedor creado' })
  create(@Body() dto: CreateProviderDto) {
    return this.providersService.createDraft(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los proveedores' })
  @ApiHeader({ name: 'x-user-role', required: false })
  @ApiResponse({ status: 200, description: 'Proveedores obtenidos' })
  findAll() {
    return this.providersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener proveedor por ID' })
  @ApiHeader({ name: 'x-user-role', required: false })
  @ApiResponse({ status: 200, description: 'Proveedor obtenido' })
  findOne(@Param('id') id: string) {
    return this.providersService.findOneWithRelations(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar proveedor por ID' })
  @ApiHeader({ name: 'x-user-role', required: false })
  @ApiResponse({ status: 200, description: 'Proveedor actualizado' })
  update(
    @Param('id') id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ) {
    return id
      ? this.providersService.update(id, updateProviderDto)
      : 'ID is required';
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Guardar proveedor por ID' })
  @ApiHeader({ name: 'x-user-role', required: false })
  @ApiResponse({ status: 200, description: 'Proveedor Guardado' })
  submit(@Param('id') id: string) {
    return this.providersService.submit(id);
  }

  @Post(':id/documents')
  @ApiOperation({ summary: 'Agregar documento a proveedor por ID' })
  @ApiHeader({ name: 'x-user-role', required: false })
  @ApiResponse({ status: 200, description: 'Documento agregado' })
  addDocument(@Param('id') id: string, @Body() dto: CreateDocumentDto) {
    return this.providersService.addDocument(id, dto);
  }

  @Post(':id/validate-document/:docId')
  @ApiOperation({ summary: 'Validar documento de proveedor por ID' })
  @ApiHeader({ name: 'x-user-role', required: false })
  @ApiResponse({ status: 200, description: 'Documento validado' })
  validateDocument(
    @Param('id') id: string,
    @Param('docId') docId: string,
    @Body() dto: { estado: string; comentario: string },
  ) {
    if (!docId) throw new Error('Document ID is required');
    if (!dto) throw new Error('Validation data is required');
    if (!id) throw new Error('Provider ID is required');
    return this.providersService.validateDocument(docId, dto);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Aprobar proveedor por ID' })
  @ApiHeader({ name: 'x-user-role', required: false })
  @ApiResponse({ status: 200, description: 'Proveedor aprobado' })
  approve(@Param('id') id: string) {
    return this.providersService.approve(id);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Rechazar proveedor por ID' })
  @ApiHeader({ name: 'x-user-role', required: false })
  @ApiResponse({ status: 200, description: 'Proveedor rechazado' })
  reject(@Param('id') id: string) {
    return this.providersService.reject(id);
  }

  @Post(':id/return-to-draft')
  @ApiOperation({ summary: 'Rechazar proveedor por ID' })
  @ApiHeader({ name: 'x-user-role', required: false })
  @ApiResponse({ status: 200, description: 'Proveedor regresado a borrador' })
  returnToDraft(@Param('id') id: string) {
    return this.providersService.returnToDraft(id);
  }
}
