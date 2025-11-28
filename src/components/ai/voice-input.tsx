
'use client';
import { Mic, MicOff } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = (language === 'sr' || language === 'se') ? 'sr-RS' : language; 
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onTranscript(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            if (event.error !== 'no-speech') {
                 console.error('Speech recognition error', event.error);
                 toast({
                    variant: "destructive",
                    title: 'Greška pri prepoznavanju govora',
                    description: `Došlo je do greške: ${event.error}`,
                });
            }
            setIsListening(false);
        };
        
        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }
  }, [language, onTranscript, toast]);

  const handleToggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start recognition", e);
        toast({
            variant: "destructive",
            title: 'Greška pri pokretanju',
            description: 'Nije moguće pokrenuti prepoznavanje govora. Proverite dozvole za mikrofon.',
        });
        setIsListening(false);
      }
    }
  };

  return (
    <Button
      type="button"
      size="icon"
      variant={'outline'}
      onClick={handleToggleListening}
      disabled={disabled}
      className={cn(
          "h-10 w-10 rounded-full border-2 border-primary/50 text-primary transition-all duration-300 hover:border-primary",
          isListening && "border-destructive/80 bg-destructive/20 animate-pulse"
      )}
    >
      {isListening ? (
        <MicOff size={24} className="text-destructive" />
      ) : (
        <Mic size={24} className="text-primary" />
      )}
    </Button>
  );
}
