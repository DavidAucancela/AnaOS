-- =====================================================
-- Consultas Útiles - Sistema AnaOS
-- Base de Datos: PostgreSQL
-- =====================================================
-- Este archivo contiene consultas útiles para el sistema
-- =====================================================

-- =====================================================
-- 1. CONSULTAR CUENTAS CON DATOS COMPLETOS DE COOPERATIVA
-- =====================================================
-- Usa la vista cuentas_con_cooperativa para obtener todos los datos
SELECT * FROM cuentas_con_cooperativa
ORDER BY nombre_cooperativa, numero_cuenta;

-- =====================================================
-- 2. CONSULTAR CUENTAS DE UNA COOPERATIVA ESPECÍFICA
-- =====================================================
SELECT 
    c.*,
    coop.nombre AS nombre_cooperativa,
    coop.ruc,
    coop.direccion,
    coop.telefono,
    coop.correo
FROM cuentas c
INNER JOIN cooperativas coop ON c.id_cooperativa = coop.id_cooperativa
WHERE coop.id_cooperativa = 1  -- Cambiar por el ID de la cooperativa
ORDER BY c.numero_cuenta;

-- =====================================================
-- 3. RESUMEN DE CUENTAS POR COOPERATIVA
-- =====================================================
SELECT * FROM resumen_cuentas_por_cooperativa
ORDER BY nombre_cooperativa;

-- =====================================================
-- 4. VERIFICAR QUE UNA COOPERATIVA TENGA DATOS COMPLETOS
-- =====================================================
-- Útil antes de crear una cuenta
SELECT 
    id_cooperativa,
    nombre,
    ruc,
    direccion,
    telefono,
    correo,
    CASE 
        WHEN nombre IS NULL OR TRIM(nombre) = '' THEN 'Falta nombre'
        WHEN ruc IS NULL OR TRIM(ruc) = '' THEN 'Falta RUC'
        WHEN direccion IS NULL OR TRIM(direccion) = '' THEN 'Falta dirección'
        ELSE 'Datos completos'
    END AS estado_datos
FROM cooperativas
WHERE id_cooperativa = 1;  -- Cambiar por el ID de la cooperativa

-- =====================================================
-- 5. LISTAR COOPERATIVAS CON CUENTAS Y SALDO TOTAL
-- =====================================================
SELECT 
    coop.id_cooperativa,
    coop.nombre,
    coop.ruc,
    COUNT(c.id_cuenta) AS total_cuentas,
    COALESCE(SUM(CASE WHEN c.estado = 'Activa' THEN c.saldo ELSE 0 END), 0) AS saldo_total_activo,
    COALESCE(SUM(c.saldo), 0) AS saldo_total_general
FROM cooperativas coop
LEFT JOIN cuentas c ON coop.id_cooperativa = c.id_cooperativa
GROUP BY coop.id_cooperativa, coop.nombre, coop.ruc
ORDER BY coop.nombre;

-- =====================================================
-- 6. COOPERATIVAS SIN CUENTAS
-- =====================================================
SELECT 
    coop.*
FROM cooperativas coop
LEFT JOIN cuentas c ON coop.id_cooperativa = c.id_cooperativa
WHERE c.id_cuenta IS NULL;

-- =====================================================
-- 7. CUENTAS POR ESTADO
-- =====================================================
SELECT 
    estado,
    COUNT(*) AS cantidad,
    SUM(saldo) AS saldo_total
FROM cuentas
GROUP BY estado
ORDER BY estado;

-- =====================================================
-- 8. TOP 10 COOPERATIVAS POR SALDO TOTAL
-- =====================================================
SELECT 
    coop.nombre,
    coop.ruc,
    COALESCE(SUM(CASE WHEN c.estado = 'Activa' THEN c.saldo ELSE 0 END), 0) AS saldo_total
FROM cooperativas coop
LEFT JOIN cuentas c ON coop.id_cooperativa = c.id_cooperativa
GROUP BY coop.id_cooperativa, coop.nombre, coop.ruc
ORDER BY saldo_total DESC
LIMIT 10;

-- =====================================================
-- 9. VALIDAR INTEGRIDAD: CUENTAS SIN COOPERATIVA VÁLIDA
-- =====================================================
-- Esta consulta no debería retornar resultados si todo está bien
SELECT 
    c.id_cuenta,
    c.numero_cuenta,
    c.id_cooperativa
FROM cuentas c
LEFT JOIN cooperativas coop ON c.id_cooperativa = coop.id_cooperativa
WHERE coop.id_cooperativa IS NULL;

-- =====================================================
-- 10. COOPERATIVAS CON DATOS INCOMPLETOS
-- =====================================================
SELECT 
    id_cooperativa,
    nombre,
    ruc,
    direccion,
    CASE 
        WHEN nombre IS NULL OR TRIM(nombre) = '' THEN TRUE
        WHEN ruc IS NULL OR TRIM(ruc) = '' THEN TRUE
        WHEN direccion IS NULL OR TRIM(direccion) = '' THEN TRUE
        ELSE FALSE
    END AS tiene_datos_incompletos
FROM cooperativas
WHERE 
    nombre IS NULL OR TRIM(nombre) = ''
    OR ruc IS NULL OR TRIM(ruc) = ''
    OR direccion IS NULL OR TRIM(direccion) = '';

-- =====================================================
-- 11. FUNCIÓN PARA OBTENER DATOS COMPLETOS DE CUENTA
-- =====================================================
CREATE OR REPLACE FUNCTION obtener_cuenta_completa(p_id_cuenta INTEGER)
RETURNS TABLE (
    id_cuenta INTEGER,
    numero_cuenta VARCHAR,
    tipo_cuenta VARCHAR,
    saldo DECIMAL,
    moneda VARCHAR,
    estado VARCHAR,
    -- Datos de cooperativa
    id_cooperativa INTEGER,
    nombre_cooperativa VARCHAR,
    ruc_cooperativa VARCHAR,
    direccion_cooperativa VARCHAR,
    telefono_cooperativa VARCHAR,
    correo_cooperativa VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id_cuenta,
        c.numero_cuenta,
        c.tipo_cuenta,
        c.saldo,
        c.moneda,
        c.estado,
        coop.id_cooperativa,
        coop.nombre,
        coop.ruc,
        coop.direccion,
        coop.telefono,
        coop.correo
    FROM cuentas c
    INNER JOIN cooperativas coop ON c.id_cooperativa = coop.id_cooperativa
    WHERE c.id_cuenta = p_id_cuenta;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION obtener_cuenta_completa IS 'Función que retorna una cuenta con todos los datos de su cooperativa';

-- Ejemplo de uso:
-- SELECT * FROM obtener_cuenta_completa(1);

