export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: number;
                    created_at: string;
                    first_name: string;
                    last_name: string;
                    profile_photo: string;
                };
                Insert: {
                    id?: never;
                    first_name: string;
                    last_name: string;
                    profile_photo: string;
                };
                Update: {
                    id?: never;
                    first_name: string;
                    last_name: string;
                    profile_photo: string;
                    user_id: string;
                };
            };
        };
    };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];