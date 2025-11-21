-- =====================================================
-- Script de Creación de Tablas - Sistema AnaOS
-- Base de Datos: PostgreSQL
-- =====================================================
-- Este script crea todas las tablas necesarias para el sistema
-- de administración de cooperativas con sus relaciones,
-- constraints, índices y valores por defecto.
-- =====================================================

-- =====================================================
-- 1. TABLA: cooperativas
-- =====================================================
CREATE TABLE IF NOT EXISTS cooperativas (
    id_cooperativa SERIAL PRIMARY KEY,
    nombre VARCHAR(300) NOT NULL,
    ruc VARCHAR(13) NOT NULL UNIQUE,
    direccion VARCHAR(300) NOT NULL,
    telefono VARCHAR(15),
    correo VARCHAR(150),
    archivo_nombramiento BYTEA,
    nombre_archivo VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice único para RUC
CREATE UNIQUE INDEX IF NOT EXISTS cooperativas_ruc_key ON cooperativas(ruc);

-- Comentarios en la tabla
COMMENT ON TABLE cooperativas IS 'Tabla principal que almacena la información de las cooperativas';
COMMENT ON COLUMN cooperativas.id_cooperativa IS 'Identificador único de la cooperativa';
COMMENT ON COLUMN cooperativas.ruc IS 'RUC único de la cooperativa (13 caracteres)';
COMMENT ON COLUMN cooperativas.nombre IS 'Nombre completo de la cooperativa';
COMMENT ON COLUMN cooperativas.direccion IS 'Dirección física de la cooperativa';
COMMENT ON COLUMN cooperativas.telefono IS 'Teléfono de contacto';
COMMENT ON COLUMN cooperativas.correo IS 'Correo electrónico de contacto';
COMMENT ON COLUMN cooperativas.archivo_nombramiento IS 'Archivo PDF o imagen del nombramiento (binario)';
COMMENT ON COLUMN cooperativas.nombre_archivo IS 'Nombre del archivo de nombramiento';

-- =====================================================
-- 2. TABLA: agencias
-- =====================================================
CREATE TABLE IF NOT EXISTS agencias (
    id_agencia SERIAL PRIMARY KEY,
    id_cooperativa INTEGER NOT NULL REFERENCES cooperativas(id_cooperativa) ON DELETE CASCADE,
    nombre VARCHAR(150) NOT NULL,
    codigo_interno VARCHAR(50),
    direccion VARCHAR(200),
    telefono VARCHAR(15),
    nombre_responsable VARCHAR(50),
    provincia VARCHAR(50),
    canton VARCHAR(50),
    ciudad VARCHAR(50),
    hora_apertura TIME,
    hora_cierre TIME,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas por cooperativa
CREATE INDEX IF NOT EXISTS idx_agencias_cooperativa ON agencias(id_cooperativa);

-- Comentarios en la tabla
COMMENT ON TABLE agencias IS 'Tabla que almacena las agencias de cada cooperativa';
COMMENT ON COLUMN agencias.id_agencia IS 'Identificador único de la agencia';
COMMENT ON COLUMN agencias.id_cooperativa IS 'Referencia a la cooperativa a la que pertenece';
COMMENT ON COLUMN agencias.nombre IS 'Nombre de la agencia';
COMMENT ON COLUMN agencias.codigo_interno IS 'Código interno de identificación de la agencia';
COMMENT ON COLUMN agencias.nombre_responsable IS 'Nombre del responsable de la agencia';

-- =====================================================
-- 3. TABLA: usuarios
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_cooperativa INTEGER REFERENCES cooperativas(id_cooperativa) ON DELETE SET NULL,
    nombres VARCHAR(75) NOT NULL,
    apellidos VARCHAR(75) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(300) NOT NULL,
    cargo VARCHAR(100),
    funcion TEXT,
    rol VARCHAR(50) NOT NULL,
    celular VARCHAR(15),
    archivo_nombramiento BYTEA,
    nombre_archivo VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint de validación de roles
    CONSTRAINT chk_rol_cooperativa CHECK (
        (rol IN ('Administrador', 'Gerente') AND id_cooperativa IS NULL) OR
        (rol NOT IN ('Administrador', 'Gerente') AND id_cooperativa IS NOT NULL)
    )
);

-- Índice único para correo
CREATE UNIQUE INDEX IF NOT EXISTS usuarios_correo_key ON usuarios(correo);

-- Índice para búsquedas por cooperativa
CREATE INDEX IF NOT EXISTS idx_usuarios_cooperativa ON usuarios(id_cooperativa);

-- Índice para búsquedas por rol
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);

-- Comentarios en la tabla
COMMENT ON TABLE usuarios IS 'Tabla que almacena los usuarios del sistema';
COMMENT ON COLUMN usuarios.id_usuario IS 'Identificador único del usuario';
COMMENT ON COLUMN usuarios.id_cooperativa IS 'Referencia a la cooperativa (NULL para Administrador y Gerente)';
COMMENT ON COLUMN usuarios.nombres IS 'Nombres del usuario';
COMMENT ON COLUMN usuarios.apellidos IS 'Apellidos del usuario';
COMMENT ON COLUMN usuarios.correo IS 'Correo electrónico único del usuario';
COMMENT ON COLUMN usuarios.contrasena_hash IS 'Hash SHA256 de la contraseña';
COMMENT ON COLUMN usuarios.rol IS 'Rol del usuario: Administrador, Gerente, UsuarioCooperativa, etc.';
COMMENT ON COLUMN usuarios.cargo IS 'Cargo del usuario dentro de la cooperativa';
COMMENT ON COLUMN usuarios.funcion IS 'Descripción de las funciones del usuario';
COMMENT ON CONSTRAINT chk_rol_cooperativa ON usuarios IS 'Valida que Administrador y Gerente no tengan cooperativa, y que otros roles sí la tengan';

-- =====================================================
-- 4. TABLA: cuentas
-- =====================================================
-- IMPORTANTE: Una cuenta SIEMPRE debe estar asociada a una cooperativa
-- La cooperativa debe existir y tener todos sus datos completos antes de crear la cuenta
CREATE TABLE IF NOT EXISTS cuentas (
    id_cuenta SERIAL PRIMARY KEY,
    id_cooperativa INTEGER NOT NULL REFERENCES cooperativas(id_cooperativa) ON DELETE CASCADE,
    numero_cuenta VARCHAR(50) UNIQUE NOT NULL,
    tipo_cuenta VARCHAR(50) NOT NULL,
    saldo DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    moneda VARCHAR(10) DEFAULT 'USD',
    estado VARCHAR(20) DEFAULT 'Activa',
    fecha_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre TIMESTAMP,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint de validación de saldo
    CONSTRAINT chk_saldo_positivo CHECK (saldo >= 0),
    
    -- Constraint de validación de estado
    CONSTRAINT chk_estado_valido CHECK (estado IN ('Activa', 'Inactiva', 'Bloqueada', 'Cerrada')),
    
    -- Constraint para asegurar que la cooperativa tenga datos mínimos requeridos
    -- Esto se valida mediante una función antes de insertar
    CONSTRAINT fk_cuenta_cooperativa FOREIGN KEY (id_cooperativa) 
        REFERENCES cooperativas(id_cooperativa) 
        ON DELETE CASCADE
        DEFERRABLE INITIALLY DEFERRED
);

-- Índice único para número de cuenta
CREATE UNIQUE INDEX IF NOT EXISTS cuentas_numero_cuenta_key ON cuentas(numero_cuenta);

-- Índice para búsquedas por cooperativa
CREATE INDEX IF NOT EXISTS idx_cuentas_cooperativa ON cuentas(id_cooperativa);

-- Índice para búsquedas por estado
CREATE INDEX IF NOT EXISTS idx_cuentas_estado ON cuentas(estado);

-- Comentarios en la tabla
COMMENT ON TABLE cuentas IS 'Tabla que almacena las cuentas bancarias de las cooperativas';
COMMENT ON COLUMN cuentas.id_cuenta IS 'Identificador único de la cuenta';
COMMENT ON COLUMN cuentas.id_cooperativa IS 'Referencia a la cooperativa propietaria';
COMMENT ON COLUMN cuentas.numero_cuenta IS 'Número único de la cuenta bancaria';
COMMENT ON COLUMN cuentas.tipo_cuenta IS 'Tipo de cuenta: Ahorros, Corriente, Inversión, etc.';
COMMENT ON COLUMN cuentas.saldo IS 'Saldo actual de la cuenta (decimal 18,2)';
COMMENT ON COLUMN cuentas.moneda IS 'Moneda de la cuenta (USD, EUR, etc.)';
COMMENT ON COLUMN cuentas.estado IS 'Estado de la cuenta: Activa, Inactiva, Bloqueada, Cerrada';
COMMENT ON COLUMN cuentas.fecha_apertura IS 'Fecha de apertura de la cuenta';
COMMENT ON COLUMN cuentas.fecha_cierre IS 'Fecha de cierre (NULL si está activa)';
COMMENT ON CONSTRAINT chk_saldo_positivo ON cuentas IS 'Valida que el saldo no sea negativo';
COMMENT ON CONSTRAINT chk_estado_valido ON cuentas IS 'Valida que el estado sea uno de los valores permitidos';

-- =====================================================
-- 5. TABLA: usuario_agencia (Opcional - Relación muchos a muchos)
-- =====================================================
-- Esta tabla permite que un usuario trabaje en múltiples agencias
-- Si no necesitas esta funcionalidad, puedes comentar o eliminar esta sección

CREATE TABLE IF NOT EXISTS usuario_agencia (
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_agencia INTEGER NOT NULL REFERENCES agencias(id_agencia) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_agencia)
);

-- Índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_usuario_agencia_usuario ON usuario_agencia(id_usuario);

-- Índice para búsquedas por agencia
CREATE INDEX IF NOT EXISTS idx_usuario_agencia_agencia ON usuario_agencia(id_agencia);

-- Comentarios en la tabla
COMMENT ON TABLE usuario_agencia IS 'Tabla de relación muchos a muchos entre usuarios y agencias';
COMMENT ON COLUMN usuario_agencia.id_usuario IS 'Referencia al usuario';
COMMENT ON COLUMN usuario_agencia.id_agencia IS 'Referencia a la agencia';
COMMENT ON COLUMN usuario_agencia.fecha_asignacion IS 'Fecha en que se asignó el usuario a la agencia';

-- =====================================================
-- 6. TRIGGERS para actualizar fecha_actualizacion automáticamente
-- =====================================================

-- Función para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION actualizar_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para cooperativas
DROP TRIGGER IF EXISTS trigger_actualizar_cooperativa ON cooperativas;
CREATE TRIGGER trigger_actualizar_cooperativa
    BEFORE UPDATE ON cooperativas
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- Trigger para usuarios
DROP TRIGGER IF EXISTS trigger_actualizar_usuario ON usuarios;
CREATE TRIGGER trigger_actualizar_usuario
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- Trigger para cuentas
DROP TRIGGER IF EXISTS trigger_actualizar_cuenta ON cuentas;
CREATE TRIGGER trigger_actualizar_cuenta
    BEFORE UPDATE ON cuentas
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- =====================================================
-- 8. FUNCIÓN para validar que la cooperativa tenga datos completos
-- =====================================================
-- Esta función valida que la cooperativa tenga los datos mínimos requeridos
-- antes de permitir crear una cuenta
CREATE OR REPLACE FUNCTION validar_cooperativa_cuenta()
RETURNS TRIGGER AS $$
DECLARE
    v_cooperativa RECORD;
BEGIN
    -- Obtener datos de la cooperativa
    SELECT * INTO v_cooperativa
    FROM cooperativas
    WHERE id_cooperativa = NEW.id_cooperativa;
    
    -- Verificar que la cooperativa existe
    IF NOT FOUND THEN
        RAISE EXCEPTION 'La cooperativa con ID % no existe. Debe crear la cooperativa primero.', NEW.id_cooperativa;
    END IF;
    
    -- Validar que tenga los datos mínimos requeridos
    IF v_cooperativa.nombre IS NULL OR TRIM(v_cooperativa.nombre) = '' THEN
        RAISE EXCEPTION 'No se puede crear la cuenta. La cooperativa con ID % debe tener un nombre válido.', NEW.id_cooperativa;
    END IF;
    
    IF v_cooperativa.ruc IS NULL OR TRIM(v_cooperativa.ruc) = '' THEN
        RAISE EXCEPTION 'No se puede crear la cuenta. La cooperativa con ID % debe tener un RUC válido.', NEW.id_cooperativa;
    END IF;
    
    IF v_cooperativa.direccion IS NULL OR TRIM(v_cooperativa.direccion) = '' THEN
        RAISE EXCEPTION 'No se puede crear la cuenta. La cooperativa con ID % debe tener una dirección válida.', NEW.id_cooperativa;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar cooperativa antes de insertar cuenta
DROP TRIGGER IF EXISTS trigger_validar_cooperativa_cuenta ON cuentas;
CREATE TRIGGER trigger_validar_cooperativa_cuenta
    BEFORE INSERT ON cuentas
    FOR EACH ROW
    EXECUTE FUNCTION validar_cooperativa_cuenta();

COMMENT ON FUNCTION validar_cooperativa_cuenta IS 'Valida que la cooperativa tenga datos completos antes de crear una cuenta';

-- =====================================================
-- 9. VISTA: cuentas_con_cooperativa
-- =====================================================
-- Vista que muestra las cuentas con todos los datos de la cooperativa
-- Facilita consultas que necesitan información completa
CREATE OR REPLACE VIEW cuentas_con_cooperativa AS
SELECT 
    c.id_cuenta,
    c.numero_cuenta,
    c.tipo_cuenta,
    c.saldo,
    c.moneda,
    c.estado,
    c.fecha_apertura,
    c.fecha_cierre,
    c.descripcion,
    c.fecha_creacion,
    c.fecha_actualizacion,
    -- Datos de la cooperativa
    coop.id_cooperativa,
    coop.nombre AS nombre_cooperativa,
    coop.ruc AS ruc_cooperativa,
    coop.direccion AS direccion_cooperativa,
    coop.telefono AS telefono_cooperativa,
    coop.correo AS correo_cooperativa
FROM cuentas c
INNER JOIN cooperativas coop ON c.id_cooperativa = coop.id_cooperativa;

COMMENT ON VIEW cuentas_con_cooperativa IS 'Vista que muestra las cuentas con todos los datos de su cooperativa asociada';

-- =====================================================
-- 10. VISTA: resumen_cuentas_por_cooperativa
-- =====================================================
-- Vista que muestra un resumen de cuentas por cooperativa
CREATE OR REPLACE VIEW resumen_cuentas_por_cooperativa AS
SELECT 
    coop.id_cooperativa,
    coop.nombre AS nombre_cooperativa,
    coop.ruc,
    COUNT(c.id_cuenta) AS total_cuentas,
    COUNT(CASE WHEN c.estado = 'Activa' THEN 1 END) AS cuentas_activas,
    COUNT(CASE WHEN c.estado = 'Inactiva' THEN 1 END) AS cuentas_inactivas,
    COUNT(CASE WHEN c.estado = 'Bloqueada' THEN 1 END) AS cuentas_bloqueadas,
    COUNT(CASE WHEN c.estado = 'Cerrada' THEN 1 END) AS cuentas_cerradas,
    COALESCE(SUM(CASE WHEN c.estado = 'Activa' THEN c.saldo ELSE 0 END), 0) AS saldo_total_activo,
    COALESCE(SUM(c.saldo), 0) AS saldo_total_general
FROM cooperativas coop
LEFT JOIN cuentas c ON coop.id_cooperativa = c.id_cooperativa
GROUP BY coop.id_cooperativa, coop.nombre, coop.ruc;

COMMENT ON VIEW resumen_cuentas_por_cooperativa IS 'Resumen estadístico de cuentas por cooperativa';

-- =====================================================
-- 11. DATOS INICIALES (Opcional)
-- =====================================================
-- Descomenta esta sección si quieres crear un usuario administrador inicial

/*
-- Crear usuario administrador inicial
-- Contraseña por defecto: "Admin123" (debes cambiarla después del primer login)
-- Hash SHA256 de "Admin123": 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9

INSERT INTO usuarios (
    nombres, 
    apellidos, 
    correo, 
    contrasena_hash, 
    rol, 
    cargo
) VALUES (
    'Administrador',
    'Sistema',
    'admin@anaos.com',
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
    'Administrador',
    'Administrador del Sistema'
) ON CONFLICT (correo) DO NOTHING;
*/

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
-- Verificación de tablas creadas
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN ('cooperativas', 'agencias', 'usuarios', 'cuentas', 'usuario_agencia')
ORDER BY table_name;

-- Mostrar mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Script ejecutado exitosamente';
    RAISE NOTICE 'Todas las tablas han sido creadas';
    RAISE NOTICE '========================================';
END $$;

