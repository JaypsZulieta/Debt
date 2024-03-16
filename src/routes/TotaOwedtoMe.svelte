<script lang="ts">
    import { fade } from "svelte/transition";

    export let statTitle: string;
    export let value: number;
    export let statDesc: string;
</script>


<div class="stats shadow min-w-64 rounded-md">
    <div class="stat">
      <div class="stat-title">{statTitle}</div>
      {#key value}
        <div in:fade class:text-success={value == 0}  class="stat-value text-error">{value.toLocaleString('en-us', { style: 'currency', currency: 'php'})}</div>
      {/key}
      <div class="stat-desc">{statDesc}</div>
    </div>
</div>