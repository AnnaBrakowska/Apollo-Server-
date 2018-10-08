// 1.added package.json - added some basic configurations (name and private)
// 2.installed packages: apollo-server and graphql
// 3. to instal run npm install --save apollo-server graphql
// 4.               npm install --save apollo-server-express graphql
// 5.               npm install --save cross-fetch    =>universal fetch for Node

// 5. CREATE NEW SERVER (apollo server will set and express server)
// 6. CREATE SCHEMA
// 7. CREATE RESOLVERS
// 8. INITIATE SERVER LISTENING FUNCTION
// 9. node server.js  => start server    control + C  => stop the server

//*****FUNCTIONALITY*****/
const fetch = require("cross-fetch");
const { ApolloServer, gql } = require("apollo-server");

//SCHEMA => we defined what our API will look like

const typeDefs = gql`
  type Person {
    id: ID!
    name: String!
    height: String
    films: [Film]
  }
  type Film {
    title: String
  }

  type Query {
    people(id: ID!): Person
  }
`;

//RESOLVER - the structure looks like whatever was done in schema, it is
//           LOGIC TO HOW THE SERVER WILL RESPOND, how each request is served
// A map of functions which return data for the schema.

const baseURL = `https://swapi.co/api/`;

const resolvers = {
  Person: {
    films: parent => {
      const promises = parent.films.map(async url => {
        const response = await fetch(url);
        return response.json();
      });
      return Promise.all(promises);
    }
  },
  Query: {
    people: (parent, args) => {
      const { id } = args;
      return fetch(`${baseURL}people/${id}`).then(res => res.json());
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

//we are staring the server here, by default it will listen to port 4000
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
