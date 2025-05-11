import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { z } from "zod";

// Zod schema for edit user data validation
const editUserSchema = z.object({
  cmsId: z.string().min(1, { message: "CMS ID is required." }),
  role: z.union([
    z.literal("Teacher"),
    z.literal("Student"),
    z.literal("Admin"),
    z.literal("Lab Instructors"),
    z.literal("Intern")
  ]),
  access: z.array(z.string()),
});

// Edit an existing user in the database
export const editUser = mutation({
  args: {
    cmsId: v.string(),
    role: v.union(
      v.literal("Teacher"),
      v.literal("Student"),
      v.literal("Admin"),
      v.literal("Lab Instructors"),
      v.literal("Intern")
    ),
    access: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Validate the incoming data using Zod (server-side validation)
      editUserSchema.parse(args);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Validation failed: ${err.message}`);
      }
      throw new Error("An unknown error occurred.");
    }

    // Find the user with the provided CMS ID
    const existingUser = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("cmsId"), args.cmsId))
      .first();

    if (!existingUser) {
      throw new Error("User not found with the provided CMS ID.");
    }

    // Update the user record with new role and access values
    const updatedUserId = await ctx.db.patch(existingUser._id, {
      role: args.role,
      access: args.access,
    });

    return updatedUserId;
  },
});