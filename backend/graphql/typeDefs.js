
const typeDefs = `
  type Region {
    code: String!
    name: String
  }
  type Query {
    regions : [Region]
  }
`


module.exports = typeDefs;
