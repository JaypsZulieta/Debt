<script lang="ts">
    import { fade } from "svelte/transition";
    import type { Debt } from "../app";
    import EditDebts from "./EditDebts.svelte";
    export let debt: Debt;
</script>

{#key debt.itemNo}
    <th class="text-right" in:fade>{debt.itemNo}.</th>
{/key}
{#key debt.name}
    <td in:fade>{debt.name}</td>
{/key}
{#key debt.description}
    <td class=" opacity-85" in:fade>{debt.description}</td>
{/key}
{#key debt.amount}
<td in:fade>
    <span class="font-bold text-red-400">
        {debt.amount.toLocaleString('en-us', { style: 'currency', currency: 'PHP'})}
    </span>
</td>
{/key}
<td>
    <EditDebts {debt} />
</td>