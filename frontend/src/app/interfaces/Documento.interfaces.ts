export interface Documento {
  id?: string;
  provider_id: string;
  tipo: string;
  nombre_archivo: string;
  meta:string;
  fecha_emision?: string;
  fecha_vencimiento?: string;
  estado?: string;
  comentario_revisor?: string;
}
