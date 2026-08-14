'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Mic, MicOff, Send, Square } from 'lucide-react';
import styles from './Chat.module.css';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  onStop: () => void;
}

export function ChatInput({ input, setInput, onSubmit, isLoading, onStop }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // Max height ~5 lines (approx 120px)
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Keyboard shortcut: Enter to send, Shift+Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  // Speech Recognition integration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        
        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setInput(input + (input ? ' ' : '') + finalTranscript);
          }
        };
        recognitionRef.current = recognition;
      }
    }
    return () => {
      try { recognitionRef.current?.stop(); } catch {}
    };
  }, [input, setInput]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className={styles.inputArea}>
      <form className={styles.inputWrapper} onSubmit={handleSubmitForm}>
        <textarea
          ref={textareaRef}
          className={styles.input}
          placeholder="Ask Atlas about scholarships, essays, strategy..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <div className={styles.inputControls}>
          {recognitionRef.current && (
            <button
              type="button"
              className={`${styles.voiceButton} ${isListening ? styles.voiceListening : ''}`}
              onClick={toggleListening}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}

          {isLoading ? (
            <button
              type="button"
              className={styles.stopButton}
              onClick={onStop}
              title="Stop generating"
            >
              <Square size={16} fill="currentColor" />
            </button>
          ) : (
            <button
              type="submit"
              className={styles.sendButton}
              disabled={!input.trim()}
              title="Send message"
            >
              <Send size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
