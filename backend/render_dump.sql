--
-- PostgreSQL database dump
--

\restrict 2TzI8IgdeKU54z23D6zrISMnHm5fgTzB3ct3SamhNpvVzxWUu2c1pDWpxHpafqx

-- Dumped from database version 17.6 (Debian 17.6-1.pgdg12+1)
-- Dumped by pg_dump version 17.6

-- Started on 2025-09-04 12:34:32

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 870 (class 1247 OID 16518)
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);


--
-- TOC entry 885 (class 1247 OID 16997)
-- Name: TransactionType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TransactionType" AS ENUM (
    'TOPUP',
    'PURCHASE',
    'MONTHLY_FEE',
    'REFUND'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 16546)
-- Name: EmailVerifyToken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EmailVerifyToken" (
    id integer NOT NULL,
    token text NOT NULL,
    "userId" integer NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 224 (class 1259 OID 16545)
-- Name: EmailVerifyToken_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."EmailVerifyToken_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3497 (class 0 OID 0)
-- Dependencies: 224
-- Name: EmailVerifyToken_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."EmailVerifyToken_id_seq" OWNED BY public."EmailVerifyToken".id;


--
-- TOC entry 221 (class 1259 OID 16526)
-- Name: PhoneNumber; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhoneNumber" (
    id integer NOT NULL,
    "countryCode" text NOT NULL,
    "countryName" text NOT NULL,
    "mobileNumber" text,
    number800 text,
    "connectionFee" integer NOT NULL,
    "monthlyFee" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    category text,
    status text DEFAULT 'available'::text NOT NULL,
    "userId" integer,
    "expiresAt" timestamp(3) without time zone,
    "lastPaymentDate" timestamp(3) without time zone,
    "reservedAt" timestamp(3) without time zone
);


--
-- TOC entry 235 (class 1259 OID 18282)
-- Name: PhoneNumberHistory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PhoneNumberHistory" (
    id integer NOT NULL,
    "phoneNumberId" integer NOT NULL,
    action text NOT NULL,
    status text NOT NULL,
    "userId" integer,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 234 (class 1259 OID 18281)
-- Name: PhoneNumberHistory_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PhoneNumberHistory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3498 (class 0 OID 0)
-- Dependencies: 234
-- Name: PhoneNumberHistory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhoneNumberHistory_id_seq" OWNED BY public."PhoneNumberHistory".id;


--
-- TOC entry 220 (class 1259 OID 16525)
-- Name: PhoneNumber_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PhoneNumber_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3499 (class 0 OID 0)
-- Dependencies: 220
-- Name: PhoneNumber_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PhoneNumber_id_seq" OWNED BY public."PhoneNumber".id;


--
-- TOC entry 223 (class 1259 OID 16536)
-- Name: Plan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Plan" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    "dataMb" integer NOT NULL,
    minutes integer NOT NULL,
    sms integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 16535)
-- Name: Plan_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Plan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3500 (class 0 OID 0)
-- Dependencies: 222
-- Name: Plan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Plan_id_seq" OWNED BY public."Plan".id;


--
-- TOC entry 227 (class 1259 OID 16557)
-- Name: ResetToken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ResetToken" (
    id integer NOT NULL,
    token text NOT NULL,
    "userId" integer NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 16556)
-- Name: ResetToken_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ResetToken_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3501 (class 0 OID 0)
-- Dependencies: 226
-- Name: ResetToken_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ResetToken_id_seq" OWNED BY public."ResetToken".id;


--
-- TOC entry 231 (class 1259 OID 17016)
-- Name: Subscription; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Subscription" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "planId" integer NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    "startDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 230 (class 1259 OID 17015)
-- Name: Subscription_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Subscription_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3502 (class 0 OID 0)
-- Dependencies: 230
-- Name: Subscription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Subscription_id_seq" OWNED BY public."Subscription".id;


--
-- TOC entry 229 (class 1259 OID 17006)
-- Name: Transaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Transaction" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    type public."TransactionType" NOT NULL,
    amount integer NOT NULL,
    description text NOT NULL,
    "balanceBefore" integer NOT NULL,
    "balanceAfter" integer NOT NULL,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 228 (class 1259 OID 17005)
-- Name: Transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Transaction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3503 (class 0 OID 0)
-- Dependencies: 228
-- Name: Transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Transaction_id_seq" OWNED BY public."Transaction".id;


--
-- TOC entry 219 (class 1259 OID 16409)
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    "firstName" text,
    "lastName" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    username text,
    balance integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 233 (class 1259 OID 17269)
-- Name: UserPlan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserPlan" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "planId" integer NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- TOC entry 232 (class 1259 OID 17268)
-- Name: UserPlan_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."UserPlan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3504 (class 0 OID 0)
-- Dependencies: 232
-- Name: UserPlan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."UserPlan_id_seq" OWNED BY public."UserPlan".id;


--
-- TOC entry 218 (class 1259 OID 16408)
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3505 (class 0 OID 0)
-- Dependencies: 218
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- TOC entry 217 (class 1259 OID 16399)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 3276 (class 2604 OID 16549)
-- Name: EmailVerifyToken id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmailVerifyToken" ALTER COLUMN id SET DEFAULT nextval('public."EmailVerifyToken_id_seq"'::regclass);


--
-- TOC entry 3271 (class 2604 OID 16529)
-- Name: PhoneNumber id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhoneNumber" ALTER COLUMN id SET DEFAULT nextval('public."PhoneNumber_id_seq"'::regclass);


--
-- TOC entry 3291 (class 2604 OID 18285)
-- Name: PhoneNumberHistory id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhoneNumberHistory" ALTER COLUMN id SET DEFAULT nextval('public."PhoneNumberHistory_id_seq"'::regclass);


--
-- TOC entry 3274 (class 2604 OID 16539)
-- Name: Plan id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Plan" ALTER COLUMN id SET DEFAULT nextval('public."Plan_id_seq"'::regclass);


--
-- TOC entry 3279 (class 2604 OID 16560)
-- Name: ResetToken id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ResetToken" ALTER COLUMN id SET DEFAULT nextval('public."ResetToken_id_seq"'::regclass);


--
-- TOC entry 3284 (class 2604 OID 17019)
-- Name: Subscription id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subscription" ALTER COLUMN id SET DEFAULT nextval('public."Subscription_id_seq"'::regclass);


--
-- TOC entry 3282 (class 2604 OID 17009)
-- Name: Transaction id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transaction" ALTER COLUMN id SET DEFAULT nextval('public."Transaction_id_seq"'::regclass);


--
-- TOC entry 3266 (class 2604 OID 16412)
-- Name: User id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- TOC entry 3288 (class 2604 OID 17272)
-- Name: UserPlan id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserPlan" ALTER COLUMN id SET DEFAULT nextval('public."UserPlan_id_seq"'::regclass);


--
-- TOC entry 3481 (class 0 OID 16546)
-- Dependencies: 225
-- Data for Name: EmailVerifyToken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."EmailVerifyToken" (id, token, "userId", "expiresAt", used, "createdAt") FROM stdin;
2	cccbb03efa766033076cc4d5e52a53e4f14a0bf8b16800fe7001bb6be6e0ab57	2	2025-08-28 10:03:17.119	t	2025-08-27 10:03:17.12
4	50cd7da677ec17674e8bc592a58535077a573e8536da0ca29502d63324e24124	3	2025-08-28 11:07:52.836	f	2025-08-27 11:07:52.837
5	0eb4562c86c3f704f53e077f41e712073b3bd50c2cc10b3f919df936cbe60090	4	2025-08-28 13:17:23.031	t	2025-08-27 13:17:23.032
1	2ad201cebaec978dfe3e1ba2c8eb1eb3a207ec790c4926a0bb073f1f919ed13c	1	2025-08-28 09:46:47.314	t	2025-08-27 09:46:47.315
\.


--
-- TOC entry 3477 (class 0 OID 16526)
-- Dependencies: 221
-- Data for Name: PhoneNumber; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PhoneNumber" (id, "countryCode", "countryName", "mobileNumber", number800, "connectionFee", "monthlyFee", "createdAt", "updatedAt", category, status, "userId", "expiresAt", "lastPaymentDate", "reservedAt") FROM stdin;
1	+995	Georgia	558242562	\N	2	10	2025-08-27 12:01:29.361	2025-08-27 13:15:09.574	simple	connected	2	\N	2025-08-27 13:15:09.573	2025-08-27 13:15:09.573
2	+995	Georgia	577509014	\N	10	10	2025-08-27 13:16:20.177	2025-08-27 13:18:33.566	simple	connected	4	\N	2025-08-27 13:18:33.565	2025-08-27 13:18:33.565
13	+995	Georgia	5009585	\N	500	30	2025-08-29 12:10:21.508	2025-08-31 09:05:55.415	gold	active	1	\N	2025-08-31 09:05:45.645	2025-08-31 09:05:45.645
3	+995	Georgia	574015220	\N	3	15	2025-08-27 13:23:01.548	2025-09-01 04:59:58.698	simple	available	\N	\N	\N	\N
11	+995	Georgia	5552277	\N	100	10	2025-08-29 10:13:39.523	2025-08-31 07:33:00.06	simple	connected	2	\N	2025-08-31 07:33:00.052	2025-08-31 07:33:00.052
16	+995	Georgia	997526366	\N	5	15	2025-09-01 05:28:51.049	2025-09-01 05:29:40.873	simple	connected	1	\N	2025-09-01 05:29:40.87	2025-09-01 05:29:40.87
17	+995	Georgia	556253624	\N	10	15	2025-09-01 06:43:12.877	2025-09-01 06:43:12.877	simple	available	\N	\N	\N	\N
18	+995	Georgia	999558888	\N	100	100	2025-09-01 06:43:57.551	2025-09-01 06:43:57.551	gold	available	\N	\N	\N	\N
20	+995	Georgia	5555555	\N	100	100	2025-09-01 06:47:03.229	2025-09-01 06:52:40.63	platinum	available	\N	\N	\N	\N
15	+995	Georgia	555626369	\N	10	15	2025-09-01 05:28:32.186	2025-09-01 06:52:44.049	simple	available	\N	\N	\N	\N
7	+995	Georgia	599505050	\N	3	10	2025-08-29 07:18:59.206	2025-09-01 06:53:03.607	simple	available	\N	\N	\N	\N
8	+995	Georgia	55555877	\N	500	25	2025-08-29 07:31:56.871	2025-09-01 06:53:07.35	gold	available	\N	\N	\N	\N
9	+995	Georgia	577150803	\N	5	10	2025-08-29 10:13:05.373	2025-09-01 06:53:11.026	simple	available	\N	\N	\N	\N
14	+995	Georgia	500123456	\N	500	30	2025-08-29 12:10:37.072	2025-09-01 06:53:19.365	gold	available	\N	\N	\N	\N
12	+995	Georgia	5005050	\N	500	30	2025-08-29 12:10:11.554	2025-09-01 06:53:23.303	vip	available	\N	\N	\N	\N
21	+995	Georgia	5666665	\N	2000	2000	2025-09-01 06:55:58.924	2025-09-01 06:55:58.924	gold	available	\N	\N	\N	\N
22	+995	Georgia	559959559	\N	1500	2500	2025-09-03 09:18:19.489	2025-09-03 09:18:19.489	simple	available	\N	\N	\N	\N
23	+995	Georgia	500050505	\N	1500	2500	2025-09-03 09:25:53.768	2025-09-03 09:25:53.768	vip	available	\N	\N	\N	\N
\.


--
-- TOC entry 3491 (class 0 OID 18282)
-- Dependencies: 235
-- Data for Name: PhoneNumberHistory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PhoneNumberHistory" (id, "phoneNumberId", action, status, "userId", metadata, "createdAt") FROM stdin;
1	20	connected	connected	1	{"connectedAt": "2025-09-01T06:51:14.084Z", "previousStatus": "available"}	2025-09-01 06:51:14.086
\.


--
-- TOC entry 3479 (class 0 OID 16536)
-- Dependencies: 223
-- Data for Name: Plan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Plan" (id, name, description, price, "dataMb", minutes, sms, "createdAt", "updatedAt") FROM stdin;
1	Standart	100mu бесплатны	9.99	1000	100	50	2025-08-27 13:14:19.239	2025-08-27 13:14:19.239
2	Summer	You can add additional parameters within the cloud PBX (IVR, call recording, etc.) separately, or by activating the price plan.	5.00	1000	100	50	2025-08-27 14:22:11.016	2025-08-27 14:22:32.129
5	Office	Everything is included in Mobilive price plans: outgoing calls, phone numbers, additional PBX features.	5.00	1000	100	50	2025-08-27 14:23:17.269	2025-08-27 14:23:17.269
6	WInter	100Mg free 20GB 	20.00	1000	100	100	2025-09-01 05:33:57.659	2025-09-01 05:33:57.659
\.


--
-- TOC entry 3483 (class 0 OID 16557)
-- Dependencies: 227
-- Data for Name: ResetToken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ResetToken" (id, token, "userId", "expiresAt", used, "createdAt") FROM stdin;
1	f7901dffc444c1dc696a9ab6eecf76e35e412af4c948bdf2e6568b547766ff0a	1	2025-08-31 09:59:50.956	f	2025-08-31 08:59:50.958
\.


--
-- TOC entry 3487 (class 0 OID 17016)
-- Dependencies: 231
-- Data for Name: Subscription; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Subscription" (id, "userId", "planId", status, "startDate", "endDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3485 (class 0 OID 17006)
-- Dependencies: 229
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Transaction" (id, "userId", type, amount, description, "balanceBefore", "balanceAfter", metadata, "createdAt") FROM stdin;
1	2	TOPUP	1000	Пополнение баланса на $10.00	0	1000	{"source": "web"}	2025-08-27 13:14:54.359
2	2	PURCHASE	-12	Покупка номера 558242562	1000	988	{"monthlyFee": 10, "mobileNumber": "558242562", "connectionFee": 2, "phoneNumberId": 1}	2025-08-27 13:15:09.589
3	4	TOPUP	2000	Пополнение баланса на $20.00	0	2000	{"source": "web"}	2025-08-27 13:18:24.914
4	4	PURCHASE	-20	Покупка номера 577509014	2000	1980	{"monthlyFee": 10, "mobileNumber": "577509014", "connectionFee": 10, "phoneNumberId": 2}	2025-08-27 13:18:33.575
5	1	REFUND	7	Отключение номера 574015220	0	7	{"number800": null, "mobileNumber": "574015220", "refundAmount": 7, "phoneNumberId": 3}	2025-08-27 13:48:30.401
6	1	REFUND	10	Отключение номера 800000052	7	17	{"number800": "800000052", "mobileNumber": null, "refundAmount": 10, "phoneNumberId": 4}	2025-08-27 13:48:34.036
7	1	REFUND	20	Отключение номера 80050020	17	37	{"number800": "80050020", "mobileNumber": null, "refundAmount": 20, "phoneNumberId": 5}	2025-08-27 13:48:37.784
8	1	REFUND	20	Отключение номера 80050020	37	57	{"number800": "80050020", "mobileNumber": null, "refundAmount": 20, "phoneNumberId": 5}	2025-08-27 13:49:21.147
9	1	REFUND	10	Отключение номера 800000052	57	67	{"number800": "800000052", "mobileNumber": null, "refundAmount": 10, "phoneNumberId": 4}	2025-08-27 14:10:29.22
10	1	PURCHASE	-18	Покупка номера 574015220	67	49	{"monthlyFee": 15, "mobileNumber": "574015220", "connectionFee": 3, "phoneNumberId": 3}	2025-08-27 14:10:39.644
11	1	REFUND	10	Отключение номера 800000052	49	59	{"number800": "800000052", "mobileNumber": null, "refundAmount": 10, "phoneNumberId": 4}	2025-08-27 14:20:31.245
12	1	REFUND	20	Отключение номера 80050020	59	79	{"number800": "80050020", "mobileNumber": null, "refundAmount": 20, "phoneNumberId": 5}	2025-08-27 14:20:35.113
13	1	REFUND	7	Отключение номера 574015220	79	86	{"number800": null, "mobileNumber": "574015220", "refundAmount": 7, "phoneNumberId": 3}	2025-08-28 02:32:24.786
14	1	TOPUP	1000	Пополнение баланса на $10.00	86	1086	{"source": "web"}	2025-08-29 07:33:05.106
15	1	REFUND	10	Отключение номера 800000052	1086	1096	{"number800": "800000052", "mobileNumber": null, "refundAmount": 10, "phoneNumberId": 4}	2025-08-29 07:33:18.949
16	1	PURCHASE	-525	Покупка номера 55555877	1096	571	{"monthlyFee": 25, "mobileNumber": "55555877", "connectionFee": 500, "phoneNumberId": 8}	2025-08-29 07:33:28.758
17	1	REFUND	12	Отключение номера 55555877	571	583	{"number800": null, "mobileNumber": "55555877", "refundAmount": 12, "phoneNumberId": 8}	2025-08-29 10:14:32.656
18	2	PURCHASE	-110	Покупка номера 5552277	988	878	{"monthlyFee": 10, "mobileNumber": "5552277", "connectionFee": 100, "phoneNumberId": 11}	2025-08-31 07:33:00.501
19	1	REFUND	7	Отключение номера 574015220	583	590	{"number800": null, "mobileNumber": "574015220", "refundAmount": 7, "phoneNumberId": 3}	2025-08-31 09:02:35.263
20	1	REFUND	5	Отключение номера 577150803	590	595	{"number800": null, "mobileNumber": "577150803", "refundAmount": 5, "phoneNumberId": 9}	2025-08-31 09:03:42.839
21	1	REFUND	15	Отключение номера 500123456	595	610	{"number800": null, "mobileNumber": "500123456", "refundAmount": 15, "phoneNumberId": 14}	2025-08-31 09:04:25.957
22	1	PURCHASE	-18	Покупка номера 574015220	610	592	{"monthlyFee": 15, "mobileNumber": "574015220", "connectionFee": 3, "phoneNumberId": 3}	2025-08-31 09:06:30.892
23	1	REFUND	7	Отключение номера 574015220	592	599	{"number800": null, "mobileNumber": "574015220", "refundAmount": 7, "phoneNumberId": 3}	2025-09-01 04:59:59.146
24	1	REFUND	12	Отключение номера 55555877	599	611	{"number800": null, "mobileNumber": "55555877", "refundAmount": 12, "phoneNumberId": 8}	2025-09-01 05:00:02.403
25	1	REFUND	5	Отключение номера 577150803	611	616	{"number800": null, "mobileNumber": "577150803", "refundAmount": 5, "phoneNumberId": 9}	2025-09-01 05:00:05.08
26	1	REFUND	15	Отключение номера 5005050	616	631	{"number800": null, "mobileNumber": "5005050", "refundAmount": 15, "phoneNumberId": 12}	2025-09-01 05:00:07.71
27	1	REFUND	15	Отключение номера 500123456	631	646	{"number800": null, "mobileNumber": "500123456", "refundAmount": 15, "phoneNumberId": 14}	2025-09-01 05:00:10.266
28	1	REFUND	50	Отключение номера 5555555	646	696	{"number800": null, "mobileNumber": "5555555", "refundAmount": 50, "phoneNumberId": 20}	2025-09-01 06:52:40.647
29	1	REFUND	7	Отключение номера 555626369	696	703	{"number800": null, "mobileNumber": "555626369", "refundAmount": 7, "phoneNumberId": 15}	2025-09-01 06:52:44.065
30	1	REFUND	5	Отключение номера 599505050	703	708	{"number800": null, "mobileNumber": "599505050", "refundAmount": 5, "phoneNumberId": 7}	2025-09-01 06:53:03.617
31	1	REFUND	12	Отключение номера 55555877	708	720	{"number800": null, "mobileNumber": "55555877", "refundAmount": 12, "phoneNumberId": 8}	2025-09-01 06:53:07.36
32	1	REFUND	5	Отключение номера 577150803	720	725	{"number800": null, "mobileNumber": "577150803", "refundAmount": 5, "phoneNumberId": 9}	2025-09-01 06:53:11.038
33	1	REFUND	15	Отключение номера 500123456	725	740	{"number800": null, "mobileNumber": "500123456", "refundAmount": 15, "phoneNumberId": 14}	2025-09-01 06:53:19.376
34	1	REFUND	15	Отключение номера 5005050	740	755	{"number800": null, "mobileNumber": "5005050", "refundAmount": 15, "phoneNumberId": 12}	2025-09-01 06:53:23.311
\.


--
-- TOC entry 3475 (class 0 OID 16409)
-- Dependencies: 219
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, "passwordHash", "firstName", "lastName", "isActive", "createdAt", "updatedAt", role, username, balance) FROM stdin;
4	mobilivetb@gmail.com	$2b$10$FggqCt9wUrHuUylFt2HLB.8JVp0S13jYcFkZHPnE2D7wXbomdaGTq	\N	\N	t	2025-08-27 13:17:23.025	2025-08-27 13:18:33.566	USER	mobilive	1980
3	admin@mobilive.ge	$2b$10$Gg6kNGYK.dct/yQs69kfaea11oMOSS18yzq9x0l5n7.X7/JP7Rl2y	\N	\N	t	2025-08-27 11:04:51.271	2025-08-28 05:32:43.452	ADMIN	admin	0
2	tvmrgeorgia@gmail.com	$2b$10$NVlBtbHpcjDM86wsxXij1.78BpTp.lFabu.dMH9hqRM0xwD3F11Q2	\N	\N	t	2025-08-27 10:03:17.111	2025-08-31 07:33:00.06	USER	tvmr	878
1	aroniazvio@gmail.com	$2b$10$Gy3CvL5kUG/aPAPh1xpl7OWhoI2y/HjWgTW.c/rF8f/c8huH4WEmG	\N	\N	t	2025-08-27 09:46:47.304	2025-09-01 06:53:23.303	USER	azvioa	755
\.


--
-- TOC entry 3489 (class 0 OID 17269)
-- Dependencies: 233
-- Data for Name: UserPlan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UserPlan" (id, "userId", "planId", status, "createdAt", "updatedAt") FROM stdin;
1	2	1	active	2025-08-27 13:15:15.003	2025-08-27 13:15:15.003
2	4	1	active	2025-08-27 13:18:44.978	2025-08-27 13:18:44.978
3	1	1	expired	2025-08-27 13:45:21.711	2025-08-27 14:23:33.841
4	1	2	expired	2025-08-27 14:23:33.851	2025-08-31 07:28:32.373
5	1	1	expired	2025-08-31 07:28:32.67	2025-09-01 05:21:16.229
6	1	2	expired	2025-09-01 05:21:16.53	2025-09-01 05:21:30.728
7	1	5	expired	2025-09-01 05:21:31.032	2025-09-01 05:31:30.388
8	1	2	expired	2025-09-01 05:31:30.672	2025-09-01 05:31:43.876
9	1	5	expired	2025-09-01 05:31:44.171	2025-09-01 05:32:06.047
10	1	1	expired	2025-09-01 05:32:06.338	2025-09-01 05:59:29.843
11	1	6	expired	2025-09-01 05:59:30.139	2025-09-03 09:22:35.412
12	1	5	active	2025-09-03 09:22:35.43	2025-09-03 09:22:35.43
\.


--
-- TOC entry 3473 (class 0 OID 16399)
-- Dependencies: 217
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
ebe1fae1-47d9-40f8-bc4c-8398d6cdf31c	a4b8c8fd9fcbf67c0cc8f392d7b009baeb409b1ec3ed3662829ec2f22913634d	2025-08-22 11:49:14.287153+00	20250810022723_	\N	\N	2025-08-22 11:49:13.930332+00	1
b83b4332-4798-4ea5-a367-5ed0ce8dccbe	48ff9b0d83b055c93448a3267c5ffe05f4d795884db0650a27d3d83fb9c8eefb	2025-08-22 11:49:14.321026+00	20250810032204_	\N	\N	2025-08-22 11:49:14.297276+00	1
3b0ec785-0f93-4e6c-b9a6-ecc0af8e688f	5c6b579bbb2f559c8de88b38bde378a24e0bb313e9cd5ca3394ee83c2ed80127	2025-08-22 11:49:14.436484+00	20250811192248_add_role_enum	\N	\N	2025-08-22 11:49:14.326295+00	1
0d18b000-eeda-4a49-8929-842d39d9b9d2	334a4c91a708598a51435a1a81e358bf96c0e391921dfc6b3c23d4135caf17ab	2025-08-22 11:49:14.524951+00	20250814105316_plan	\N	\N	2025-08-22 11:49:14.441901+00	1
e78136ff-6a8d-4639-b5cb-716e8b605c87	8b6c6e1c77afb522633cb9ce7d9dbf356a9be14be14af20d582cda0414cb04bb	2025-08-22 11:49:14.544516+00	20250815110321_add_phone_category	\N	\N	2025-08-22 11:49:14.532413+00	1
a26ccacc-b432-4025-8ba3-fcfe89ebd356	10f38d335c048cde22d4919e0d51ff8785a79f89ab7dc4e10f146b8c52bdf32d	2025-08-22 11:49:14.565195+00	20250821001405_add_user_balance	\N	\N	2025-08-22 11:49:14.548916+00	1
458dd89d-8a57-402d-8bd1-9896bc8fa17c	e8db5e880e30fabb09f642a26d6728da1c925db5de767d5b3120956318dcc54a	2025-08-27 08:56:42.747776+00	20250823075740_add_transactions_and_phone_updates	\N	\N	2025-08-27 08:56:42.356169+00	1
a5ea7185-ed5b-4382-89eb-967c0328bdd2	ced5e2716a356d12003648e61ecaafca2970e1652030e809bf9ab09f0e18c404	2025-08-27 08:56:43.252913+00	20250823084032_make_mobile_number_optional	\N	\N	2025-08-27 08:56:42.89197+00	1
8344f18a-e6e7-4ac4-89b6-5229437d67d7	dacf444ba1a5acf007d93500eee12ce1f4baead0d73b2bf0cd1e390a05eaa598	2025-08-27 08:56:49.387041+00	20250827085648_kar	\N	\N	2025-08-27 08:56:49.000405+00	1
868dc3a2-8aed-437c-ad1d-227ec11f2071	e00a1edfe5315f98875325014a74fefcd6fe454914220f14dd2795e07f22756b	2025-09-01 06:27:27.809597+00	20250901062727_add_phone_number_history	\N	\N	2025-09-01 06:27:27.408581+00	1
\.


--
-- TOC entry 3506 (class 0 OID 0)
-- Dependencies: 224
-- Name: EmailVerifyToken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."EmailVerifyToken_id_seq"', 5, true);


--
-- TOC entry 3507 (class 0 OID 0)
-- Dependencies: 234
-- Name: PhoneNumberHistory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhoneNumberHistory_id_seq"', 1, true);


--
-- TOC entry 3508 (class 0 OID 0)
-- Dependencies: 220
-- Name: PhoneNumber_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PhoneNumber_id_seq"', 23, true);


--
-- TOC entry 3509 (class 0 OID 0)
-- Dependencies: 222
-- Name: Plan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Plan_id_seq"', 6, true);


--
-- TOC entry 3510 (class 0 OID 0)
-- Dependencies: 226
-- Name: ResetToken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ResetToken_id_seq"', 1, true);


--
-- TOC entry 3511 (class 0 OID 0)
-- Dependencies: 230
-- Name: Subscription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Subscription_id_seq"', 1, false);


--
-- TOC entry 3512 (class 0 OID 0)
-- Dependencies: 228
-- Name: Transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Transaction_id_seq"', 34, true);


--
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 232
-- Name: UserPlan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."UserPlan_id_seq"', 12, true);


--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 218
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."User_id_seq"', 5, true);


--
-- TOC entry 3305 (class 2606 OID 16555)
-- Name: EmailVerifyToken EmailVerifyToken_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmailVerifyToken"
    ADD CONSTRAINT "EmailVerifyToken_pkey" PRIMARY KEY (id);


--
-- TOC entry 3317 (class 2606 OID 18290)
-- Name: PhoneNumberHistory PhoneNumberHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhoneNumberHistory"
    ADD CONSTRAINT "PhoneNumberHistory_pkey" PRIMARY KEY (id);


--
-- TOC entry 3301 (class 2606 OID 16534)
-- Name: PhoneNumber PhoneNumber_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhoneNumber"
    ADD CONSTRAINT "PhoneNumber_pkey" PRIMARY KEY (id);


--
-- TOC entry 3303 (class 2606 OID 16544)
-- Name: Plan Plan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Plan"
    ADD CONSTRAINT "Plan_pkey" PRIMARY KEY (id);


--
-- TOC entry 3308 (class 2606 OID 16566)
-- Name: ResetToken ResetToken_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ResetToken"
    ADD CONSTRAINT "ResetToken_pkey" PRIMARY KEY (id);


--
-- TOC entry 3313 (class 2606 OID 17026)
-- Name: Subscription Subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY (id);


--
-- TOC entry 3311 (class 2606 OID 17014)
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- TOC entry 3315 (class 2606 OID 17278)
-- Name: UserPlan UserPlan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserPlan"
    ADD CONSTRAINT "UserPlan_pkey" PRIMARY KEY (id);


--
-- TOC entry 3297 (class 2606 OID 16419)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 3294 (class 2606 OID 16407)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3306 (class 1259 OID 16567)
-- Name: EmailVerifyToken_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "EmailVerifyToken_token_key" ON public."EmailVerifyToken" USING btree (token);


--
-- TOC entry 3299 (class 1259 OID 16582)
-- Name: PhoneNumber_mobileNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PhoneNumber_mobileNumber_key" ON public."PhoneNumber" USING btree ("mobileNumber");


--
-- TOC entry 3309 (class 1259 OID 16568)
-- Name: ResetToken_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ResetToken_token_key" ON public."ResetToken" USING btree (token);


--
-- TOC entry 3295 (class 1259 OID 16481)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 3298 (class 1259 OID 16569)
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- TOC entry 3319 (class 2606 OID 16570)
-- Name: EmailVerifyToken EmailVerifyToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EmailVerifyToken"
    ADD CONSTRAINT "EmailVerifyToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3326 (class 2606 OID 18291)
-- Name: PhoneNumberHistory PhoneNumberHistory_phoneNumberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhoneNumberHistory"
    ADD CONSTRAINT "PhoneNumberHistory_phoneNumberId_fkey" FOREIGN KEY ("phoneNumberId") REFERENCES public."PhoneNumber"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3327 (class 2606 OID 18296)
-- Name: PhoneNumberHistory PhoneNumberHistory_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhoneNumberHistory"
    ADD CONSTRAINT "PhoneNumberHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3318 (class 2606 OID 16583)
-- Name: PhoneNumber PhoneNumber_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PhoneNumber"
    ADD CONSTRAINT "PhoneNumber_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3320 (class 2606 OID 16575)
-- Name: ResetToken ResetToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ResetToken"
    ADD CONSTRAINT "ResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3322 (class 2606 OID 17037)
-- Name: Subscription Subscription_planId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES public."Plan"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3323 (class 2606 OID 17032)
-- Name: Subscription Subscription_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3321 (class 2606 OID 17027)
-- Name: Transaction Transaction_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3324 (class 2606 OID 17284)
-- Name: UserPlan UserPlan_planId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserPlan"
    ADD CONSTRAINT "UserPlan_planId_fkey" FOREIGN KEY ("planId") REFERENCES public."Plan"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3325 (class 2606 OID 17279)
-- Name: UserPlan UserPlan_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserPlan"
    ADD CONSTRAINT "UserPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2025-09-04 12:34:42

--
-- PostgreSQL database dump complete
--

\unrestrict 2TzI8IgdeKU54z23D6zrISMnHm5fgTzB3ct3SamhNpvVzxWUu2c1pDWpxHpafqx

