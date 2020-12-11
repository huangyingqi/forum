import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { MemData } from "./memData/memData";
import schema from './schema';

const app = express();
const server = new ApolloServer({
  schema,
});

// preload memData
MemData.getInstance();

server.applyMiddleware({ app, path: '/graphql' });
const httpServer = createServer(app);
httpServer.listen(
  { port: 3000 },
  (): void => {
    console.log(`\n GraphQL is now running on http://localhost:3000/graphql`)
  }
);