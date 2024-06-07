alter table "public"."chats" drop constraint "public_chats_owner_id_fkey";

alter table "public"."profiles" drop constraint "public_profiles_user_id_fkey";

alter table "public"."chats" add constraint "chats_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."chats" validate constraint "chats_owner_id_fkey";

alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_user_id_fkey";


