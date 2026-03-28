# Trackwise Backend

A Node.js Express API for work time tracking with PostgreSQL and Prisma.

## Features

- MVC Architecture
- PostgreSQL Database with Prisma ORM
- JWT Authentication
- Rate Limiting
- Global Validation
- Docker Support
- CORS and Security Headers

## Tech Stack

- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: express-validator
- **Rate Limiting**: express-rate-limit
- **Security**: Helmet, CORS

## Project Structure

```
src/
├── config/
│   └── database.js          # Database connection
├── controllers/
│   ├── AuthController.js    # Authentication logic
│   └── WorkEntryController.js # Work entry logic
├── middleware/
│   ├── auth.js             # JWT authentication
│   ├── rateLimit.js        # Rate limiting
│   └── validation.js       # Request validation
├── models/
│   ├── User.js             # User model
│   └── WorkEntry.js        # Work entry model
├── routes/
│   ├── auth.js             # Authentication routes
│   └── workEntries.js      # Work entry routes
├── app.js                  # Express app setup
└── index.js                # Server entry point
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### Installation

1. Clone the repository
2. Navigate to backend directory
3. Install dependencies:

```bash
npm install
```

4. Set up environment variables:

Copy `.env` file and update the values:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/trackwise_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
NODE_ENV=development
```

5. Set up the database:

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### Running with Docker

1. Make sure Docker is installed
2. Run the application:

```bash
docker-compose up --build
```

The API will be available at `http://localhost:3000`

### Running Locally

1. Start PostgreSQL database
2. Run the application:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Work Entries (Protected)

- `GET /api/work-entries` - Get all work entries
- `GET /api/work-entries/:id` - Get work entry by ID
- `POST /api/work-entries` - Create work entry
- `PUT /api/work-entries/:id` - Update work entry
- `DELETE /api/work-entries/:id` - Delete work entry
- `GET /api/work-entries/summary` - Get work summary

### Health Check

- `GET /health` - Health check endpoint

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

### Testing

```bash
npm test
```

## Deployment

### Docker Deployment

```bash
docker build -t trackwise-backend .
docker run -p 3000:3000 trackwise-backend
```

### Environment Variables for Production

Make sure to set strong secrets for:

- `JWT_SECRET`
- `DATABASE_URL` (use connection pooling for production)

## License

ISC