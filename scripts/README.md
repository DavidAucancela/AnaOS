# Scripts SQL - Sistema AnaOS

Este directorio contiene los scripts SQL necesarios para crear y gestionar la base de datos del sistema AnaOS.

## 📋 Archivos Disponibles

### 1. `02_BORRAR_TABLAS.sql`
**⚠️ ADVERTENCIA**: Este script elimina TODAS las tablas y datos de la base de datos.

**Uso:**
```bash
psql -U postgres -d AnaOSDB -f 02_BORRAR_TABLAS.sql
```

**O desde pgAdmin:**
- Abre el archivo y ejecuta el script completo

### 2. `01_CREAR_TABLAS.sql`
Crea todas las tablas necesarias del sistema con:
- ✅ Estructura completa de tablas
- ✅ Constraints y validaciones
- ✅ Índices para optimización
- ✅ Triggers para actualización automática de fechas
- ✅ Comentarios en tablas y columnas

**Tablas creadas:**
- `cooperativas` - Información de cooperativas
- `agencias` - Agencias de cada cooperativa
- `usuarios` - Usuarios del sistema
- `cuentas` - Cuentas bancarias de las cooperativas
- `usuario_agencia` - Relación muchos a muchos (opcional)

**Uso:**
```bash
psql -U postgres -d AnaOSDB -f 01_CREAR_TABLAS.sql
```

### 3. `03_DATOS_INICIALES.sql`
Inserta datos iniciales para desarrollo y pruebas:
- Usuario administrador por defecto
- Cooperativas de ejemplo
- Agencias de ejemplo
- Usuarios de ejemplo
- Cuentas de ejemplo (solo si la cooperativa tiene datos completos)

### 4. `04_CONSULTAS_UTILES.sql`
Consultas útiles para el sistema:
- Consultar cuentas con datos completos de cooperativa
- Resumen de cuentas por cooperativa
- Validar integridad de datos
- Funciones útiles para consultas

**Credenciales por defecto:**
- **Email**: `admin@anaos.com`
- **Contraseña**: `Admin123`
- ⚠️ **IMPORTANTE**: Cambiar la contraseña después del primer login

**Uso:**
```bash
psql -U postgres -d AnaOSDB -f 03_DATOS_INICIALES.sql
```

## 🚀 Proceso de Instalación Completo

### Opción 1: Desde cero (Recomendado)

```bash
# 1. Conectarse a PostgreSQL
psql -U postgres

# 2. Crear la base de datos (si no existe)
CREATE DATABASE AnaOSDB;

# 3. Salir de psql
\q

# 4. Ejecutar scripts en orden
psql -U postgres -d AnaOSDB -f 02_BORRAR_TABLAS.sql
psql -U postgres -d AnaOSDB -f 01_CREAR_TABLAS.sql
psql -U postgres -d AnaOSDB -f 03_DATOS_INICIALES.sql
```

### Opción 2: Solo crear tablas (si ya tienes BD limpia)

```bash
psql -U postgres -d AnaOSDB -f 01_CREAR_TABLAS.sql
```

### Opción 3: Solo datos iniciales (si ya tienes tablas)

```bash
psql -U postgres -d AnaOSDB -f 03_DATOS_INICIALES.sql
```

## 📊 Estructura de Tablas

### Relaciones:
```
cooperativas (1) ──< (N) agencias
cooperativas (1) ──< (N) usuarios
cooperativas (1) ──< (N) cuentas
usuarios (N) ──< > (N) agencias (usuario_agencia)
```

### Constraints Importantes:

1. **usuarios.chk_rol_cooperativa**
   - Administrador y Gerente: `id_cooperativa IS NULL`
   - Otros roles: `id_cooperativa IS NOT NULL`

2. **cuentas.chk_saldo_positivo**
   - El saldo no puede ser negativo

3. **cuentas.chk_estado_valido**
   - Estados permitidos: Activa, Inactiva, Bloqueada, Cerrada

4. **Validación de Cooperativa Completa**
   - Antes de crear una cuenta, se valida que la cooperativa tenga:
     - Nombre válido (no NULL ni vacío)
     - RUC válido (no NULL ni vacío)
     - Dirección válida (no NULL ni vacío)
   - Esto se hace mediante trigger `trigger_validar_cooperativa_cuenta`

### Vistas Creadas:

1. **cuentas_con_cooperativa**
   - Muestra todas las cuentas con datos completos de su cooperativa
   - Facilita consultas que necesitan información completa

2. **resumen_cuentas_por_cooperativa**
   - Resumen estadístico de cuentas por cooperativa
   - Incluye totales, estados y saldos

## 🔍 Verificación

Después de ejecutar los scripts, puedes verificar con:

```sql
-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Contar registros
SELECT 
    'cooperativas' as tabla, COUNT(*) as registros FROM cooperativas
UNION ALL
SELECT 'agencias', COUNT(*) FROM agencias
UNION ALL
SELECT 'usuarios', COUNT(*) FROM usuarios
UNION ALL
SELECT 'cuentas', COUNT(*) FROM cuentas;
```

## ⚠️ Notas Importantes

1. **Backup**: Siempre haz un backup antes de ejecutar `02_BORRAR_TABLAS.sql`

2. **Contraseñas**: Las contraseñas en `03_DATOS_INICIALES.sql` están en hash SHA256. Cambia las contraseñas después del primer login.

3. **Roles**: Los roles válidos son:
   - `Administrador` - Acceso total
   - `Gerente` - Puede ver todas las cooperativas
   - `UsuarioCooperativa` - Solo su cooperativa

4. **Triggers**: Los triggers actualizan automáticamente `fecha_actualizacion` en las tablas correspondientes.

5. **Índices**: Los índices están optimizados para las consultas más comunes del sistema.

## 🐛 Solución de Problemas

### Error: "relation already exists"
- Ejecuta primero `02_BORRAR_TABLAS.sql` para limpiar

### Error: "constraint violation"
- Verifica que los datos cumplan con los constraints
- Revisa especialmente el constraint `chk_rol_cooperativa`

### Error: "permission denied"
- Asegúrate de tener permisos de superusuario o propietario de la BD

## 📝 Personalización

Si necesitas modificar los scripts:

1. **Cambiar nombres de tablas**: Busca y reemplaza en todos los archivos
2. **Agregar campos**: Modifica `01_CREAR_TABLAS.sql` y actualiza los modelos C#
3. **Cambiar datos iniciales**: Modifica `03_DATOS_INICIALES.sql`

## 🔗 Referencias

- Documentación de PostgreSQL: https://www.postgresql.org/docs/
- Modelos C# en: `AnaOSProject/Models/`
- DTOs en: `AnaOSProject/Models/DTOs/`

