import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useLocation, useHistory } from 'react-router';
import * as request from 'utils/request';

export type Collection = {
  name: string;
  slug: string;
  count: number;
  traits: Record<string, Record<string, number>>;
};

export type NFT = {
  index: number;
  image: string;
  attributes: Record<string, string>[];
  missingTraits: Record<string, string>[];
};

const CollectionsContext = createContext<{
  collections: Collection[];
  searchTerm: string | null;
  setSearchTerm: (s: string | null) => void;
  nfts: NFT[];
  setPage: (s: number) => void;
  pages: number;
  page: number;
  activeCollectionSlug: string | null;
  activeCollection: Collection | null;
  addFilter: (t: string, v: string) => void;
  removeFilter: (t: string, v: string) => void;
  filters: Record<string, string>;
  setCollection: (collection: string) => void;
} | null>(null);

export const CollectionsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [pages, setPages] = useState<number>(0);

  const history = useHistory();
  const location = useLocation();
  const query = useMemo(
    () => new URLSearchParams(location.search.replace(/\?/, '')),
    [location.search]
  );

  const activeCollectionSlug = location.pathname.replace('/', '');

  const activeCollection = useMemo(
    () => collections.find((c) => c.slug === activeCollectionSlug) ?? null,
    [collections, activeCollectionSlug]
  );

  const page = useMemo(() => {
    const p = query.get('page');
    if (!p) return 1;
    return parseInt(p) ?? 1;
  }, [query]);

  const filters = useMemo(() => {
    const filters: Record<string, string> = {};
    if (!activeCollection) return filters;

    Object.keys(activeCollection.traits).forEach((traitType) => {
      if (query.has(traitType)) {
        filters[traitType] = query.get(traitType)!;
      }
    });
    return filters;
  }, [query, activeCollection]);

  const setCollection = useCallback(
    (collection: string) => {
      history.push(`/${collection}?page=1`);
    },
    [history]
  );

  const setPage = useCallback(
    (page: number) => {
      history.push(`/${activeCollectionSlug}?page=${page}`);
    },
    [history, activeCollectionSlug]
  );

  const addFilter = (trait: string, value: string) => {
    const qs = new URLSearchParams(location.search.replace(/\?/, ''));
    qs.set(trait, value);
    history.push(`/${activeCollectionSlug}?${qs.toString()}`);
  };

  const removeFilter = (trait: string, value: string) => {
    const qs = new URLSearchParams(location.search.replace(/\?/, ''));
    if (~qs.has(trait)) {
      qs.delete(trait);
    }
    history.push(`/${activeCollectionSlug}?${qs.toString()}`);
  };

  useEffect(() => {
    const load = async () => {
      const collections = await request.api('/collections');
      setCollections(collections);
    };
    load();
  }, [setCollection]);

  useEffect(() => {
    if (collections.length && !activeCollectionSlug)
      setCollection(collections[0].slug);
  }, [collections, activeCollectionSlug, setCollection]);

  useEffect(() => {
    if (!(activeCollectionSlug && page)) return;
    const load = async () => {
      const { nfts, pages } = await request.api(
        `/collections/${activeCollectionSlug}`,
        {
          page,
          filters,
        }
      );
      setNFTs(nfts);
      setPages(pages);
    };
    load();
  }, [activeCollectionSlug, page, filters]);

  return (
    <CollectionsContext.Provider
      value={{
        activeCollectionSlug,
        activeCollection,
        setCollection,
        collections,
        searchTerm,
        setSearchTerm,
        nfts,
        setPage,
        pages,
        page,
        filters,
        addFilter,
        removeFilter,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};

export function useCollections() {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error('Missing Collection context');
  }
  return context;
}
