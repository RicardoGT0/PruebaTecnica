import { NgClass, CommonModule } from '@angular/common';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProveedoresService } from '../../../services/proveedores.service';
import { Proveedor } from '../../../interfaces/Proveedor.interfaces';
import { Documento } from '../../../interfaces/Documento.interfaces';
import { from, mergeMap, toArray } from 'rxjs';

@Component({
  selector: 'form-privider-page',
  imports: [NgClass, CommonModule, ReactiveFormsModule],
  templateUrl: './formPrividerPage.component.html',
  styleUrls: ['./formPrividerPage.component.css'],
})
export class FormPrividerPageComponent implements OnInit {
  routeId: string | null = null;
  proveedorForm!: FormGroup;
  submitted = signal(false);

  comprobante_domicilio = signal<{ name: string; base64String: string } | null>(null);
  identificacion_representante = signal<{ name: string; base64String: string } | null>(null);
  constancia_fiscal = signal<{ name: string; base64String: string } | null>(null);

  uploadedFiles: Record<string, WritableSignal<{ name: string; base64String: string } | null>> = {
    "comprobante_domicilio": this.comprobante_domicilio,
    "identificacion_representante": this.identificacion_representante,
    "constancia_fiscal": this.constancia_fiscal,
  };

  documentosRequeridos = [
    { key: 'comprobante_domicilio', label: 'Comprobante de domicilio', tipos: '.pdf,.jpg,.png' },
    { key: 'constancia_fiscal', label: 'Constancia fiscal', tipos: '.pdf,.jpg,.png' },
    { key: 'identificacion_representante', label: 'Identificación del representante legal', tipos: '.pdf,.jpg,.png' },
  ];

  constructor(
    private fb: FormBuilder,
    private proveedoresService: ProveedoresService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.initializeForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== '0') {
      this.routeId = id;
      this.loadProveedor(id);
    }
  }

  loadProveedor(id: string) {
    this.proveedoresService.obtenerProveedorPorId(id).subscribe({
      next: (proveedor: Proveedor) => {
        this.proveedorForm.patchValue({
          nombre_legal: proveedor.nombre_legal ?? '',
          nombre_comercial: proveedor.nombre_comercial ?? '',
          rfc: proveedor.rfc ?? '',
          direccion: proveedor.direccion ?? '',
          telefono: proveedor.telefono ?? '',
          email: proveedor.email ?? '',
          monto_estimado_anual: proveedor.monto_estimado_anual ?? '',
          nombre_contacto: proveedor.contacto?.nombre ?? '',
          telefono_contacto: proveedor.contacto?.telefono ?? '',
          email_contacto: proveedor.contacto?.email ?? '',
        });

        (proveedor.documentos || []).forEach(doc => {
          const key = doc.tipo as keyof typeof this.uploadedFiles;
          if (this.uploadedFiles[key]) {
            this.uploadedFiles[key].set({ name: doc.nombre_archivo, base64String: doc.meta });
          }
        });
      },
      error: () => {
        console.warn('No se pudo obtener proveedor con id', id);
      }
    });
  }

  initializeForm() {
    this.proveedorForm = this.fb.group({
      nombre_legal: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      nombre_comercial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      rfc: ['', [Validators.required, this.rfcValidator.bind(this)]],
      direccion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      telefono: ['', [Validators.required, this.telefonoValidator.bind(this)]],
      email: ['', [Validators.required, Validators.email]],
      monto_estimado_anual: ['', [Validators.required, Validators.min(0), this.montoValidator.bind(this)]],
      nombre_contacto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      telefono_contacto: ['', [Validators.required, this.telefonoValidator.bind(this)]],
      email_contacto: ['', [Validators.required, Validators.email]],
    });
  }

  rfcValidator(control: any) {
    const value = control.value;
    if (!value) return null;
    // const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}(?:[A-V0-9]{3})?$/i;
    const rfcPattern = /^([A-ZÑ&]{3,4})\d{6}(?:[A-Z0-9]{3})$/;
    return rfcPattern.test(value) ? null : { invalidRfc: true };
  }

  telefonoValidator(control: any) {
    const value = control.value;
    if (!value) return null;
    const telefonoPattern = /^(?:\+?52)?[\s]?(?:\d{2,3})?[\s]?[\d\s]{8,10}$/;
    return telefonoPattern.test(value.replace(/\s/g, '')) ? null : { invalidTelefono: true };
  }

  montoValidator(control: any) {
    const value = control.value;
    if (!value) return null;
    return !isNaN(value) && parseFloat(value) > 0 ? null : { invalidMonto: true };
  }

  onFileSelected(event: any, inputName: string) {
    const file = event.target.files[0];
    if (file === undefined) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.uploadedFiles[inputName].set({ name: file.name, base64String });
    };
    reader.readAsDataURL(file);
  }

  hasFile(inputName: string): boolean {
    if (this.uploadedFiles[inputName]() === null) return false;
    return this.uploadedFiles[inputName]()?.name !== '' || this.uploadedFiles[inputName]()?.base64String !== '';
  }

  downloadFile(inputName: string): void {
    const file = this.uploadedFiles[inputName]();
    if (!file) return;

    const base64Data = file.base64String.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.proveedorForm.get(fieldName);
    if (!control || !control.errors || !this.submitted()) return '';

    if (control.hasError('required')) return 'Este campo es requerido';
    if (control.hasError('minlength')) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.hasError('maxlength')) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    if (control.hasError('email')) return 'Email inválido';
    if (control.hasError('min')) return `Valor mínimo: ${control.errors['min'].min}`;
    if (control.hasError('invalidRfc')) return 'RFC inválido';
    if (control.hasError('invalidTelefono')) return 'Teléfono inválido (10 dígitos o con código de país)';
    if (control.hasError('invalidMonto')) return 'Monto debe ser un número positivo';

    return 'Campo inválido';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.proveedorForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted()));
  }

  cancelar() {
    this.proveedorForm.reset();
    this.submitted.set(false);
    Object.values(this.uploadedFiles).forEach(signal => signal.set(null));
    this.router.navigate(['dashboard']);
  }

  guardar() {
    this.submitted.set(true);

    if (this.proveedorForm.invalid) {
      alert('Por favor completa el formulario correctamente');
      return;
    }

    const formData: Proveedor = {
      id: this.routeId && this.routeId !== '0' ? this.routeId : undefined,
      nombre_legal: this.proveedorForm.get('nombre_legal')?.value,
      nombre_comercial: this.proveedorForm.get('nombre_comercial')?.value,
      rfc: this.proveedorForm.get('rfc')?.value,
      direccion: this.proveedorForm.get('direccion')?.value,
      telefono: this.proveedorForm.get('telefono')?.value,
      email: this.proveedorForm.get('email')?.value,
      monto_estimado_anual: this.proveedorForm.get('monto_estimado_anual')?.value,
      estado_proveedor: 'pendiente',
      contacto: {
        nombre: this.proveedorForm.get('nombre_contacto')?.value,
        telefono: this.proveedorForm.get('telefono_contacto')?.value,
        email: this.proveedorForm.get('email_contacto')?.value
      },
    };

    this.proveedoresService.guardarProveedor(formData).subscribe({
      next: (data) => {
        if (!data.id) return;

        const documentos: Documento[] = [
          {
            provider_id: data.id,
            tipo: 'comprobante_domicilio',
            nombre_archivo: this.comprobante_domicilio()?.name ?? '',
            meta: this.comprobante_domicilio()?.base64String ?? '',
          },
          {
            provider_id: data.id,
            tipo: 'constancia_fiscal',
            nombre_archivo: this.constancia_fiscal()?.name ?? '',
            meta: this.constancia_fiscal()?.base64String ?? '',
          },
          {
            provider_id: data.id,
            tipo: 'identificacion_representante',
            nombre_archivo: this.identificacion_representante()?.name ?? '',
            meta: this.identificacion_representante()?.base64String ?? '',
          },
        ];

        const documentosValidos = documentos.filter(d => d.meta && d.nombre_archivo);
        if (!documentosValidos.length) {
          alert('Se han Guadado los Datos del Proveedor');
          return;
        }

        from(documentos)
          .pipe(
            mergeMap(
              doc => this.proveedoresService.guardarDocumento(doc),
              3 // concurrencia máxima
            ),
            toArray()
          )
          .subscribe({
            next: res => alert('Todos los documentos guardados'),
            error: err => alert('Error al guardar los documentos, intentalo de nuevo'),
          });

      },
      error: err => { alert('Error al guardar el proveedor, intentalo de nuevo') }
    });

  }
}
