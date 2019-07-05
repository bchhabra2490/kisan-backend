--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2 (Debian 11.2-1.pgdg90+1)
-- Dumped by pg_dump version 11.2 (Debian 11.2-1.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."Contacts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Contacts_id_seq" OWNER TO root;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: Contacts; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Contacts" (
    id integer DEFAULT nextval('public."Contacts_id_seq"'::regclass) NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    phone character(10) NOT NULL,
    "createdBy" integer NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Contacts" OWNER TO root;

--
-- Name: TABLE "Contacts"; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON TABLE public."Contacts" IS 'Tables for contacts created by users';


--
-- Name: COLUMN "Contacts".id; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Contacts".id IS 'Primary key';


--
-- Name: COLUMN "Contacts"."firstName"; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Contacts"."firstName" IS 'First Name of the contact';


--
-- Name: COLUMN "Contacts"."lastName"; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Contacts"."lastName" IS 'Last Name of the contact';


--
-- Name: COLUMN "Contacts".phone; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Contacts".phone IS 'Phone Number of the contact';


--
-- Name: COLUMN "Contacts"."createdBy"; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Contacts"."createdBy" IS 'id from users table';


--
-- Name: COLUMN "Contacts"."createdAt"; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Contacts"."createdAt" IS 'Creation Time';


--
-- Name: COLUMN "Contacts"."updatedAt"; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Contacts"."updatedAt" IS 'Updation Timestamp';


--
-- Name: Messages_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."Messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Messages_id_seq" OWNER TO root;

--
-- Name: Messages; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Messages" (
    id integer DEFAULT nextval('public."Messages_id_seq"'::regclass) NOT NULL,
    "sendFrom" integer NOT NULL,
    "sendTo" integer NOT NULL,
    message text NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now()
);


ALTER TABLE public."Messages" OWNER TO root;

--
-- Name: TABLE "Messages"; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON TABLE public."Messages" IS 'Sent Messages ';


--
-- Name: COLUMN "Messages".id; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Messages".id IS 'Primary key';


--
-- Name: COLUMN "Messages"."sendFrom"; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Messages"."sendFrom" IS 'Id of the User who sent the message';


--
-- Name: COLUMN "Messages"."sendTo"; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Messages"."sendTo" IS 'Id of the contact to whom message was sent';


--
-- Name: COLUMN "Messages".message; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Messages".message IS 'Message text';


--
-- Name: COLUMN "Messages"."createdAt"; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Messages"."createdAt" IS 'Creation/Sent time of the message';


--
-- Name: COLUMN "Messages"."updatedAt"; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Messages"."updatedAt" IS 'Updation Timestamp';


--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."Users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_id_seq" OWNER TO root;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Users" (
    id integer DEFAULT nextval('public."Users_id_seq"'::regclass) NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone character(10),
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Users" OWNER TO root;

--
-- Name: TABLE "Users"; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON TABLE public."Users" IS 'Table for Users';


--
-- Name: COLUMN "Users".id; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Users".id IS 'Primary key';


--
-- Name: COLUMN "Users".name; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Users".name IS 'Name of the user';


--
-- Name: COLUMN "Users".email; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Users".email IS 'Email of the user';


--
-- Name: COLUMN "Users".username; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Users".username IS 'Username';


--
-- Name: COLUMN "Users".password; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Users".password IS 'encrypted password ';


--
-- Name: COLUMN "Users".phone; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Users".phone IS 'Phone Number of user';


--
-- Name: COLUMN "Users"."createdAt"; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Users"."createdAt" IS 'Creation time';


--
-- Name: COLUMN "Users"."updatedAt"; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON COLUMN public."Users"."updatedAt" IS 'Updated Timestamp';


--
-- Data for Name: Contacts; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Contacts" (id, "firstName", "lastName", phone, "createdBy", "createdAt", "updatedAt") FROM stdin;
4	Sahil	Chhaabra	9781800004	10	2019-07-04 15:53:05.939+00	2019-07-04 16:07:53.403+00
\.


--
-- Data for Name: Messages; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Messages" (id, "sendFrom", "sendTo", message, "createdAt", "updatedAt") FROM stdin;
1	10	4	Your otp is 1234	2019-07-04 16:42:07.143+00	2019-07-04 16:42:07.143+00
2	10	4	Your otp is 1234	2019-07-04 16:42:39.476+00	2019-07-04 16:42:39.476+00
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Users" (id, name, email, username, password, phone, "createdAt", "updatedAt") FROM stdin;
10	Bhaarat Chhabra	bchhabra2490@gmail.com	bchhabra2490	$2b$10$CRfRSxIn.sbwC.rkas9R4uiKnH3FiXVyrTRJLYJidKlcqAs0bR.Dm	9780443873	2019-07-04 14:45:37.591+00	2019-07-04 16:01:51.561+00
\.


--
-- Name: Contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."Contacts_id_seq"', 4, true);


--
-- Name: Messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."Messages_id_seq"', 2, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."Users_id_seq"', 10, true);


--
-- Name: Users Users_username_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_username_key" UNIQUE (username);


--
-- Name: Contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Contacts"
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: Messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: Users users_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: Contacts Contacts_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Contacts"
    ADD CONSTRAINT "Contacts_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Messages messages_sendFrom_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "messages_sendFrom_fkey" FOREIGN KEY ("sendFrom") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Messages messages_sendTo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Messages"
    ADD CONSTRAINT "messages_sendTo_fkey" FOREIGN KEY ("sendTo") REFERENCES public."Contacts"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

