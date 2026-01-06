import * as extend from 'extend';
import { SeederCollection, DeepPartial } from './common';
import { BulkWriteOptions, MongoClientOptions } from 'mongodb';
import { EJSONOptions } from 'bson';
import { ConnectionString } from 'connection-string';
import { parseSeederDatabaseConfig } from './database';

/**
 * Defines configuration for database seeding.
 */
export interface SeederConfig {
    
    database?: parseSeederDatabaseConfig; //Database connection URI or configuration object.

    databaseReconnectTimeout: number; // max time of waiting for successful MongoDB connection

    dropDatabase: boolean; // drops entire database before import

    dropCollections: boolean; // drops collection before importing it

    removeAllDocuments: boolean; //delete all documents from every collection

    mongoClientOptions?: MongoClientOptions;

    bulkWriteOptions?: BulkWriteOptions;

}

export type SeederConfigWithoutDatabase = Omit<SeederConfig, 'database'>;

/**
 * Stores default configuration for database seeding.
 */
export const defaultSeederConfig : SeederConfigWithoutDatabase = {
    databaseReconnectTimeout: 1000,
    dropDatabase: false,
    dropCollections: false,
    removeAllDocuments: false,
}

export type SeederDatabaseConfig = string | SeederDatabaseConfigObject;


export interface SeederDatabaseConfigObject {
    protocol: string; //database connection protocol
    host: string; //database connection host
    port: number; //database connection port
    name: string; //database name
    username?: string; //database username(optional)
    password?: string; //database password(optional)
    options?: SeederDatabaseConfigObjectOptions;
}

/**
 * Defines options for MongoDB Database Connection URI.
 */
export interface SeederDatabaseConfigObjectOptions {
    [key: string]: unknown;
}

/**
 * Merges configuration for seeding and deletes database property.
 *
 * @param partial Partial config object.
 * @param previous Previous config object. 
 */
export const mergeSeederConfigAndDeleteDb = (
    partial?: DeepPartial<SeederConfig>,
    previous?: SeederConfig,
): SeederConfigWithoutDatabase => {
    const source = previous ? previous : defaultSeederConfig;
    if ('database' in source) {
        delete source.database;
    }

    if (!partial) {
        return source;
    }

    const config = {};
    delete partial.database;
    return extend(true, config, source, partial);
}

export const mergeConnection = (
    partial?: DeepPartial<SeederDatabaseConfig>,
    previous?: ConnectionString,
): ConnectionString => {
    const source = previous ?? parseSeederDatabaseConfig(undefined);
    if (source.hosts && source.hosts.length > 1) {
        source.hosts = [source.hosts[0]]
    }

    if (!partial) {
        return source;
    }

    if (typeof partial === 'string') {
        return parseSeederDatabaseConfig(partial);
    }

    const partialConn = parseSeederDatabaseConfig(partial, true);

    if (
        partialConn.hosts &&
        partialConn.hosts.length > 0 &&
        source.hosts &&
        source.hosts.length > 0
    ) {
        const newHost = partialConn.hosts[0];
        if(!newHost.name) {
            newHost.name = source.hosts[0].name;
        }

        if(!newHost.name) {
            newHost.port = source.hosts[0].port;
        }

        const config = new ConnectionString();
        return extend(true, config, source, partialConn);
    };

export interface SeederCollectionReadingOptions {
        extensions: string[]; 
        ejsonParseOptions?: EJSONOptions; //options for parsing EJSON files with `.json` extension
        transformers: ((collection: SeederCollection) => SeederCollection)[]; // to modify collection data before import
    }
}

export const defaultCollectionReadingOptions: SeederCollectionReadingOptions = {
    extensions: ['json', 'js', 'cjs'],
    ejsonParseOptions: {
        relaxed: true,
    },
    transformers: [],
}

export const mergeCollectionReadingOptions = (
  partial?: DeepPartial<SeederCollectionReadingOptions>,
  previous?: SeederCollectionReadingOptions,
): SeederCollectionReadingOptions => {
  const source = previous ? previous : defaultCollectionReadingOptions;

  if (!partial) {
    return source;
  }

  const config = {};
  return extend(true, config, source, partial);
};