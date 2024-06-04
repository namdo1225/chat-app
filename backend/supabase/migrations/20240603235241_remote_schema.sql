drop policy "Enable read access for all users" on "public"."messages";

alter table "public"."chats" add column "encrypted" boolean not null default false;

alter table "public"."chats" add column "public_key" text;

create policy "Enable read access for users based on user_id"
on "public"."chat_members"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for authenticated users only"
on "public"."messages"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) IN ( SELECT chat_members.user_id
   FROM chat_members
  WHERE ((chat_members.chat_id = messages.chat_id) AND (chat_members.user_id = auth.uid())))));



