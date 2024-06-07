--- Create profile_images bucket

INSERT INTO
storage.buckets (id, name, public, avif_autodetection, allowed_mime_types, file_size_limit)
VALUES ('profile_images', 'profile_images', TRUE, FALSE, '{"image/*"}', 51200);


--- Create user for test. Do NOT create such a user in the production db.
--- Test user id should begin with: 90241aa1-9820-4499-bc05-1daff7c8043
-- auth.users

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
            'test01@example.com',
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
            '90241aa1-9820-4499-bc05-1daff7c8043e',
            'authenticated',
            'authenticated',
            'test02@example.com',
            crypt ('password123D!', gen_salt ('bf')),
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
            '90241aa1-9820-4499-bc05-1daff7c8043f',
            'authenticated',
            'authenticated',
            'test03@example.com',
            crypt ('password123D!', gen_salt ('bf')),
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
            '90241aa1-9820-4499-bc05-1daff7c8043a',
            'authenticated',
            'authenticated',
            'test04@example.com',
            crypt ('password123D!', gen_salt ('bf')),
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

-- public.profiles

INSERT INTO
    public.profiles (
        first_name,
        last_name,
        user_id
    ) (
        values(
            'Test01',
            'Account01',
            '90241aa1-9820-4499-bc05-1daff7c8043d'
        )
    );

INSERT INTO
    public.profiles (
        first_name,
        last_name,
        user_id
    ) (
        values(
            'Test02',
            'Account02',
            '90241aa1-9820-4499-bc05-1daff7c8043e'
        )
    );

INSERT INTO
    public.profiles (
        first_name,
        last_name,
        user_id,
        public_profile
    ) (
        values(
            'Test03',
            'Account03',
            '90241aa1-9820-4499-bc05-1daff7c8043f',
            TRUE
        )
    );

INSERT INTO
    public.profiles (
        first_name,
        last_name,
        user_id,
        public_profile
    ) (
        values(
            'Test04',
            'Account04',
            '90241aa1-9820-4499-bc05-1daff7c8043a',
            TRUE
        )
    );

-- Create friend relationships for tests.

INSERT INTO
    public.friends (
        pending,
        requester,
        requestee
    ) (
        values(
            FALSE,
            '90241aa1-9820-4499-bc05-1daff7c8043f',
            '90241aa1-9820-4499-bc05-1daff7c8043a'
        )
    );

--- Create public group chats for tests.
INSERT INTO
    public.chats (
        owner_id,
        name,
        description,
        public
    ) (
        values(
            '90241aa1-9820-4499-bc05-1daff7c8043e',
            'TestChat01',
            '',
            TRUE
        )
    );

INSERT INTO
    public.chats (
        owner_id,
        name,
        description,
        public
    ) (
        values(
            '90241aa1-9820-4499-bc05-1daff7c8043e',
            'TestChat02',
            '',
            FALSE
        )
    );