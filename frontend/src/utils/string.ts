/**
 * Turns a camel case stirng into a sentence.
 * @param {string} str Camel case string
 * @returns {string} Words from camel case string
 */
export const camelCaseToWords = (str: string): string => {
    const result = str.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
};

export const unknownError =
    "An unknown error occured while trying to process your request.";

export const sbLocalStorageTokenKey =
    "sb-onzyqnwywxomvmghummg-auth-token";