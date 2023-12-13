import { CosmosClient } from "@azure/cosmos";

const cosmosClient = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
});

async function getDBContainer(databaseId, containerId) {
    const database = (
        await cosmosClient.databases.createIfNotExists({
            id: process.env.COSMOS_ENV || databaseId,
        })
    ).database;

    const container = (
        await database.containers.createIfNotExists({
            id: containerId,
        })
    ).container;

    return container;
}

export default getDBContainer