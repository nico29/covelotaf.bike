import { GraphQLResolveInfo } from "graphql";
import { Context } from "./context";
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: "Query";
  ride?: Maybe<Ride>;
  rides: Array<Ride>;
  currentUser?: Maybe<User>;
};

export type QueryRideArgs = {
  id: Scalars["ID"];
};

export type Mutation = {
  __typename?: "Mutation";
  createRide: Ride;
  deleteRide: Ride;
  registerUser: User;
  login: User;
  logout: Scalars["Boolean"];
  requestPasswordReset: Scalars["Boolean"];
  resetPassword: User;
};

export type MutationCreateRideArgs = {
  input: CreateRideInput;
};

export type MutationDeleteRideArgs = {
  id: Scalars["ID"];
};

export type MutationRegisterUserArgs = {
  input: RegisterUserInput;
};

export type MutationLoginArgs = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type MutationRequestPasswordResetArgs = {
  email: Scalars["String"];
};

export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};

export type Ride = {
  __typename?: "Ride";
  id: Scalars["ID"];
  creator: User;
  name: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  points: Array<Point>;
  distance: Scalars["Float"];
  start: Scalars["String"];
  finish: Scalars["String"];
  previewURL: Scalars["String"];
  color: Scalars["String"];
};

export type Point = {
  __typename?: "Point";
  latitude: Scalars["Float"];
  longitude: Scalars["Float"];
};

export type PointInput = {
  latitude: Scalars["Float"];
  longitude: Scalars["Float"];
};

export type CreateRideInput = {
  name: Scalars["String"];
  points: Array<PointInput>;
  description?: Maybe<Scalars["String"]>;
  distance: Scalars["Float"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  email: Scalars["String"];
  firstname?: Maybe<Scalars["String"]>;
  lastname?: Maybe<Scalars["String"]>;
  username: Scalars["String"];
  rides?: Maybe<Array<Ride>>;
};

export type Invitation = {
  __typename?: "Invitation";
  id: Scalars["ID"];
};

export type RegisterUserInput = {
  email: Scalars["String"];
  password: Scalars["String"];
  firstname?: Maybe<Scalars["String"]>;
  lastname?: Maybe<Scalars["String"]>;
  username: Scalars["String"];
  inviteCode?: Maybe<Scalars["String"]>;
};

export type ResetPasswordInput = {
  token: Scalars["String"];
  password: Scalars["String"];
  passwordConfirmation: Scalars["String"];
};

export type AdditionalEntityFields = {
  path?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (
  obj: T,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  String: ResolverTypeWrapper<Scalars["String"]>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Mutation: ResolverTypeWrapper<{}>;
  Ride: ResolverTypeWrapper<RideEntity>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  Point: ResolverTypeWrapper<Point>;
  PointInput: PointInput;
  CreateRideInput: CreateRideInput;
  User: ResolverTypeWrapper<UserEntity>;
  Invitation: ResolverTypeWrapper<Invitation>;
  RegisterUserInput: RegisterUserInput;
  ResetPasswordInput: ResetPasswordInput;
  AdditionalEntityFields: AdditionalEntityFields;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  String: Scalars["String"];
  Boolean: Scalars["Boolean"];
  Query: {};
  ID: Scalars["ID"];
  Mutation: {};
  Ride: RideEntity;
  Float: Scalars["Float"];
  Point: Point;
  PointInput: PointInput;
  CreateRideInput: CreateRideInput;
  User: UserEntity;
  Invitation: Invitation;
  RegisterUserInput: RegisterUserInput;
  ResetPasswordInput: ResetPasswordInput;
  AdditionalEntityFields: AdditionalEntityFields;
};

export type UnionDirectiveArgs = {
  discriminatorField?: Maybe<Scalars["String"]>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type UnionDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = UnionDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {
  discriminatorField: Scalars["String"];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type AbstractEntityDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = AbstractEntityDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {
  embedded?: Maybe<Scalars["Boolean"]>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type EntityDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = EntityDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = { overrideType?: Maybe<Scalars["String"]> };

export type ColumnDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = ColumnDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = {};

export type IdDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = IdDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = { overrideType?: Maybe<Scalars["String"]> };

export type LinkDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = LinkDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = {};

export type EmbeddedDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = EmbeddedDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = { path: Scalars["String"] };

export type MapDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = MapDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  ride?: Resolver<
    Maybe<ResolversTypes["Ride"]>,
    ParentType,
    ContextType,
    RequireFields<QueryRideArgs, "id">
  >;
  rides?: Resolver<Array<ResolversTypes["Ride"]>, ParentType, ContextType>;
  currentUser?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType
  >;
};

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  createRide?: Resolver<
    ResolversTypes["Ride"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateRideArgs, "input">
  >;
  deleteRide?: Resolver<
    ResolversTypes["Ride"],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteRideArgs, "id">
  >;
  registerUser?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    RequireFields<MutationRegisterUserArgs, "input">
  >;
  login?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, "email" | "password">
  >;
  logout?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  requestPasswordReset?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<MutationRequestPasswordResetArgs, "email">
  >;
  resetPassword?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    RequireFields<MutationResetPasswordArgs, "input">
  >;
};

export type RideResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Ride"] = ResolversParentTypes["Ride"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  points?: Resolver<Array<ResolversTypes["Point"]>, ParentType, ContextType>;
  distance?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  start?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  finish?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  previewURL?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  color?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type PointResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Point"] = ResolversParentTypes["Point"]
> = {
  latitude?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  longitude?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type UserResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  firstname?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  lastname?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  rides?: Resolver<
    Maybe<Array<ResolversTypes["Ride"]>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type InvitationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Invitation"] = ResolversParentTypes["Invitation"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type Resolvers<ContextType = Context> = {
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Ride?: RideResolvers<ContextType>;
  Point?: PointResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Invitation?: InvitationResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = Context> = {
  union?: UnionDirectiveResolver<any, any, ContextType>;
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  column?: ColumnDirectiveResolver<any, any, ContextType>;
  id?: IdDirectiveResolver<any, any, ContextType>;
  link?: LinkDirectiveResolver<any, any, ContextType>;
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>;
  map?: MapDirectiveResolver<any, any, ContextType>;
};

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = Context> = DirectiveResolvers<
  ContextType
>;
import { ObjectID } from "mongodb";
export type RideEntity = {
  _id: ObjectID;
  name: string;
  description?: Maybe<string>;
  points: Array<Point>;
  distance: number;
  start: string;
  finish: string;
  creatorID: ObjectID;
  createdAt: Date;
};

export type UserEntity = {
  _id: ObjectID;
  email: string;
  firstname?: Maybe<string>;
  lastname?: Maybe<string>;
  username: string;
  rides?: Maybe<Array<Ride>>;
  password: string;
  resetToken?: string;
  resetTokenExpiry?: number;
  createdAt: Date;
};

export type InvitationEntity = {
  _id: ObjectID;
  email: string;
  code: string;
  createdAt: Date;
  usedAt?: Date;
};
