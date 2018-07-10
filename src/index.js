const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");

const resolvers = {
  Query: {
    info: () => null,
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info);
    }
  },

  Mutation: {
    post: (root, args, context, info) => {
      return context.db.mutation.createLink(
        {
          data: {
            url: args.url,
            description: args.description
          }
        },
        info
      );
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
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: "src/generated/prisma.graphql",
      endpoint: "https://us1.prisma.sh/weder-ribas-885196/hackernews-node/dev",
      debug: true
    })
  })
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
