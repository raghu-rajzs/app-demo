import React, { useState } from 'react';
import { BookOpen, Download, FileText, Video, Image as ImageIcon, ExternalLink, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Input } from './ui/input';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'guide' | 'image';
  category: string;
  size?: string;
  downloadUrl?: string;
  dateAdded: string;
}

const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Best Practices for Hybrid Seed Production',
    description: 'Comprehensive guide covering all aspects of hybrid seed production',
    type: 'document',
    category: 'Guidelines',
    size: '2.4 MB',
    dateAdded: '2024-11-15'
  },
  {
    id: '2',
    title: 'Irrigation Management Tutorial',
    description: 'Video tutorial on modern irrigation techniques for optimal crop yield',
    type: 'video',
    category: 'Training',
    size: '45 MB',
    dateAdded: '2024-11-20'
  },
  {
    id: '3',
    title: 'Pest Identification Guide',
    description: 'Visual guide to identify common pests in agricultural fields',
    type: 'guide',
    category: 'Field Support',
    size: '5.1 MB',
    dateAdded: '2024-11-10'
  },
  {
    id: '4',
    title: 'Soil Testing Procedures',
    description: 'Step-by-step procedures for accurate soil testing',
    type: 'document',
    category: 'Guidelines',
    size: '1.8 MB',
    dateAdded: '2024-11-25'
  },
  {
    id: '5',
    title: 'Fertilizer Application Chart',
    description: 'Reference chart for proper fertilizer application rates',
    type: 'image',
    category: 'Reference',
    size: '850 KB',
    dateAdded: '2024-11-18'
  },
  {
    id: '6',
    title: 'Safety Protocols for Field Work',
    description: 'Important safety guidelines for field assistants',
    type: 'document',
    category: 'Safety',
    size: '1.2 MB',
    dateAdded: '2024-11-12'
  }
];

export function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(MOCK_RESOURCES.map(r => r.category)))];

  const filteredResources = MOCK_RESOURCES.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5 text-purple-600" />;
      case 'image':
        return <ImageIcon className="h-5 w-5 text-blue-600" />;
      case 'guide':
        return <BookOpen className="h-5 w-5 text-green-600" />;
      default:
        return <FileText className="h-5 w-5 text-slate-600" />;
    }
  };

  const getTypeBadge = (type: Resource['type']) => {
    const colors = {
      video: 'bg-purple-100 text-purple-800 border-purple-300',
      image: 'bg-blue-100 text-blue-800 border-blue-300',
      guide: 'bg-green-100 text-green-800 border-green-300',
      document: 'bg-slate-100 text-slate-800 border-slate-300'
    };
    return <Badge className={colors[type]}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Resources</h2>
          <p className="text-sm text-slate-500">Training materials & guides</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 bg-gradient-to-br from-[#10B981] to-[#0e9870] text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-90">Total Resources</p>
                <p className="text-2xl font-bold">{MOCK_RESOURCES.length}</p>
              </div>
              <BookOpen className="h-8 w-8 opacity-30" />
            </div>
          </Card>
          <Card className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-90">Categories</p>
                <p className="text-2xl font-bold">{categories.length - 1}</p>
              </div>
              <FileText className="h-8 w-8 opacity-30" />
            </div>
          </Card>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b px-4 py-3 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-[#10B981] hover:bg-[#0e9870] whitespace-nowrap' : 'whitespace-nowrap'}
            >
              {category === 'all' ? 'All' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Resources List */}
      <div className="p-4 space-y-3">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getTypeIcon(resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-slate-900 mb-1">{resource.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{resource.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  {getTypeBadge(resource.type)}
                  <Badge variant="outline" className="text-xs">
                    {resource.category}
                  </Badge>
                </div>
                <span className="text-xs text-slate-500">{resource.size}</span>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-[#10B981] hover:bg-[#0e9870] h-10 gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" className="h-10 px-3">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-16 w-16 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No resources found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
