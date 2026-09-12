const { z } = require("zod");


const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must contain at least 2 characters")
    .max(50, "Name is too long")
    .trim(),

  email: z
    .string()
    .email("Invalid email")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(6, "Password must contain at least 6 characters")
    .max(100, "Password is too long"),
});


const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Password is required"),
});

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must contain at least 2 characters").optional(),

  email: z.string().email("Invalid email").optional(),

  password: z.string().min(6, "Password must contain at least 6 characters").optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
};