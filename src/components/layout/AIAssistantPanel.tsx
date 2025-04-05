
import React, { useState } from 'react';
import { 
  Bot, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft, 
  SendHorizontal,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AISuggestion {
  id: string;
  content: string;
}

const AIAssistantPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {
      role: 'assistant',
      content: 'Hi there! I\'m your compliance assistant. How can I help you with NIS2 or SOX compliance today?'
    }
  ]);

  const suggestions: AISuggestion[] = [
    {
      id: '1',
      content: 'What policies do I need for NIS2 compliance?'
    },
    {
      id: '2',
      content: 'How do I create a SOX internal control framework?'
    },
    {
      id: '3',
      content: 'Explain what evidence I need for NIS2 Article 21'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userInput }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Thanks for your question about "${userInput}". As an AI assistant, I'd recommend starting with documenting your security measures and creating a risk assessment process. This applies to both NIS2 and SOX frameworks. Let me know if you'd like me to help generate a draft policy.` 
      }]);
    }, 1000);
    
    setUserInput('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setUserInput(suggestion);
  };

  if (!isExpanded) {
    return (
      <div className="fixed right-4 bottom-4">
        <Button 
          size="icon"
          className="h-12 w-12 rounded-full shadow-md"
          onClick={() => setIsExpanded(true)}
        >
          <Bot />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-screen">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Bot size={18} />
          <h3 className="font-medium">AI Assistant</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsExpanded(false)}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 bg-primary">
                  <Bot size={14} className="text-primary-foreground" />
                </Avatar>
              )}
              <div className={`rounded-lg p-3 max-w-[80%] ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {message.content}
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8 bg-muted">
                  <MessageSquare size={14} />
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Suggestions</h4>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(suggestion => (
              <Button 
                key={suggestion.id}
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => handleSuggestionClick(suggestion.content)}
              >
                {suggestion.content}
              </Button>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask a question..."
              className="resize-none min-h-[60px]"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!userInput.trim()}
            >
              <SendHorizontal size={16} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
