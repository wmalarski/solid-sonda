import { ErrorBoundary, Suspense, type Component } from "solid-js";
import { I18nContextProvider } from "./integrations/i18n";
import { BoardRoute } from "./modules/board/board-route";
import { ErrorFallback } from "./modules/fallbacks/error-fallback";

export const App: Component = () => (
  <I18nContextProvider>
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense>
        <BoardRoute />
      </Suspense>
    </ErrorBoundary>
  </I18nContextProvider>
);
