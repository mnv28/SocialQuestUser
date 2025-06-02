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

interface ContentAreaProps {
  selectedContent: { title: string; url: string } | null;
}

const ContentArea = ({ selectedContent }: ContentAreaProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);
  const { toast } = useToast();
  const tableauContainerRef = useRef<HTMLDivElement>(null);
  const vizRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const loadContent = async () => {
      if (!selectedContent) return;

      setIsLoading(true);
      setHasError(false);

      try {
        if (selectedContent.url.includes("tableau.com")) {
          // Clean up previous viz if it existsvizRef
          if (vizRef.current) {
            vizRef.current.dispose();
            vizRef.current = null;
          }

          if (tableauContainerRef.current && mounted) {
            const options = {
              hideTabs: true,
              hideToolbar: true,
              width: "100%",
              height: "100%",
              onFirstInteractive: () => {
                if (mounted) setIsLoading(false);
              },
            };

            vizRef.current = new (window as any).tableau.Viz(
              tableauContainerRef.current,
              selectedContent.url,
              options
            );
          }
        } else {
          // For non-Tableau content, wait for iframe to load
          const timer = setTimeout(() => {
            if (mounted) setIsLoading(false);
          }, 2000);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Error loading content:", error);
        if (mounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      mounted = false;
      if (vizRef.current) {
        vizRef.current.dispose();
        vizRef.current = null;
      }
    };
  }, [selectedContent?.url]);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
    setIsLoading(true);
    setHasError(false);

    if (selectedContent?.url.includes("tableau.com")) {
      try {
        if (vizRef.current) {
          vizRef.current
            .refreshDataAsync()
            .then(() => {
              setIsLoading(false);
            })
            .catch(() => {
              setHasError(true);
              setIsLoading(false);
            });
        }
      } catch (error) {
        console.error("Error refreshing Tableau viz:", error);
        setHasError(true);
        setIsLoading(false);
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }

    toast({
      title: "Content refreshed",
      description: "Dashboard data has been updated.",
    });
  };

  const handleOpenExternal = () => {
    if (selectedContent?.url) {
      window.open(selectedContent.url, "_blank");
    }
  };

  const handleIframeError = () => {
    setHasError(true);
    setIsLoading(false);
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
                Choose a menu item from the sidebar to view analytics and
                reports
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="flex flex-col space-y-4 h-full">
        <div className="flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-20 py-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {selectedContent.title}
            </h2>
            <p className="text-sm text-slate-500">
              Interactive dashboard and analytics
            </p>
          </div>
          {/* <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleOpenExternal}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </Button>
          </div> */}
        </div>

        <Card className="flex-1 overflow-hidden">
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
                      This dashboard cannot be displayed in an embedded frame
                      due to security restrictions. This is common with Tableau
                      Public and other external platforms.
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
            ) : selectedContent.url.includes("tableau.com") ? (
              <div
                ref={tableauContainerRef}
                className="w-full h-full"
                style={{
                  minHeight: "800px",
                  width: "100%",
                  overflow: "auto",
                }}
              />
            ) : (
              <div className="h-full w-full overflow-x-auto">
                <div className="min-w-full h-full">
                  <iframe
                    key={key}
                    src={selectedContent.url}
                    className="w-full h-full border-0 rounded-lg"
                    title={selectedContent.title}
                    allow="fullscreen"
                    loading="lazy"
                    onLoad={() => setIsLoading(false)}
                    onError={handleIframeError}
                    style={{
                      minHeight: "800px",
                      width: "100%",
                      height: "100%",
                      overflow: "auto",
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ContentArea;
