import {
  groupSearchHits,
  searchCatalog,
  type SearchResultGroup,
} from "@/lib/search";
import { ProductListingGrid } from "@/components/catalog/ProductListingGrid";

interface SearchResultsPanelProps {
  query: string;
  familyId?: string;
}

function formatSearchSummary(groups: SearchResultGroup[], rawCount: number): string {
  const articleCount = groups.length;
  if (articleCount === rawCount) {
    return `${articleCount} résultat${articleCount > 1 ? "s" : ""}`;
  }
  return `${articleCount} article${articleCount > 1 ? "s" : ""} (${rawCount} déclinaisons)`;
}

export function SearchResultsPanel({ query, familyId }: SearchResultsPanelProps) {
  const hits = searchCatalog(query, { familyId });
  const scope = familyId ? "dans cette famille" : "dans tout le catalogue";

  if (hits.length === 0) {
    return (
      <div className="rounded-card border border-sand-300 bg-white px-6 py-10 text-center shadow-card">
        <p className="font-medium text-forest-dark">Aucun résultat pour « {query} »</p>
        <p className="mt-2 text-sm text-bark-muted">
          Essayez un autre terme (référence, type de produit, dimension), effacez la recherche
          pour revenir aux familles, ou parcourez le catalogue ci-dessous.
        </p>
      </div>
    );
  }

  const groups = groupSearchHits(hits);

  return (
    <section aria-labelledby="search-results-title">
      <h2 id="search-results-title" className="text-lg font-semibold text-forest-dark">
        {formatSearchSummary(groups, hits.length)} {scope}
      </h2>
      <div className="mt-5">
        <ProductListingGrid groups={groups} showFamilyContext={!familyId} />
      </div>
    </section>
  );
}
