import {
  FC,
  useContext,
  createContext,
  ReactNode,
  useState,
  useCallback,
} from 'react';
import NProgress from 'nprogress';

const UIContext = createContext<{
  startProgress: () => void;
  endProgress: () => void;
  inProgress: boolean;
} | null>(null);

export const UIProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [inProgress, setInProgress] = useState<boolean>(false);

  const startProgress = useCallback(() => {
    setInProgress(true);
    NProgress.start();
    NProgress.set(0.4);
  }, [setInProgress]);

  const endProgress = useCallback(() => {
    setInProgress(false);
    NProgress.done();
  }, [setInProgress]);

  return (
    <UIContext.Provider value={{ startProgress, endProgress, inProgress }}>
      {children}
    </UIContext.Provider>
  );
};

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('Missing UI context');
  }
  const { startProgress, endProgress, inProgress } = context;
  return { startProgress, endProgress, inProgress };
}
