const { GraphQLServer } = require("graphql-yoga");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "FullStack tutorial for GraphQL"
  }
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => null,
    feed: () => links,
    link: (root, args) => {
      const foundLink = links.filter((link, index) => {
        return link.id === args.id;
      });
      return foundLink[0];
    }
  },

  Mutation: {
    post: (root, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      };
      links.push(link);
      return link;
    },

    updateLink: (root, args) => {
      const updatedLink = links.filter((link, index) => {
        if (link.id === args.id) {
          links[index].description = args.description;
          links[index].url = args.url;
        }

        return link.id === args.id;
      });
      return updatedLink[0];
    },

    deleteLink: (root, args) => {
      const deletedLink = links.filter((link, index) => {
        if (link.id === args.id) {
          return links.splice(index, 1);
        }
      });
      return deletedLink[0];
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
