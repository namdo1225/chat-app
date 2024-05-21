export const differentDays = (
    supabaseDate01: string,
    supabaseDate02: string
): boolean => {
    const date01 = new Date(`${supabaseDate01.slice(0, -6)}Z`);
    const date02 = new Date(`${supabaseDate02.slice(0, -6)}Z`);

    return date01.getDate() !== date02.getDate();
};

export const parseSupabaseDate = (supabaseDate: string): Date => {
    return new Date(`${supabaseDate.slice(0, -6)}Z`);
};

export const formatSupabaseDate = (supabaseDate: string): string => {
    return new Date(`${supabaseDate.slice(0, -6)}Z`).toLocaleDateString();
};
