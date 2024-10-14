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

function createUserValidationSchema() {
  return {
    username: {
      isLength: {
        options: { min: 1, max: 255 },
        errorMessage:
          "Please provide a valid username (min length 1, max length 255)",
      },
      isString: {
        errorMessage: "Username must be a string",
      },
      notEmpty: {
        errorMessage: "Username cannot be empty",
      },
    },
    password: {
      isLength: {
        options: { min: 8 },
        errorMessage: "Password must be at least 8 characters long",
      },
    },
  }
}

export {
  createUrlValidationSchema,
  createShortCodeValidationSchema,
  createUserValidationSchema,
}
