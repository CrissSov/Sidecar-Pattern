# 🧩 Arquitectura de Microservicios con NestJS y Sidecar Pattern

[![NestJS](https://img.shields.io/badge/NestJS-10.4.6-red.svg)](https://nestjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-20.0.0-blue.svg)](https://docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Esta arquitectura demuestra un ecosistema de **microservicios escalables y mantenibles** con **NestJS**, **gRPC**, **PostgreSQL**, **Redis**, **Kong Gateway** y un **Sidecar Service** que añade observabilidad, seguridad y resiliencia a la plataforma.

---

## 📘 Tabla de Contenidos

- [🏗️ Arquitectura General](#️-arquitectura-general)
- [🧠 Concepto del Sidecar](#-concepto-del-sidecar)
- [🚀 Servicios Principales](#-servicios-principales)
- [⚙️ Configuración del Entorno](#️-configuración-del-entorno)
- [🐳 Ejecución del Proyecto](#-ejecución-del-proyecto)
- [📡 Comunicación entre Servicios](#-comunicación-entre-servicios)
- [📊 Monitoreo y Logging Centralizado](#-monitoreo-y-logging-centralizado)
- [🧠 Seguridad y Validaciones SSL](#-seguridad-y-validaciones-ssl)
- [🌐 Configuración Dinámica y Tracing](#-configuración-dinámica-y-tracing)
- [🧪 Pruebas y Verificación](#-pruebas-y-verificación)
- [📄 Licencia](#-licencia)

---

## 🏗️ Arquitectura General

```mermaid
graph TB
    Client[Aplicaciones Cliente] --> Kong[Kong API Gateway<br/>:8000]
    Kong --> Auth[Auth Service<br/>:9001]
    Kong --> Post[Post Service<br/>:9002]
    Auth --> PostgreSQL[(PostgreSQL<br/>:5432)]
    Post --> PostgreSQL
    Auth --> Redis[(Redis<br/>:6379)]
    Post --> Redis
    Auth -.->|gRPC| Post
    Post -.->|gRPC| Auth
    Auth --> SidecarAuth[(Sidecar Agent - Auth)]
    Post --> SidecarPost[(Sidecar Agent - Post)]
    SidecarAuth --> CentralSidecar[Sidecar Core<br/>:9100]
    SidecarPost --> CentralSidecar
```



## 🧠 Concepto del Sidecar

El **Patrón Sidecar** permite agregar funcionalidades transversales (como monitoreo, seguridad o configuración) sin modificar el código del microservicio principal.  
Cada servicio tiene un **Sidecar Agent** independiente que se comunica con un **Sidecar Core centralizado**.

---

## 🧩 Beneficios

- Aislamiento y modularidad  
- Observabilidad avanzada  
- Despliegue independiente  
- Seguridad reforzada  
- Escalabilidad horizontal  

---

## 🚀 Servicios Principales

| Servicio | Descripción | Puerto | Comunicación |
|-----------|--------------|--------|---------------|
| 🔐 **Auth Service** | Gestión de autenticación y tokens JWT | 9001 | HTTP / gRPC |
| 📝 **Post Service** | CRUD de publicaciones y datos | 9002 | HTTP / gRPC |
| 🌐 **Kong Gateway** | Ruteo, API Management y seguridad | 8000 / 8001 | HTTP |
| 🗄️ **PostgreSQL** | Base de datos relacional | 5432 | TCP |
| ⚡ **Redis** | Cache y sesiones | 6379 | TCP |
| 👁️ **Sidecar Agents** | Observabilidad local (Auth / Post) | 9101, 9102 | HTTP |
| 📊 **Sidecar Core** | Agregador central de métricas/logs | 9100 | HTTP |

---

## ⚙️ Configuración del Entorno

### `.env` del Auth Service

```env
NODE_ENV=local
APP_NAME=@backendworks/auth
HTTP_PORT=9001
DATABASE_URL=postgresql://admin:master123@postgres:5432/postgres?schema=public
REDIS_URL=redis://redis:6379
GRPC_URL=0.0.0.0:50051
GRPC_PACKAGE=auth
SIDECAR_URL=http://sidecar-auth:9101
