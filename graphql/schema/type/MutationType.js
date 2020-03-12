// @flow

const { GraphQLObjectType } = require('graphql');

const UserMutations = require('../../user/mutations');
const WagerMutations = require('../../wager/mutations');
// const BetMutations = require('../../bet/mutations');
// const CommentMutations = require('../../comment/mutations');

module.exports = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...UserMutations,
    ...WagerMutations,
    // ...BetMutations,
    // ...CommentMutations
  })
});
