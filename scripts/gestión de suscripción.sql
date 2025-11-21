select * from public.usuarios

CREATE TABLE IF NOT EXISTS planes_suscripcion (
    id_plan SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo_plan VARCHAR(20) NOT NULL CHECK (tipo_plan IN ('basica', 'professional', 'enterprise', 'custom')),
    descripcion TEXT,
    precio_mensual DECIMAL(18,2) NOT NULL DEFAULT 0,
    precio_anual DECIMAL(18,2) NOT NULL DEFAULT 0,
    moneda VARCHAR(3) DEFAULT 'USD',
    
    -- Características del plan (para planes custom)
    max_usuarios INT DEFAULT NULL,
    max_agencias INT DEFAULT NULL,
    max_cuentas INT DEFAULT NULL,
    almacenamiento_gb INT DEFAULT NULL,
    soporte_prioritario BOOLEAN DEFAULT FALSE,
    api_access BOOLEAN DEFAULT FALSE,
    customizacion_branding BOOLEAN DEFAULT FALSE,
    
    -- Configuración
    activo BOOLEAN DEFAULT TRUE,
    destacado BOOLEAN DEFAULT FALSE, -- Para mostrar en la página de precios
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_planes_tipo ON planes_suscripcion(tipo_plan);
CREATE INDEX idx_planes_activo ON planes_suscripcion(activo);


CREATE TABLE IF NOT EXISTS suscripciones (
    id_suscripcion SERIAL PRIMARY KEY,
    
    -- Relaciones
    id_cooperativa INT NOT NULL,
    id_plan INT NOT NULL,
    
    -- Estado de la suscripción
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('active', 'canceled', 'expired', 'pending', 'past_due', 'suspended')),
    
    -- Fechas importantes
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    fecha_cancelacion TIMESTAMP NULL,
    proxima_fecha_cobro TIMESTAMP NOT NULL,
    
    -- Facturación
    periodo VARCHAR(20) NOT NULL CHECK (periodo IN ('monthly', 'annual')),
    monto_pagado DECIMAL(18,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'USD',
    
    -- Renovación automática
    renovacion_automatica BOOLEAN DEFAULT TRUE,
    
    -- Método de pago
    metodo_pago VARCHAR(100) NULL, -- Kushki, Comprobante, Transferencia, etc.
    id_metodo_pago VARCHAR(255) NULL, -- ID del método de pago en el procesador (ej: Kushki token)
    ultimos_4_digitos VARCHAR(4) NULL, -- Últimos 4 dígitos de tarjeta si aplica
    
    -- Comprobante de pago (para métodos manuales)
    comprobante_pago BYTEA NULL,
    nombre_comprobante VARCHAR(255) NULL,
    
    -- Información adicional
    notas TEXT NULL, -- Notas internas sobre la suscripción
    motivo_cancelacion TEXT NULL, -- Razón de cancelación si aplica
    
    -- Auditoría
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_suscripcion_cooperativa 
        FOREIGN KEY (id_cooperativa) 
        REFERENCES cooperativas(id_cooperativa) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_suscripcion_plan 
        FOREIGN KEY (id_plan) 
        REFERENCES planes_suscripcion(id_plan) 
        ON DELETE RESTRICT
);

CREATE INDEX idx_suscripciones_cooperativa ON suscripciones(id_cooperativa);
CREATE INDEX idx_suscripciones_plan ON suscripciones(id_plan);
CREATE INDEX idx_suscripciones_estado ON suscripciones(estado);
CREATE INDEX idx_suscripciones_fecha_fin ON suscripciones(fecha_fin);
CREATE INDEX idx_suscripciones_proxima_cobro ON suscripciones(proxima_fecha_cobro);


-- Trigger para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION update_suscripciones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_suscripciones_updated_at
    BEFORE UPDATE ON suscripciones
    FOR EACH ROW
    EXECUTE FUNCTION update_suscripciones_updated_at();

-- Trigger para actualizar fecha_actualizacion en planes_suscripcion
CREATE OR REPLACE FUNCTION update_planes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_planes_updated_at
    BEFORE UPDATE ON planes_suscripcion
    FOR EACH ROW
    EXECUTE FUNCTION update_planes_updated_at();

INSERT INTO planes_suscripcion (nombre, tipo_plan, descripcion, precio_mensual, precio_anual, moneda, max_usuarios, max_agencias, max_cuentas, almacenamiento_gb, soporte_prioritario, api_access, customizacion_branding, destacado) VALUES
('Plan Básico', 'basica', 'Plan por defecto', 0.00, 0.00, 'USD', 5, 3, 50, 10, FALSE, FALSE, FALSE, TRUE),
('Plan Profesional', 'professional', 'Para cooperativas en crecimiento con necesidades avanzadas', 80.00, 864.00, 'USD', 25, 10, 200, 50, TRUE, TRUE, FALSE, TRUE),
('Plan Enterprise', 'enterprise', 'Solución completa para cooperativas grandes', 240.00, 2592.00, 'USD', 100, 50, 1000, 200, TRUE, TRUE, TRUE, TRUE),
('Plan Personalizado', 'custom', 'Plan adaptado a las necesidades específicas de tu cooperativa', 0.00, 0.00, 'USD', NULL, NULL, NULL, NULL, TRUE, TRUE, TRUE, FALSE);


CREATE OR REPLACE VIEW vw_suscripciones_activas AS
SELECT 
    s.id_suscripcion,
    s.id_cooperativa,
    c.nombre AS nombre_cooperativa,
    s.id_plan,
    p.nombre AS nombre_plan,
    p.tipo_plan,
    s.estado,
    s.fecha_inicio,
    s.fecha_fin,
    s.proxima_fecha_cobro,
    s.monto_pagado,
    s.moneda,
    s.periodo,
    s.renovacion_automatica,
    (s.fecha_fin - CURRENT_DATE) AS dias_restantes
FROM suscripciones s
INNER JOIN cooperativas c ON s.id_cooperativa = c.id_cooperativa
INNER JOIN planes_suscripcion p ON s.id_plan = p.id_plan
WHERE s.estado = 'active';

CREATE OR REPLACE VIEW vw_suscripciones_por_vencer AS
SELECT 
    s.id_suscripcion,
    s.id_cooperativa,
    c.nombre AS nombre_cooperativa,
    c.correo AS correo_cooperativa,
    p.nombre AS nombre_plan,
    s.fecha_fin,
    s.proxima_fecha_cobro,
    s.renovacion_automatica,
    (s.fecha_fin - CURRENT_DATE) AS dias_restantes
FROM suscripciones s
INNER JOIN cooperativas c ON s.id_cooperativa = c.id_cooperativa
INNER JOIN planes_suscripcion p ON s.id_plan = p.id_plan
WHERE s.estado = 'active' 
    AND s.fecha_fin BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '30 days';

