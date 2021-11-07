import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import * as request from 'utils/request';

export type Collection = {
  name: string;
  slug: string;
  count: number;
};

export type NFT = {
  id: number;
  image: string;
};

const CollectionsContext = createContext<{
  collections: Collection[];
  collection: string | null;
  setCollection: (s: string) => void;
  searchTerm: string | null;
  setSearchTerm: (s: string | null) => void;
  nfts: NFT[];
  setPage: (s: number) => void;
  pages: number;
  page: number;
} | null>(null);

export const CollectionsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collection, setCollection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [pages, setPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const load = async () => {
      const collections = await request.api('/collections');
      setCollections(collections);
      setCollection(collections[0].slug);
    };
    load();
  }, []);

  useEffect(() => {
    if (!(collection && page)) return;

    const load = async () => {
      const { nfts, pages } = await request.api(
        `/collections/${collection}/${page}`
      );
      setNFTs(nfts);
      setPages(pages);
    };
    load();
  }, [collection, page]);

  return (
    <CollectionsContext.Provider
      value={{
        collection,
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
