import { asFunction, asValue, Resolver } from 'awilix';
import { PrismaClient } from '@prisma/client';
import * as Interfaces from '@application/common/interfaces';
import * as repositories from './repositories';
import { makeLogger } from './logger';

export type Dependencies = {
  db: PrismaClient;
  logger: Interfaces.ILogger;
  postsRepository: Interfaces.IPostsRepository;
};

export function makeInfrastructure(): { [dependency in keyof Dependencies]: Resolver<Dependencies[dependency]> } {
  const logger = makeLogger();
  const db = new PrismaClient();

  db.$connect().catch(() => {
    logger.error({ detail: 'Failed to establish a connection to the database!' });
    process.exit(1);
  });

  return {
    db: asValue(db),
    logger: asValue(logger),
    postsRepository: asFunction(repositories.makePostsRepository).singleton(),
  };
}
