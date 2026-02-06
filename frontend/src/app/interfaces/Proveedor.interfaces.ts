import { Contacto } from "./Contacto.interfaces";
import { Documento } from "./Documento.interfaces";

export interface Proveedor {
  id?: string;
  nombre_legal: string;
  nombre_comercial: string;
  rfc: string;
  direccion: string;
  telefono: string;
  email: string;
  contacto: Contacto;
  monto_estimado_anual: number;
  estado_proveedor: string;
  requiere_aprobacion_adicional?: boolean;
  documentos?: Documento[];
}
