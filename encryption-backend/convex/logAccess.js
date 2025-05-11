// convex/logAccess.js
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const logAccess = mutation({
  args: {
    userId: v.string(),
    roomName: v.string(),
    accessStatus: v.string(),
    timestamp: v.string(), 
  },
  handler: async (ctx, args) => {
    console.log("Received args:", args);

    // Validate userId
    if (!args.userId) {
      throw new Error("userId is required.");
    }

    // Insert the access log
    await ctx.db.insert("access_logs", {
      userId: args.userId,
      roomName: args.roomName,
      timestamp: args.timestamp,
      accessStatus: args.accessStatus,
    });
  }
});
 