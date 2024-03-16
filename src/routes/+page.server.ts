import type { Actions } from "@sveltejs/kit";
import type { Debt } from "../app";
import type { PageServerLoad } from "./$types";
import { debtRecorder, debtRecorderReader, debtorRecordReader, debtorRecorder, prismaClient } from "./objects";

export const load = (async (e) => {
    const debts = (await debtRecorderReader.findAllRecords()).map((debt, index) => {
        return {
            itemNo: index + 1,
            id: debt.getId(),
            description: debt.getDescription(),
            amount: debt.getAmount(),
            name: debt.getDebtor().getName(),
            timeAdded: debt.getTimeAdded(),
        }
    }) satisfies Debt[];

    let totalOwedToMe = 0;

    if(debts.length > 0){
        totalOwedToMe = debts.map((debt) => debt.amount)
        .reduce((accumlatedValue, currentValue) => accumlatedValue + currentValue );
    }

    const debtorsCount = await debtorRecordReader.count();

    return { debtorsCount, totalOwedToMe, debts };
}) satisfies PageServerLoad;

export const actions = ({
    add: async (e) => {
        const formData = await e.request.formData();
        const name = formData.get("debtor") as string;
        const description = formData.get("description") as string;
        const amount = Number(formData.get("amount") as string);
        const debtor = await debtorRecordReader.findRecordByName(name)
        .catch(() => debtorRecorder.record(name));
        await debtRecorder.record(description, amount, debtor);
    },
    update: async (e) => {
        const formData = await e.request.formData();
        const name = formData.get("debtor") as string;
        const description = formData.get("description") as string;
        const amount = Number(formData.get("amount") as string);
        const id = Number(formData.get("id"));
        const debtor = await debtorRecordReader.findRecordByName(name)
        .catch(() => debtorRecorder.record(name));
        const debt = await debtRecorderReader.findRecordById(id);
        const prevDebtor = debt.getDebtor();
        await debt.setDebtor(debtor, prismaClient);
        await debt.setAmount(amount, prismaClient);
        await debt.setDescription(description, prismaClient);
        if(await prevDebtor.countDebts(prismaClient) === 0)
            await prevDebtor.delete(prismaClient);
    },
    delete: async (e) => {
        const formData = await e.request.formData();
        const id = Number(formData.get("id"));
        const debt = await debtRecorderReader.findRecordById(id);
        const debtor = debt.getDebtor();
        await debt.delete(prismaClient)
        .then(async () => {
            if(await debtor.countDebts(prismaClient) === 0)
                await debtor.delete(prismaClient);
        });
    }
}) satisfies Actions;