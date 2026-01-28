import AppError from "../common/errors/AppError.js";

/**
 * System-owned layout validation
 * @param {string} layoutType
 * @param {object} config
 */
export function validateLayoutConfig(layoutType, config) {
  console.log("VALIDATE LAYOUT CONFIG CALLED", layoutType, config);

  if (!layoutType) {
    throw new AppError("Layout type is required", 400);
  }

  if (!config || typeof config !== "object") {
    throw new AppError("Layout configuration is required", 400);
  }

  switch (layoutType) {
    case "ROW_COLUMN":
    case "GALLERY": {
      const { rows, columns } = config;

      if (!Number.isInteger(rows) || rows <= 0) {
        throw new AppError("Rows must be a positive integer", 400);
      }

      if (!Number.isInteger(columns) || columns <= 0) {
        throw new AppError("Columns must be a positive integer", 400);
      }

      break;
    }

    case "ROUND_TABLE": {
      const { tables, seatsPerTable } = config;

      if (!Number.isInteger(tables) || tables <= 0) {
        throw new AppError("Tables must be a positive integer", 400);
      }

      if (!Number.isInteger(seatsPerTable) || seatsPerTable <= 0) {
        throw new AppError("Seats per table must be a positive integer", 400);
      }

      break;
    }

    case "OPEN_CROWD": {
      const { capacity } = config;

      if (!Number.isInteger(capacity) || capacity <= 0) {
        throw new AppError("Capacity must be a positive integer", 400);
      }

      break;
    }

    default:
      throw new AppError(`Unsupported layout type: ${layoutType}`, 400);
  }
}
