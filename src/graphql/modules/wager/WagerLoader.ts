import DataLoader from 'dataloader';
import {
  connectionFromMongoCursor,
  mongooseLoader
} from '@entria/graphql-mongoose-loader';
import { ConnectionArguments, connectionFromArray } from 'graphql-relay';
import mongoose, { Types } from 'mongoose';
declare type ObjectId = mongoose.Schema.Types.ObjectId;

import WagerModel, { IWager } from './WagerModel';

import { IUser } from '../user/UserModel';

import { GraphQLContext } from '../../TypeDefinition';

export default class Wager {
  _id: Types.ObjectId;

  title: string;

  content: string | null | undefined;

  creator: Types.ObjectId;

  constructor(data: IWager) {
    this._id = data._id;
    this.title = data.title;
    this.content = data.content;
    this.creator = data.creator;
  }
}

export const getLoader = () =>
  new DataLoader((ids: ReadonlyArray<string>) =>
    mongooseLoader(WagerModel, ids)
  );

const viewerCanSee = () => true;

export const load = async (
  context: GraphQLContext,
  id: string | Object | ObjectId
): Promise<Wager | null> => {
  if (!id && typeof id !== 'string') {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.WagerLoader.load(id as string);
  } catch (err) {
    return null;
  }
  return viewerCanSee() ? new Wager(data) : null;
};

export const clearCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId
) => dataloaders.WagerLoader.clear(id.toString());

export const primeCache = (
  { dataloaders }: GraphQLContext,
  id: Types.ObjectId,
  data: IWager
) => dataloaders.WagerLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (
  context: GraphQLContext,
  id: Types.ObjectId,
  data: IWager
) => clearCache(context, id) && primeCache(context, id, data);

type WagerArgs = ConnectionArguments & {
  search?: string;
};
export const loadWagers = async (context: GraphQLContext, args: WagerArgs) => {
  const where = args.search
    ? { title: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};
  const wagers = await WagerModel.find(where, {})
  return connectionFromArray(wagers, args);
  // return connectionFromMongoCursor({
  //   cursor: wagers,
  //   context,
  //   args,
  //   loader: load
  // });
};

export const loadUserWagers = async (
  user: IUser,
  context: GraphQLContext,
  args: WagerArgs
) => {
  console.log(context);
  const where = args.search
    ? { title: { $regex: new RegExp(`^${args.search}`, 'ig') } }
    : {};

  const wagers = await WagerModel.find(where, { creator: user._id })
  return connectionFromArray(wagers,args)
  // return connectionFromMongoCursor({
  //   cursor: wagers,
  //   context,
  //   args,
  //   loader: load
  // });
};
