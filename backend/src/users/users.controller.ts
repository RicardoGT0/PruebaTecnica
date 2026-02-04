import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo Usuario' })
  @ApiHeader({ name: 'x-user-role', required: false })
  @ApiResponse({ status: 200, description: 'Usuario creado con éxito' })
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Usuarios' })
  @ApiResponse({ status: 200, description: 'Listado de Usuarios' })
  @ApiHeader({ name: 'x-user-role', required: false })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un Usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido' })
  @ApiHeader({ name: 'x-user-role', required: false })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
