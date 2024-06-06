--- Create profile_images bucket

INSERT INTO
storage.buckets (id, name, public, avif_autodetection, allowed_mime_types, file_size_limit)
VALUES ('profile_images', 'profile_images', TRUE, FALSE, '{"image/*"}', 51200);


--- Create user for test. Do NOT create such a user in the production db.
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        values(
            '00000000-0000-0000-0000-000000000000',
            '90241aa1-9820-4499-bc05-1daff7c8043d',
            'authenticated',
            'authenticated',
            'test@example.com',
            crypt ('password123', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        )
    );


INSERT INTO
    public.profiles (
        first_name,
        last_name,
        user_id
    ) (
        values(
            'Test',
            'Account',
            '90241aa1-9820-4499-bc05-1daff7c8043d'
        )
    );