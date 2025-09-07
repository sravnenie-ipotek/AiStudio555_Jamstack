# AI Studio E-Learning Platform

[Русская версия](#ai-studio-платформа-электронного-обучения)

## Overview

AI Studio is a modern e-learning platform built with JAMstack architecture, featuring a static frontend powered by Webflow templates and a headless CMS backend using Strapi v5. The platform provides comprehensive course management, user authentication, and content delivery capabilities.

## Architecture

```
Frontend (Static HTML) → Strapi API → PostgreSQL Docker
Port 3005/8000        → Port 1337   → Port 5432
```

## Features

- 🎓 **Course Management**: Create, manage, and deliver online courses
- 👥 **User Authentication**: Secure login and registration system
- 💳 **Payment Integration**: Support for Stripe, PayPal, and Razorpay
- 🌍 **Multi-language Support**: English, Russian, and Hebrew (RTL)
- 📱 **Responsive Design**: Mobile-first approach with Webflow templates
- 🚀 **Performance Optimized**: Static site generation with dynamic API content
- 📊 **Analytics Dashboard**: Track user progress and course performance

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Webflow templates)
- **Backend**: Strapi v5 (Headless CMS)
- **Database**: PostgreSQL (Docker container)
- **Deployment**: Railway (Production)
- **CDN**: Cloudflare/CloudFront (planned)

## Prerequisites

- Node.js v18+ 
- Docker & Docker Compose
- Python 3 (for development server)
- Git

## Installation

### 1. Clone the repository

```bash
git clone git@github.com:sravnenie-ipotek/AiStudio555_Jamstack.git
cd AiStudio555_Jamstack
```

### 2. Start PostgreSQL Database

```bash
docker-compose up -d postgres
```

### 3. Setup Strapi CMS

```bash
cd strapi-fresh
npm install
npm run develop
```

The Strapi admin panel will be available at http://localhost:1337/admin

### 4. Start Frontend Server

```bash
# From project root
python3 -m http.server 3005
```

Visit http://localhost:3005 to see the frontend.

## Development

### Start all services

```bash
# Start database
docker-compose up -d postgres

# Start Strapi (in strapi-fresh directory)
npm run develop

# Start frontend server (in project root)
python3 -m http.server 3005
```

### API Integration

The frontend communicates with Strapi via REST API. Configuration is in `webflow-strapi-integration.js`:

```javascript
const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = 'your-api-token-here';
```

### Generate API Token

1. Go to http://localhost:1337/admin
2. Navigate to Settings → API Tokens
3. Create new token with Full Access
4. Update token in `webflow-strapi-integration.js`

## Testing

```bash
# Run Cypress E2E tests
npx cypress open

# Run headless
npx cypress run
```

## Project Structure

```
/
├── strapi-fresh/           # Strapi CMS v5
├── authentication-pages/   # Auth UI templates
├── css/                    # Webflow styles
├── js/                     # Client scripts
├── images/                 # Static assets
├── Docs/                   # Documentation
├── cypress/e2e/           # E2E tests
├── docker-compose.yml     # Docker config
└── webflow-strapi-integration.js  # API integration
```

## Environment Variables

Create `.env` file in strapi-fresh directory:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
JWT_SECRET=your-jwt-secret
ADMIN_JWT_SECRET=your-admin-jwt-secret
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
FRONTEND_URL=http://localhost:3005
```

## Deployment

### Production (Railway)

1. Push to main branch
2. Railway will auto-deploy from GitHub
3. Configure environment variables in Railway dashboard
4. Update FRONTEND_URL and API endpoints

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is proprietary and confidential.

---

# AI Studio Платформа Электронного Обучения

## Обзор

AI Studio - это современная платформа электронного обучения, построенная на архитектуре JAMstack, с статическим фронтендом на основе шаблонов Webflow и безголовой CMS на базе Strapi v5. Платформа предоставляет комплексные возможности управления курсами, аутентификации пользователей и доставки контента.

## Архитектура

```
Фронтенд (Статический HTML) → Strapi API → PostgreSQL Docker
Порт 3005/8000             → Порт 1337  → Порт 5432
```

## Возможности

- 🎓 **Управление курсами**: Создание, управление и проведение онлайн-курсов
- 👥 **Аутентификация пользователей**: Безопасная система входа и регистрации
- 💳 **Интеграция платежей**: Поддержка Stripe, PayPal и Razorpay
- 🌍 **Мультиязычная поддержка**: Английский, русский и иврит (RTL)
- 📱 **Адаптивный дизайн**: Mobile-first подход с шаблонами Webflow
- 🚀 **Оптимизация производительности**: Генерация статического сайта с динамическим API контентом
- 📊 **Панель аналитики**: Отслеживание прогресса пользователей и эффективности курсов

## Технологический стек

- **Фронтенд**: HTML5, CSS3, JavaScript (шаблоны Webflow)
- **Бэкенд**: Strapi v5 (Безголовая CMS)
- **База данных**: PostgreSQL (Docker контейнер)
- **Развертывание**: Railway (Продакшн)
- **CDN**: Cloudflare/CloudFront (планируется)

## Требования

- Node.js v18+ 
- Docker и Docker Compose
- Python 3 (для сервера разработки)
- Git

## Установка

### 1. Клонирование репозитория

```bash
git clone git@github.com:sravnenie-ipotek/AiStudio555_Jamstack.git
cd AiStudio555_Jamstack
```

### 2. Запуск базы данных PostgreSQL

```bash
docker-compose up -d postgres
```

### 3. Настройка Strapi CMS

```bash
cd strapi-fresh
npm install
npm run develop
```

Админ-панель Strapi будет доступна по адресу http://localhost:1337/admin

### 4. Запуск фронтенд-сервера

```bash
# Из корневой директории проекта
python3 -m http.server 3005
```

Откройте http://localhost:3005 для просмотра фронтенда.

## Разработка

### Запуск всех сервисов

```bash
# Запуск базы данных
docker-compose up -d postgres

# Запуск Strapi (в директории strapi-fresh)
npm run develop

# Запуск фронтенд-сервера (в корневой директории)
python3 -m http.server 3005
```

### Интеграция с API

Фронтенд взаимодействует со Strapi через REST API. Конфигурация находится в `webflow-strapi-integration.js`:

```javascript
const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = 'ваш-api-токен';
```

### Генерация API токена

1. Перейдите на http://localhost:1337/admin
2. Откройте Настройки → API Токены
3. Создайте новый токен с полным доступом
4. Обновите токен в `webflow-strapi-integration.js`

## Тестирование

```bash
# Запуск Cypress E2E тестов
npx cypress open

# Запуск в headless режиме
npx cypress run
```

## Структура проекта

```
/
├── strapi-fresh/           # Strapi CMS v5
├── authentication-pages/   # Шаблоны UI аутентификации
├── css/                    # Стили Webflow
├── js/                     # Клиентские скрипты
├── images/                 # Статические ресурсы
├── Docs/                   # Документация
├── cypress/e2e/           # E2E тесты
├── docker-compose.yml     # Конфигурация Docker
└── webflow-strapi-integration.js  # Интеграция с API
```

## Переменные окружения

Создайте файл `.env` в директории strapi-fresh:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
JWT_SECRET=ваш-jwt-секрет
ADMIN_JWT_SECRET=ваш-admin-jwt-секрет
APP_KEYS=ваши-app-ключи
API_TOKEN_SALT=ваша-api-token-соль
FRONTEND_URL=http://localhost:3005
```

## Развертывание

### Продакшн (Railway)

1. Отправьте изменения в ветку main
2. Railway автоматически развернет из GitHub
3. Настройте переменные окружения в панели Railway
4. Обновите FRONTEND_URL и конечные точки API

## Участие в разработке

1. Сделайте форк репозитория
2. Создайте ветку функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Добавить потрясающую функцию'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## Лицензия

Этот проект является частной собственностью и конфиденциальным.

---

## Support / Поддержка

For issues and questions, please create an issue in the [GitHub repository](https://github.com/sravnenie-ipotek/AiStudio555_Jamstack/issues).

По вопросам и проблемам создайте issue в [GitHub репозитории](https://github.com/sravnenie-ipotek/AiStudio555_Jamstack/issues).