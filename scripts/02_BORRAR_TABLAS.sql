-- =====================================================
-- Script de Eliminación de Tablas - Sistema AnaOS
-- Base de Datos: PostgreSQL
-- =====================================================
-- ADVERTENCIA: Este script eliminará TODAS las tablas y datos
-- Asegúrate de tener un backup antes de ejecutar este script
-- =====================================================

-- Desactivar temporalmente las restricciones de foreign key
SET session_replication_role = 'replica';

-- Eliminar vistas primero
DROP VIEW IF EXISTS resumen_cuentas_por_cooperativa CASCADE;
DROP VIEW IF EXISTS cuentas_con_cooperativa CASCADE;

-- Eliminar triggers primero
DROP TRIGGER IF EXISTS trigger_validar_cooperativa_cuenta ON cuentas;
DROP TRIGGER IF EXISTS trigger_actualizar_cooperativa ON cooperativas;
DROP TRIGGER IF EXISTS trigger_actualizar_usuario ON usuarios;
DROP TRIGGER IF EXISTS trigger_actualizar_cuenta ON cuentas;

-- Eliminar funciones
DROP FUNCTION IF EXISTS obtener_cuenta_completa(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS validar_cooperativa_cuenta() CASCADE;
DROP FUNCTION IF EXISTS actualizar_fecha_actualizacion() CASCADE;

-- Eliminar tablas en orden inverso de dependencias
DROP TABLE IF EXISTS usuario_agencia CASCADE;
DROP TABLE IF EXISTS cuentas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS agencias CASCADE;
DROP TABLE IF EXISTS cooperativas CASCADE;

-- Reactivar restricciones
SET session_replication_role = 'origin';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Todas las tablas han sido eliminadas';
    RAISE NOTICE 'Ejecuta 01_CREAR_TABLAS.sql para recrearlas';
    RAISE NOTICE '========================================';
END $$;

