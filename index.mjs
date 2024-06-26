import { LoggerPretty } from '@comunica/logger-pretty';
import { QueryEngineFactory } from '@comunica/query-sparql-link-traversal-solid';

const query = `
PREFIX snvoc: <https://solidbench.linkeddatafragments.org/www.ldbc.eu/ldbc_socialnet/1.0/vocabulary/>
SELECT DISTINCT ?locationIp WHERE {
  ?message snvoc:hasCreator <http://localhost:3000/pods/00000006597069767117/profile/card#me>;
    snvoc:locationIP ?locationIp.
}
`;
/**
PREFIX snvoc: <https://solidbench.linkeddatafragments.org/www.ldbc.eu/ldbc_socialnet/1.0/vocabulary/>
SELECT DISTINCT ?locationIp WHERE {
  ?message snvoc:hasCreator <http://localhost:3000/pods/00000006597069767117/profile/card#me>;
    snvoc:locationIP ?locationIp.
}

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX snvoc: <http://localhost:3000/www.ldbc.eu/ldbc_socialnet/1.0/vocabulary/>
SELECT * WHERE {
  <http://localhost:3000/pods/00000004398046512167/profile/card#me> snvoc:firstName ?name;
                                                                    snvoc:lastName ?lastName.
}
 */

const configPathRegular = './engines/config-query-sparql-link-traversal/config/config-solid-default.json';

const configPath = './engines/config-query-sparql-link-traversal/config/config-solid-hybrid-endpoint.json';

const engine = await new QueryEngineFactory().create({ configPathRegular });

const setResult = new Set();
const bindingsStream = await engine.queryBindings(query, {
    lenient: true,
    //log: new LoggerPretty({ level: 'trace' }),
});

bindingsStream.on("data", (binding) => {
    if (setResult.has(binding.toString())) {
        console.log("duplicate");
    }
    setResult.add(binding.toString());
    console.log(binding.toString());
})