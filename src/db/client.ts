import postgres from "postgres";

const DB_USER: string = "postgres";
const DB_PASSWORD: string = "test";
const DB_HOST: string = "127.0.0.1";
const DB_PORT: number = 5432;
const DB_NAME: string = "postgres";

const sql = postgres({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
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
