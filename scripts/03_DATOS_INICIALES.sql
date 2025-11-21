-- =====================================================
-- Script de Datos Iniciales - Sistema AnaOS
-- Base de Datos: PostgreSQL
-- =====================================================
-- Este script crea datos iniciales para pruebas y desarrollo
-- =====================================================

-- =====================================================
-- 1. CREAR USUARIO ADMINISTRADOR INICIAL
-- =====================================================
-- Contraseña: "Admin123"
-- Hash SHA256: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
-- IMPORTANTE: Cambiar la contraseña después del primer login

INSERT INTO usuarios (
    nombres, 
    apellidos, 
    correo, 
    contrasena_hash, 
    rol, 
    cargo,
    celular
) VALUES (
    'Administrador',
    'Sistema',
    'admin@anaos.com',
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
    'Administrador',
    'Administrador del Sistema',
    '0999999999'
) ON CONFLICT (correo) DO NOTHING;

-- =====================================================
-- 2. CREAR COOPERATIVAS DE EJEMPLO (Opcional)
-- =====================================================

-- Cooperativa de ejemplo 1
INSERT INTO cooperativas (
    nombre,
    ruc,
    direccion,
    telefono,
    correo
) VALUES (
    'Cooperativa de Ahorro y Crédito San José',
    '0991234567001',
    'Av. Principal 123, Quito',
    '02-1234567',
    'contacto@coopsanjose.com'
) ON CONFLICT (ruc) DO NOTHING;

-- Cooperativa de ejemplo 2
INSERT INTO cooperativas (
    nombre,
    ruc,
    direccion,
    telefono,
    correo
) VALUES (
    'Cooperativa de Ahorro y Crédito Los Andes',
    '0991234567002',
    'Calle Bolívar 456, Guayaquil',
    '04-7654321',
    'info@coopandes.com'
) ON CONFLICT (ruc) DO NOTHING;

-- =====================================================
-- 3. CREAR AGENCIAS DE EJEMPLO (Opcional)
-- =====================================================

-- Agencia para la primera cooperativa
INSERT INTO agencias (
    id_cooperativa,
    nombre,
    codigo_interno,
    direccion,
    telefono,
    nombre_responsable,
    provincia,
    canton,
    ciudad,
    hora_apertura,
    hora_cierre
) 
SELECT 
    c.id_cooperativa,
    'Agencia Central Quito',
    'AG001',
    'Av. Principal 123, Quito',
    '02-1234567',
    'Juan Pérez',
    'Pichincha',
    'Quito',
    'Quito',
    '08:00:00',
    '17:00:00'
FROM cooperativas c
WHERE c.ruc = '0991234567001'
ON CONFLICT DO NOTHING;

-- Agencia para la segunda cooperativa
INSERT INTO agencias (
    id_cooperativa,
    nombre,
    codigo_interno,
    direccion,
    telefono,
    nombre_responsable,
    provincia,
    canton,
    ciudad,
    hora_apertura,
    hora_cierre
) 
SELECT 
    c.id_cooperativa,
    'Agencia Principal Guayaquil',
    'AG001',
    'Calle Bolívar 456, Guayaquil',
    '04-7654321',
    'María González',
    'Guayas',
    'Guayaquil',
    'Guayaquil',
    '09:00:00',
    '18:00:00'
FROM cooperativas c
WHERE c.ruc = '0991234567002'
ON CONFLICT DO NOTHING;

-- =====================================================
-- 4. CREAR USUARIOS DE COOPERATIVA DE EJEMPLO (Opcional)
-- =====================================================

-- Usuario para la primera cooperativa
-- Contraseña: "Usuario123"
-- Hash SHA256: 7c4a8d09ca3762af61e59520943dc26494f8941b

INSERT INTO usuarios (
    id_cooperativa,
    nombres,
    apellidos,
    correo,
    contrasena_hash,
    rol,
    cargo,
    celular
)
SELECT 
    c.id_cooperativa,
    'Carlos',
    'Rodríguez',
    'carlos.rodriguez@coopsanjose.com',
    '7c4a8d09ca3762af61e59520943dc26494f8941b',
    'UsuarioCooperativa',
    'Gerente de Operaciones',
    '0987654321'
FROM cooperativas c
WHERE c.ruc = '0991234567001'
ON CONFLICT (correo) DO NOTHING;

-- =====================================================
-- 5. CREAR CUENTAS DE EJEMPLO (Opcional)
-- =====================================================
-- IMPORTANTE: Las cuentas solo se pueden crear si la cooperativa
-- tiene todos sus datos completos (nombre, ruc, direccion)

-- Cuenta para la primera cooperativa
-- La cooperativa debe existir y tener datos completos
INSERT INTO cuentas (
    id_cooperativa,
    numero_cuenta,
    tipo_cuenta,
    saldo,
    moneda,
    estado,
    descripcion
)
SELECT 
    c.id_cooperativa,
    '001-1234567890',
    'Corriente',
    50000.00,
    'USD',
    'Activa',
    'Cuenta principal de operaciones'
FROM cooperativas c
WHERE c.ruc = '0991234567001'
    AND c.nombre IS NOT NULL 
    AND TRIM(c.nombre) != ''
    AND c.ruc IS NOT NULL 
    AND TRIM(c.ruc) != ''
    AND c.direccion IS NOT NULL 
    AND TRIM(c.direccion) != ''
ON CONFLICT (numero_cuenta) DO NOTHING;

-- Cuenta de ahorros para la primera cooperativa
INSERT INTO cuentas (
    id_cooperativa,
    numero_cuenta,
    tipo_cuenta,
    saldo,
    moneda,
    estado,
    descripcion
)
SELECT 
    c.id_cooperativa,
    '002-1234567891',
    'Ahorros',
    25000.00,
    'USD',
    'Activa',
    'Cuenta de ahorros'
FROM cooperativas c
WHERE c.ruc = '0991234567001'
    AND c.nombre IS NOT NULL 
    AND TRIM(c.nombre) != ''
    AND c.ruc IS NOT NULL 
    AND TRIM(c.ruc) != ''
    AND c.direccion IS NOT NULL 
    AND TRIM(c.direccion) != ''
ON CONFLICT (numero_cuenta) DO NOTHING;

-- Cuenta para la segunda cooperativa
INSERT INTO cuentas (
    id_cooperativa,
    numero_cuenta,
    tipo_cuenta,
    saldo,
    moneda,
    estado,
    descripcion
)
SELECT 
    c.id_cooperativa,
    '001-9876543210',
    'Corriente',
    75000.00,
    'USD',
    'Activa',
    'Cuenta principal'
FROM cooperativas c
WHERE c.ruc = '0991234567002'
    AND c.nombre IS NOT NULL 
    AND TRIM(c.nombre) != ''
    AND c.ruc IS NOT NULL 
    AND TRIM(c.ruc) != ''
    AND c.direccion IS NOT NULL 
    AND TRIM(c.direccion) != ''
ON CONFLICT (numero_cuenta) DO NOTHING;

-- =====================================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- =====================================================

SELECT 'Usuarios creados:' as tipo, COUNT(*) as cantidad FROM usuarios
UNION ALL
SELECT 'Cooperativas creadas:', COUNT(*) FROM cooperativas
UNION ALL
SELECT 'Agencias creadas:', COUNT(*) FROM agencias
UNION ALL
SELECT 'Cuentas creadas:', COUNT(*) FROM cuentas;

-- Mostrar usuarios creados
SELECT 
    id_usuario,
    nombres || ' ' || apellidos as nombre_completo,
    correo,
    rol,
    CASE 
        WHEN id_cooperativa IS NULL THEN 'Sin cooperativa'
        ELSE 'Cooperativa: ' || id_cooperativa::text
    END as cooperativa
FROM usuarios
ORDER BY id_usuario;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Datos iniciales insertados exitosamente';
    RAISE NOTICE 'Usuario Admin: admin@anaos.com';
    RAISE NOTICE 'Contraseña: Admin123';
    RAISE NOTICE 'IMPORTANTE: Cambiar la contraseña después del primer login';
    RAISE NOTICE '========================================';
END $$;

