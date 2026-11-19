# Registro de Decisiones de Arquitectura y Auditoría — DigitalBoard Frontend

Este documento registra los hallazgos de la auditoría inicial del proyecto, las decisiones de arquitectura adoptadas y la deuda técnica sugerida para el backend.

---

## 1. Auditoría Inicial (Fase 0)

### 1.1 Contrato del Backend
- **Base URL**: `http://localhost:8081/api/v1`
- **Recursos existentes en Spring Boot**:
  - `User`: `/users` (CRUD completo).
  - `Topic`: `/topics` (CRUD completo; DELETE falla con 400 si contiene publicaciones asociadas). Asimetría: el request espera `topicDescription` pero el response entrega `description`.
  - `Post`: `/posts` (crear, obtener por ID, obtener por topic `/posts/topic/{topicId}`, actualizar, eliminar). **No existe endpoint para listar todas las publicaciones**.
  - `Comment`: `/comments` (crear, obtener por ID, obtener por post `/comments/post/{postId}`, actualizar, eliminar).
  - `Auth`: Existe un controlador preliminar con sesión HTTP en `/auth/login`, pero el contrato general y las pruebas de la especificación solicitan una sesión de identificación desacoplada en el cliente con cookie de persistencia `db_session` y consulta a `/users`.
- **Particularidades detectadas**:
  - `PUT /users/{id}` requiere campo `password` (mínimo 8 caracteres) en el DTO de validación, por lo que el formulario de edición de perfil debe solicitar contraseña actual o nueva.
  - `PUT /posts/{id}` y `PUT /comments/{id}` reciben `userId` y `topicId`/`postId`; deben mantenerse los valores originales del autor para evitar transferir la autoría de forma accidental.
  - Fechas (`LocalDate`) retornan cadenas `"YYYY-MM-DD"`. Para evitar desfasajes en husos horarios (ej. Colombia UTC-5), deben analizarse extrayendo año, mes y día de forma determinista.

### 1.2 Problemas encontrados en el prototipo inicial de `nuxt-app/`
1. **Dominio falso (modelo Brainly)**: Componentes y páginas hacían referencia a grados de la ESO, materias escolares, puntos de reputación, insignias, likes y solución aceptada. Todo esto se descarta en favor del dominio real del backend (Temáticas, Publicaciones, Comentarios y Usuarios).
2. **Duplicación de estado**: Existían stores de Pinia y composables con `useState` desconectados. Se unifica el estado global exclusivamente en **Pinia** con `@pinia/nuxt`.
3. **Configuración de componentes**: Nuxt 4 prefija carpetas por defecto (ej. `CommonAppHeader`). Se configura `components: [{ path: '~/components', pathPrefix: false }]` para autoimportación limpia sin prefijos redundantes.
4. **Carga duplicada de Vuetify**: Se utilizaba `vite-plugin-vuetify` con `autoImport: true` junto con `import * as components` en el plugin. Se optimiza el plugin para apoyarse en el autoimportador de componentes y mantener `directives` y estilos.
5. **Ubicación de dependencias**: `vuetify` figuraba en `devDependencies`, moviéndose a `dependencies` para soporte en SSR y producción.

---

## 2. Decisiones de Arquitectura Frontend

1. **Estrategia para Muro Principal (sin `GET /posts`)**:
   - Para mostrar todas las publicaciones en `/`, se obtienen las temáticas (`GET /topics`) y luego en paralelo mediante `Promise.allSettled` se solicitan los posts de cada temática (`GET /posts/topic/{id}`).
   - Los resultados se aplanan y se ordenan descendentemente por fecha (`createdAt`) y, como desempate estable, por `postId`.
   - Se mantiene un caché en `postsByTopic` dentro del store para evitar recargas innecesarias al navegar a `/topics/{id}`.
2. **Autenticación e Identificación**:
   - Dado que el backend no utiliza JWT ni retorna hash de contraseña, la sesión de usuario se mantiene mediante el identificador `userId` guardado en una cookie `db_session` (7 días, SameSite=Lax).
   - Al cargar la aplicación se rehidrata el usuario actual vía `GET /users/{id}`.
   - En el inicio de sesión se busca el usuario por email.
   - Los permisos de edición/eliminación se evalúan con `canEdit(ownerUserId)`: permitido si el usuario es `ADMIN` o si coincide su `userId`.
3. **Mapeo del Modelo de Temáticas (Topic)**:
   - En el servicio `topics.api.ts` se normaliza la asimetría: el dominio interno usa `Topic { id, name, description }`, convirtiendo `topicDescription` al enviar y leyendo `description` al recibir.
4. **Seguridad y Renderizado**:
   - Se prohíbe el uso de `v-html` en descripciones y comentarios de usuarios para prevenir XSS. Se utiliza `white-space: pre-line` sobre texto plano.
   - Las imágenes cargadas por URL usan `referrerpolicy="no-referrer"` y manejo de errores con fallback visual en `ImagePreview`.

---

## 3. Sugerencias de Mejora para el Backend (Deuda Técnica)

1. **Autenticación robusta con JWT**: Implementar `POST /auth/login` con emisión de tokens JWT e intercepción en el backend para validar propiedad de recursos (`userId` de autor) en endpoints de modificación y eliminación.
2. **Endpoint de listado global y paginación**: Crear `GET /posts` con soporte para filtros por query (`?q=`), temática (`?topicId=`), usuario (`?userId=`), ordenamiento y paginación con `Pageable`.
3. **Contador de comentarios en Post**: Incluir el campo `commentCount` directamente en `PostResponseDTO` para evitar consultas N+1 en vistas de lista.
4. **Normalización de Topic**: Unificar el nombre del campo de descripción en `TopicResponseDTO` y `TopicRequestDTO` (ambos `topicDescription` o ambos `description`).
5. **Flexibilidad en actualización de perfil**: Permitir que `PUT /users/{id}` reciba contraseña opcional o crear un endpoint específico `PATCH /users/{id}/password`.
