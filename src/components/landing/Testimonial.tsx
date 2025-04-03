
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarSrc?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({
  quote,
  author,
  role,
  company,
  avatarSrc
}) => {
  const initials = author
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="testimonial-card h-full flex flex-col">
      <CardContent className="pt-5 flex-1 flex flex-col">
        <div className="mb-3 text-primary">
          <Quote className="h-4 w-4" />
        </div>
        <p className="text-foreground mb-4 flex-1 text-sm">{quote}</p>
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={author} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-xs">{author}</p>
            <p className="text-xs text-muted-foreground">
              {role}, {company}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Testimonial;
