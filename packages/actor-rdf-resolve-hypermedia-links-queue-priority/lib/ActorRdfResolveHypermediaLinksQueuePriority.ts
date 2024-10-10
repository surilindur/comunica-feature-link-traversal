import type {
  IActionRdfResolveHypermediaLinksQueue,
  IActorRdfResolveHypermediaLinksQueueArgs,
  IActorRdfResolveHypermediaLinksQueueOutput,
} from '@comunica/bus-rdf-resolve-hypermedia-links-queue';
import { ActorRdfResolveHypermediaLinksQueue } from '@comunica/bus-rdf-resolve-hypermedia-links-queue';
import type { IActorTest, TestResult } from '@comunica/core';
import { passTestVoid } from '@comunica/core';
import { LinkQueuePriority } from './LinkQueuePriority';

/**
 * A comunica Priority RDF Resolve Hypermedia Links Queue Actor.
 */
export class ActorRdfResolveHypermediaLinksQueuePriority extends ActorRdfResolveHypermediaLinksQueue {
  public constructor(args: IActorRdfResolveHypermediaLinksQueueArgs) {
    super(args);
  }

  public async test(_action: IActionRdfResolveHypermediaLinksQueue): Promise<TestResult<IActorTest>> {
    return passTestVoid();
  }

  public async run(_action: IActionRdfResolveHypermediaLinksQueue):
  Promise<IActorRdfResolveHypermediaLinksQueueOutput> {
    return { linkQueue: new LinkQueuePriority() };
  }
}
