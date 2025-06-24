import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, ExternalLink, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    tableau: any;
  }
}

interface ContentAreaProps {
  selectedContent: { title: string; url: string } | null;
}

const ContentArea = ({ selectedContent }: ContentAreaProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);
  const { toast } = useToast();
  const vizContainerRef = useRef<HTMLDivElement>(null);
  const vizRef = useRef<any>(null);

  const getTableauEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);

      // Handle /views/ format
      const viewsIndex = pathParts.indexOf('views');
      if (viewsIndex !== -1 && viewsIndex < pathParts.length - 2) {
        const workbookName = pathParts[viewsIndex + 1];
        const viewName = pathParts[viewsIndex + 2];
        return `https://public.tableau.com/views/${workbookName}/${viewName}`;
      }

      // Handle /app/profile/ format
      const profileIndex = pathParts.indexOf('profile');
      if (profileIndex !== -1 && profileIndex < pathParts.length - 2) {
        const workbookName = pathParts[pathParts.length - 2];
        const viewName = pathParts[pathParts.length - 1];
        return `https://public.tableau.com/views/${workbookName}/${viewName}`;
      }

      throw new Error("Invalid Tableau URL format");
    } catch (error) {
      console.error("Error parsing Tableau URL:", error);
      return url;
    }
  };

  useEffect(() => {
    if (!selectedContent) return;
    setIsLoading(true);
    setHasError(false);

    if (selectedContent.url.includes("tableau.com")) {
      // Clean up previous viz if it exists
      if (vizRef.current) {
        vizRef.current.dispose();
      }

      // Initialize new viz
      const initViz = async () => {
        try {
          if (!vizContainerRef.current) return;

          // Wait for Tableau API to be available
          if (!window.tableau) {
            await new Promise((resolve) => {
              const checkTableau = () => {
                if (window.tableau) {
                  resolve(true);
                } else {
                  setTimeout(checkTableau, 100);
                }
              };
              checkTableau();
            });
          }

          const options = {
            hideTabs: true,
            hideToolbar: false,
            width: "100%",
            height: "100%",
            onFirstInteractive: () => {
              setIsLoading(false);
            },
            onFirstVizSizeKnown: () => {
              setIsLoading(false);
            },
            onError: (error: any) => {
              console.error("Tableau error:", error);
              setHasError(true);
              setIsLoading(false);
            }
          };

          const embedUrl = getTableauEmbedUrl(selectedContent.url);

          vizRef.current = new window.tableau.Viz(
            vizContainerRef.current,
            embedUrl,
            options
          );
        } catch (error) {
          console.error("Error initializing Tableau viz:", error);
          setHasError(true);
          setIsLoading(false);
        }
      };

      initViz();
    }

    return () => {
      if (vizRef.current) {
        vizRef.current.dispose();
      }
    };
  }, [selectedContent?.url]);

  const handleOpenExternal = () => {
    if (selectedContent?.url) {
      window.open(selectedContent.url, "_blank");
    }
  };

  if (!selectedContent) {
    return (
      <main className="flex-1 p-6 overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <Card className="w-full max-w-md bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-slate-800">
                Select a Dashboard
              </CardTitle>
              <CardDescription className="text-slate-600">
                Please select an item from the side menu to view the dashboard and associated analytics
                {/* Choose a menu item from the sidebar to view analytics and reports */}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-0 h-screen overflow-hidden">
      <div className="flex flex-col h-full">
        <Card className="flex-1 overflow-hidden border-0 shadow-orange-400">
          <CardContent className="p-0 h-full relative">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center animate-pulse">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-slate-700">
                      Loading Dashboard
                    </p>
                    <p className="text-sm text-slate-500">
                      Please wait while we load your content...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {hasError ? (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
                <div className="text-center space-y-6 max-w-md px-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-slate-800">
                      Content Blocked
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      This dashboard cannot be displayed due to security restrictions.
                      Please try opening it in a new tab.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button
                      onClick={handleOpenExternal}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </Button>
                    <p className="text-xs text-slate-500">
                      Click above to view the dashboard in a new browser tab
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full w-full">
                {selectedContent.url.includes("tableau.com") ? (
                  <div ref={vizContainerRef} className="w-full h-full" />
                ) : (
                  <iframe
                    key={key}
                    src={selectedContent.url}
                    className="w-full h-full border-0"
                    title={selectedContent.title}
                    allowFullScreen
                    loading="lazy"
                    onLoad={() => setIsLoading(false)}
                    onError={() => setHasError(true)}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ContentArea;
