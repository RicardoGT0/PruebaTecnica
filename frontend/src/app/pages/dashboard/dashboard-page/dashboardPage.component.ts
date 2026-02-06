import { Component, computed, signal } from '@angular/core';
import { ListaProveedoresComponent } from "../../../components/listaProveedores/listaProveedores.component/listaProveedores.component";
import { ProveedoresService } from '../../../services/proveedores.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dashboard-page',
  templateUrl: './dashboardPage.component.html',
  imports: [ListaProveedoresComponent, RouterLink],
})

export class DashboardPageComponent {
  proveedoresService = new ProveedoresService();
  estadosProveedorKeys = computed(() => Object.keys(this.proveedoresService.estadosProveedor()));
  buscadorValue = signal('');
  filtrosValue = signal('todos');

  limpiarFiltros() {
    this.buscadorValue.set('');
    this.filtrosValue.set('todos');
    this.proveedoresService.limpiarFiltros();
  }

  actualizarProveedores() {
    this.limpiarFiltros();
    this.proveedoresService.getProveedores();
  }

  buscarProveedores() {
    this.proveedoresService.buscarProveedores(this.buscadorValue());
  }

  filtrarPorEstatus(filtro: string, limpiarBuscador: boolean = true) {
    if (limpiarBuscador) this.buscadorValue.set('');
    this.filtrosValue.set(filtro);
    this.proveedoresService.filtrarProveedoresPorEstatus(filtro);
  }

}
