const { GraphQLServer } = require('graphql-yoga')


let authors = [{
  id: '1',
  name: 'First Author'
}, {
  id: '2',
  name: 'Second Author'
}]

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL',
  author: authors[0]
},{
  id: 'link-1',
  url: 'www.google.com',
  description: 'Google',
  author: authors[1]
}];

let idCount = links.length

/**
 * The resolvers object is the actual implementation of the GraphQL schema. 
 * Notice how its structure is identical to the structure of the type definition inside typeDefs: Query.info.
 */

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    count: () => links.length
  },
  Mutation: {
    // 2
    postLink: (parent, {description, url}) => {
      // тут parent = undefined
       const link = {
        id: `link-${idCount++}`,
        description: description,
        url: url,
      }
      links.push(link)
      // тут можно например сортироваку вставить
      return links
    },

    updateLink: (parent, {id, description, url}) => {
      // TODO: how to handle errors?
      links.map(link => {
        if(link.id === id) {
          link.description = description;
          link.url = url;
        }
      })
      return links;
    },

    deleteLink: (parent, {id}) => {
      const index = links.findIndex(link => link.id === id);
      links = [...links.slice(0, index), ...links.slice(index + 1)];
      return links;
    }
  },
  // First off, note that you’re entirely removing the Link resolvers 
  // (as explained at the very end of the last section). 
  // They are not needed because the GraphQL server infers what they look like.
  // не понимаю, как работает резолвел для типа Link
  // в данном случае parent = это  link из feed
  // я могу тут какие-нибудь трансформации добавлять
  // Link: {
  //   id: (parent) => parent.id,
  //   description: (parent) => parent.description,
  //   url: (parent) => parent.url,
  // }
}

// 3
/**
 * Finally, the schema and resolvers are bundled and passed to the GraphQLServer 
 * which is imported from graphql-yoga. 
 * This tells the server what API operations are accepted and how they should be resolved.
 */
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`))