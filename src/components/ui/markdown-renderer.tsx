
import React from 'react';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  // Process the markdown content
  const formattedContent = content
    // Handle bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Handle italic text
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Handle code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Handle inline code
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Handle lists (unordered)
    .replace(/^\s*-\s+(.*?)$/gm, '<li>$1</li>')
    // Handle lists (ordered)
    .replace(/^\s*(\d+)\.\s+(.*?)$/gm, '<li>$2</li>')
    // Handle headings
    .replace(/^#{1}\s+(.*?)$/gm, '<h1>$1</h1>')
    .replace(/^#{2}\s+(.*?)$/gm, '<h2>$1</h2>')
    .replace(/^#{3}\s+(.*?)$/gm, '<h3>$1</h3>')
    // Handle paragraphs and line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />');

  // Wrap in paragraph tags if not already wrapped
  const wrappedContent = formattedContent.startsWith('<p>') 
    ? formattedContent 
    : `<p>${formattedContent}</p>`;

  return (
    <div 
      className={cn("prose prose-sm max-w-none dark:prose-invert", className)}
      dangerouslySetInnerHTML={{ __html: wrappedContent }}
    />
  );
};
