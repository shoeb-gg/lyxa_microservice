# 🚀 NestJS Microservices Project

A monorepo containing two microservices built with NestJS, RabbitMQ message queuing, and Docker containerization.

## 📋 Project Overview

This project consists of two microservices:

### 🔐 Auth Service

- **Hybrid Service**: HTTP REST API + RabbitMQ Microservice
- **Endpoints**: User authentication (login, register, validate)
- **Message Patterns**: Token validation requests
- **Events**: Authentication events emission

### 📦 Product Service

- **HTTP REST API**: Full CRUD operations for products
- **Authentication**: Token validation via RabbitMQ messaging to Auth Service
- **Protected Routes**: All endpoints require valid JWT tokens

## 🏗️ Architecture

```
┌─────────────────┐    RabbitMQ     ┌─────────────────┐
│   Product API   │◄──────────────► │   Auth Service  │
│                 │    Messages     │                 │
│ • CRUD Products │                 │ • HTTP Auth API │
│ • Token Verify  │                 │ • Token Validate│
└─────────────────┘                 │ • Event Emitter │
                                    └─────────────────┘
```

### 🔄 Inter-Service Communication Flow

1. **Product Request**: Client sends product API request with JWT token
2. **Token Validation**: Product service sends token to Auth service via RabbitMQ
3. **Validation Response**: Auth service validates and responds via RabbitMQ
4. **API Response**: Product service returns data if token is valid

## 🛠️ Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Environment files (`.env`)

## ⚡ Quick Start

### 🐳 Using Docker Compose (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nestjs-microservices
   ```

2. **Add environment files**

   - Add `.env` files to both services (see examples below)
   - If not provided, please contact the project maintainer

3. **Start all services**

   ```bash
   docker-compose up
   ```

4. **Access the services**
   - Auth Service: `http://localhost:3001`
   - Product Service: `http://localhost:3002`
   - RabbitMQ Management: `http://localhost:15672` (guest/guest)

## 🐳 Docker Services

The Docker Compose setup includes:

- **Auth Service** - Port 3001
- **Product Service** - Port 3002
- **RabbitMQ** - Ports 5672, 15672

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

---

📧 **Need Help?** Contact the project maintainer for environment files or support.

🎯 **Happy Coding!** 🚀
