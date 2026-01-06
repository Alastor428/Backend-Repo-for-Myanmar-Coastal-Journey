export const NewLoggerInstance = () => {
  const debug = require('debug');
  return debug('mongo-seeding');
};

/**
 * Logs app events to stderr.
 */
export type LogFn = (input: string) => void;