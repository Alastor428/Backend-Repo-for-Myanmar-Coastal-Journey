import { MongoClient, MongoClientOptions } from 'mongodb';
import { Database } from '.';
import { LogFn } from '../common';

/**
 * manage connection to a MongoDB database
 * 
 * class DatabaseConnector
 * func constructor
 * func connect
 * func maskUriCredentials
 */
export class DatabaseConnector {
    /**
   * Masked URI credentials token.
   */
  static MASKED_URI_CREDENTIALS = '[secure]';

  static DEFAULT_CLIENT_OPTIONS: MongoClientOptions = {
    ignoreUndefined: true,
    connectTimeoutMS: 10000,
  };

  clientOptions: MongoClientOptions;

  log: LogFn;

  constructor(
    reconnectTimeoutMillis?: number,
    mongoClientOptions?: MongoClientOptions,
    log?: LogFn,
  ) {
    this.clientOptions = 
        mongoClientOptions != null 
        ? mongoClientOptions 
        : {
            ...DatabaseConnector.DEFAULT_CLIENT_OPTIONS,
            connectTimeoutMS: reconnectTimeoutMillis,
        };
        this.log = log 
        ? log
        : () => {
            // do nothing
        };
  }

  /**
   * Connects to database.
   * @param connectionString Database connection string
   */

  async connect(connectionString: string): Promise<Database> {
    const mongoClient = new MongoClient(connectionString, this.clientOptions);

    this.log(`Connecting to ${this.maskUriCredentials(connectionString)}...`);

    // test
    console.log(`Connecting to ${this.maskUriCredentials(connectionString)}...`)

    await mongoClient.connect();

    this.log(`Connection with database established.`);

    return new Database(mongoClient);

  }

  /**
   * Detects database connection credentials and masks them, replacing with masked URI credentials token.
   * 
   * @param uri Database connection URI
   */
  private maskUriCredentials(uri: string): string {
    if (!uri.includes('@')) {
        return uri;
    }

    const creds = uri.substring(uri.indexOf('://') + 3, uri.indexOf('@'));
    return uri.replace(creds, DatabaseConnector.MASKED_URI_CREDENTIALS);
  }


}