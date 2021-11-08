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
  id: number;
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

  const activeCollection = useMemo(
    () => collections.find((c) => c.slug === activeCollectionSlug) ?? null,
    [collections, activeCollectionSlug]
  );

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
        `/collections/${activeCollectionSlug}/${page}`
      );
      setNFTs(nfts);
      setPages(pages);
    };
    load();
  }, [activeCollectionSlug, page]);

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
