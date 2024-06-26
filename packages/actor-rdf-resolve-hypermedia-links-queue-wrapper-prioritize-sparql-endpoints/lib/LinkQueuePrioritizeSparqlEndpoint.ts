import type { ILinkQueue, ILink } from '@comunica/bus-rdf-resolve-hypermedia-links-queue';
import { LinkQueueWrapper } from '@comunica/bus-rdf-resolve-hypermedia-links-queue';

/**
 * A link queue that prioritizes Sparql endpoint URIs
 */
export class LinkQueuePrioritizeSparqlEndpoint extends LinkQueueWrapper {
  private sparqlEndpointPredicate: string;

  public constructor(linkQueue: ILinkQueue, sparqlEndpointPredicate: string) {
    super(linkQueue);
    this.sparqlEndpointPredicate = sparqlEndpointPredicate;
  }
  
  public override push(link: ILink, parent: ILink): boolean {
    if (link.metadata && link.metadata!['producedByActor']){
       if (link.metadata!['producedByActor']['matchingPredicate'] === this.sparqlEndpointPredicate){
            link.metadata['priority'] = 1;
       }
    }
    return super.push(link, parent);
  }
}
