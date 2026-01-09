require('ts-node').register();
const path = require('path');
process.env.DEBUG = 'mongo-seeding'; //to see debug output
const { Seeder } = require('mongo-seeding');

const config = {
    database: 'mongodb+srv://juliawilson757_db_user:uJRqA4uKgYIPvgwc@cluster0.gxzbq9w.mongodb.net/?appName=Cluster0',
    databaseReconnectTimeout: 10000,
    dropDatabase: false,
    dropCollections: false,
    mongoClientOptions: undefined,
    bulkWriteOptions: undefined,
};

const seeder = new Seeder(config);

const collectionReadingOptions = {
        extensions: ['ts', 'js', 'json'],
        ejsonParseOptions: {
            relaxed: false,
        },
        transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
};
const collections = seeder.readCollectionsFromPath(
    path.resolve('./data'),
    collectionReadingOptions,
);

seeder
    .import(collections)
    .then(() => {
        console.log('Success');
    })
    .catch((err) => {
        console.log('Error', err);
    });
