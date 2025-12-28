/**
 * Templates Page
 * Displays Department-specific portfolio templates
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Star, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { templates, categories } from '@/data/templates';

const Templates = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBySearch = templates.filter(
    t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUseTemplate = (templateId: number) => {
    navigate(`/editor/template/${templateId}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Your Portfolio Template</h1>
          <p className="text-muted-foreground">
            Choose the template designed for your department
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, department (e.g. CSE), or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="All" className="mb-8">
          <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category}
                <span className="ml-2 text-xs opacity-70">
                  ({category === 'All'
                    ? filteredBySearch.length
                    : filteredBySearch.filter(t => t.department === category).length})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBySearch
                  .filter((t) => category === 'All' || t.department === category)
                  .map((template) => (
                    <Card
                      key={template.id}
                      className="group overflow-hidden hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary/20"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      {/* Template Preview */}
                      <div className="h-48 bg-gray-100 relative overflow-hidden group">
                        <img
                          src={template.previewImage}
                          alt={template.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUseTemplate(template.id);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Use Template
                          </Button>
                        </div>
                        {/* Department Badge */}
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {template.department}
                        </div>
                      </div>

                      {/* Template Info */}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-base truncate">{template.name}</h3>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-xs font-medium text-muted-foreground">{template.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {template.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">
                            {template.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {template.uses.toLocaleString()} uses
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>

              {/* Empty State */}
              {filteredBySearch.filter((t) => category === 'All' || t.department === category).length === 0 && (
                <div className="text-center py-12 bg-white/50 rounded-lg border border-dashed">
                  <p className="text-lg font-medium text-muted-foreground mb-2">No templates found</p>
                  <p className="text-sm text-muted-foreground">
                    We couldn't find any templates for "{searchQuery}" relative to {category === 'All' ? 'all categories' : category}.
                  </p>
                  <Button
                    variant="link"
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-primary"
                  >
                    Clear search and view all
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Templates;
