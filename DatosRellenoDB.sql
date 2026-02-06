BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================
-- PROVEEDORES
-- =========================
INSERT INTO public.providers (
    id,
    nombre_legal,
    nombre_comercial,
    rfc,
    direccion,
    telefono,
    email,
    contacto,
    monto_estimado_anual,
    estado_proveedor,
    requiere_aprobacion_adicional,
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid(),
    'Proveedor Legal ' || i,
    'Proveedor Comercial ' || i,
    'RFC' || LPAD(i::text, 10, '0'),
    'Calle Falsa #' || i || ', CDMX',
    '+52 55 5555 ' || LPAD(i::text, 4, '0'),
    'proveedor' || i || '@correo.com',
    json_build_object(
        'nombre', 'Contacto ' || i,
        'puesto', 'Compras',
        'telefono', '+52 55 7777 ' || LPAD(i::text, 4, '0')
    ),
    (random() * 900000 + 100000)::numeric(12,2),
    CASE 
        WHEN i % 3 = 0 THEN 'Suspendido'
        WHEN i % 2 = 0 THEN 'Pendiente'
        ELSE 'Activo'
    END,
    (i % 2 = 0),
    now() - (i || ' days')::interval,
    now() - (i || ' days')::interval
FROM generate_series(1,15) AS i;

-- =========================
-- DOCUMENTOS (1 por proveedor)
-- =========================
INSERT INTO public.documents (
    id,
    provider_id,
    tipo,
    nombre_archivo,
    meta,
    fecha_emision,
    fecha_vencimiento,
    estado,
    comentario_revisor,
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid(),
    p.id,
    CASE 
        WHEN row_number() OVER () % 3 = 0 THEN 'Contrato'
        WHEN row_number() OVER () % 2 = 0 THEN 'Identificación'
        ELSE 'Comprobante Fiscal'
    END,
    'documento_' || row_number() OVER () || '.pdf',
    json_build_object(
        'tamano_kb', (random() * 500 + 100)::int,
        'formato', 'pdf',
        'origen', 'Carga manual'
    ),
    now() - (row_number() OVER () || ' months')::interval,
    now() + ((row_number() OVER () + 6) || ' months')::interval,
    CASE 
        WHEN row_number() OVER () % 3 = 0 THEN 'Rechazado'
        WHEN row_number() OVER () % 2 = 0 THEN 'Pendiente'
        ELSE 'Aprobado'
    END,
    CASE 
        WHEN row_number() OVER () % 3 = 0 THEN 'Documento vencido'
        ELSE NULL
    END,
    now(),
    now()
FROM public.providers p
LIMIT 15;

COMMIT;
