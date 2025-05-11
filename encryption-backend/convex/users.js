// convex/functions/addUser.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server"; // Import mutation from Convex
import { z } from "zod";

// Zod schema for user data validation (same as client-side validation)
const userSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email format." }),
  cmsId: z.string().min(6, { message: "CMS ID is required." }),
  dept: z.union([
    z.literal("Seecs"),
    z.literal("Sada"),
    z.literal("Iaec"),
    z.literal("S3h"),
    z.literal("Smme"),
    z.literal("Rimms"),
    z.literal("Ns"),
    z.literal("Sns"),
    z.literal("Nshs"),
    z.literal("Igis"),
    z.literal("Nice"),
    z.literal("Scme"),
    z.literal("Asap"),
    z.literal("Nls")
  ]),
  role: z.union([
    z.literal("Teacher"),
    z.literal("Student"),
    z.literal("Admin"),
    z.literal("Lab Instructors"),
    z.literal("Intern")
  ]),
  access: z.array(z.string()),
});

// Create a new user in the database
export const addUser = mutation({
  args: {
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
    access: v.array(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Validate the incoming data using Zod (server-side validation)
      userSchema.parse(args); // This will throw if validation fails
    } catch (err) {
      // Type the error as an instance of Error to safely access the message
      if (err instanceof Error) {
        throw new Error(`Validation failed: ${err.message}`);
      }
      throw new Error("An unknown error occurred.");
    }

    // Check if a user with the same CMS ID or email already exists
    const existingUser = await ctx.db
      .query("users")
      .filter(
        (q) =>
         q.and(q.eq(q.field("cmsId"), args.cmsId),(q.eq(q.field("email"), args.email))) // Correct syntax for filtering
      )
      .first();

    if (existingUser) {
      throw new Error("A user with the same CMS ID or email already exists.");
    }

    // Insert new user into the database
    const newUserId = await ctx.db.insert("users", {
      fullName: args.fullName,
      cmsId: args.cmsId,
      email: args.email,
      dept: args.dept,
      role: args.role,
      access: args.access,
    });

    return newUserId; // Return the new user's ID
  },
});

export const getUserByCmsId = query({
  args: { cmsId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("cmsId"), args.cmsId))
      .first();
    
    if (!user) {
      return null;
    }
    
    return user;
  },
});
// Query to get a single user by CMS ID
export const getUserByCmsIdMutation = mutation({
  args: { cmsId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("users")
      .filter(q => q.eq(q.field("cmsId"), args.cmsId))
      .first();
  }
});
// Mutation to delete a user
export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) {
      throw new Error(`User with ID ${args.id} not found`);
    }
    
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
// Define the filter arguments type
const filterArgs = {
  cmsId: v.optional(v.string()),
  fullName: v.optional(v.string()),
  email: v.optional(v.string()),
  dept: v.optional(
    v.union(
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
    )
  ),
  role: v.optional(
    v.union(
      v.literal("Teacher"),
      v.literal("Student"),
      v.literal("Admin"),
      v.literal("Lab Instructors"),
      v.literal("Intern")
    )
  ),
};

// Query to get all users with optional filtering
// Query to get all users with optional filtering
export const getUsers = query({
  args: filterArgs,
  handler: async (ctx, args) => {
    // First, get all users
    let usersQuery = ctx.db.query("users");
    
    // Apply exact match filters on the database level where possible
    if (args.dept) {
      usersQuery = usersQuery.filter(q => q.eq(q.field("dept"), args.dept));
    }
    
    if (args.role) {
      usersQuery = usersQuery.filter(q => q.eq(q.field("role"), args.role));
    }
    
    // Execute the query and get all matching users
    let users = await usersQuery.collect();
    
    // Apply the string matching filters in JavaScript after getting the results
    if (args.cmsId && args.cmsId !== "") {
      users = users.filter(user => 
        user.cmsId.toLowerCase().includes(args.cmsId.toLowerCase())
      );
    }
    
    if (args.fullName && args.fullName !== "") {
      users = users.filter(user => 
        user.fullName.toLowerCase().includes(args.fullName.toLowerCase())
      );
    }
    
    if (args.email && args.email !== "") {
      users = users.filter(user => 
        user.email.toLowerCase().includes(args.email.toLowerCase())
      );
    }
    
    return users;
  },
});


// Mutation to update an existing user
export const updateUser = mutation({
  args: {
    id: v.id("users"),
    fullName: v.optional(v.string()),
    cmsId: v.optional(v.string()),
    email: v.optional(v.string()),
    dept: v.optional(
      v.union(
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
      )
    ),
    role: v.optional(
      v.union(
        v.literal("Teacher"),
        v.literal("Student"),
        v.literal("Admin"),
        v.literal("Lab Instructors"),
        v.literal("Intern")
      )
    ),
    access: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    
    // Get the current user data
    const existingUser = await ctx.db.get(id);
    if (!existingUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    // If CMS ID is being changed, check for duplicates
    if (args.cmsId && args.cmsId !== existingUser.cmsId) {
      const duplicateCmsId = await ctx.db
        .query("users")
        .filter(q => q.eq(q.field("cmsId"), args.cmsId))
        .first();
      
      if (duplicateCmsId) {
        throw new Error(`User with CMS ID ${args.cmsId} already exists`);
      }
    }
    
    // Update the user
    return await ctx.db.patch(id, fields);
  },
});
