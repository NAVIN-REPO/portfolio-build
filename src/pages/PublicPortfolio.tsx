/**
 * Public Portfolio Page
 * Displays a saved portfolio by rendering its HTML content in an iframe
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPortfolioById, incrementPortfolioView } from '@/lib/portfolio-storage';
import { Loader2 } from 'lucide-react';

const PublicPortfolio = () => {
  const { portfolioId } = useParams();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      if (portfolioId) {
        try {
          const portfolio = await getPortfolioById(portfolioId);
          if (portfolio) {
            setHtmlContent(portfolio.htmlContent);
            await incrementPortfolioView(portfolioId); // Increment views
          }
        } catch (error) {
          console.error("Error loading portfolio:", error);
        }
      }
      setLoading(false);
    };

    loadPortfolio();
  }, [portfolioId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!htmlContent) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold">Portfolio Not Found</h1>
        <p className="text-muted-foreground">The portfolio you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-white">
      <iframe
        srcDoc={htmlContent}
        className="w-full h-full border-none"
        title="Portfolio"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black/80 text-white px-3 py-1 rounded-full text-xs hover:bg-black transition-colors shadow-lg backdrop-blur-sm no-underline"
        >
          Built with Portfolio Builder
        </a>
      </div>
    </div>
  );
};

export default PublicPortfolio;
