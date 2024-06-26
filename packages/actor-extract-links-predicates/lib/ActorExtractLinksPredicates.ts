import type { IActionExtractLinks, IActorExtractLinksOutput } from '@comunica/bus-extract-links';
import { ActorExtractLinks } from '@comunica/bus-extract-links';
import { ILink } from '@comunica/bus-rdf-resolve-hypermedia-links';
import { KeysFilter } from '@comunica/context-entries-link-traversal';
import type { IActorArgs, IActorTest } from '@comunica/core';
import { EVERY_REACHABILITY_CRITERIA, FilterFunction, IActorExtractDescription } from '@comunica/types-link-traversal';

/**
 * A comunica Traverse Predicates RDF Metadata Extract Actor.
 */
export class ActorExtractLinksPredicates extends ActorExtractLinks {
  private readonly checkSubject: boolean;
  private readonly predicates: RegExp[];
  private readonly stringPredicates: string[];
  private filters: Map<string, FilterFunction> = new Map();
  private linkDeactivationMap: Map<string, IActorExtractDescription> = new Map();

  public constructor(args: IActorExtractLinksTraversePredicatesArgs) {
    super(args);

    this.stringPredicates = args.predicateRegexes;
    this.predicates = args.predicateRegexes.map(stringRegex => new RegExp(stringRegex, 'u'));
  }

  public async run(action: IActionExtractLinks): Promise<IActorExtractLinksOutput> {
    let filters: undefined | Map<string, FilterFunction> = action.context.get(KeysFilter.filters);
    // We add filters to the context, if it doesn't exist or the query has changed
    // We also reset the cashing of shape index handled
    if (filters === undefined) {
      filters = new Map();
      action.context = action.context.set(KeysFilter.filters, filters);
    }
    this.filters = filters;

    return {
      links: await ActorExtractLinks.collectStream(action.metadata, (quad, links) => {
        if (!this.checkSubject || this.subjectMatches(quad.subject.value, action.url)) {
          for (const regex of this.predicates) {
            if (regex.test(quad.predicate.value)) {
              //this.generateFilter(quad.predicate.value, quad.subject.value);
                links.push({
                  url: quad.object.value,
                  metadata: {
                    producedByActor: {
                      name: this.name,
                      predicates: this.stringPredicates,
                      matchingPredicate: quad.predicate.value,
                      checkSubject: this.checkSubject,
                    },
                  },
                });
              break;
            }
          }
        }
      }),
    };
  }

  private subjectMatches(subject: string, url: string): boolean {
    const fragmentPos = subject.indexOf('#');
    if (fragmentPos >= 0) {
      subject = subject.slice(0, fragmentPos);
    }
    return subject === url;
  }

  private generateFilter(matchingPredicate: string, pod:string): boolean {
    const sparlEndpointInSolidPredicate = "http://rdfs.org/ns/void#sparqlEndpoint";
    if (matchingPredicate === sparlEndpointInSolidPredicate) {
      this.filters.set(`${performance.now}_ignore_pod${pod}`, (link: ILink): boolean => {        
        return link.url.includes(pod);
      });

      this.linkDeactivationMap.set(EVERY_REACHABILITY_CRITERIA, {
        actorParam: new Map(),
        urlPatterns: new Set([ new RegExp(`${pod}.*`)]),
        urls: new Set(),
      });

      return true;
    }
    return false;
  }
}

export interface IActorExtractLinksTraversePredicatesArgs
  extends IActorArgs<IActionExtractLinks, IActorTest, IActorExtractLinksOutput> {
  /**
   * If only quads will be considered that have a subject equal to the request URL.
   */
  checkSubject: boolean;
  /**
   * A list of regular expressions that will be tested against predicates of quads.
   */
  predicateRegexes: string[];
}
