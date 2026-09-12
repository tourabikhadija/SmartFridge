const { z } = require("zod");

const productSchema = z.object({
  name: z
    .string()
    .min(2, "Name must contain at least 2 characters")
    .trim(),

  category: z
    .string()
    .min(2, "Category must contain at least 2 characters")
    .trim(),

  purchaseDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid purchase date",
    }),

  expirationDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid expiration date",
    }),

  expirationAlertDays: z
    .number()
    .min(0, "Expiration alert days cannot be negative"),

  quantity: z
    .number()
    .min(1, "Quantity must be at least 1"),
  
  unit: z
  .enum(["piece", "kg", "g", "l", "ml"]),
  
  price: z
  .number()
  .min(0, "Price cannot be negative"),
});

module.exports = {
  productSchema,
};