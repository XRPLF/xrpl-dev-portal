import { DocSearch } from '@docsearch/react';
import { useThemeHooks } from '@redocly/theme/core/hooks';

export function AlgoliaSearch() {
    const { useL10n } = useThemeHooks()
    let { lang } = useL10n()
    if (lang == "en-US") {
        lang = "en"
    }
    return (
            <DocSearch
                appId="R39QY3MZC7"
                indexName="xrpl"
                apiKey="3431349deec23b0bc3dcd3424beb9a6e"
                searchParameters={{
                    facetFilters: ['lang:'+lang],
                }}
            />
    )
}
