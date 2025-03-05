import postgres from "postgres";


const sql = postgres({
    user: 'postgres',
    password: 'test',
    host: '127.0.0.1',
    port: 5432,
    database: 'postgres',
});


export async function getAllTeeTimes() {
    // const client = await getClient();

    try {
        return await sql`SELECT * FROM tee_times;`
    } catch (err) {
        console.error(err);
    } finally {
        // await client.end()
    }

    return []
}

export async function deleteTeeTime(id: number) {

    try {
        const result = await sql`DELETE FROM tee_times WHERE id = ${id} RETURNING *`

        if (result.count > 0){
            console.log("Tee Time deleted successfully");
        }
    } catch (err) {
        console.error(err);
    } finally {
    }
}

export async function updateTeeTime(id: number, data: any) {
    try {
        const result = await sql`
        UPDATE tee_times
        SET price = ${data.price}, 
            min_players = ${data.min_players}, 
            max_players = ${data.max_players},
            time = ${data.time}
            holes = ${data.holes}
        WHERE id = ${id}
        RETURNING *;
        `;

        if (result.count > 0){
            console.log("Tee Time deleted successfully");
        }
    } catch (err) {
        console.error(err);
    } finally {
    }
}
 
