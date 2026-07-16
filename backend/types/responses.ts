export const Responses = {
    OK: {
        code: 200,
        status: "success",
    },
    VAL_ERROR: {
        code: 400,
        status: "Validation Error",
    },
    AUTH_ERROR: {
        code: 401,
        status: "Invalid credentials",
    },
    RUNTIME_ERROR: {
        code: 500,
        status: "Internal Server Error",
    },
} as const;