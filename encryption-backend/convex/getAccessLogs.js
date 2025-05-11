// convex/getAccessLogs.ts
import { v } from "convex/values";
import { query } from "./_generated/server";

// Query to retrieve logs based on filters
export const getAccessLog = query({
  args: {
    userId: v.optional(v.string()), // Optional filter for userId
    roomName: v.optional(v.string()), // Optional filter for roomName
    startDate: v.optional(v.string()), // Optional filter for start date (ISO string)
    endDate: v.optional(v.string()), // Optional filter for end date (ISO string)
  },
  handler: async (ctx, args) => {
    // Start with the base query
    let logsQuery = ctx.db.query("access_logs");

    // Apply filters if provided
    if (args.userId) {
      logsQuery = logsQuery.filter((q) => q.eq(q.field("userId"), args.userId));
    }
    if (args.roomName) {
      logsQuery = logsQuery.filter((q) => q.eq(q.field("roomName"), args.roomName));
    }
    if (args.startDate) {
      const startDateValue = args.startDate;
      logsQuery = logsQuery.filter((q) => q.gte(q.field("timestamp"), startDateValue));
    }
    if (args.endDate) {
      const endDateValue = args.endDate;
      logsQuery = logsQuery.filter((q) => q.lte(q.field("timestamp"), endDateValue));
    }

    // Order by timestamp descending and return results
    return logsQuery.order("desc").collect();
  },
});