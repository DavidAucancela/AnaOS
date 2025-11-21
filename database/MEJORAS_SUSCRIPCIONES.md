# Mejoras en el Sistema de Suscripciones

## Resumen de Cambios

Se ha mejorado significativamente el sistema de suscripciones para incluir tipos de planes (básica, professional, enterprise, custom) y campos adicionales para un mejor control y gestión.

## Cambios Realizados

### 1. Tabla `planes_suscripcion` - Mejoras

#### Campos Agregados:
- **`tipo_plan`**: VARCHAR(20) - Define el tipo de plan: 'basica', 'professional', 'enterprise', 'custom'
- **`moneda`**: VARCHAR(3) - Moneda del plan (default: 'USD')
- **`max_usuarios`**: INT - Límite de usuarios (NULL para ilimitado)
- **`max_agencias`**: INT - Límite de agencias (NULL para ilimitado)
- **`max_cuentas`**: INT - Límite de cuentas (NULL para ilimitado)
- **`almacenamiento_gb`**: INT - Almacenamiento en GB (NULL para ilimitado)
- **`soporte_prioritario`**: BOOLEAN - Indica si tiene soporte prioritario
- **`api_access`**: BOOLEAN - Indica si tiene acceso a API
- **`customizacion_branding`**: BOOLEAN - Indica si permite personalización de marca
- **`destacado`**: BOOLEAN - Para mostrar en la página de precios

#### Índices Agregados:
- Índice en `tipo_plan` para búsquedas rápidas
- Índice en `activo` para filtrar planes activos

### 2. Tabla `suscripciones` - Mejoras

#### Campos Agregados:
- **`fecha_cancelacion`**: TIMESTAMP - Fecha en que se canceló la suscripción
- **`proxima_fecha_cobro`**: TIMESTAMP - Próxima fecha de facturación
- **`moneda`**: VARCHAR(3) - Moneda de la suscripción (default: 'USD')
- **`renovacion_automatica`**: BOOLEAN - Indica si se renueva automáticamente (default: TRUE)
- **`id_metodo_pago`**: VARCHAR(255) - ID del método de pago en el procesador (ej: Kushki token)
- **`ultimos_4_digitos`**: VARCHAR(4) - Últimos 4 dígitos de tarjeta si aplica
- **`notas`**: TEXT - Notas internas sobre la suscripción
- **`motivo_cancelacion`**: TEXT - Razón de cancelación si aplica

#### Campos Mejorados:
- **`estado`**: Ahora incluye 'suspended' además de los estados anteriores
- **`periodo`**: Cambiado a valores en inglés: 'monthly', 'annual'
- **`metodo_pago`**: Aumentado a VARCHAR(100) para más flexibilidad

#### Índices Agregados:
- Índice en `id_cooperativa`
- Índice en `id_plan`
- Índice en `estado`
- Índice en `fecha_fin`
- Índice en `proxima_fecha_cobro`

#### Triggers Agregados:
- Trigger para actualizar automáticamente `fecha_actualizacion` en ambas tablas

### 3. Vistas Útiles Creadas

#### `vw_suscripciones_activas`
Vista que muestra todas las suscripciones activas con información completa del plan y días restantes.

#### `vw_suscripciones_por_vencer`
Vista que muestra suscripciones que vencen en los próximos 30 días, útil para notificaciones.

### 4. Datos Iniciales

Se han creado 4 planes predefinidos:
1. **Plan Básico** - $29.99/mes o $299.99/año
2. **Plan Profesional** - $79.99/mes o $799.99/año
3. **Plan Enterprise** - $199.99/mes o $1999.99/año
4. **Plan Personalizado** - Precio negociable

## Modelos C# Actualizados

### PlanSuscripcion.cs
- Agregado campo `TipoPlan`
- Agregados campos de características del plan
- Agregado campo `Moneda` y `Destacado`

### Suscripcion.cs
- Agregados campos de gestión de fechas (`FechaCancelacion`, `ProximaFechaCobro`)
- Agregado campo `RenovacionAutomatica`
- Agregados campos de método de pago mejorados
- Agregados campos `Notas` y `MotivoCancelacion`

### DTOs Actualizados
- `PlanSuscripcionDTO`, `PlanSuscripcionCreateDTO`, `PlanSuscripcionUpdateDTO`
- `SuscripcionDTO`, `SuscripcionCreateDTO`, `SuscripcionUpdateDTO`

### DbContext Actualizado
- Agregadas validaciones de constraints para `tipo_plan`, `estado` y `periodo`
- Configuraciones de precisión y valores por defecto

## Próximos Pasos Recomendados

1. **Migración de Base de Datos**: Ejecutar el script SQL para actualizar la estructura
2. **Actualizar Servicios**: Revisar y actualizar los servicios que manejan suscripciones
3. **Actualizar Controladores**: Asegurar que los endpoints manejen los nuevos campos
4. **Pruebas**: Realizar pruebas completas del flujo de suscripción
5. **Notificaciones**: Implementar sistema de notificaciones para suscripciones por vencer
6. **Renovación Automática**: Implementar lógica de renovación automática

## Notas Importantes

- Los valores de `estado` y `periodo` han cambiado a inglés para mantener consistencia
- El campo `renovacion_automatica` está habilitado por defecto
- Los planes personalizados pueden tener límites NULL (ilimitados)
- Las vistas creadas facilitan consultas comunes sin necesidad de joins complejos

