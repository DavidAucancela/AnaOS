# Instrucciones para Instalar SQL Server LocalDB

## Opción 1: Instalar LocalDB (Recomendado)

### Paso 1: Descargar LocalDB
1. Ve a: https://go.microsoft.com/fwlink/?LinkID=866658
2. Descarga e instala **SQL Server Express LocalDB**

### Paso 2: Verificar la Instalación
Abre PowerShell como Administrador y ejecuta:
```powershell
sqllocaldb info
```

Si LocalDB está instalado, verás las instancias disponibles.

### Paso 3: Crear/Iniciar Instancia (si es necesario)
```powershell
sqllocaldb create "MSSQLLocalDB"
sqllocaldb start "MSSQLLocalDB"
```

### Paso 4: Verificar la Conexión
La cadena de conexión en `appsettings.json` debería funcionar:
```json
"AnaOSConnectionString": "Server=(localdb)\\mssqllocaldb;Database=AnaOSDb;Trusted_Connection=True;MultipleActiveResultSets=true"
```

## Opción 2: Usar SQL Server Express

Si tienes SQL Server Express instalado, cambia la cadena de conexión a:
```json
"AnaOSConnectionString": "Server=.\\SQLEXPRESS;Database=AnaOSDb;Trusted_Connection=True;MultipleActiveResultSets=true"
```

O si tienes una instancia con nombre diferente:
```json
"AnaOSConnectionString": "Server=localhost;Database=AnaOSDb;Trusted_Connection=True;MultipleActiveResultSets=true"
```

## Opción 3: Usar SQL Server Developer Edition (Gratis)

1. Descarga SQL Server Developer Edition (gratis): https://www.microsoft.com/es-es/sql-server/sql-server-downloads
2. Durante la instalación, selecciona "Instancia con nombre" o "Instancia predeterminada"
3. Configura la cadena de conexión según tu instalación

## Después de Instalar

Una vez instalado LocalDB o SQL Server, ejecuta las migraciones:

```powershell
cd AnaOSProject
dotnet ef database update
```

Esto creará la base de datos automáticamente.




