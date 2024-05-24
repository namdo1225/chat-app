/**
 * Logger to encapsulate console.log()
 * @param {unknown[]} params Arguments to log.
 */
export const info = (...params: unknown[]): void => {
    console.log(...params);
};

/**
 * Logger to encapsulate console.error()
 * @param {unknown[]} params Arguments to error.
 */
export const logError = (...params: unknown[]): void => {
    console.error(...params);
};