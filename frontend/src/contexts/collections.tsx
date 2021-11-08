import { clone } from 'lodash';
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
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
};

const CollectionsContext = createContext<{
  collections: Collection[];
  setCollection: (s: string) => void;
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
  filters: Record<string, string[]>;
} | null>(null);

export const CollectionsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollectionSlug, setCollection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [pages, setPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const activeCollection = useMemo(
    () => collections.find((c) => c.slug === activeCollectionSlug) ?? null,
    [collections, activeCollectionSlug]
  );

  const addFilter = (trait: string, value: string) => {
    setFilters((f) => {
      const filters = clone(f);
      let values = filters[trait] ?? [];
      const idx = values.indexOf(value);
      if (!~idx) {
        values.push(value);
      }
      filters[trait] = values;
      return filters;
    });
  };

  const removeFilter = (trait: string, value: string) => {
    setFilters((f) => {
      const filters = clone(f);
      let values = filters[trait] ?? [];
      const idx = values.indexOf(value);
      if (~idx) {
        values.splice(idx, 1);
      }
      filters[trait] = values;
      return filters;
    });
  };

  useEffect(() => {
    const load = async () => {
      const collections = await request.api('/collections');
      setCollections(collections);
      setCollection(collections[0].slug);
    };
    load();
  }, []);

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
