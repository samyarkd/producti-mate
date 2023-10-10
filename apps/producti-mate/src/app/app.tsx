import { WelcomeStories } from "@/components/stories";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { isNewUserAtom } from "@/lib/atoms";
import { Outlet } from "@tanstack/react-router";
import { useThemeParams, useWebApp } from "@twa.js/sdk-react";
import { useAtomValue } from "jotai";
import { useEffect } from "react";

export function App() {
  const webApp = useWebApp();
  const themeParams = useThemeParams();
  const isNewUser = useAtomValue(isNewUserAtom);

  useEffect(() => {
    webApp.ready();
  }, [webApp]);

  return (
    <ThemeProvider
      defaultTheme={themeParams.isDark ? "dark" : "light"}
      storageKey="vite-ui-theme"
    >
      {isNewUser ? (
        <WelcomeStories />
      ) : (
        <main
          style={{
            backgroundColor: themeParams?.backgroundColor || "white",
            color: themeParams?.textColor || "black",
          }}
          className={"min-h-screen"}
        >
          <Outlet />
        </main>
      )}
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
