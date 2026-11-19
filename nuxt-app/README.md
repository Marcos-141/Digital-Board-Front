# Tablero Digital (DigitalBoard) — Frontend

Frontend completo para la plataforma **Tablero Digital (DigitalBoard)**, un muro colaborativo y tablón de anuncios estructurado para comunidades de aprendizaje, aulas virtuales y equipos de trabajo.

Construido con **Nuxt 4**, **Vue 3 (Composition API)**, **TypeScript estricto**, **Vuetify 4** y **Pinia**.

---

## 🚀 Tecnologías Principales

- **Framework**: [Nuxt 4](https://nuxt.com/) (estructura moderna basada en la carpeta `app/`)
- **Librería de Componentes**: [Vuetify 4](https://vuetifyjs.com/) con iconos `@mdi/font` y plugin oficial de Vite
- **Estado Global**: [Pinia](https://pinia.vuejs.org/) con `@pinia/nuxt`
- **Lenguaje**: TypeScript en modo estricto
- **Tipografía y Diseño**: Fuente Google Fonts *Outfit*, sistema de tokens CSS y paleta accesible con contraste AA

---

## 📋 Requisitos Previos

- **Node.js**: versión 18.x o superior (se recomienda 20.x+)
- **NPM** o gestor de paquetes compatible
- **Backend Spring Boot**: corriendo en `http://localhost:8081` (puerto definido en `DigitalBoard`)

---

## ⚙️ Configuración y Variables de Entorno

Copia el archivo de ejemplo para configurar la URL base de la API:

```bash
cp .env.example .env
```

Contenido de `.env`:

```env
NUXT_PUBLIC_API_BASE=http://localhost:8081/api/v1
```

Si no se define la variable, la aplicación utiliza por defecto `http://localhost:8081/api/v1`.

---

## 🛠️ Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo en http://localhost:3000
npm run dev

# 3. Inicializar temáticas predeterminadas en el backend (con el backend en :8081)
npm run seed

# 4. Compilar para producción (SSR / Node server)
npm run build

# 5. Previsualizar la compilación de producción
npm run preview

# 6. Comprobación estricta de tipos de TypeScript
npm run typecheck
```

---

## 🏛️ Arquitectura del Proyecto

```
nuxt-app/
├── app/
│   ├── api/                    # Capa de cliente HTTP, errores y servicios REST
│   │   ├── client.ts           # apiFetch con normalización a ApiError
│   │   ├── errors.ts           # Clase ApiError y tipado de respuestas de error
│   │   ├── users.api.ts        # Operaciones sobre /users
│   │   ├── topics.api.ts       # Mapeo Topic (topicDescription ⇄ description)
│   │   ├── posts.api.ts        # Operaciones sobre /posts
│   │   └── comments.api.ts     # Operaciones sobre /comments
│   ├── assets/
│   │   └── css/
│   │       └── main.css        # Tokens CSS (--db-*), utilidades y estilos globales
│   ├── components/             # Componentes sin prefijo (pathPrefix: false)
│   │   ├── auth/               # Formularios de inicio de sesión y registro
│   │   ├── board/              # Barra de herramientas, filtros y grilla del muro
│   │   ├── comment/            # Lista, ítem con edición inline y formulario
│   │   ├── common/             # Header, footer, estados (loading, empty, error), avatar, modal confirmación
│   │   ├── post/               # Tarjeta de publicación, modal de creación/edición
│   │   ├── topic/              # Tarjeta de temática, chip con color, modal creación
│   │   └── user/               # Avatar determinista, cabecera y tarjeta de miembro
│   ├── composables/            # useNotify, useConfirm, useTopicColor, useFormatDate, usePostDialog, useFormErrors
│   ├── layouts/
│   │   ├── default.vue         # Layout principal con skip-link accesible, header y footer
│   │   └── auth.vue            # Layout minimalista para /login
│   ├── middleware/
│   │   ├── auth.ts             # Exige sesión activa (redirige a /login con redirect)
│   │   └── guest.ts            # Redirige al muro si ya existe sesión
│   ├── pages/
│   │   ├── index.vue           # Muro colaborativo con filtros y búsqueda
│   │   ├── login.vue           # Ingreso y registro con pestañas
│   │   ├── profile/index.vue   # Mi perfil, publicaciones propias y zona de peligro
│   │   ├── topics/index.vue    # Catálogo y gestión de temáticas
│   │   ├── topics/[id].vue     # Publicaciones de una temática específica
│   │   ├── post/[id].vue       # Detalle de publicación y comentarios
│   │   ├── users/index.vue     # Directorio de miembros de la comunidad
│   │   ├── users/[id].vue      # Perfil público de un miembro
│   │   └── [...slug].vue       # Página 404 personalizada
│   ├── plugins/
│   │   └── vuetify.ts          # Configuración del tema y directivas de Vuetify
│   ├── stores/                 # Stores Pinia (auth, topics, posts, comments, users, board)
│   ├── types/                  # Contrato de la API (api.ts) y modelos de dominio (domain.ts)
│   └── utils/                  # Formateo de fechas para Colombia, validadores y cadenas
├── DECISIONES.md               # Registro de decisiones de arquitectura y deuda técnica
├── nuxt.config.ts              # Configuración principal de Nuxt
├── package.json
└── tsconfig.json
```

---

## 📌 Decisiones Clave y Estrategias del Frontend

1. **Estrategia del Muro Principal (sin `GET /posts`)**:
   - Como la API no dispone de un endpoint para listar todos los posts de una vez, el store `posts.ts` consulta las temáticas (`GET /topics`) y ejecuta consultas paralelas vía `Promise.allSettled` a `GET /posts/topic/{id}`.
   - Las publicaciones se unifican y se ordenan de forma descendente por fecha de creación (`createdAt`) y `postId`.
   - Se mantiene un caché en memoria por temática para optimizar la navegación.
2. **Sesión de Identificación**:
   - El backend opera sin autenticación JWT (`permitAll`). El frontend implementa una sesión de identificación desacoplada en `stores/auth.ts` utilizando una cookie segura `db_session` con el `userId`.
   - Al abrir la aplicación, el usuario se rehidrata consultando `GET /users/{id}`.
   - El control de permisos en la UI oculta las acciones de edición/eliminación salvo que el usuario sea el autor del recurso o tenga el rol `ADMIN`.
3. **Mapeo de Temáticas (Topic)**:
   - Resuelve la asimetría del backend: `TopicRequest` envía `topicDescription`, mientras que `TopicResponse` devuelve `description`.
4. **Fechas en zona horaria local**:
   - Los strings `"YYYY-MM-DD"` se interpretan extrayendo año, mes y día de forma determinista (evitando que el huso UTC-5 de Colombia muestre el día anterior).
5. **Seguridad**:
   - Prohibido el uso de `v-html`. Todo contenido de usuarios se muestra en texto plano con `white-space: pre-line` y sanitización de URLs de imágenes.

---

## ⚠️ Limitaciones Conocidas

- La API actual no dispone de paginación del lado del servidor ni ordenamiento remoto; las búsquedas y ordenamientos se realizan en el cliente sobre las publicaciones cargadas.
- `PUT /users/{id}` en el backend exige siempre contraseña (mínimo 8 caracteres) en su DTO de validación, por lo que el formulario de edición de perfil la solicita obligatoriamente.
- `DELETE /topics/{id}` falla con código 400 si la temática contiene publicaciones; la interfaz muestra el mensaje retornado por el servidor.
