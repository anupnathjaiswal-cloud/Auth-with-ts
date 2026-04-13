import { createServer } from "node:http";
import { createApplication } from "./app/index.js";

async function main() {
    try {
        const server = createServer(createApplication());
        // const PORT: number = process.env.PORT || 8080;
        const PORT: number = 8080;
        server.listen(PORT, () => {
            console.log(`http server running on PORT ${PORT}.`);
        });
    } catch (error) {
        console.error(`Error in starting http server ${error}`);
        throw error;
    }
}

main();
