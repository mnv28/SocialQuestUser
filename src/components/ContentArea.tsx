import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (!selectedContent) return;
    setIsLoading(true);
    setHasError(false);
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
            ) : (
              <div className="h-full w-full">
                <iframe
                  key={key}
                  src={
                    selectedContent.url.includes("tableau.com")
                      ? `${selectedContent.url}?embed=yes&:showVizHome=no&:host_url=https://public.tableau.com/&:embed_code_version=3&:tabs=no&:toolbar=yes&:animate_transition=yes&:display_static_image=no&:display_spinner=no&:display_overlay=yes&:display_count=yes&:language=en-US&:loadOrderID=0`
                      : selectedContent.url
                  }
                  className="w-full h-full border-0"
                  title={selectedContent.title}
                  allowFullScreen
                  loading="lazy"
                  onLoad={() => setIsLoading(false)}
                  onError={handleIframeError}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
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
