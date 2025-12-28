/**
 * Template Editor Page
 * Visual WYSIWYG editor for generic HTML templates
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Save,
  Eye,
  Share2,
  ArrowLeft,
  Loader2,
  Undo,
  Redo,
  Smartphone,
  Monitor
} from 'lucide-react';
import { templates, PortfolioTemplate } from '@/data/templates';
import { savePortfolio, updatePortfolio, getPortfolioById } from '@/lib/portfolio-storage';
import { addHistoryItem } from '@/lib/history-storage';
import { toast } from 'sonner';

const TemplateEditor = () => {
  const { templateId, portfolioId } = useParams();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [template, setTemplate] = useState<PortfolioTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [portfolioName, setPortfolioName] = useState('My Portfolio');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [initialHtml, setInitialHtml] = useState<string>('');

  // Initialize Editor
  useEffect(() => {
    const initializeEditor = async () => {
      setLoading(true);
      try {
        if (portfolioId) {
          // Load existing portfolio
          const savedPortfolio = await getPortfolioById(portfolioId);
          if (savedPortfolio) {
            setInitialHtml(savedPortfolio.htmlContent);
            setPortfolioName(savedPortfolio.name);
            const foundTemplate = templates.find(t => t.id === savedPortfolio.templateId);
            setTemplate(foundTemplate || null);
          }
        } else if (templateId) {
          // Load new template
          const foundTemplate = templates.find(t => t.id === parseInt(templateId));
          setTemplate(foundTemplate || null);
          setPortfolioName(`${foundTemplate?.name} Portfolio`);

          if (foundTemplate) {
            // Fetch the raw HTML of the template
            const response = await fetch(foundTemplate.templatePath);
            if (!response.ok) throw new Error('Failed to load template');
            let html = await response.text();

            // Get the base path for assets (e.g., /templates/Hudson/)
            const basePath = foundTemplate.templatePath.substring(0, foundTemplate.templatePath.lastIndexOf('/') + 1);

            // Rewrite relative paths for links, scripts, and images
            html = html.replace(
              /(src|href)="([^"]*)"/g,
              (match, attr, url) => {
                // Ignore absolute URLs, data URIs, or anchor links
                if (url.startsWith('http') || url.startsWith('//') || url.startsWith('data:') || url.startsWith('#')) {
                  return match;
                }
                // Remove leading ./ if present
                const cleanUrl = url.startsWith('./') ? url.slice(2) : url;
                // Construct new path
                return `${attr}="${basePath}${cleanUrl}"`;
              }
            );

            setInitialHtml(html);
          }
        }
      } catch (error) {
        toast.error('Failed to load editor resources');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initializeEditor();
  }, [templateId, portfolioId]);

  // Inject Editor Scripts after iframe load
  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) return;

    const doc = iframe.contentDocument;

    // 1. Inject Styles for Editable Elements
    const style = doc.createElement('style');
    style.innerHTML = `
      [contenteditable="true"] {
        outline: 2px dashed rgba(59, 130, 246, 0.5);
        cursor: text;
      }
      [contenteditable="true"]:focus {
        outline: 2px solid #3B82F6;
        background-color: rgba(59, 130, 246, 0.05);
      }
      img {
        cursor: pointer;
        transition: opacity 0.2s;
      }
      img:hover {
        opacity: 0.8;
        outline: 2px solid #3B82F6;
      }
      .editor-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 8px;
        background: #3B82F6;
        color: white;
        font-family: sans-serif;
        font-size: 12px;
        z-index: 10000;
        display: none;
      }
      .custom-context-menu {
        position: absolute;
        z-index: 10000;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        min-width: 160px;
        overflow: hidden;
        display: none;
      }
      .custom-context-menu-item {
        padding: 8px 12px;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        color: #1e293b;
        cursor: pointer;
        transition: background-color 0.1s;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .custom-context-menu-item:hover {
        background-color: #f1f5f9;
        color: #0f172a;
      }
      .custom-context-menu-item.delete {
        color: #ef4444;
      }
      .custom-context-menu-item.delete:hover {
        background-color: #fef2f2;
        color: #dc2626;
      }
    `;
    doc.head.appendChild(style);

    // Create Context Menu Element
    const contextMenu = doc.createElement('div');
    contextMenu.className = 'custom-context-menu';
    contextMenu.innerHTML = `
      <div class="custom-context-menu-item" id="edit-link-option" style="display: none;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        Edit Link
      </div>
      <div class="custom-context-menu-item" id="change-image-option" style="display: none;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        Change Image
      </div>
      <div class="custom-context-menu-item delete" id="delete-option">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        Delete Element
      </div>
    `;
    doc.body.appendChild(contextMenu);

    let targetElement: HTMLElement | null = null;
    let targetLink: HTMLAnchorElement | null = null; // Store link reference

    // 2. Make Text Editable
    const textElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, li, a');
    textElements.forEach(el => {
      // Basic check to avoid breaking layout or scripts
      if (el.children.length === 0 && el.textContent?.trim() && !el.closest('.custom-context-menu')) {
        el.setAttribute('contenteditable', 'true');
      }
    });

    // 3. Handle Image Drag & Drop
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && e.dataTransfer?.files.length) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            (target as HTMLImageElement).src = event.target?.result as string;
            toast.success('Image updated!');
          };
          reader.readAsDataURL(file);
        }
      }
    };

    // Helper to trigger file upload
    const triggerImageUpload = (imgElement: HTMLImageElement) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const newSrc = ev.target?.result as string;
            imgElement.src = newSrc;

            // Critical Fix: Remove srcset so browser uses the new src
            imgElement.removeAttribute('srcset');
            imgElement.removeAttribute('sizes');

            // Also update parent if it's a lightbox link (optional but nice)
            const parentLink = imgElement.closest('a');
            if (parentLink && parentLink.classList.contains('glightbox')) {
              parentLink.setAttribute('href', newSrc);
            }

            toast.success('Image updated!');
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    };

    // Helper: Smart Link Prompt
    const promptForLink = (currentHref: string | null, linkText: string = '') => {
      let promptMsg = "Enter the URL for this link:";
      if (linkText.toLowerCase().includes('mail') || linkText.toLowerCase().includes('contact') || linkText.toLowerCase().includes('message') || linkText.toLowerCase().includes('hire') || currentHref?.startsWith('mailto:')) {
        promptMsg = "Enter email address (e.g. name@example.com) or URL:";
      }

      let newHref = prompt(promptMsg, currentHref || "https://");

      if (newHref !== null) {
        // Smart Link Handling
        if (newHref.includes('@') && !newHref.includes('/') && !newHref.startsWith('mailto:')) {
          newHref = `mailto:${newHref}`;
        } else if (!newHref.startsWith('http') && !newHref.startsWith('#') && !newHref.startsWith('mailto:')) {
          newHref = `https://${newHref}`;
        }
        return newHref;
      }
      return null;
    };

    // 4. Handle Link/Image Clicks
    const handleClick = (e: MouseEvent) => {
      // Hide context menu on left click usually
      contextMenu.style.display = 'none';

      const target = e.target as HTMLElement;

      // Image Editing (Left Click)
      if (target.tagName === 'IMG') {
        e.stopPropagation();
        triggerImageUpload(target as HTMLImageElement);
        return;
      }

      // Link Editing (Left Click)
      // Check if clicked element is a link or inside a link
      const link = target.closest('a');
      if (link) {
        // Prevent default navigation
        e.preventDefault();
        e.stopPropagation();

        const currentHref = link.getAttribute('href');
        const newHref = promptForLink(currentHref, link.innerText);

        if (newHref) {
          link.setAttribute('href', newHref);
          link.style.outline = "2px solid #22c55e";
          setTimeout(() => { link.style.outline = ""; }, 1000);
          toast.success('Link updated!');
        }
      }
    };

    // 5. Context Menu Handler
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const x = e.clientX; // Use clientX/Y for elementsFromPoint
      const y = e.clientY;

      // Check for elements under the cursor (handle overlays)
      const elements = doc.elementsFromPoint(x, y);
      targetElement = e.target as HTMLElement;
      targetLink = null;

      // Look for an image in the stack if the target itself isn't one
      let imageElement: HTMLImageElement | null = null;
      if (targetElement.tagName === 'IMG') {
        imageElement = targetElement as HTMLImageElement;
      } else {
        // Check the stack for an image
        for (const el of elements) {
          if (el.tagName === 'IMG') {
            imageElement = el as HTMLImageElement;
            // Update targetElement to the image if we found one under overlay
            // This allows "Delete" to act on the image if desired, or at least "Change Image" works
            targetElement = el as HTMLElement;
            break;
          }
        }
      }

      // Look for a link (target or ancestors)
      targetLink = targetElement.closest('a');
      // If not strictly on the element, check elements stack for a link
      if (!targetLink) {
        for (const el of elements) {
          const foundLink = el.closest('a');
          if (foundLink) {
            targetLink = foundLink;
            break;
          }
        }
      }

      // Don't allowing deleting the body or html
      if (targetElement === doc.body || targetElement === doc.documentElement) return;

      const editLinkOption = contextMenu.querySelector('#edit-link-option') as HTMLElement;
      const changeImageOption = contextMenu.querySelector('#change-image-option') as HTMLElement;

      if (targetLink) {
        editLinkOption.style.display = 'flex';
      } else {
        editLinkOption.style.display = 'none';
      }

      if (imageElement) {
        changeImageOption.style.display = 'flex';
        targetElement = imageElement;
      } else {
        changeImageOption.style.display = 'none';
      }

      contextMenu.style.display = 'block';
      contextMenu.style.left = `${e.pageX}px`;
      contextMenu.style.top = `${e.pageY}px`;
    };

    // Handle Context Menu Actions
    contextMenu.querySelector('#delete-option')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (targetElement) {
        targetElement.remove();
        contextMenu.style.display = 'none';
        toast.success('Element deleted');
      }
    });

    contextMenu.querySelector('#change-image-option')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (targetElement && targetElement.tagName === 'IMG') {
        triggerImageUpload(targetElement as HTMLImageElement);
        contextMenu.style.display = 'none';
      }
    });

    contextMenu.querySelector('#edit-link-option')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (targetLink) {
        contextMenu.style.display = 'none';
        const currentHref = targetLink.getAttribute('href');
        const newHref = promptForLink(currentHref, targetLink.innerText);
        if (newHref) {
          targetLink.setAttribute('href', newHref);
          toast.success('Link updated!');
        }
      }
    });

    // Attach listeners to Body (delegate) with CAPTURE phase to override template scripts
    doc.body.addEventListener('dragover', handleDragOver, true);
    doc.body.addEventListener('drop', handleDrop, true);
    doc.body.addEventListener('click', handleClick, true);
    doc.body.addEventListener('contextmenu', handleContextMenu, true);

    // Prevent links from navigating inside editor (backup)
    const links = doc.querySelectorAll('a');
    links.forEach(link => {
      // Just ensuring default behavior is off initially too
      link.addEventListener('click', (e) => e.preventDefault());
    });
  };

  const handleSave = async () => {
    if (!iframeRef.current?.contentDocument || !template) return;

    // Clone the document to clean up editor-specific stuff before saving
    // Currently we just grab outerHTML, but ideally we'd remove contenteditable attributes
    const doc = iframeRef.current.contentDocument;

    // Clean up: Remove contenteditable attributes for the saved version
    const cleanHtml = doc.documentElement.outerHTML.replace(/contenteditable="true"/g, '');

    const style = template.style; // Persist style metadata

    if (portfolioId) {
      await updatePortfolio(portfolioId, {
        name: portfolioName,
        htmlContent: cleanHtml,
        style
      });
      await addHistoryItem("Updated portfolio", "edit", portfolioName);
      toast.success('Portfolio updated successfully!');
    } else {
      const saved = await savePortfolio({
        templateId: template.id,
        templateName: template.name,
        name: portfolioName,
        htmlContent: cleanHtml,
        previewImage: template.previewImage,
        style
      });
      await addHistoryItem("Created new portfolio", "create", portfolioName);
      toast.success('Portfolio saved successfully!');
      navigate(`/editor/portfolio/${saved.id}`);
    }
  };

  const handleShare = async () => {
    if (!portfolioId) {
      toast.error('Please save your portfolio first.');
      return;
    }
    const portfolio = await getPortfolioById(portfolioId);
    if (portfolio) {
      navigator.clipboard.writeText(portfolio.shareLink);
      toast.success('Share link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Template...</span>
      </div>
    );
  }

  if (!template && !initialHtml) {
    return <div className="p-8">Template not found.</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Toolbar */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/templates')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <Input
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              className="font-semibold text-lg border-none h-auto p-0 focus-visible:ring-0 w-[200px]"
              placeholder="Portfolio Name"
            />
            <span className="text-xs text-muted-foreground">
              Editing: {template?.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-md flex gap-1 mr-4">
            <Button
              variant={viewMode === 'desktop' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-slate-100 p-4">
        <div
          className={`bg-white transition-all duration-300 shadow-2xl overflow-hidden ${viewMode === 'mobile' ? 'w-[375px] h-[667px] rounded-3xl border-8 border-slate-900' : 'w-full h-full rounded-sm'
            }`}
        >
          <iframe
            ref={iframeRef}
            srcDoc={initialHtml}
            onLoad={handleIframeLoad}
            className="w-full h-full border-0 block"
            title="Template Editor"
            sandbox="allow-same-origin allow-scripts allow-forms allow-modals" // Security: Careful with what we allow
          />
        </div>

        {/* Helper Hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm pointer-events-none animate-in fade-in slide-in-from-bottom-4">
          Click text to edit • Drag & Drop images to replace
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;

