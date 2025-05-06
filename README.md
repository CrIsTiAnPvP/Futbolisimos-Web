# Futbolisimos - Web

Futbolisimos es una plataforma web diseñada para los amantes del fútbol. Permite a los usuarios crear ligas, invitar amigos, gestionar equipos y competir entre ellos. Este README documenta la estructura del proyecto, con un enfoque especial en la API, para que cualquier desarrollador o usuario técnico pueda entender cómo funciona y cómo interactuar con el sistema.

---

## Tabla de Contenidos

1. [📖 Descripción General](#-descripción-general)
2. [🏗️ Estructura del Proyecto](#️-estructura-del-proyecto)
3. [⚙️ Configuración Inicial](#️-configuración-inicial)
	- [Requisitos Previos](#requisitos-previos)
	- [Estructura archivo .env](#estructura-del-archivo-env)
4. [📡 Estructura de la API](#-estructura-de-la-api)
	- [🔐 Autenticación](#-autenticación)
	- [👤 Usuarios](#-usuarios)
	- [🏆 Ligas](#-ligas)
	- [✉️ Invitaciones](#️-invitaciones)
	- [⚽ Equipos](#-equipos)
5. [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
6. [🤝 Contribuciones](#-contribuciones)

---

## 📖 Descripción General

Futbolisimos permite a los usuarios:

- Crear y gestionar ligas de fútbol.
- Invitar a otros usuarios a unirse a sus ligas.
- Configurar equipos y competir en ligas.
- Gestionar cuentas de usuario.

El proyecto utiliza **Next.js** como framework principal, con soporte para internacionalización (i18n) y autenticación mediante **NextAuth**. La base de datos está gestionada con **Prisma** y se utiliza **MongoDB** como sistema de almacenamiento.

---

## 🏗️ Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```bash
Futbolisimos-Web/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Páginas organizadas por idioma
│   │   ├── api/               # Endpoints de la API
│   │   └── layout.tsx         # Layout principal
│   ├── components/            # Componentes reutilizables
│   ├── i18n/                  # Configuración de internacionalización
│   ├── lib/                   # Utilidades compartidas
│   ├── prisma/                # Configuración de Prisma
│   └── provider/              # Proveedores de contexto (e.g., sesión)
├── .env                       # Variables de entorno
├── README.md                  # Documentación del proyecto
└── package.json               # Dependencias del proyecto
```

---

## ⚙️ Configuración Inicial

### Requisitos Previos

- **Node.js** v18+
- **MongoDB Atlas** o una instancia local de MongoDB
- Variables de entorno configuradas en un archivo `.env`

### Estructura del Archivo `.env`

El archivo `.env` debe contener las siguientes variables de entorno para el correcto funcionamiento del proyecto. Asegúrate de configurarlas con los valores adecuados:

```env
# Base de datos
DATABASE_URL="mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<nombre_base_datos>"

# Entorno de desarrollo
NODE_ENV=development

# Configuración de autenticación
AUTH_TRUST_HOST=true
# AUTH_REDIRECT_PROXY_URL=<url_proxy_redireccion>
# NEXTAUTH_URL_INTERNAL=<url_interna_nextauth>

# Credenciales de OAuth
AUTH_GITHUB_ID=<id_github>
AUTH_GITHUB_SECRET=<secreto_github>
AUTH_GOOGLE_ID=<id_google>
AUTH_GOOGLE_SECRET=<secreto_google>
AUTH_SPOTIFY_ID=<id_spotify>
AUTH_SPOTIFY_SECRET=<secreto_spotify>

# Claves públicas
NEXT_PUBLIC_API_KEY=<clave_api>
NEXT_PUBLIC_API_URL=<url_api>
NEXT_PUBLIC_INVITE_URL=<url_invitaciones>

# Secreto de autenticación
AUTH_SECRET=<secreto_autenticacion>
```

Asegúrate de no compartir este archivo públicamente, ya que contiene información sensible.

### Instalación

1. **Clona el repositorio:**

	```bash
	git clone https://github.com/tu-usuario/Futbolisimos-Web.git
	cd Futbolisimos-Web
	```

2. **Instala las dependencias:**

	```bash
	pnpm install
	```

3. **Configura las variables de entorno en el archivo `.env`:**

	```env
	DATABASE_URL="mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/futbolisimos"
	NEXT_PUBLIC_API_KEY="tu-api-key"
	```

4. **Ejecuta el servidor de desarrollo:**

	```bash
	pnpm run dev
	```

---

## 📡 Estructura de la API

La API de Futbolisimos está organizada en diferentes endpoints que permiten gestionar usuarios, ligas, invitaciones y equipos. A continuación, se documentan los principales endpoints:

### 🔐 Autenticación

**POST** `/api/auth`  

- **Descripción:** Maneja la autenticación de usuarios.  
- **Requiere:** Credenciales de OAuth (GitHub, Google, etc.).  
- **Respuesta:**

  ```json
  {
	"user": {
		"id": "123",
		"name": "Usuario",
		"email": "usuario@example.com"
	 }
  }
  ```

### 👤 Usuarios

**GET** `/api/user`

- **Descripción:** Obtiene información de un usuario por su ID.  
- **Parámetros de consulta:**
  - `id` (string): ID del usuario.  
- **Respuesta:**
  ```json
  {
	 "user": {
		"id": "123",
		"name": "Usuario",
		"email": "usuario@example.com"
	 }
  }
  ```

**POST** `/api/account`  

- **Descripción:** Actualiza la información de un usuario.  
- **Cuerpo de la solicitud:**

  ```json
  {
	 "id": "123",
	 "name": "Nuevo Nombre",
	 "apiKey": "tu-api-key"
  }
  ```

- **Respuesta:**

  ```json
  {
	 "message": "User updated successfully"
  }
  ```

### 🏆 Ligas

**GET** `/api/league` 

- **Descripción:** Obtiene información de una liga por su ID.  
- **Parámetros de consulta:**
  - `id` (string): ID de la liga.  
- **Respuesta:**

  ```json
  {
	 "liga": {
		"id": "456",
		"nombre": "Liga Ejemplo",
		"descripcion": "Descripción de la liga",
		"cantidadMiembros": 10
	 }
  }
  ```

**POST** `/api/league/create`  

- **Descripción:** Crea una nueva liga.  
- **Cuerpo de la solicitud:**

  ```json
  {
	 "id": "123",
	 "name": "Liga Ejemplo",
	 "description": "Descripción de la liga",
	 "image": "https://example.com/image.png",
	 "maxMembers": 20,
	 "apiKey": "tu-api-key",
	 "privateLeague": true
  }
  ```

- **Respuesta:**

  ```json
  {
	 "message": "League created successfully",
	 "league": {
		"id": "456",
		"nombre": "Liga Ejemplo"
	 }
  }
  ```

**DELETE** `/api/league/delete`  

- **Descripción:** Elimina una liga existente.  
- **Cuerpo de la solicitud:**

  ```json
  {
	 "id": "456",
	 "apiKey": "tu-api-key"
  }
  ```
- **Respuesta:**

  ```json
  {
	 "message": "League deleted successfully"
  }
  ```

### ✉️ Invitaciones

**POST** `/api/league/[liga]/invite/create`  

- **Descripción:** Crea una invitación para una liga.  
- **Cuerpo de la solicitud:**

  ```json
  {
	 "id": "123",
	 "apiKey": "tu-api-key",
	 "privada": true
  }
  ```

- **Respuesta:**

  ```json
  {
	 "message": "Invitation created successfully"
  }
  ```

**DELETE** `/api/league/[liga]/invite/delete`

- **Descripción:** Elimina una invitación existente.  
- **Cuerpo de la solicitud:**

  ```json
  {
	 "id": "789",
	 "apiKey": "tu-api-key"
  }
  ```

- **Respuesta:**

  ```json
  {
	 "message": "Invitation deleted successfully"
  }
  ```

### ⚽ Equipos

**GET** `/api/team/eteam`  

- **Descripción:** Obtiene los 10 equipos mejor valorados.  
- **Respuesta:**

  ```json
  [
	 {
		"id": "1",
		"nombre": "Equipo 1",
		"valor": 100
	 },
	 {
		"id": "2",
		"nombre": "Equipo 2",
		"valor": 95
	 }
  ]
  ```

---

## 🛠️ Tecnologías Utilizadas

- **Next.js:** Framework de React para aplicaciones web.
- **NextAuth:** Autenticación para Next.js.
- **Prisma:** ORM para la gestión de la base de datos.
- **MongoDB:** Base de datos NoSQL.
- **Tailwind CSS:** Framework de estilos CSS.
- **i18n:** Internacionalización para soporte multilenguaje.

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas colaborar, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad:

	```bash
	git checkout -b feature/nueva-funcionalidad
	```
	
3. Realiza tus cambios y haz un commit:

	```bash
	git commit -m 'Añadir nueva funcionalidad'
	```

4. Envía un pull request.

---

Si tienes preguntas o problemas, no dudes en abrir un issue en el repositorio.

¡Gracias por ser parte de Futbolisimos!
