#/bin/bash

context='{
  "sources": [],
  "lenient": true
}'

query='PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX snvoc: <http://localhost:3100/ldbc_socialnet/1.0/vocabulary/>
SELECT ?messageId ?messageCreationDate ?messageContent WHERE {
  ?message snvoc:hasCreator <http://localhost:3000/pods/00000000000000001129/profile/card#me>;
    rdf:type snvoc:Post;
    snvoc:content ?messageContent;
    snvoc:creationDate ?messageCreationDate;
    snvoc:id ?messageId.
}'

node engines/query-sparql-link-traversal-solid/bin/query.js --query "$query" --context "$context" --idp void --voidLinkFilters
