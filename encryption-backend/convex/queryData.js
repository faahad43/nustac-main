import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUserById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    return user;
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Use the by_email index to efficiently query

    console.log('getUserByEmail called with args:', args);
    const user = await ctx.db
      .query("users")        // Table name is case-sensitive (make sure it's "User")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();            // Since email should be unique

    return user;
  },

  
});

export const getUserByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    console.log('getUserByUserId called with args:', args);

    const logs = await ctx.db
      .query("access_logs")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    if (!logs || logs.length === 0) {
      console.error(`No access logs found for userId: ${args.userId}`);
      throw new Error(`No access logs found for userId: ${args.userId}`);
    }

    console.log('Access logs found:', logs);
    return logs;
  },
});