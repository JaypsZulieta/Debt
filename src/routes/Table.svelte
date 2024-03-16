<script lang="ts">
    import { flip } from "svelte/animate";
    import type { Debt } from "../app";
    import TableRow from "./TableRow.svelte";
    export let debts: Debt[];
</script>

<div class="overflow-x-hidden bg-base-100 shadow-md h-96 mt-5 rounded-md">
    <table class="table">
      <thead class=" bg-blue-400">
        <tr>
        <th></th>
          <th class="w-1/4">Name</th>
          <th class="w-1/2">Description</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each debts as debt (debt.id)}
          <tr class="hover" animate:flip={{duration:200}}>
            <TableRow {debt} />
          </tr>
        {/each}
      </tbody>
    </table>
</div>