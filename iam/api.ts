import { FunctionReference, anyApi } from "convex/server";
import { GenericId as Id } from "convex/values";

export const api: PublicApiType = anyApi as unknown as PublicApiType;
export const internal: InternalApiType = anyApi as unknown as InternalApiType;

export type PublicApiType = {
  userLogin: {
    userLogin: FunctionReference<
      "action",
      "public",
      { email: string; password: string },
      any
    >;
  };
  userRegistration: {
    checkEmail: FunctionReference<"action", "public", { email: string }, any>;
    sendMessage: FunctionReference<
      "action",
      "public",
      { email: string; password: string },
      any
    >;
  };
  logAccess: {
    logAccess: FunctionReference<
      "mutation",
      "public",
      {
        accessStatus: string;
        roomName: string;
        timestamp: string;
        userId: string;
      },
      any
    >;
  };
  queryData: {
    getUserById: FunctionReference<"query", "public", { id: Id<"users"> }, any>;
    getUserByEmail: FunctionReference<
      "query",
      "public",
      { email: string },
      any
    >;
    getUserByUserId: FunctionReference<
      "query",
      "public",
      { userId: string },
      any
    >;
  };
  userMutation: {
    updateUserPassword: FunctionReference<
      "mutation",
      "public",
      { hashedPassword: string; userId: Id<"users"> },
      any
    >;
  };
  userQueries: {
    getUserByEmail: FunctionReference<
      "query",
      "public",
      { email: string },
      any
    >;
  };
};
export type InternalApiType = {};
