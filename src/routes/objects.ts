import { DebtRecordReader, DebtRecorder, DebtorRecordReader, DebtorRecorder } from "$lib";
import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient();

export const debtorRecordReader = new DebtorRecordReader(prismaClient);
export const debtRecorderReader = new DebtRecordReader(prismaClient, debtorRecordReader);
export const debtorRecorder = new DebtorRecorder(prismaClient);
export const debtRecorder = new DebtRecorder(prismaClient);