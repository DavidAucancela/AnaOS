# Implementación Backend - Sistema de Suscripciones Mejorado

## Resumen

Se ha implementado completamente el backend para el sistema de suscripciones mejorado, incluyendo todos los nuevos campos, métodos y endpoints.

## Cambios Implementados

### 1. Repositorios Actualizados

#### `SuscripcionRepository.cs`
- ✅ Actualizado para usar estados en inglés (`active`, `canceled`, `pending`, etc.)
- ✅ Nuevo método: `GetSubscriptionsExpiringSoonAsync(int days = 30)`
- ✅ Nuevo método: `GetSubscriptionsForRenewalAsync()`

#### `PlanSuscripcionRepository.cs`
- ✅ Nuevo método: `GetPlansByTypeAsync(string tipoPlan)`
- ✅ Nuevo método: `GetFeaturedPlansAsync()`

### 2. Servicios Actualizados

#### `SuscripcionService.cs`
**Campos nuevos manejados:**
- ✅ `Moneda` - Soporte multi-moneda
- ✅ `RenovacionAutomatica` - Control de renovación automática
- ✅ `FechaCancelacion` - Fecha de cancelación
- ✅ `ProximaFechaCobro` - Próxima fecha de facturación
- ✅ `IdMetodoPago` - ID del método de pago en procesador
- ✅ `Ultimos4Digitos` - Últimos 4 dígitos de tarjeta
- ✅ `Notas` - Notas internas
- ✅ `MotivoCancelacion` - Razón de cancelación

**Lógica mejorada:**
- ✅ Conversión automática de estados y periodos (español → inglés)
- ✅ Cálculo automático de `ProximaFechaCobro` basado en `RenovacionAutomatica`
- ✅ Registro automático de `FechaCancelacion` al cancelar

**Nuevos métodos:**
- ✅ `GetSubscriptionsExpiringSoonAsync(int days = 30)` - Suscripciones próximas a vencer
- ✅ `GetSubscriptionsForRenewalAsync()` - Suscripciones listas para renovar
- ✅ `RenewSubscriptionAsync(int id, int? idUsuario = null)` - Renovar suscripción

**Mapeo DTO mejorado:**
- ✅ Incluye todos los nuevos campos
- ✅ Calcula `DiasRestantes` automáticamente
- ✅ Calcula `EstaPorVencer` (true si quedan ≤30 días)

#### `PlanSuscripcionService.cs`
**Campos nuevos manejados:**
- ✅ `TipoPlan` - basica, professional, enterprise, custom
- ✅ `Moneda` - Moneda del plan
- ✅ `MaxUsuarios`, `MaxAgencias`, `MaxCuentas` - Límites configurables
- ✅ `AlmacenamientoGb` - Almacenamiento en GB
- ✅ `SoportePrioritario`, `ApiAccess`, `CustomizacionBranding` - Características
- ✅ `Destacado` - Para mostrar en página de precios

**Nuevos métodos:**
- ✅ `GetByIdDTOAsync(int id)` - Obtener plan por ID como DTO
- ✅ `GetPlansByTypeAsync(string tipoPlan)` - Filtrar por tipo
- ✅ `GetFeaturedPlansAsync()` - Obtener planes destacados

**Validaciones:**
- ✅ Validación de `TipoPlan` (debe ser: basica, professional, enterprise o custom)

### 3. Controladores Actualizados

#### `SuscripcionController.cs`
**Endpoints existentes mejorados:**
- ✅ `POST /api/Suscripcion/ProcessPayment` - Actualizado para incluir nuevos campos

**Nuevos endpoints:**
- ✅ `GET /api/Suscripcion/ExpiringSoon/{days}` - Suscripciones próximas a vencer
- ✅ `GET /api/Suscripcion/ForRenewal` - Suscripciones listas para renovar
- ✅ `POST /api/Suscripcion/{id}/Renew` - Renovar suscripción

**DTO actualizado:**
- ✅ `ProcessPaymentDTO` incluye todos los nuevos campos

#### `PlanSuscripcionController.cs`
**Nuevos endpoints:**
- ✅ `GET /api/PlanSuscripcion/ByType/{tipoPlan}` - Filtrar planes por tipo
- ✅ `GET /api/PlanSuscripcion/Featured` - Obtener planes destacados

### 4. Interfaces Actualizadas

#### `ISuscripcionRepository`
- ✅ Agregados métodos nuevos para renovación y expiración

#### `ISuscripcionService`
- ✅ Agregados métodos nuevos para gestión avanzada

#### `IPlanSuscripcionRepository`
- ✅ Agregados métodos para filtrar por tipo y destacados

#### `IPlanSuscripcionService`
- ✅ Agregados métodos nuevos para gestión de planes

## Valores de Estado y Periodo

### Estados de Suscripción (en inglés)
- `active` - Suscripción activa
- `canceled` - Suscripción cancelada
- `expired` - Suscripción expirada
- `pending` - Pendiente de aprobación
- `past_due` - Pago vencido
- `suspended` - Suscripción suspendida

### Periodos (en inglés)
- `monthly` - Mensual
- `annual` - Anual

**Nota:** El sistema acepta valores en español y los convierte automáticamente a inglés.

## Tipos de Plan

- `basica` - Plan Básico
- `professional` - Plan Profesional
- `enterprise` - Plan Enterprise
- `custom` - Plan Personalizado

## Endpoints Disponibles

### Suscripciones

```
GET    /api/Suscripcion/ByCooperativa/{idCooperativa}
GET    /api/Suscripcion/Active/ByCooperativa/{idCooperativa}
GET    /api/Suscripcion/HasActive/{idCooperativa}
GET    /api/Suscripcion/ExpiringSoon/{days}
GET    /api/Suscripcion/ForRenewal
POST   /api/Suscripcion
POST   /api/Suscripcion/ProcessPayment
POST   /api/Suscripcion/{id}/Renew
POST   /api/Suscripcion/{id}/Cancel
PUT    /api/Suscripcion/{id}
```

### Planes de Suscripción

```
GET    /api/PlanSuscripcion
GET    /api/PlanSuscripcion/{id}
GET    /api/PlanSuscripcion/ByType/{tipoPlan}
GET    /api/PlanSuscripcion/Featured
POST   /api/PlanSuscripcion (Requiere: Administrador)
PUT    /api/PlanSuscripcion/{id} (Requiere: Administrador)
```

## Ejemplo de Uso

### Crear Suscripción con Nuevos Campos

```json
POST /api/Suscripcion/ProcessPayment
{
  "idCooperativa": 1,
  "idPlan": 2,
  "periodo": "monthly",
  "montoPagado": 79.99,
  "moneda": "USD",
  "renovacionAutomatica": true,
  "metodoPago": "Kushki",
  "idMetodoPago": "kushki_token_12345",
  "ultimos4Digitos": "1234",
  "notas": "Pago procesado exitosamente"
}
```

### Renovar Suscripción

```
POST /api/Suscripcion/1/Renew
```

### Obtener Suscripciones Próximas a Vencer

```
GET /api/Suscripcion/ExpiringSoon/30
```

### Obtener Planes por Tipo

```
GET /api/PlanSuscripcion/ByType/professional
```

## Próximos Pasos Recomendados

1. **Implementar Job de Renovación Automática**
   - Crear un servicio en segundo plano que ejecute `GetSubscriptionsForRenewalAsync()`
   - Procesar pagos automáticamente para suscripciones con `RenovacionAutomatica = true`
   - Llamar a `RenewSubscriptionAsync()` después de confirmar el pago

2. **Implementar Notificaciones**
   - Crear servicio de notificaciones para suscripciones próximas a vencer
   - Enviar emails/alertas cuando una suscripción esté por expirar

3. **Validaciones Adicionales**
   - Validar límites del plan (max_usuarios, max_agencias, etc.) antes de crear recursos
   - Implementar middleware para verificar suscripción activa en endpoints protegidos

4. **Reportes**
   - Crear endpoints para reportes de suscripciones
   - Estadísticas de renovaciones, cancelaciones, etc.

5. **Integración con Kushki**
   - Implementar integración real con API de Kushki
   - Manejar webhooks de Kushki para actualizar estados de pago

## Notas Importantes

- Todos los estados y periodos se manejan en inglés en la base de datos
- El sistema acepta valores en español y los convierte automáticamente
- Los campos de fecha se manejan en UTC
- La renovación automática está habilitada por defecto
- Los planes personalizados pueden tener límites NULL (ilimitados)

