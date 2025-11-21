-----------------------------------------------------------------------------------------------------------------
---------------------------------------------usuarios--------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------
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

CREATE UNIQUE INDEX IF NOT EXISTS usuarios_correo_key ON usuarios(correo);
CREATE INDEX IF NOT EXISTS idx_usuarios_cooperativa ON usuarios(id_cooperativa);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);



EXPLAIN ANALYZE
SELECT * FROM Usuario WHERE correo = 'david@example.com';

EXPLAIN ANALYZE
select * from usuarios 



-----------------------------------------------------------------------------------------------------------------
---------------------------------------------cooperativas--------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------
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
CREATE UNIQUE INDEX IF NOT EXISTS cooperativas_ruc_key ON cooperativas(ruc);


-- actualizar campos
ALTER TABLE cooperativas
ADD COLUMN IF NOT EXISTS logo BYTEA,
ADD COLUMN IF NOT EXISTS nombre_logo VARCHAR(255);

-----------------------------------------------------------------------------------------------------------------
---------------------------------------------agencias------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------
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
CREATE INDEX IF NOT EXISTS idx_agencias_cooperativa ON agencias(id_cooperativa);

-----------------------------------------------------------------------------------------------------------------
---------------------------------------------cuentas------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------
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
    CONSTRAINT chk_estado_valido CHECK (estado IN ('Activa', 'Inactiva', 'Bloqueada', 'Cerrada'))
);

CREATE UNIQUE INDEX IF NOT EXISTS cuentas_numero_cuenta_key ON cuentas(numero_cuenta);
CREATE INDEX IF NOT EXISTS idx_cuentas_cooperativa ON cuentas(id_cooperativa);
CREATE INDEX IF NOT EXISTS idx_cuentas_estado ON cuentas(estado);

---------------------------------------------------------------------------------------------------
ALTER TABLE usuarios 
    DROP CONSTRAINT IF EXISTS usuarios_id_agencia_fkey,
    DROP COLUMN IF EXISTS id_agencia,
    ADD COLUMN IF NOT EXISTS id_cooperativa INTEGER REFERENCES cooperativas(id_cooperativa) ON DELETE SET NULL;
	
DROP TRIGGER IF EXISTS trigger_actualizar_cooperativa ON cooperativas;
DROP TRIGGER IF EXISTS trigger_actualizar_usuario ON usuarios;
DROP TRIGGER IF EXISTS trigger_actualizar_cuenta ON cuentas;

DROP TABLE IF EXISTS usuario_agencia CASCADE;
DROP TABLE IF EXISTS cuentas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS agencias CASCADE;
DROP TABLE IF EXISTS cooperativas CASCADE;


CREATE TABLE IF NOT EXISTS usuario_agencia (
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_agencia INTEGER NOT NULL REFERENCES agencias(id_agencia) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_agencia)
);
CREATE INDEX IF NOT EXISTS idx_usuario_agencia_usuario ON usuario_agencia(id_usuario);
CREATE INDEX IF NOT EXISTS idx_usuario_agencia_agencia ON usuario_agencia(id_agencia);

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


-- Verificación de tablas creadas
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN ('cooperativas', 'agencias', 'usuarios', 'cuentas', 'usuario_agencia')
ORDER BY table_name;


--crear
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


-- Insertar usuario sin archivo
INSERT INTO usuarios (
    nombres, 
    apellidos, 
    correo, 
    contrasena_hash,
	rol
) VALUES (
    'Michael Jose',
    'Perez Perez',
    'admin@anaos.com',
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
	'Administrador'
);

--convertir a hash
UPDATE usuarios 
SET contrasena_hash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809fecb37ac9'
WHERE correo = 'admin@anaos.com';

select * from usuarios
select * from cooperativas
select * from agencias
select * from public.usuario_agencia
