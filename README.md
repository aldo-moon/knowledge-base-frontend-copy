# 📚 Sistema de Base de Conocimientos con IA

Sistema integral de gestión de conocimiento empresarial con búsqueda semántica impulsada por IA, organización por áreas/puestos y chatbot inteligente.

## 🚀 Características Principales

### 📁 Gestión de Contenido
- **Carpetas jerárquicas** para organización estructurada
- **Temas con permisos** por área y puesto
- **Archivos adjuntos** con soporte multimedia
- **Borradores** para contenido en progreso
- **Papelera** con soft delete y recuperación

### 🤖 Inteligencia Artificial
- **Chatbot SIA** con respuestas contextuales
- **Embeddings vectoriales** para búsqueda semántica
- **Modelos configurables** con instrucciones personalizadas
- **Secciones temáticas** para mejor organización
- **Búsqueda por similitud** usando PostgreSQL + pgvector

### 👥 Control de Acceso
- **Permisos por área y puesto** a nivel de tema
- **Autores siempre ven su contenido** independiente de permisos
- **Borradores solo visibles** para el autor
- **Archivos adjuntos heredan permisos** del tema

### ⭐ Funcionalidades Extra
- **Sistema de favoritos** para acceso rápido
- **Historial de versiones** con soft delete
- **Vista "Mis Archivos"** con contenido del usuario
- **Búsqueda avanzada** con filtros múltiples

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js** - Framework React
- **TypeScript** - Tipado estático
- **CSS Modules** - Estilos componentes
- **Lucide React** - Iconografía
- **Lottie** - Animaciones

### Backend
- **Node.js + Express** - API REST
- **MongoDB** - Base de datos principal (carpetas, temas, archivos)
- **PostgreSQL + pgvector** - Almacenamiento de embeddings vectoriales
- **Python FastAPI** - Servicio de embeddings (sentence-transformers)

### Servicios Externos
- **AWS S3** - Almacenamiento de archivos
- **DeepSeek API** - Generación de respuestas del chatbot

## 📦 Estructura del Proyecto
```
knowledge-base/
├── frontend/
│   ├── components/
│   │   └── BaseConocimientos/
│   │       ├── Actions/          # Botones y acciones
│   │       ├── ChatbotWidget/    # Widget de chat IA
│   │       ├── Content/          # Vistas de contenido
│   │       ├── Details/          # Panel de detalles
│   │       ├── Files/            # Gestión de archivos
│   │       ├── Folders/          # Gestión de carpetas
│   │       ├── Header/           # Encabezados
│   │       ├── Modals/           # Modales
│   │       ├── Navigation/       # Navegación
│   │       ├── Search/           # Búsqueda
│   │       └── Themes/           # Gestión de temas
│   ├── hooks/                    # Custom hooks
│   ├── services/                 # Servicios API
│   └── styles/                   # Estilos globales
│
└── backend/
    ├── controller/               # Controladores
    ├── model/                    # Modelos MongoDB
    ├── routes/                   # Rutas API
    ├── services/                 # Servicios (vectores, embeddings)
    └── python-service/           # Servicio Python de embeddings
```

## 🔧 Instalación

### Requisitos Previos
- Node.js 16+
- MongoDB 5+
- PostgreSQL 14+ con extensión pgvector
- Python 3.9+
- AWS S3 configurado

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd knowledge-base
```

### 2. Backend (Node.js)
```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Servicio Python (Embeddings)
```bash
cd backend/python-service
pip install -r requirements.txt
```

### 4. Frontend
```bash
cd frontend
npm install
```

### 5. Base de Datos PostgreSQL
```sql
-- Crear base de datos
CREATE DATABASE knowledge_base;

-- Habilitar extensión pgvector
CREATE EXTENSION vector;

-- Tablas se crean automáticamente al iniciar
```

## ▶️ Ejecutar el Proyecto

### Desarrollo

**Backend:**
```bash
cd backend
npm run dev
```

**Servicio Python:**
```bash
cd backend/python-service
python main.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Acceder a: `http://localhost:3000`

## 🗄️ Modelos de Datos

### MongoDB

**Carpetas (Folders)**
- Estructura jerárquica
- Soft delete con `is_deleted`
- Relación con carpeta padre

**Temas (Topics)**
- Título, descripción, prioridad
- Permisos: `area_id[]`, `puesto_id[]`
- Autor: `author_topic_id`
- Estado: `is_draft`, `is_deleted`
- Archivos adjuntos: `files_attachment_id[]`
- Modelos IA: `modelo_id[]`
- Keywords para búsqueda

**Archivos (Files)**
- Metadata del archivo
- Ruta S3: `s3_path`
- Tipo de archivo: `type_file`
- Soft delete: `is_deleted`

### PostgreSQL

**tema_embeddings**
- Vectores de texto de temas
- Dimensión: 384 (MiniLM)
- Índice HNSW para búsqueda rápida

**archivo_embeddings**
- Vectores de contenido de archivos
- Extracción de texto PDF, DOCX, XLSX
- Chunks de ~300 palabras

## 🤖 Chatbot SIA

### Flujo de Funcionamiento

1. **Usuario hace pregunta** → Frontend envía a backend
2. **Backend genera embedding** → Llama a Python service
3. **Búsqueda vectorial** → PostgreSQL encuentra contenido similar
4. **Construcción de contexto** → Recopila chunks relevantes
5. **Generación de respuesta** → DeepSeek API con contexto
6. **Respuesta al usuario** → Con referencias a temas relacionados

### Configuración de Modelos

Los administradores pueden crear múltiples modelos de IA con:
- Nombre personalizado
- Instrucciones específicas (prompt)
- Secciones temáticas asociadas

## 🔐 Sistema de Permisos

### Lógica de Visibilidad

**Temas:**
- ✅ Visible si: `(esAutor) OR (área coincide AND puesto coincide AND !is_draft)`
- ❌ Oculto si: es borrador de otro usuario o no cumple área/puesto

**Archivos:**
- **Sueltos** (no en temas): Visibles para todos
- **Adjuntos a temas**: Heredan permisos del tema

## 🗑️ Sistema de Papelera

- **Soft Delete**: Marca como `is_deleted: true`
- **Archivos adjuntos**: Se marcan automáticamente al borrar tema
- **Embeddings**: Se marcan como eliminados en PostgreSQL
- **Restauración**: Revierte todos los cambios
- **Eliminación permanente**: Borra físicamente de MongoDB y PostgreSQL

## 🌟 Características Avanzadas

### Búsqueda Semántica
- Usa sentence-transformers (paraphrase-multilingual-MiniLM-L12-v2)
- Búsqueda por similitud coseno
- Threshold configurable de relevancia

### Gestión de Embeddings
- Generación automática al crear/editar temas
- Actualización incremental de chunks
- Eliminación en cascada

### Historial y Auditoría
- Fechas de creación y modificación
- Tracking de autores
- Métricas de similitud en búsquedas

## 📝 Variables de Entorno
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/knowledge_base

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=knowledge_base
POSTGRES_USER=usuario
POSTGRES_PASSWORD=password

# AWS S3
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=knowledge-base-files

# Python Service
EMBEDDING_SERVICE_URL=http://localhost:8000

# DeepSeek API
DEEPSEEK_API_KEY=tu_api_key
DEEPSEEK_API_URL=https://api.deepseek.com/v1
```

## 🐛 Troubleshooting

**Problema: Archivos no se ven después de borrar tema**
- ✅ Verificar que el modelo Archivo tenga campo `is_deleted`
- ✅ Verificar que getAllFilesFolders filtre por `is_deleted: false`

**Problema: Chatbot no responde**
- ✅ Verificar que el servicio Python esté corriendo
- ✅ Verificar conexión a PostgreSQL con pgvector
- ✅ Verificar API key de DeepSeek

**Problema: Permisos no funcionan**
- ✅ Verificar que usuario tenga `area` y `puesto` asignados
- ✅ Verificar conversión a números en comparaciones

## 👥 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 🙏 Agradecimientos

- Anthropic Claude por asistencia en desarrollo
- Sentence Transformers por el modelo de embeddings
- DeepSeek por el API de generación de respuestas

---

**Desarrollado para gestión inteligente del conocimiento empresarial**