# NestJS Blockchain Telegram Bot Template

A comprehensive NestJS template for building blockchain-integrated applications with Telegram bot functionality. This template provides a robust foundation for developing blockchain applications with features like Telegram bot integration, wallet management, queue processing, and more.

## Features

- **Blockchain Integration**: Built-in support for blockchain operations using ethers.js, including ERC20 token interactions and wallet management
- **Telegram Bot**: Complete Telegram bot implementation with command handlers, UI components, and state management
- **Database Integration**: TypeORM setup with PostgreSQL for data persistence
- **Queue System**: Bull queue implementation for handling asynchronous tasks
- **API Endpoints**: RESTful API endpoints with authentication and health checks
- **Swagger Documentation**: API documentation with Swagger UI
- **Worker Module**: Background task scheduling with NestJS Schedule
- **Docker Integration**: Docker and Docker Compose setup for easy deployment and development

## Prerequisites

- Node.js (v14+)
- pnpm
- PostgreSQL
- Redis (for queue system)

## Installation

```bash
# Install dependencies
$ pnpm install
```

## Configuration

Create a `.env` file in the root directory and add the necessary environment variables:

```
# App
PORT=3000
APP_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=nestjs_template

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Blockchain
BLOCKCHAIN_PROVIDER_URL=your_blockchain_provider_url
BLOCKCHAIN_PRIVATE_KEY=your_blockchain_private_key

# Queue
IS_QUEUE=1
IS_BOT=1
```

## Running the App

```bash
# Development mode
$ pnpm start:dev

# Production mode
$ pnpm start:prod

# Using Docker
$ docker-compose up
```

## Docker Scripts

The repository includes several convenience scripts:

```bash
# Start local environment
$ ./start-local.sh

# Restart local environment
$ ./restart-local.sh

# Stop all containers
$ ./stop.sh

# View server logs
$ ./server-logs.sh

# Connect to the container
$ ./connect.sh
```

## Project Structure

```
src/
├── app.module.ts        # Main application module
├── main.ts              # Application entry point
├── modules/             # Feature modules
│   ├── api/             # API endpoints
│   ├── blockchain/      # Blockchain integration
│   ├── database/        # Database configuration
│   ├── logger/          # Logging service
│   ├── queue/           # Queue system
│   ├── telegram-bot/    # Telegram bot implementation
│   └── worker/          # Background task scheduling
└── shared/              # Shared utilities and validators
```

## Adding New Features

### Adding a New Telegram Bot Command

1. Create a new handler in `src/modules/telegram-bot/handlers/`
2. Register the handler in the Telegram bot module
3. Define UI components in `src/modules/telegram-bot/ui/`

### Adding a New Blockchain Interaction

1. Update or add contract ABIs in `src/modules/blockchain/abi/`
2. Create a new smart contract interface in `src/modules/blockchain/smart-contracts/`
3. Implement the required methods in the wallet service or create a new service

## License

This project is [MIT licensed](LICENSE).
