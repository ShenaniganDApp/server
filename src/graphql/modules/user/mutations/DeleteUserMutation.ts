import User = require('../UserModel');
import { mutationWithClientMutationId } from 'graphql-relay';
import { GraphQLString, GraphQLNonNull } from 'graphql';

export = mutationWithClientMutationId({
  name: 'Delete',
  inputFields: {
    _id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ _id }) => {
    const user = await User.findOne({ _id: _id });
    if (!user) {
      throw new Error('User does not exist');
    }
    User.deleteOne({ _id: _id }, err => {
      if (err) {
        throw new Error(err.message);
      }
    });
    return {
      userId: user.id,
      message: `User with username: "${user.username}" was deleted`
    };
  },
  outputFields: {
    // id: {
    //   type: GraphQLID,
    //   resolve: ({ userId }) => userId
    // },
    message: {
      type: GraphQLString,
      resolve: ({ message }) => message
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
