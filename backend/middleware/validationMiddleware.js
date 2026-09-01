const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues.map((error) => ({
          field: error.path[0],
          message: error.message,
        })),
      });
    }

    req.body = result.data;

    next();
  };
};

module.exports = validate;