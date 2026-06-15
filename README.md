# Taller Bucket - Proyecto S3 con LocalStack, Terraform, NestJS y Next.js

Este proyecto es una aplicación full-stack que utiliza **LocalStack** para emular un bucket de AWS S3 de manera local. La infraestructura está automatizada con **Terraform**, el backend está desarrollado en **NestJS** y el frontend en **Next.js**.

## 🚀 Requisitos Previos

Asegúrate de tener instalados los siguientes componentes antes de comenzar:
- [Docker](https://www.docker.com/products/docker-desktop) y Docker Compose
- [Terraform](https://developer.hashicorp.com/terraform/downloads)
- [Node.js](https://nodejs.org/es/) (Versión 18+ recomendada)
- [pnpm](https://pnpm.io/es/) (Opcional, pero sugerido para el frontend basado en tu configuración) o `npm`

---

## 🛠️ Pasos para levantar el proyecto

Sigue el orden de los siguientes pasos para ejecutar el proyecto correctamente en tu máquina local.

### 1. Iniciar LocalStack (Emulador de AWS)
Primero, levantaremos LocalStack, que proveerá el servicio de S3 localmente en el puerto `4566`.

Abre una terminal en la raíz del proyecto y ejecuta:
```bash
docker-compose up -d
```
*Verifica que el contenedor `TallerBucket-localstack` esté en ejecución.*

---

### 2. Provisionar la infraestructura (Terraform)
Una vez que LocalStack esté en ejecución, usaremos Terraform para crear nuestro bucket S3 (`tallerbucket-drive`).

Abre otra terminal, navega a la carpeta `terraform/` y ejecuta los siguientes comandos:
```bash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
```
*Esto creará el bucket S3 local con los permisos de acceso público configurados.*

---

### 3. Levantar el Backend (NestJS)
El backend se encarga de comunicarse con el S3 local. 

Navega a la carpeta `Backend/`, instala las dependencias y corre el servidor en modo desarrollo:
```bash
cd Backend
npm install
npm run start:dev
```
*Nota: El backend utilizará las credenciales y configuraciones definidas en `Backend/.env`, conectándose al puerto `3000` por defecto.*

---

### 4. Levantar el Frontend (Next.js)
El frontend proporciona la interfaz de usuario para interactuar con la aplicación.

Abre una nueva terminal, navega a la carpeta `Frontend/`, instala las dependencias y corre la aplicación web:
```bash
cd Frontend
npm install    # o 'pnpm install'
npm run dev    # o 'pnpm dev'
```
*Nota: Revisa en la consola en qué puerto se inicia Next.js (usualmente `http://localhost:3000` o `3001` si el backend ya está ocupando el `3000`).*

---

## 🛑 Cómo detener el entorno

Para detener el servidor de AWS S3 local y eliminar los contenedores generados:
```bash
docker-compose down
```
*(Si deseas destruir los recursos de terraform de manera explícita, puedes hacer `terraform destroy` en la carpeta `terraform/` antes de bajar los contenedores).*

## 🗂️ Estructura del Proyecto

- `/Frontend`: Aplicación web en Next.js, React y Tailwind.
- `/Backend`: API REST en NestJS configurada para el AWS SDK S3 apuntando al LocalStack.
- `/terraform`: Archivos IaC (Infrastructure as Code) para la creación del Bucket.
- `docker-compose.yml`: Archivo para el despliegue del LocalStack.
