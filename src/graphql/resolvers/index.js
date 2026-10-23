import { mergeResolvers } from "@graphql-tools/merge";
import { authResolver } from "./authResolver.js";
import { userResolver } from "./userResolver.js";

export const resolvers = mergeResolvers([authResolver, userResolver]);
