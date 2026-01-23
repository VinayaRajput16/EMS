import AppError from "../errors/AppError.js";

export function validateLayoutConfig(schema, config) {
  if (!schema?.fields || !Array.isArray(schema.fields)) {
    throw new AppError("Invalid layout schema", 500);
  }

  for (const field of schema.fields) {
    const { key, type, min, max } = field;
    const value = config[key];

    if (value === undefined) {
      throw new AppError(`Missing layout field: ${key}`, 400);
    }

    if (type === "number") {
      if (typeof value !== "number") {
        throw new AppError(`Field ${key} must be a number`, 400);
      }
      if (min !== undefined && value < min) {
        throw new AppError(`Field ${key} must be ≥ ${min}`, 400);
      }
      if (max !== undefined && value > max) {
        throw new AppError(`Field ${key} must be ≤ ${max}`, 400);
      }
    }
  }
}
