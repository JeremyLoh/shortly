// https://express-validator.github.io/docs/api/check-schema/
function createUrlValidationSchema() {
  return {
    url: {
      isLength: {
        options: { min: 3, max: 2048 },
      },
      errorMessage: "Url length should be between 3 and 2048",
    },
    notEmpty: {
      errorMessage: "Url cannot be empty",
    },
    isString: {
      errorMessage: "Url must be a string",
    },
  }
}

function createShortCodeValidationSchema() {
  return {
    shortCode: {
      isLength: {
        options: { min: 7, max: 7 },
      },
      errorMessage: "Please provide a valid short code",
    },
    notEmpty: {
      errorMessage: "Short code cannot be empty",
    },
  }
}

export { createUrlValidationSchema, createShortCodeValidationSchema }
