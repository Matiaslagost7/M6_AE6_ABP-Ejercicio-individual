# Sistema de Gestión de Inventario - Plataforma Django

## 📋 Descripción del Proyecto

Este proyecto es una **plataforma web de gestión de inventario** desarrollada en Django que permite administrar productos con diferentes niveles de permisos para usuarios. El sistema incluye autenticación personalizada, manejo de grupos y permisos granulares para el control de acceso.

### 🎯 Características Principales

- **Gestión de Productos**: CRUD completo (Crear, Leer, Actualizar, Eliminar)
- **Sistema de Autenticación**: Login/logout personalizado
- **Control de Permisos**: Diferentes niveles de acceso según el usuario
- **Grupos de Usuario**: Administradores y Gestores de Productos
- **Panel Administrativo**: Interfaz administrativa de Django
- **Interfaz Responsiva**: Diseño adaptable para diferentes dispositivos

### 🛠️ Tecnologías Utilizadas

- **Backend**: Django 5.2.7
- **Base de Datos**: SQLite3
- **Frontend**: HTML5, CSS3, JavaScript
- **Autenticación**: Django Auth con modelo personalizado
- **Permisos**: Sistema de permisos personalizado de Django

---

## 👥 Sistema de Usuarios y Permisos

### 🔑 SuperUsuarios

#### **Mati7**
- **Tipo**: SuperUser
- **Contraseña**: Mati2000
- **Permisos**: 
  - Acceso completo al panel administrativo
  - Puede crear, editar y eliminar usuarios
  - Gestión completa de grupos y permisos
  - Acceso total al inventario

#### **Mati2000** 
- **Tipo**: SuperUser (Alternativo)
- **Contraseña**: [Definida por el administrador]
- **Permisos**: Mismos que Mati7

---

### 👤 Usuarios Normales

#### **Mati1** - Usuario de Solo Lectura
- **Permisos**:
  - ✅ `InventarioView`: Puede ver el inventario
  - ❌ No puede crear productos
  - ❌ No puede editar productos
  - ❌ No puede eliminar productos
- **Descripción**: Usuario con acceso de solo lectura al inventario

#### **Mati2** - Usuario Básico
- **Permisos**:
  - ✅ `InventarioView`: Puede ver el inventario
  - ✅ `CrearProductoView`: Puede crear productos
  - ❌ No puede editar productos
  - ❌ No puede eliminar productos
- **Descripción**: Usuario que puede consultar y agregar nuevos productos

#### **Mati3** - Usuario Avanzado
- **Permisos**:
  - ✅ `InventarioView`: Puede ver el inventario
  - ✅ `CrearProductoView`: Puede crear productos
  - ✅ `EditarProductoView`: Puede editar productos
  - ❌ No puede eliminar productos
- **Descripción**: Usuario con permisos de gestión completa excepto eliminación

#### **Mati4** - Administrador Staff
- **Tipo**: Usuario Staff
- **Permisos**:
  - ✅ Acceso al panel administrativo Django
  - ✅ Solo puede ver productos en el admin
  - ❌ Sin permisos de inventario en la aplicación principal
- **Descripción**: Administrador con acceso limitado al backend

---

### 🏢 Usuarios por Grupos

#### **Mati5** - Grupo Administradores
- **Grupo**: Administradores
- **Permisos del Grupo**:
  - ✅ `InventarioView`: Ver inventario
  - ✅ `CrearProductoView`: Crear productos
  - ✅ `EditarProductoView`: Editar productos
  - ✅ `EliminarProductoView`: Eliminar productos
- **Descripción**: Miembro del grupo con permisos administrativos completos

#### **Mati6** - Grupo Gestores de Productos
- **Grupo**: Gestores de Productos
- **Permisos del Grupo**:
  - ✅ `InventarioView`: Ver inventario
  - ✅ `CrearProductoView`: Crear productos
  - ✅ `EditarProductoView`: Editar productos
  - ❌ `EliminarProductoView`: NO puede eliminar productos
- **Descripción**: Miembro del grupo de gestores con permisos limitados

---

## 📊 Matriz de Permisos

| Usuario | Ver Inventario | Crear Producto | Editar Producto | Eliminar Producto | Admin Panel |
|---------|---------------|----------------|-----------------|------------------|-------------|
| **Mati7** (SuperUser) | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Mati2000** (SuperUser) | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Mati1** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Mati2** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Mati3** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Mati4** | ❌ | ❌ | ❌ | ❌ | ✅ (Solo ver) |
| **Mati5** (Administradores) | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Mati6** (Gestores) | ✅ | ✅ | ✅ | ❌ | ❌ |

---

## 🏗️ Estructura del Proyecto

```
plataforma/
├── manage.py
├── db.sqlite3
├── media/                  # Archivos multimedia
├── myapp/                  # Aplicación principal
│   ├── models.py          # Modelo Producto
│   ├── views.py           # Vistas principales
│   ├── forms.py           # Formularios
│   ├── urls.py            # URLs de la app
│   └── templates/         # Templates HTML
├── myapp_login/           # Aplicación de autenticación
│   ├── models.py          # CustomUser con permisos
│   ├── views.py           # Vistas de auth e inventario
│   ├── mixins.py          # Mixins de permisos
│   └── templates/         # Templates de login/inventario
└── plataforma/            # Configuración del proyecto
    ├── settings.py        # Configuraciones
    ├── urls.py           # URLs principales
    └── wsgi.py           # Configuración WSGI
```

## 🔐 Sistema de Permisos Personalizados

### Permisos Definidos en CustomUser:
- `InventarioView`: Permiso para ver el inventario
- `CrearProductoView`: Permiso para crear productos
- `EditarProductoView`: Permiso para editar productos
- `EliminarProductoView`: Permiso para eliminar productos

### Verificación de Permisos
El sistema utiliza el mixin `verificar_login_permiso` que:
- Verifica si el usuario está autenticado
- Comprueba si tiene el permiso específico requerido
- Redirige al login si no está autenticado
- Muestra mensaje de error si no tiene permisos

---

## 📱 Funcionalidades de la Aplicación

### 1. **Página de Inicio**
- Información general del sistema
- Acceso a login para usuarios

### 2. **Sistema de Autenticación**
- Login personalizado con validaciones
- Registro de usuarios con asignación a grupos
- Logout con mensajes personalizados

### 3. **Gestión de Inventario**
- **Ver Inventario**: Lista de todos los productos
- **Crear Producto**: Formulario para agregar productos
- **Editar Producto**: Modificación de productos existentes
- **Eliminar Producto**: Eliminación con confirmación

### 4. **Panel Administrativo**
- Gestión de usuarios y grupos
- Asignación de permisos
- Configuración del sistema

---
