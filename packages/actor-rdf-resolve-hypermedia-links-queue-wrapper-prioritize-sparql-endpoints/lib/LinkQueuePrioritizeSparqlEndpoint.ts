import type { ILinkQueue, ILink } from '@comunica/bus-rdf-resolve-hypermedia-links-queue';
import { LinkQueueWrapper } from '@comunica/bus-rdf-resolve-hypermedia-links-queue';

/**
 * A link queue that prioritizes Sparql endpoint URIs
 */
export class LinkQueuePrioritizeSparqlEndpoint extends LinkQueueWrapper {
  private limit: number;

  public constructor(linkQueue: ILinkQueue, sparqlEndpointUri: string) {
    super(linkQueue);
  }

  public override push(link: ILink, parent: ILink): boolean {
    console.log(link);
    // Todo implement priority setting
    return super.push(link, parent);
  }
}
