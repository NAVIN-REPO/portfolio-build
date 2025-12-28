import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { templates } from "@/data/templates";

export const TemplatesSection = () => {
  const navigate = useNavigate();

  // Get featured templates from different categories
  // Select one high-quality template from each major category
  const getFeaturedTemplates = () => {
    const categories = ['Professional', 'Developer', 'Designer', 'Creative', 'Business', 'Minimal'];
    const featured: typeof templates = [];

    categories.forEach((category) => {
      // Find templates in this category, sorted by rating (desc) then uses (desc)
      const categoryTemplates = templates
        .filter((t) => t.category === category)
        .sort((a, b) => {
          // Sort by rating first, then by uses
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          return b.uses - a.uses;
        });

      // Get the best template from this category
      if (categoryTemplates.length > 0) {
        featured.push(categoryTemplates[0]);
      }
    });

    return featured;
  };

  const featuredTemplates = getFeaturedTemplates();

  const handleTemplateClick = (templateId: number) => {
    // Navigate to template editor with the selected template
    navigate(`/editor/template/${templateId}`);
  };

  return (
    <section id="templates" className="py-16 sm:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Beautiful Templates to Start With
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose a template and customize it to make it uniquely yours
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">
            {featuredTemplates.map((template) => (
              <Card
                key={template.id}
                className="group overflow-hidden hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary/20"
                onClick={() => handleTemplateClick(template.id)}
              >
                <div
                  className={`h-48 bg-gradient-to-br ${template.color} flex items-center justify-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  <div className="relative z-10 text-white text-center">
                    <div className="w-full max-w-[200px] mx-auto space-y-3 px-4">
                      <div className="h-3 bg-white/30 rounded"></div>
                      <div className="h-8 bg-white/50 rounded"></div>
                      <div className="h-2 bg-white/30 rounded w-3/4 mx-auto"></div>
                      <div className="flex gap-2 justify-center">
                        <div className="w-16 h-6 bg-white/40 rounded"></div>
                        <div className="w-16 h-6 bg-white/40 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTemplateClick(template.id);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Use Template
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg">{template.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-xs font-medium">{template.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{template.category}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" onClick={() => navigate("/templates")}>
              View All {templates.length}+ Templates
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
