<script lang="ts">
    import { enhance } from "$app/forms";
    import type { Debt } from "../app";

    export let debt: Debt;

    let modal: HTMLDialogElement;

    const showModal = () => {
        modal.showModal();
    }

</script>

<button class="btn btn-square rounded-full btn-ghost btn-sm" on:click={showModal}>
    <span class="material-symbols-outlined opacity-60">settings</span>
</button>
<dialog bind:this={modal}  class="modal">
    <div class="modal-box  min-h-96 rounded-md">
        <form class="flex place-content-end" method="dialog">
            <button class="btn btn-ghost btn-square rounded-full btn-sm hover:bg-error"><span class="material-symbols-outlined">close</span></button>
        </form>
        <form class="flex flex-col" action="?/update" method="POST" use:enhance={() => {
            modal.close();
            return async ({update}) => {
                update({ reset: false });
            }
        }}>
            <h3 class="text text-2xl font-bold mb-5 text-center">Record a Debt</h3>
            <label for="debtor"  class="label font-semibold opacity-80">Name of Debtor</label>
            <input id="debtor" class="input input-bordered rounded-md" type="text" name="debtor" placeholder="eg. John Smith" value={debt.name} required >
            <label for="description"  class="label font-semibold opacity-80">Description of Debt</label>
            <textarea class="textarea textarea-bordered resize-none h-32 rounded-md" id="description" name="description" placeholder="Describe the details of the debt" value={debt.description} required />
            <label class="label font-semibold opacity-80" for="amount">Amount</label>
            <input class="input input-bordered font-semibold rounded-md" type="number" name="amount" placeholder="Amount borrowed" step="0.01" value={debt.amount} required />
            <div class="mt-5">
                <div class="w-full">
                    <button class="btn btn-primary w-full btn-md rounded-md" name="id" value={debt.id}> 
                        <span class="material-symbols-outlined" >edit</span>
                        Update
                    </button>
                </div>
                <form class="w-full mt-3" use:enhance={() => modal.close()} action="?/delete" method="POST">
                    <button class="btn btn-success w-full rounded-md" name="id" value={debt.id}>
                        <span class="material-symbols-outlined">task_alt</span>
                        Mark as Paid
                    </button>
                </form>
            </div>  
        </form>
    </div>
</dialog>