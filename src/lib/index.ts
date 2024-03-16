import type { PrismaClient } from "@prisma/client";

abstract class Entity{
    public abstract delete(prismaClient: PrismaClient): Promise<void>;
}

class Debtor extends Entity{
    private id: number;
    private name: string;

    constructor(id: number, name: string){
        super();
        this.id = id;
        this.name = name;
    }

    async setName(name: string, prismaClient: PrismaClient): Promise<void>{
        this.name = name;
        await prismaClient.debtor.update({ data: { name }, where: { id: this.id }});
    }

    getId(): number{
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    public async delete(prismaClient: PrismaClient): Promise<void> {
        await prismaClient.debtor.delete({ where: { id: this.id }});
    }

    public async countDebts(prismaClient: PrismaClient): Promise<number>{
        return await prismaClient.debt.count({ where: { debtorId: this.id }});
    }

}

class Debt extends Entity{
    private id: number;
    private description: string;
    private amount: number;
    private debtor: Debtor;
    private timeAdded: Date;

    constructor(id: number, description: string, amount: number, debtor: Debtor, timeAdded: Date){
        super();
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.debtor = debtor;
        this.timeAdded = timeAdded;
    }

    async setDescription(description: string, prismaClient: PrismaClient) {
        this.description = description;
        await prismaClient.debt.update({ data: { description }, where: { id: this.id }});
    }
    async setDebtor(debtor: Debtor, prismaClient: PrismaClient) {
        this.debtor = debtor;
        await prismaClient.debt.update({ data: { debtorId: debtor.getId()}, where: { id: this.id }});
    }
    async setAmount(amount: number, prismaClient: PrismaClient){
        this.amount = amount;
        await prismaClient.debt.update({ data: { amount }, where: { id: this.id }});
    }
    public async delete(prismaClient: PrismaClient): Promise<void> {
        await prismaClient.debt.delete({ where: { id: this.id }});
    }
    getId(): number {
        return this.id;
    }
    getDescription(): string {
        return this.description;
    }
    getAmount(): number {
        return this.amount;
    }
    getDebtor(): Debtor {
        return this.debtor;
    }
    getTimeAdded(): Date {
        return this.timeAdded;
    }
}

abstract class RecordReader<TId, TEntity>{
    protected prismaClient: PrismaClient;
    constructor(prismaClient: PrismaClient){
        this.prismaClient = prismaClient;
    }
    abstract existById(id:TId ): Promise<boolean>;
    abstract findAllRecords(): Promise<TEntity[]>;
    abstract findRecordById(id: TId): Promise<TEntity>;
}

export class DebtorRecordReader extends RecordReader<number,Debtor>{

    constructor(prismaClient: PrismaClient){
        super(prismaClient);
    }

    async findAllRecords(): Promise<Debtor[]> {
        return (await this.prismaClient.debtor.findMany({ orderBy: { timeAdded: 'desc'}}))
        .map((debtor) => new Debtor(debtor.id, debtor.name));
    }
    async existById(id: number): Promise<boolean> {
        return await this.prismaClient.debtor.count({ where: { id }}) > 0;
    }
    async existByName(name: string): Promise<boolean> {
        return await this.prismaClient.debtor.count({ where: { name }}) > 0;
    }
    async findRecordById(id: number): Promise<Debtor> {
        if(!await this.existById(id)) throw Error(`Debtor ${id} does not exist`);
        return await this.prismaClient.debtor.findUniqueOrThrow({ where: { id }})
        .then((debtor) => new Debtor(debtor.id, debtor.name));
    }
    async findRecordByName(name: string): Promise<Debtor> {
        if(!await this.existByName(name)) throw Error(`Debtor with name ${name} does not exist`);
        return await this.prismaClient.debtor.findUniqueOrThrow({ where: { name }})
        .then((debtor) => new Debtor(debtor.id, debtor.name));
    }

    async count(): Promise<number>{
        const count = await this.prismaClient
        .$queryRaw`SELECT count(distinct debtor.id) AS count FROM debtor INNER JOIN debt ON debtor.id = debt.debtorid;` as any;
        return Number(count[0].count);
    }
}

export class DebtRecordReader extends RecordReader<number, Debt>{
    private debtorRecordReader: DebtorRecordReader;

    constructor(prismaClient: PrismaClient, debtorRecordReader: DebtorRecordReader){
        super(prismaClient);
        this.debtorRecordReader = debtorRecordReader;
    }

    async existById(id: number): Promise<boolean> {
        return await this.prismaClient.debt.count({ where: { id }}) > 0;
    }
    async findAllRecords(): Promise<Debt[]> {
        const debts =  (await this.prismaClient.debt.findMany({ orderBy: { timeAdded: 'desc'}}))
        .map(async (debt) => {
            const debtor = await this.debtorRecordReader.findRecordById(debt.debtorId);
            return new Debt(debt.id, debt.description, debt.amount, debtor, debt.timeAdded);
        });
        return Promise.all(debts);
    }
    async findRecordById(id: number): Promise<Debt> {
        if(!await this.existById(id)) throw Error(`debt ${id} does not exist`);
        return await this.prismaClient.debt.findUniqueOrThrow({ where: { id }})
        .then(async (debt) => {
            const debtor = await this.debtorRecordReader.findRecordById(debt.debtorId);
            return new Debt(debt.id, debt.description, debt.amount, debtor, debt.timeAdded);
        });
    }
}

export class DebtorRecorder{
    private prismaClient: PrismaClient;
    constructor(prismaClient: PrismaClient){
        this.prismaClient = prismaClient;
    }
    async record(name: string): Promise<Debtor>{
        return await this.prismaClient.debtor.create({ data: { name }})
        .then((debtor) => new Debtor(debtor.id, debtor.name));
    }
}

export class DebtRecorder {
    private prismaClient: PrismaClient;
    constructor(prismaClient: PrismaClient){
        this.prismaClient = prismaClient;
    }
    async record(description: string, amount: number, debtor: Debtor): Promise<Debt>{
        return await this.prismaClient.debt.create({ data: { description, amount, debtorId: debtor.getId()}})
        .then((debt) => new Debt(debt.id, debt.description, debt.amount, debtor, debt.timeAdded));
    }
}
