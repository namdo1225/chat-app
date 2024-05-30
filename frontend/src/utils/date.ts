/**
 * Checks if two Supabase dates are from different days.
 * @param {string} supabaseDate01 Date #1 to compare.
 * @param {string} supabaseDate02 Date #2 to compare.
 * @returns {boolean} true if they are different days.
 */
export const differentDays = (
    supabaseDate01: string,
    supabaseDate02: string
): boolean => {
    const date01 = new Date(`${supabaseDate01.slice(0, -6)}Z`);
    const date02 = new Date(`${supabaseDate02.slice(0, -6)}Z`);

    return date01.getDate() !== date02.getDate();
};

/**
 * Parses a supabase date.
 * @param {string} supabaseDate Date to parse.
 * @returns {Date} Parsed date.
 */
export const parseSupabaseDate = (supabaseDate: string): Date => {
    return new Date(`${supabaseDate.slice(0, -6)}Z`);
};

/**
 * Format a supabase date to locale date string.
 * @param {string} supabaseDate Date to format.
 * @returns {string} Formatted date.
 */
export const formatSupabaseDate = (supabaseDate: string): string => {
    return new Date(`${supabaseDate.slice(0, -6)}Z`).toLocaleDateString();
};

export const convertDateToUTC = (date: Date): Date => {
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    );
};
