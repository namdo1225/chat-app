
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_hashids" WITH SCHEMA "public";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."chat_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "chat_id" "uuid" NOT NULL
);

ALTER TABLE "public"."chat_members" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."chats" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "public" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."chats" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."friends" (
    "sent_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "pending" boolean DEFAULT true NOT NULL,
    "requester" "uuid" NOT NULL,
    "requestee" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."friends" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sent_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "from_user_id" "uuid" NOT NULL,
    "chat_id" "uuid" NOT NULL,
    "text" "text" NOT NULL
);

ALTER TABLE "public"."messages" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "profile_photo" "text" DEFAULT 'https://onzyqnwywxomvmghummg.supabase.co/storage/v1/object/public/profile_images/default.jpg'::"text",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "public_profile" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

ALTER TABLE ONLY "public"."chat_members"
    ADD CONSTRAINT "chat_members_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_key" UNIQUE ("user_id");

ALTER TABLE ONLY "public"."chat_members"
    ADD CONSTRAINT "chat_members_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."chat_members"
    ADD CONSTRAINT "chat_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_requestee_fkey" FOREIGN KEY ("requestee") REFERENCES "public"."profiles"("user_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."friends"
    ADD CONSTRAINT "friends_requester_fkey" FOREIGN KEY ("requester") REFERENCES "public"."profiles"("user_id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."chat_members"
    ADD CONSTRAINT "public_chat_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."chats"
    ADD CONSTRAINT "public_chats_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "public_messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "public_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

CREATE POLICY "Allow read, write, delete for service role" ON "public"."chat_members" TO "service_role" USING (true);

CREATE POLICY "Enable insert access for service role" ON "public"."profiles" FOR INSERT TO "service_role" WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."messages" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."profiles" FOR SELECT USING (true);

CREATE POLICY "Enable update for users" ON "public"."profiles" FOR UPDATE TO "service_role" USING (true) WITH CHECK (true);

ALTER TABLE "public"."chat_members" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."chats" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."friends" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."messages";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."hash_decode"("text", "text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."hash_decode"("text", "text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."hash_decode"("text", "text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."hash_decode"("text", "text", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."hash_encode"(bigint) TO "postgres";
GRANT ALL ON FUNCTION "public"."hash_encode"(bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."hash_encode"(bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."hash_encode"(bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."hash_encode"(bigint, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."hash_encode"(bigint, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."hash_encode"(bigint, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hash_encode"(bigint, "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."hash_encode"(bigint, "text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."hash_encode"(bigint, "text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."hash_encode"(bigint, "text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."hash_encode"(bigint, "text", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."id_decode"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."id_decode"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."id_decode"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."id_decode"("text") TO "service_role";

GRANT ALL ON FUNCTION "public"."id_decode"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."id_decode"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."id_decode"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."id_decode"("text", "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."id_decode"("text", "text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."id_decode"("text", "text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."id_decode"("text", "text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."id_decode"("text", "text", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."id_decode"("text", "text", integer, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."id_decode"("text", "text", integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."id_decode"("text", "text", integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."id_decode"("text", "text", integer, "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."id_decode_once"("text") TO "postgres";
GRANT ALL ON FUNCTION "public"."id_decode_once"("text") TO "anon";
GRANT ALL ON FUNCTION "public"."id_decode_once"("text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."id_decode_once"("text") TO "service_role";

GRANT ALL ON FUNCTION "public"."id_decode_once"("text", "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."id_decode_once"("text", "text") TO "anon";
GRANT ALL ON FUNCTION "public"."id_decode_once"("text", "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."id_decode_once"("text", "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."id_decode_once"("text", "text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."id_decode_once"("text", "text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."id_decode_once"("text", "text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."id_decode_once"("text", "text", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."id_decode_once"("text", "text", integer, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."id_decode_once"("text", "text", integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."id_decode_once"("text", "text", integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."id_decode_once"("text", "text", integer, "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."id_encode"(bigint[]) TO "postgres";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint[]) TO "anon";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."id_encode"(bigint) TO "postgres";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."id_encode"(bigint[], "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint[], "text") TO "anon";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint[], "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint[], "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."id_encode"(bigint, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint, "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."id_encode"(bigint[], "text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint[], "text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint[], "text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint[], "text", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."id_encode"(bigint, "text", integer) TO "postgres";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint, "text", integer) TO "anon";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint, "text", integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint, "text", integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."id_encode"(bigint[], "text", integer, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint[], "text", integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint[], "text", integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint[], "text", integer, "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."id_encode"(bigint, "text", integer, "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint, "text", integer, "text") TO "anon";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint, "text", integer, "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."id_encode"(bigint, "text", integer, "text") TO "service_role";

GRANT ALL ON TABLE "public"."chat_members" TO "anon";
GRANT ALL ON TABLE "public"."chat_members" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_members" TO "service_role";

GRANT ALL ON TABLE "public"."chats" TO "anon";
GRANT ALL ON TABLE "public"."chats" TO "authenticated";
GRANT ALL ON TABLE "public"."chats" TO "service_role";

GRANT ALL ON TABLE "public"."friends" TO "anon";
GRANT ALL ON TABLE "public"."friends" TO "authenticated";
GRANT ALL ON TABLE "public"."friends" TO "service_role";

GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
