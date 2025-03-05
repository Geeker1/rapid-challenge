import postgres from "postgres";


const sql = postgres({
    user: 'postgres',
    password: 'test',
    host: '127.0.0.1',
    port: 5432,
    database: 'postgres',
});


export async function getAllTeeTimes() {
    try {
        return await sql`SELECT * FROM tee_times;`
    } catch (err) {
        throw err;
    }
}

export async function deleteTeeTime(id: string) {
    try {
        await sql`DELETE FROM tee_times WHERE id = ${id} RETURNING *`;
    } catch (err) {
        throw err;
    }
}

export async function updateTeeTime(id: string, data: any) {
    console.log("DATA", data)
    try {
        const result = await sql`
        UPDATE tee_times
        SET price = ${data.price}, 
            min_players = ${data.min_players}, 
            max_players = ${data.max_players},
            holes = ${data.holes}
        WHERE id = ${id}
        RETURNING *;
        `;

        return result
    } catch (err) {
        throw err;
    }
}

function templateBuilder(data: any[]): string {
    return data.map(d => 
        `('${d.id}', '${d.time}', ${d.min_players}, ${d.max_players}, ${d.holes}, ${d.price})`
    ).join(',\n');
}

export async function bulkInsertTeeTime(tees: any) {
    const values = tees.map(({ id, time, min_players, max_players, holes, price }: any) => 
        [id, time, min_players, max_players, holes, price]
    );

    try {
        const result = await sql`
            INSERT INTO tee_times (id, time, min_players, max_players, holes, price)
            VALUES ${sql(values)}
            ON CONFLICT (id) 
            DO UPDATE SET 
                time = EXCLUDED.time,
                min_players = EXCLUDED.min_players,
                max_players = EXCLUDED.max_players,
                holes = EXCLUDED.holes,
                price = EXCLUDED.price;
        `;
        return result
    } catch (error) {
        throw error;
    }
}
