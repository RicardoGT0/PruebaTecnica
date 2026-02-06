import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { Proveedor } from "../interfaces/Proveedor.interfaces";
import { Documento } from "../interfaces/Documento.interfaces";


@Injectable({ providedIn: 'root' })
export class ProveedoresService {
  private html = inject(HttpClient);
  proveedoresList = signal<Proveedor[]>([]);
  proveedoresFiltrados = signal<Proveedor[]>([]);
  estadosProveedor = signal<{ [key: string]: string }>({
    todos: 'Todos',
    activo: 'Activos',
    pendiente: 'Pendientes',
    suspendido: 'Suspendidos',
    rechazado: 'Rechazados',
  });

  constructor() {
    this.getProveedores();
  }

  getProveedores() {
    this.html.get<Proveedor[]>(environment.URLAPI + environment.URLProveedores).subscribe((data) => {
      this.proveedoresList.set(data);
      this.proveedoresFiltrados.set(data);
    })
  }

  buscarProveedores(termino: string) {
    if (termino.length === 0) return

    this.proveedoresFiltrados.update((filtrados) => {
      return filtrados.filter((proveedor) =>
        proveedor.nombre_legal.toLowerCase().includes(termino.toLowerCase()) ||
        proveedor.nombre_comercial.toLowerCase().includes(termino.toLowerCase()) ||
        proveedor.rfc.toLowerCase().includes(termino.toLowerCase()))
    });
  }

  filtrarProveedoresPorEstatus(estatus: string) {
    if (estatus === 'todos') {
      this.proveedoresFiltrados.set(this.proveedoresList());
    } else {
      this.proveedoresFiltrados.set(
        this.proveedoresList().filter(proveedor => proveedor.estado_proveedor.toLowerCase() === estatus.toLowerCase())
      );
    }
  }

  guardarProveedor(proveedor: Proveedor) {
    if (proveedor.id) {
      return this.html.put<Proveedor>(environment.URLAPI + environment.URLProveedores + `/${proveedor.id}`, proveedor)
    } else {
      return this.html.post<Proveedor>(environment.URLAPI + environment.URLProveedores, proveedor)
    }
  }

  guardarDocumento(documento: Documento) {
    return this.html.post<Documento>(environment.URLAPI + environment.URLProveedores + `/${documento.provider_id}/documents`, documento)
  }

  obtenerProveedorPorId(id: string) {
    return this.html.get<Proveedor>(environment.URLAPI + environment.URLProveedores + `/${id}`)
  }

  limpiarFiltros() {
    this.proveedoresFiltrados.set(this.proveedoresList());
  }

}
