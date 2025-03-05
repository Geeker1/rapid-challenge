<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
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
        {#each data.tees as tee}
            <tr>
                <td>{tee.time}</td>
                <td>${tee.price}</td>
                <td>{tee.min_players}</td>
                <td>{tee.max_players}</td>
                <td>{tee.holes}</td>
                <td><button>Edit</button> | <button>Delete</button></td>
            </tr>
        {/each}
    </tbody>
</table>

<div>
    <h2 style="margin-top: 60px;">Edit Tee Time</h2>
</div>
