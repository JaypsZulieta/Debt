-- CreateTable
CREATE TABLE `Debtor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `timeAdded` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Debtor_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Debt` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` TEXT NOT NULL,
    `amount` DOUBLE NOT NULL,
    `debtorId` INTEGER NOT NULL,
    `timeAdded` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Debt` ADD CONSTRAINT `Debt_debtorId_fkey` FOREIGN KEY (`debtorId`) REFERENCES `Debtor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
