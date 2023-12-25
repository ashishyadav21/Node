# Express.js API with Swagger, JWT Authentication, and Zod

This is a simple Express.js API template that integrates Swagger (Nordman) for API documentation, JWT authentication for securing routes, and Zod for request validation.

## Features

- **Swagger (Nordman):** Auto-generated API documentation. View and test your API endpoints easily.
- **JWT Authentication:** Secure your routes using JSON Web Tokens.
- **Zod Request Validation:** Ensure that incoming requests meet the expected schema.

## Getting Started

1. **Clone the repository:**
    # https://github.com/ashishyadav21/Nodejs-Boilerplate.git

2. Install dependencies with 
    # npm install


2. Simply run on root directory to run it
    # npm start

3. Swagger Documentation
Access the Swagger documentation at http://localhost:3000/apis

4. Routes
Public Routes:
    POST /api/signin: Log in and get an authentication token.
Protected Routes:
   GET /api/user/userID: Get the user profile (requires authentication).


5. Request Validation with Zod
Requests to the API are validated using Zod schemas. Ensure that requests adhere to the specified schema to avoid validation errors.
