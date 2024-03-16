<script lang="ts">
    import TotalOwedtoMe from "./TotaOwedtoMe.svelte";
    import AddDebtForm from "./AddDebtForm.svelte";
    import Table from "./Table.svelte";
    import TotalDebtors from "./TotalDebtors.svelte";
    export let data;
</script>

<div class="min-h-screen pt-10 overflow-auto px-40 bg-base-200">
    <div class="flex gap-2">
        <div class="flex-1">
            <TotalDebtors statDesc="The total amount of debtors" statTitle="Number of Debtors" value={data.debtorsCount}  />
            <TotalOwedtoMe statTitle="Amount owed to me" value={data.totalOwedToMe} statDesc="The total amount of pessos owed to me" />
        </div>
        <div class="flex-none">
            <AddDebtForm />
        </div>
    </div>
    
    <Table debts={data.debts} />
</div>