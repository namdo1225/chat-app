alter table "auth"."users" enable row level security;


create policy "Full access for service role"
on "storage"."objects"
as permissive
for all
to service_role
using (true)
with check (true);


create policy "Give service role full access 1iz9mmm_0"
on "storage"."objects"
as permissive
for insert
to service_role
with check ((bucket_id = 'profile_images'::text));


create policy "Give service role full access 1iz9mmm_1"
on "storage"."objects"
as permissive
for select
to service_role
using ((bucket_id = 'profile_images'::text));


create policy "Give service role full access 1iz9mmm_2"
on "storage"."objects"
as permissive
for update
to service_role
using ((bucket_id = 'profile_images'::text));


create policy "Give service role full access 1iz9mmm_3"
on "storage"."objects"
as permissive
for delete
to service_role
using ((bucket_id = 'profile_images'::text));



