CREATE TABLE "public"."Challenges" (
"id" SERIAL,
"validTo" timestamp(3)   NOT NULL ,
"email" text   NOT NULL ,
"challenge" text   NOT NULL ,
"done" boolean   NOT NULL ,
PRIMARY KEY ("id")
);

CREATE TABLE "public"."KeyPairs" (
"id" SERIAL,
"validFrom" timestamp(3)   NOT NULL ,
"validTo" timestamp(3)   NOT NULL ,
"privateKeyPem" text   NOT NULL ,
"publicKeyPem" text   NOT NULL ,
"privateKeyJwk" text   NOT NULL ,
"publicKeyJwk" text   NOT NULL ,
PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UX_Challenges_Email_Challenge" ON "public"."Challenges"("email", "challenge");
