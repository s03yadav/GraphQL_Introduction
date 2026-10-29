const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const axios = require('axios');
const cors = require('cors');

async function startServer() {
    const app = express();
    const server = new ApolloServer({

        // Resolvers are JavaScript functions that tell GraphQL 
        // how to fetch or calculate the data for a field.
        resolvers: {

            // defining a field in resolver where if inside Todo object one ask for userId it should be returned with user information connected with that id
            Todo: {
                userId: async (todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data
            },

            Query: {
                getAllUsers: async () => {
                    return (await axios.get("https://jsonplaceholder.typicode.com/users")).data
                },
                getTodos: async () => {
                    return (await axios.get("https://jsonplaceholder.typicode.com/todos")).data;
                },
                getUser: async (parent, { id }) => {
                    return (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data;
                }
            }
        },

        // typeDefs means type definitions. It describes the structure of your 
        // GraphQL API using GraphQL's schema definition language (SDL).
        typeDefs: `
            type Todo {
                id : Int!
                userId : Users
                title : String!
                completed : Boolean
            }

            type Users {
                id : Int!
                name : String!
                username : String!
                email : String!
                phone : String!
                website : String!
            }

            type Query {
                getTodos : [Todo]
                getAllUsers : [Users]
                getUser(id : Int!) : Users
            }
        `
    });
    app.use(cors());
    app.use(express.json());

    await server.start()


    app.use("/graphql", expressMiddleware(server));

    app.listen(8000, () => console.log(`Server Started at PORT 8000`));
}

startServer();