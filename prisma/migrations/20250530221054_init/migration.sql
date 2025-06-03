-- CreateTable
CREATE TABLE "Ranking" (
    "id" SERIAL PRIMARY KEY,
    "accountName" VARCHAR(191) NOT NULL,
    "profileUrl" VARCHAR(191) NOT NULL,
    "followers" INTEGER NOT NULL,
    "imageUrl" VARCHAR(191) NOT NULL,
    "area" VARCHAR(191) NOT NULL,
    "storeName" VARCHAR(191) NOT NULL
);