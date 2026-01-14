# Vayu - User and Group Management API

A TypeScript-based REST API for managing users and groups with PostgreSQL database.

## Features

- **Get All Users with Pagination** - Retrieve users with limit and offset
- **Get All Groups with Pagination** - Retrieve groups with limit and offset
- **Remove User from Group** - Remove a user from a group and automatically update group status to 'empty' if no members remain

## Tech Stack

- **TypeScript** - Type-safe development
- **Express** - Web framework
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Database
- **Zod** - Input validation
- **Docker Compose** - Database containerization

## Project Structure

```
src/
├── db/
│   ├── schema.ts          # Database schema definitions
│   ├── connection.ts      # Database connection and pool
│   └── migrate.ts         # Migration runner
├── services/
│   ├── userService.ts     # User business logic
│   └── groupService.ts    # Group business logic
├── controllers/
│   ├── userController.ts  # User request handlers
│   └── groupController.ts # Group request handlers
├── routes/
│   ├── userRoutes.ts      # User routes
│   └── groupRoutes.ts     # Group routes
├── middleware/
│   ├── validation.ts      # Zod validation middleware
│   └── errorHandler.ts    # Error handling middleware
├── types/
│   └── index.ts           # Type definitions and Zod schemas
├── app.ts                 # Express app setup
└── index.ts               # Application entry point
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if needed (defaults should work with docker-compose).

3. **Start PostgreSQL with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

4. **Generate and run migrations:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Get All Users
```
GET /api/users?limit=10&offset=0
```

**Query Parameters:**
- `limit` (optional): Number of results per page (1-100, default: 10)
- `offset` (optional): Number of results to skip (default: 0)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 100,
    "hasMore": true
  }
}
```

### Get All Groups
```
GET /api/groups?limit=10&offset=0
```

**Query Parameters:**
- `limit` (optional): Number of results per page (1-100, default: 10)
- `offset` (optional): Number of results to skip (default: 0)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 50,
    "hasMore": true
  }
}
```

### Remove User from Group
```
DELETE /api/users/:userId/groups/:groupId
```

**Path Parameters:**
- `userId`: UUID of the user
- `groupId`: UUID of the group

**Response:**
```json
{
  "message": "User removed from group successfully",
  "groupStatusUpdated": true
}
```

**Notes:**
- If the user is the last member of the group, the group status will be automatically updated to 'empty'
- Returns 404 if user not found
- Returns 400 if user is not a member of the specified group

## Database Schema

### Users
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `groupId` (UUID, Foreign Key to Groups, Nullable)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Groups
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `status` (Enum: 'empty' | 'notEmpty')
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run format` - Format code with Prettier
- `npm run lint` - Check code formatting

## Performance Considerations

- Connection pooling (max 20 connections) for database scalability
- Efficient SQL COUNT queries for pagination
- Indexed foreign keys for fast lookups
- Pagination limits (max 100) to prevent large result sets

## Code Quality

- SOLID principles applied throughout
- Separation of concerns (Services, Controllers, Routes)
- Type-safe database queries with Drizzle
- Input validation with Zod
- Error handling middleware
- Prettier for code formatting

