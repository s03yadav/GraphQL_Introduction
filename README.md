# GraphQL Practice — Apollo Client & Apollo Server

A full-stack GraphQL practice project demonstrating how to build a GraphQL API using **Apollo Server, Express.js, and Node.js**, and consume it in a React application using **Apollo Client**.

The project fetches todo data and associated user information from the JSONPlaceholder API, exposing the data through a custom GraphQL API.

## Overview

This project demonstrates the fundamentals of GraphQL and how Apollo simplifies communication between a frontend and backend.

Instead of making multiple REST API requests directly from the React application, the client sends GraphQL queries to the Node.js server. Apollo Server resolves these queries by fetching data from JSONPlaceholder and returns only the requested fields.

### Key Features

- Build a GraphQL API using Apollo Server.
- Integrate Apollo Server with Express.js.
- Define GraphQL schemas using Type Definitions (`typeDefs`).
- Implement Resolvers to fetch and process data.
- Fetch external API data using Axios.
- Retrieve todos along with their associated user information.
- Consume GraphQL queries in React using Apollo Client.
- Manage client-side GraphQL requests using `useQuery`.
- Configure HTTP communication using `HttpLink`.
- Use `ApolloProvider` to make the Apollo Client available throughout the React application.
- Display API responses and handle loading and error states.

## Tech Stack

### Backend

- Node.js
- Express.js
- Apollo Server 5-compatible integration
- GraphQL
- Axios
- CORS

### Frontend

- React.js
- Vite
- Apollo Client 4
- HTML and CSS

### External API

- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) — provides sample users and todos for testing and development.

## Project Architecture

```text
React Frontend
      |
      | Apollo Client
      | useQuery()
      v
GraphQL HTTP Request
      |
      v
Express.js Server
      |
      v
Apollo Server
      |
      | GraphQL Schema
      | Query Resolvers
      | Todo Field Resolver
      v
Axios HTTP Requests
      |
      v
JSONPlaceholder API
      |
      v
GraphQL Response
      |
      v
React UI
```

## How It Works

### 1. GraphQL Schema — Type Definitions

The schema defines the structure of the data available through the GraphQL API.

Example:

```graphql
type Todo {
  id: Int!
  userId: Users
  title: String!
  completed: Boolean
}

type Users {
  id: Int!
  name: String!
  username: String!
  email: String!
  phone: String!
  website: String!
}

type Query {
  getTodos: [Todo]
  getAllUsers: [Users]
  getUser(id: Int!): Users
}
```

**Important concepts:**

- `typeDefs` defines the available object types, fields, and queries.
- `Int!` means the integer value cannot be null.
- `[Todo]` represents a list of todo objects.
- `Query` defines the entry points clients can request.
- `getUser(id: Int!)` accepts an argument to fetch a specific user.

### 2. Resolvers

Resolvers are JavaScript functions that determine how GraphQL fields obtain their values.

For example:

```javascript
Query: {
  getTodos: async () => {
    return (
      await axios.get(
        'https://jsonplaceholder.typicode.com/todos'
      )
    ).data;
  }
}
```

When the client requests `getTodos`, the resolver fetches the todo list from JSONPlaceholder and returns the data to Apollo Server.

### 3. Nested Data with Field Resolvers

Each todo contains a `userId` that refers to the user who owns that todo.

The field resolver converts that user ID into a user object:

```javascript
Todo: {
  userId: async (todo) => {
    return (
      await axios.get(
        `https://jsonplaceholder.typicode.com/users/${todo.userId}`
      )
    ).data;
  }
}
```

This enables the client to request nested data in a single GraphQL query.

For example:

```graphql
query GetTodosWithUser {
  getTodos {
    id
    title
    completed
    userId {
      id
      name
    }
  }
}
```

The response contains each todo along with the requested information about its associated user.

### 4. Apollo Server and Express Integration

Apollo Server handles GraphQL operations, while Express.js provides the HTTP server and middleware integration.

The server is configured with:

- `ApolloServer` — creates the GraphQL server.
- `expressMiddleware` — connects Apollo Server to Express.
- `cors()` — allows requests from a different frontend origin when permitted by the configured CORS policy.
- `express.json()` — parses incoming JSON request bodies.

The GraphQL endpoint is:

```text
http://localhost:8000/graphql
```

### 5. Apollo Client in React

Apollo Client connects the React application to the GraphQL server.

The client is configured using `HttpLink` and `InMemoryCache`:

```javascript
const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:8000/graphql'
  }),
  cache: new InMemoryCache()
});
```

`ApolloProvider` supplies the configured client to React components.

The `useQuery()` hook sends a query and provides its result, loading status, and error information.

Example:

```jsx
const { data, loading, error } = useQuery(query);
```

- `data` contains the GraphQL response.
- `loading` indicates whether the request is in progress.
- `error` contains information about a failed request or GraphQL operation.

**Note:** Apollo Client 4 uses `@apollo/client/react` for React-specific exports such as `ApolloProvider` and `useQuery`.

## Available GraphQL Operations

| Operation | Purpose |
|---|---|
| `getTodos` | Retrieves the todo list |
| `getAllUsers` | Retrieves all users |
| `getUser(id: Int!)` | Retrieves a specific user by ID |
| `Todo.userId` | Resolves the user associated with a todo |

## Use Cases of GraphQL and Apollo

### 1. Flexible Data Fetching

The frontend can request only the fields it needs, reducing unnecessary data transfer.

### 2. Fetching Related Data

GraphQL allows nested queries to retrieve related entities, such as todos and their associated users, through one client operation.

### 3. API Integration

Apollo Server can act as a unified API layer over external REST APIs, databases, and other data sources.

### 4. Frontend and Backend Separation

The React frontend does not need to know how the backend obtains the data. It only needs to know the available GraphQL schema.

### 5. Scalable Application Architecture

The same pattern can be extended to applications involving users, products, orders, posts, comments, dashboards, and other related resources.

### 6. Simplified Client-Side Data Management

Apollo Client provides query management, loading and error states, and an in-memory cache, helping reduce repetitive data-fetching logic in React.

## REST API vs GraphQL

| REST API | GraphQL |
|---|---|
| Typically uses multiple resource endpoints | Commonly exposes one GraphQL endpoint |
| Server defines the response structure for each endpoint | Client specifies the fields it needs |
| Related resources may require multiple requests | Nested fields can be fetched in one query |
| Responses are generally defined by the endpoint | Responses follow the requested GraphQL selection set |

GraphQL does not automatically make every request faster. Performance depends on resolver design, caching, query complexity, and the number of underlying data requests.

## Installation and Setup

### Prerequisites

- Node.js and npm
- Basic knowledge of JavaScript, React, and Express.js

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

### 2. Start the Backend

Navigate to the backend directory:

```bash
cd server
npm install
npm start
```

If no `start` script exists in `package.json`, run the backend entry point directly:

```bash
node index.js
```

The backend should run on:

```text
http://localhost:8000/graphql
```

### 3. Start the Frontend

Open another terminal and navigate to the React client directory:

```bash
cd client/graphQL_client
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

**Note:** Adjust the directory paths and npm commands according to your actual repository structure and `package.json` scripts.

## Learning Outcomes

Through this project, the following concepts are practiced:

- GraphQL schemas and the Schema Definition Language (SDL).
- Queries, arguments, object types, and nested fields.
- Resolver functions and asynchronous API requests.
- Apollo Server integration with Express.js.
- Fetching external REST API data using Axios.
- Apollo Client configuration and React integration.
- Using `useQuery()` to fetch GraphQL data.
- Handling loading and error states.
- Understanding communication between the frontend, GraphQL server, and external APIs.

## Future Improvements

- Add mutations to create, update, and delete todos.
- Implement pagination and filtering.
- Optimize nested resolvers using batching and DataLoader.
- Add authentication and authorization.
- Introduce a database such as MongoDB or PostgreSQL.
- Improve the UI with todo lists, user details, and completion status.
- Add automated tests for resolvers and GraphQL operations.

## Conclusion

This project provides a practical introduction to building and consuming GraphQL APIs with Apollo.

It demonstrates how Apollo Server exposes a structured API, how resolvers retrieve and connect data, and how Apollo Client enables React components to query that data efficiently.

The concepts learned here provide a foundation for developing full-stack applications with GraphQL.

---

**Built for learning and practicing GraphQL with Apollo Client, Apollo Server, React, and Node.js.**
