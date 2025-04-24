
import React, { useState } from 'react';
import { 
  MessageSquare, 
  ChevronRight,
  SendHorizontal,
  Loader2,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { useChat } from '@/contexts/ChatContext';

interface AISuggestion {
  id: string;
  content: string;
}

interface Props {
  onExpandChange?: (isExpanded: boolean) => void;
}

const AIAssistantPanel: React.FC<Props> = ({ onExpandChange }) => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { messages, setMessages, isChatVisible, setIsChatVisible } = useChat();

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

  const handleSubmit = async (e?: React.FormEvent, inputOverride?: string) => {
    if (e) e.preventDefault();
    
    const input = inputOverride || userInput;
    if (!input.trim()) return;
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    
    try {
      const messageHistory = messages.slice(-6).concat(userMessage);
      
      const { data, error } = await supabase.functions.invoke('openai', {
        body: {
          type: 'assistant',
          messages: messageHistory
        }
      });
      
      if (error) throw new Error(error.message);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply 
      }]);
    } catch (error: any) {
      console.error('Error with AI assistant:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response from the AI assistant.',
        variant: 'destructive'
      });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered a technical issue. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setUserInput(suggestion);
    handleSubmit(undefined, suggestion);
  };

  const handleExpandToggle = (expanded: boolean) => {
    setIsChatVisible(expanded);
    onExpandChange?.(expanded);
  };

  if (!isChatVisible) {
    return (
      <div className="fixed right-4 bottom-4">
        <Button 
          size="icon"
          className="h-12 w-12 rounded-full shadow-md"
          onClick={() => handleExpandToggle(true)}
        >
          <Bot size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full fixed right-0 top-0 bottom-0">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src="/audily_avatar.svg" 
              alt="Audrey Avatar" 
            />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <h3 className="font-medium">Audrey</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleExpandToggle(false)}
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
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src="/audily_avatar.svg" 
                    alt="Audrey Avatar" 
                  />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-lg p-3 max-w-[80%] ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {message.role === 'assistant' ? (
                  <MarkdownRenderer content={message.content} />
                ) : (
                  message.content
                )}
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8 bg-muted flex items-center justify-center">
                  <MessageSquare size={14} />
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src="/audily_avatar.svg" 
                  alt="Audrey Avatar" 
                />
                <AvatarFallback>
                  <Loader2 size={14} className="animate-spin" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-secondary text-secondary-foreground rounded-lg p-3 flex items-center">
                <Loader2 size={14} className="animate-spin mr-2" />
                Thinking...
              </div>
            </div>
          )}
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
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!userInput.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <SendHorizontal size={16} />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
