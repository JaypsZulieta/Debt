<script lang="ts">
    import { enhance } from "$app/forms";

    let modal: HTMLDialogElement;

    const showModal = () => {
        modal.showModal();
    }

</script>


<button class="btn btn-square rounded-full btn-primary" on:click={showModal}>
    <span class="material-symbols-outlined">add</span>
</button>
<dialog bind:this={modal}  class="modal">
    <div class="modal-box  min-h-96 rounded-md">
        <form class="flex place-content-end" method="dialog">
            <button class="btn btn-ghost btn-square rounded-full btn-sm hover:bg-error"><span class="material-symbols-outlined">close</span></button>
        </form>
        <form class="flex flex-col" action="?/add" method="POST" use:enhance={() => modal.close()}>
            <h3 class="text text-2xl font-bold mb-5 text-center">Record a Debt</h3>
            <label for="debtor"  class="label font-semibold opacity-80">Name of Debtor</label>
            <input id="debtor" class="input input-bordered rounded-md" type="text" name="debtor" placeholder="eg. John Smith" required >
            <label for="description"  class="label font-semibold opacity-80">Description of Debt</label>
            <textarea class="textarea textarea-bordered resize-none h-32 rounded-md" id="description" name="description" placeholder="Describe the details of the debt" required />
            <label class="label font-semibold opacity-80" for="amount">Amount</label>
            <input class="input input-bordered font-semibold rounded-md" type="number" name="amount" placeholder="Amount borrowed" step="0.01" required />
            <div class="mt-5">
                <div class="w-full">
                    <button class="btn btn-primary w-full btn-md rounded-md">
                        Submit
                        <span class="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            </div>  
        </form>
    </div>
</dialog>