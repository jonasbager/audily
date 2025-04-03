
import React from 'react';
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
    <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-6 items-center py-8 border-b border-border last:border-b-0`}>
      <div className="w-full lg:w-1/2 space-y-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="w-full lg:w-1/2">
        {imageUrl ? (
          <div className="rounded-xl overflow-hidden border border-border shadow-md">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-auto object-cover"
            />
          </div>
        ) : (
          <div className="bg-muted rounded-xl h-[250px] flex items-center justify-center">
            <p className="text-muted-foreground">Screenshot coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureHighlight;
