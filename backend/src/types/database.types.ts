export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    created_at: string;
                    first_name: string;
                    last_name: string;
                    profile_photo: string;
                    user_id: string;
                };
                Insert: {
                    id?: never;
                    first_name: string;
                    last_name: string;
                    profile_photo?: string;
                };
                Update: {
                    id?: never;
                    first_name?: string;
                    last_name?: string;
                    profile_photo?: string;
                    user_id?: string;
                };
            };
            messages: {
                Row: {
                    id: number;
                    sent_at: string;
                    from_user_id: string;
                    text: string;
                    chat_id: string;
                };
                Insert: {
                    id?: never;
                    sent_at: string;
                    from_user_id: string;
                    text: string;
                    chat_id: string;
                };
                Delete: {
                    id?: never;
                };
            };
            chats: {
                Row: {
                    id: string;
                    created_at: string;
                    owner_id: string;
                    name: string;
                    description: string;
                };
                Insert: {
                    id?: never;
                    owner_id: string;
                    name: string;
                    description: string;
                };
                Update: {
                    id?: never;
                    owner_id?: string;
                    name?: string;
                    description?: string;
                };
                Delete: {
                    id?: never;
                };
            };
            chat_members: {
                Row: {
                    id: string;
                    user_id: string;
                    chat_id: string;
                    joined_at: string;
                };
                Insert: {
                    id?: never;
                    user_id: string;
                    chat_id: string;
                };
                Delete: {
                    id?: never;
                };
            };
        };
    };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Chat = Database['public']['Tables']['chats']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type ChatMember = Database['public']['Tables']['chat_members']['Row'];