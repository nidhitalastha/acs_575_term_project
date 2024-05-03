const db = require('../models');

const resolvers = {
    Query: {
        async regions(parent, args, context) {
            return db.Region.findAll();
        },
    },
 }


module.exports = resolvers;
