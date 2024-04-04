# Node Starter

## Overview
The Starter Backend project provides a foundation for building a Node.js backend server for web applications. It includes configurations, middleware, controllers, routes, and utilities to kickstart the development process. The project leverages modern technologies and best practices for efficient development and deployment.

## Usage
- Use the provided routes to handle user authentication and registration.
- Customize the routes and controllers to fit your application's needs.
- Modify the Prisma schema to define your database structure.

## Prerequisites
- code editor: [Recommended](https://code.visualstudio.com/download).
- docker descktop: [Docker Dowload](https://www.docker.com/products/docker-desktop/).
- Node.js: [Node Dowload](https://nodejs.org/en/download).

## Resources
- Prisma: [Prisma docs](https://www.prisma.io/docs).
- Docker: [Docker docs](https://docs.docker.com/).
- Docker Hub: [Container Image Library](https://hub.docker.com/).
- Node: [Node docs](https://nodejs.org/docs/latest/api/).
- npm: [commands](https://www.npmjs.com/package/download).
- JWT: [Introduction](https://jwt.io/introduction).
- Zod: [Zod docs](https://zod.dev/).
- TypeScript: [typeScript docs](https://www.typescriptlang.org/docs/).

## Features
- Express.js: A minimalist web framework for Node.js used for handling HTTP requests, routing, and middleware.
- Prisma: A modern database toolkit for Node.js and TypeScript, providing type-safe database access and powerful query capabilities.
- JWT Authentication: JSON Web Tokens (JWT) are used for user authentication and authorization, providing a stateless mechanism for securing endpoints.
- bcrypt: A library for hashing passwords securely, ensuring sensitive user information remains protected.
- Docker: Docker containers are utilized for packaging the application, enabling seamless deployment across different environments.
- Testing with Jest: Jest is employed for unit testing, ensuring the reliability and correctness of the application logic.

## Future Changes
- [ ] Integrating it with [Grafana](https://grafana.com/).
- [ ] Experiment and setting up PostgreSQL instead of sqlite3.
- [x] 

## Development Setup
1. Clone the Repository: Run `git clone https:github.com/filipetocchio/starter_node.git` to clone the starter_node repository to your local machine.
2. Install Dependencies: Run `npm install` to install project dependencies.
3. Set Environment Variables: Create a `.env` file based on the provided `.env.example` and fill in the required environment variables.
4. Run Development Server: Execute `npm run dev` to start the development server with Nodemon for automatic restarts on file changes.
5. Testing: Run `npm test` to execute unit tests with Jest.
6. Building for Production: Use `npm run build` to compile TypeScript files into JavaScript and generate a `dist` folder for production deployment.
7. Dockerization: Build Docker images for development (`npm run build`) and production (`npm run build-production`), then run them with Docker (`npm run server and npm run start` respectively).

## Setting up prisma shortcut with different Databases

### Setting up Prisma Shortcut with Sqlite

- Initialize Prisma with Sqlite: run `npx prisma init --datasource-provider sqlite` command to initialize a new Prisma directory with your Prisma schema file and configure Sqlite as your database provider. 
- Create the Sqlite Database and Tables: After initializing Prisma, you'll have a schema file, but no database yet. To create the Sqlite database and the tables defined in your schema, run `npx prisma migrate dev --name init` to generate and apply a migration named init, which creates the necessary database tables based on your model definitions.

### Setting up Prisma Shortcut with PostgreSQL

- Initialize Prisma with PostgreSQL: run `npx prisma init --datasource-provider postgresql` command to initialize a new Prisma directory with your Prisma schema file and configure PostgreSQL as your database provider. 
- Create the PostgreSQL Database and Tables: After initializing Prisma, you'll have a schema file, but no database yet. To create the PostgreSQL database and the tables defined in your schema, run `npx prisma migrate dev --name init` to generate and apply a migration named init, which creates the necessary database tables based on your model definitions.

### Setting up Prisma Shortcut with MongoDB

- Initialize Prisma with MongoDB: run `npx prisma init --datasource-provider mongodb` command to initialize a new Prisma directory with your Prisma schema file and configure MongoDB as your database provider. 
- Create the MongoDB Database and Collections: After initializing Prisma, you'll have a schema file, but no database yet. To create the MongoDB database and the collections defined in your schema, run `npx prisma migrate dev --name init` to generate and apply a migration named init, which creates the necessary collections based on your model definitions.


## package.json Scripts
In the provided `package.json` file, there are several scripts defined under the `"scripts"` section. Each script serves a specific purpose and can be executed using the `npm run` command followed by the script name.

Let's go through each script and understand what it does:

1. `"dev": "nodemon"`: This script uses `nodemon` to run your application in development mode. `nodemon` is a tool that automatically restarts the application whenever changes are detected in the source code. To run this script, you can use the command `npm run dev`.
2. `"migrate": "prisma migrate dev"`: This script executes the `prisma migrate dev` command, which applies pending migrations to your database as defined in your Prisma schema. Migrations manage changes to your database schema over time, ensuring that your database structure stays synchronized with your application's requirements. Use `npm run migrate` to run this script and update your database with any schema changes.
3. `"studio": "npx prisma studio"`: This script starts the Prisma Studio, which is a visual interface for exploring and managing your database. Prisma is an Object-Relational Mapping (ORM) tool. To run this script, you can use the command `npm run studio`.
4. `"build": "rimraf ./dist && tsc"`: This script is responsible for building your TypeScript code. It first removes the existing `dist` directory using `rimraf`, and then compiles the TypeScript code into JavaScript using `tsc` (TypeScript Compiler). The compiled code is placed in the `dist` directory. To run this script, you can use the command `npm run build`.
5. `"start": "npm run build && node dist/src/index.js"`: This script is used to start your application in production mode. It first runs the `"build"` script to compile the TypeScript code, and then executes the compiled JavaScript file `dist/src/index.js` using `node`. To run this script, you can use the command `npm start`.
6. `"test": "jest"`: This script runs your test suite using `jest`, which is a popular JavaScript testing framework. It executes all the test files in your project. To run this script, you can use the command `npm test`.
7. `"test:watch": "jest --watch"`: This script runs the test suite in watch mode. It continuously monitors the test files for changes and re-runs the tests whenever a change is detected. To run this script, you can use the command `npm run test:watch`.

To execute any of these scripts, open your terminal or integrated terminal in Visual Studio Code, navigate to the project directory where the `package.json` file is located, and run the desired script using the `npm run` command followed by the script name.

## Routes URL's
- Login url endpoint:
- `http://localhost:8001/api/v1/login`
- Logout url endpoint:
- `http://localhost:8001/api/v1/logout`
- Refesh access jwt url endpoint:
- `http://localhost:8001/api/v1/refresh/"id"`
- Register url endpoint:
- `http://localhost:8001/api/v1/register`

## Folder Structure
- `prisma/`: Directory containing the Prisma schema file defining the database structure.
  - `schema.prisma`: Prisma schema file.
- `src/`: Directory containing the source code of the application.
  - `config/`: Directory containing configuration files.
    - `allowedOrigins.ts`: File defining allowed origins for CORS policy.
    - `corsOptions.ts`: File defining CORS options.
    - `rolesList.ts`: File defining roles and their corresponding numeric values.
  - `controllers/`: Directory containing controller functions for handling requests.
    - `login.controller.ts`: Controller function for handling user login requests.
    - `logout.controller.ts`: Controller function for handling user logout requests.
    - `refreshToken.controller.ts`: Controller function for refreshing authentication tokens.
    - `register.controller.ts`: Controller function for handling user registration requests.
  - `interfaces/`: Directory containing TypeScript interfaces.
    - `interfaces.ts`: File containing interfaces used across the application.
  - `middleware/`: Directory containing middleware functions.
    - `credentials.ts`: Middleware for handling credentials.
    - `errorHandler.ts`: Express error handling middleware.
    - `logEvents.ts`: Middleware for logging events to files.
    - `verifyJWT.ts`: Middleware for verifying JWT tokens.
    - `verifyRoles.ts`: Middleware for verifying user roles.
  - `routes/`: Directory containing route definitions.
    - `LoginRouter.ts`: Router for handling login-related routes.
    - `LogoutRouter.ts`: Router for handling logout-related routes.
    - `RefreshRouter.ts`: Router for handling token refresh-related routes.
    - `RegisterRouter.ts`: Router for handling registration-related routes.
    - `routes.ts`: Main router file for mounting other routers.
  - `utils/`: Directory containing utility functions.
    - `prisma.ts`: Utility function for initializing Prisma client.
  - `server.ts`: Entry point file for starting the server.
- `.dockerignore`: Specifies files and directories to be excluded from Docker image builds.
- `.env.example`: Example environment configuration file containing placeholders for sensitive data like access tokens and database URLs.
- `.gitignore`: Specifies files and directories to be ignored by Git version control.
- `.nvmrc`: File specifying the Node.js version for NVM (Node Version Manager).
- `.prettierrc`: Prettier configuration file defining code formatting rules.
- `dockerfile`: Dockerfile for building the development Docker image.
- `dockerfile.production`: Dockerfile for building the production Docker image.
- `jest.config.js`: Jest configuration file for unit testing setup and options.
- `makefile`: Makefile for defining tasks related to Docker and development environment setup.
- `nodemon.json`: Nodemon configuration file for automatically restarting the server on file changes during development.
- `package-lock.json`: npm package lock file specifying exact versions of dependencies.
- `package.json`: npm package configuration file specifying dependencies, scripts, and project metadata.
- `README.md`: Main documentation file providing information about the project, installation, usage, and contribution guidelines.
- `tsconfig.json`: TypeScript configuration file specifying compiler options, paths, and project structure.

## Contributing
Contributions to the Starter Backend project are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License
This project is licensed under the []().
