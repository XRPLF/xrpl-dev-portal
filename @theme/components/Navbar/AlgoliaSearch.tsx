import { DocSearch } from '@docsearch/react';

export function AlgoliaSearch() {
    return (
            <DocSearch
                appId="R39QY3MZC7"
                indexName="xrpl"
                apiKey="3431349deec23b0bc3dcd3424beb9a6e"
                searchParameters={{
                    facetFilters: ['lang:en'],
                }}
            />
    )
}
