<script lang="ts">
	import type { PageProps } from './$types';

    import { invalidateAll } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';

	let { data }: PageProps = $props();

    // Restructure data into map, with IDs as the key, so it would be easier to
    // update and delete tee times
    const obj: any = {}

    for(const key of data.tees){
        obj[key.id] = key
    }

    let tees = $state(obj);
    let edit = $state(false);
    let currentTee: any = $state({});
    let apiError = $state("");
    let successMsg = $state("");

    async function deleteTee(id: string) {
        try {
            const resp = await fetch('/api/delete', {
                method: 'DELETE',
                body: JSON.stringify({id}),
                headers: {
                    'content-type': "application/json"
                }
            });

            if (resp.status == 200){
                delete tees[id];
            }
        } catch (error) {
            console.error("Error deleting Tee Time");
        }
    }

    async function handleSubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}) {
        clearMessages();

		event.preventDefault();
		const data = new FormData(event.currentTarget);

		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: data
		});

		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			// rerun all `load` functions, following the successful update
            apiError = "";
            successMsg = "Tee time updated successfully";
			await invalidateAll();
		}

        if (result.type === "error" || result.type === "failure"){
            apiError = "An error occurred while saving tee time."
        }

		applyAction(result);
	}

    async function setTeeEdit(id: string) {
        edit = true;
        currentTee = tees[id];
    }

    function clearMessages(){
        apiError = "";
        successMsg = "";
    }

    async function closeForm(){
        clearMessages();
        edit = false;
    }

</script>

<h1>Tee Times</h1>

<table>
    <thead>
        <tr>
            <th>Time</th>
            <th>Price</th>
            <th>Min Players</th>
            <th>Max Players</th>
            <th>Holes</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        {#each Object.keys(tees) as tee}
            <tr>
                <td>{tees[tee].time}</td>
                <td>${tees[tee].price}</td>
                <td>{tees[tee].min_players}</td>
                <td>{tees[tee].max_players}</td>
                <td>{tees[tee].holes}</td>
                <td><button onclick={async () => await setTeeEdit(tees[tee].id)}>Edit</button> | <button onclick={async ()=> await deleteTee(tees[tee].id)}>Delete</button></td>
            </tr>
        {/each}
    </tbody>
</table>

<!-- <br>
<button>Create Tee Time</button> -->


{#if edit && currentTee}
<div>
    <h2 style="margin-top: 60px;">Change Tee Time ({currentTee.time})</h2>
    <form style="margin-bottom: 100px;" action="?/update" onsubmit={handleSubmit}>
        <input type="hidden" id="id" name="id" value={currentTee.id.toISOString()}>

        <label for="price">Price ($):</label>
        <input type="number" id="price" name="price" value={currentTee.price} step="0.01" required>
        <br><br>

        <label for="min_players">Min Players:</label>
        <input type="number" id="min_players" name="min_players" value={currentTee.min_players} min="1" required>
        <br><br>

        <label for="max_players">Max Players:</label>
        <input type="number" id="max_players" name="max_players" value={currentTee.max_players} min="1" required>
        <br><br>

        <label for="holes">Holes:</label>
        <input type="number" id="holes" name="holes" value={currentTee.holes} min="1" required>
        <br><br>

        <span style="color: red;">{apiError}</span>
        <br><br>

        <span style="color: teal;">{successMsg}</span>
        <br><br>

        <button type="submit">Submit</button>
        <button onclick={closeForm}>Close Form</button>
    </form>
</div>
{/if}
