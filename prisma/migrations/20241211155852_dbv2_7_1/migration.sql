-- AlterTable
CREATE SEQUENCE genre_id_seq;
ALTER TABLE "Genre" ALTER COLUMN "id" SET DEFAULT nextval('genre_id_seq');
ALTER SEQUENCE genre_id_seq OWNED BY "Genre"."id";
