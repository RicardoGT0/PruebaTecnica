import { Component, input } from '@angular/core';
import { Proveedor } from '../../../interfaces/Proveedor.interfaces';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'lista-proveedores',
  templateUrl: './listaProveedores.component.html',
  imports: [CurrencyPipe, RouterLink],
})
export class ListaProveedoresComponent {
  data = input<Proveedor[]>();
}
