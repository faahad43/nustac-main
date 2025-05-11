// convex/functions/addAccessLog.ts
import { mutation } from "./_generated/server"; // Import mutation from Convex
import { v } from "convex/values"; // Import Convex validation
// Mutation to log a user’s attempt to access a room
export const addAccessLog = mutation({
  args: {
    userId: v.string(), // User ID attempting access
    roomName: v.string(), // Room being accessed
    accessStatus: v.union(v.literal("allowed"), v.literal("denied")), // Access status
  },
  handler: async (ctx, args) => {
    // Create a timestamp as an ISO string
    const timestamp = new Date().toISOString();

    // Insert the access log into the database
    const newLog = await ctx.db.insert("access_logs", {
      userId: args.userId,
      roomName: args.roomName,
      accessStatus: args.accessStatus,
      timestamp: timestamp, // Store the timestamp as an ISO string
    });

    return newLog; // Return the new log record
  },
});
