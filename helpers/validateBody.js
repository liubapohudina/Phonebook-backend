import HttpError from "./HttpError.js";

export const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    } else {
      next();
    }
  };

  return func;
};

export const validateBodyResendEmail = (schema) => {
   const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, "missing required field email"));
    } else {
      next();
    }
  };

  return func;
}


