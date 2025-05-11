
// convex/functions/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Existing users table
  users: defineTable({
    fullName: v.string(),
    cmsId: v.string(),
    email: v.string(),
    dept: v.union(
      v.literal("Seecs"),
      v.literal("Sada"),
      v.literal("Iaec"),
      v.literal("S3h"),
      v.literal("Smme"),
      v.literal("Rimms"),
      v.literal("Ns"),
      v.literal("Sns"),
      v.literal("Nshs"),
      v.literal("Igis"),
      v.literal("Nice"),
      v.literal("Scme"),
      v.literal("Asap"),
      v.literal("Nls")
    ),
    role: v.union(
      v.literal("Teacher"),
      v.literal("Student"),
      v.literal("Admin"),
      v.literal("Lab Instructors"),
      v.literal("Intern")
    ),
    password: v.optional(v.string()), // Optional password field for user authentication
    access: v.array(v.string()), // Classes user has access to
  }).index("by_cmsId", ["cmsId"])
  .index("by_email",["email"]), // Index to query by CMS ID

  // New access logs table
  access_logs: defineTable({
    userId: v.string(), // References the user who attempted access
    roomName: v.string(), // Name of the classroom or room
    accessStatus: v.union(
      v.literal("allowed"),
      v.literal("denied")
    ), // Whether access was granted or denied
    timestamp: v.string(), // Timestamp of the access attempt (ISO string format)
  })
  .index("by_userId", ["userId"]) // Index to query logs by user
  .index("by_roomName", ["roomName"]) // Index to query logs by room name
  .index("by_timestamp", ["timestamp"]), // Index to query logs by timestamp
});