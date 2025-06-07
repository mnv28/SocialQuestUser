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

  // Function to calculate and apply the optimal scale
  const updateScale = () => {
    if (!tableauContainerRef.current?.parentElement) return;
    
    const container = tableauContainerRef.current.parentElement;
    const containerWidth = container.clientWidth;
    
    // Calculate scale based on width only to ensure perfect horizontal fit
    const scale = containerWidth / 1280; // 1280 is Tableau dashboard's native width
    
    // Apply the scale
    tableauContainerRef.current.style.transform = `scale(${scale})`;
    tableauContainerRef.current.style.transformOrigin = "top left";
    
    // Update container dimensions to prevent horizontal overflow
    // Use a larger height to accommodate full content
    tableauContainerRef.current.style.width = `${1280 / scale}px`;
    tableauContainerRef.current.style.height = `${2000 / scale}px`; // Increased height to show more content
  };

  // Update scale on window resize and content change
  useEffect(() => {
    const handleResize = () => {
      updateScale();
    };

    window.addEventListener('resize', handleResize);
    updateScale(); // Initial scale calculation

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedContent?.url]);

  // Load Tableau content
  useEffect(() => {
    let mounted = true;

    const loadContent = async () => {
      if (!selectedContent) return;

      setIsLoading(true);
      setHasError(false);

      try {
        if (selectedContent.url.includes("tableau.com")) {
          // Clean up previous viz if it exists
          if (vizRef.current) {
            vizRef.current.dispose();
            vizRef.current = null;
          }

          if (tableauContainerRef.current && mounted) {
            const options = {
              hideTabs: true,
              hideToolbar: true,
              width: "1280px", // Fixed width
              height: "2000px", // Increased height to show more content
              onFirstInteractive: () => {
                if (mounted) {
                  setIsLoading(false);
                  updateScale(); // Update scale after content loads
                }
              },
            };

            vizRef.current = new (window as any).tableau.Viz(
              tableauContainerRef.current,
              selectedContent.url,
              options
            );
          }
        } else {
          // For non-Tableau content
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
                Choose a menu item from the sidebar to view analytics and reports
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-0 overflow-hidden">
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
              <div className="w-full h-full overflow-x-hidden overflow-y-auto relative">
                <div
                  ref={tableauContainerRef}
                  className="absolute top-0 left-0"
                  style={{
                    transform: "scale(1)",
                    transformOrigin: "top left",
                    width: "1280px",
                    height: "2000px", // Increased height to show more content
                  }}
                />
              </div>
            ) : (
              <div className="h-full w-full">
                <iframe
                  key={key}
                  src={selectedContent.url}
                  className="w-full h-full border-0"
                  title={selectedContent.title}
                  allow="fullscreen"
                  loading="lazy"
                  onLoad={() => setIsLoading(false)}
                  onError={handleIframeError}
                  style={{
                    height: "100%",
                    width: "100%",
                    maxWidth: "100%",
                    overflow: "auto",
                    display: "block"
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ContentArea;