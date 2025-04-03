
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureHighlightProps {
  title: string;
  description: string;
  icon: LucideIcon;
  imageUrl?: string;
  reversed?: boolean;
}

const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  title,
  description,
  icon: Icon,
  imageUrl,
  reversed = false
}) => {
  return (
    <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center py-12`}>
      <div className="w-full lg:w-1/2 space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
        <p className="text-muted-foreground text-lg">{description}</p>
      </div>
      
      <div className="w-full lg:w-1/2">
        {imageUrl ? (
          <div className="rounded-xl overflow-hidden border border-border shadow-lg">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-auto object-cover"
            />
          </div>
        ) : (
          <div className="bg-muted rounded-xl h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Screenshot coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureHighlight;
