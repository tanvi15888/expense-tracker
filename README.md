# Expense Tracker — Full-Stack Web Application

A full-stack expense management application built with **React, Spring Boot, PostgreSQL, and JWT authentication**. The application allows users to manage expenses, visualize spending patterns, and securely access their own expense records.

## Features

### Authentication and Security
- User registration and login.
- BCrypt password hashing.
- JWT-based authentication.
- Protected REST API endpoints.
- User-specific expense access and ownership checks.
- Logout functionality.

### Expense Management
- Create, view, update, and delete expenses.
- Categorize expenses and record amounts, dates, and payment methods.
- Associate each expense with the authenticated user.
- Prevent users from modifying another user's expenses.

### Dashboard and Analytics
- View total expenses.
- Track the number of expenses.
- Calculate average expense amounts.
- View spending totals by category.
- Visualize expense distribution using a pie chart.
- Review recent expenses.

### User and Payment Method Management
- Manage user records.
- Manage payment methods.
- Validate input and handle API errors.

### Developer Features
- REST APIs built with Spring Boot.
- PostgreSQL database integration.
- Swagger/OpenAPI API documentation.
- React frontend built with Vite.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, Vite, HTML, CSS |
| Charts | Recharts |
| Backend | Java 21, Spring Boot |
| Security | Spring Security, JWT, BCrypt |
| Database | PostgreSQL |
| Data access | Spring Data JPA, Hibernate |
| API documentation | Swagger/OpenAPI |
| Version control | Git, GitHub |

## Project Structure

```text
expense-tracker/
├── src/
│   ├── main/
│   │   ├── java/com/example/demo/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── exception/
│   │   │   ├── repository/
│   │   │   └── service/
│   │   └── resources/
│   └── test/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── pom.xml
├── mvnw
├── mvnw.cmd
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the application:

- Java Development Kit (JDK) 21.
- PostgreSQL.
- Node.js and npm.
- Git.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tanvi15888/expense-tracker.git
cd expense-tracker
```

### 2. Create the PostgreSQL database

Open PostgreSQL or pgAdmin and create a database named:

```sql
CREATE DATABASE expense_tracker;
```

If the database already exists, you do not need to create it again.

### 3. Configure the backend

Create a local file named `application.properties` inside:

```text
src/main/resources/
```

Add the following configuration:

```properties
spring.application.name=expense-tracker

spring.datasource.url=jdbc:postgresql://localhost:5432/expense_tracker
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=${JWT_SECRET}
jwt.expiration=86400000
```

This local configuration file is excluded from version control to help prevent credentials from being uploaded to GitHub.

### 4. Set environment variables

In Windows PowerShell, set your PostgreSQL credentials and generate a random JWT secret:

```powershell
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="YOUR_POSTGRES_PASSWORD"
$env:JWT_SECRET = ([guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N"))
```

Replace `YOUR_POSTGRES_PASSWORD` with the password configured on your own PostgreSQL installation.

Keep these variables set in the same PowerShell session where you start the backend.

**Security:** Do not commit database credentials or JWT secrets to GitHub. Use a strong, private secret for each environment.

### 5. Start the Spring Boot backend

From the repository root, run:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend should start at:

```text
http://localhost:8080
```

Swagger API documentation is available at:

```text
http://localhost:8080/swagger-ui.html
```

### 6. Start the React frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the frontend at:

```text
http://localhost:5173
```

Register an account, log in, and start managing expenses.

## API Overview

The backend provides REST endpoints for authentication, expenses, users, and payment methods.

| Resource | Purpose |
|---|---|
| `/auth/login` | Authenticate a user and return a JWT |
| `/users` | Register and manage user records |
| `/expenses` | Manage expense records |
| `/payment-methods` | Manage payment methods |

The React development server uses a proxy that removes the `/api` prefix from frontend requests before forwarding them to the backend. For example, the frontend login request to `/api/auth/login` is forwarded to `/auth/login`.

Protected endpoints require a valid JWT in the HTTP `Authorization` header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

See Swagger UI for the available endpoints and their request/response formats.

## Security Notes

- Passwords are hashed using BCrypt.
- JWTs are used to authenticate protected requests.
- Expense ownership is checked by the backend.
- Database credentials and JWT signing secrets must remain private.
- The local application configuration file is excluded from Git tracking.

For production deployment, configure secrets through the hosting platform's environment variables, use HTTPS, and configure the production database and frontend/backend URLs appropriately.

## Future Improvements

- Deploy the frontend and backend to public hosting.
- Add automated unit and integration tests.
- Add password reset and email verification.
- Improve reporting with monthly and yearly spending summaries.
- Add pagination and filtering for larger expense lists.

## Author

**Tanvi**

GitHub: [tanvi15888](https://github.com/tanvi15888)

## License

A license has not yet been selected for this project.
