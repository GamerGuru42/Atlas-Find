"use client";

import React, { useRef, useEffect, useState } from 'react';
import styles from './page.module.css';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatPage() {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");

  const { messages, setMessages, sendMessage, status, error } = useChat({
    id: 'chat',
    onError: (err) => {
      console.error('[Chat Page Error]', err);
    }
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    
    sendMessage({ parts: [{ type: 'text', text: trimmed }], role: 'user' });
    setInput('');
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Speech Recognition
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

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
            setInput(prev => prev + (prev ? ' ' : '') + finalTranscript);
          }
        };
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleEdit = (msgId: string, currentText: string) => {
    const index = messages.findIndex(m => m.id === msgId);
    if (index !== -1) {
      setInput(currentText);
      setMessages(messages.slice(0, index));
      textareaRef.current?.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <main className={styles.mainChat}>
        <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>AtlasFind AI</h2>
          <span style={{ width: '8px', height: '8px', background: 'var(--accent-primary)', borderRadius: '50%', display: 'inline-block' }}></span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Agent Active</span>
        </div>

        <div className={styles.chatHistory}>
          {messages.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>✨</div>
              <h2 className={styles.emptyTitle}>Hi, I&apos;m Atlas.</h2>
              <p className={styles.emptyText}>I can help you find verified scholarships, fellowships, and grants tailored to your profile.</p>
              <div className={styles.suggestionChips}>
                {[
                  "Find me fully funded Master's scholarships in Europe",
                  "What fellowships are available for African students?",
                  "Show me internships with upcoming deadlines",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    className={styles.suggestionChip}
                    onClick={() => {
                      sendMessage({ parts: [{ type: 'text', text: suggestion }], role: 'user' });
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.messageRow} ${msg.role === 'user' ? styles.messageUser : styles.messageAgent}`}>
              <div className={styles.messageContent}>
                {msg.role !== 'user' && (
                  <div className={styles.agentAvatar}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                      <path d="M2 17L12 22L22 17" />
                      <path d="M2 12L12 17L22 12" />
                    </svg>
                  </div>
                )}
                
                <div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAgent}`}>
                  {msg.role === 'user' ? (
                    <div className={styles.messageText}>{msg.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || ''}</div>
                  ) : (
                    <div className={styles.messageTextMarkdown}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || ''}
                      </ReactMarkdown>
                    </div>
                  )}
                  
                  <div className={styles.messageActions}>
                    <button 
                      className={styles.messageActionBtn} 
                      onClick={() => handleCopy(msg.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || '')}
                      title="Copy message"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                    {msg.role === 'user' && (
                      <button 
                        className={styles.messageActionBtn}
                        onClick={() => handleEdit(msg.id, msg.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || '')}
                        title="Edit message"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
             <div className={`${styles.messageRow} ${styles.messageAgent}`}>
              <div className={styles.messageContent}>
                <div className={styles.agentAvatar}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                    <path d="M2 17L12 22L22 17" />
                    <path d="M2 12L12 17L22 12" />
                  </svg>
                </div>
                <div className={`${styles.messageBubble} ${styles.bubbleAgent}`}>
                  <div className={styles.messageText}>
                    <span className={styles.thinkingIndicator}>
                      <span className={styles.thinkingDot}>.</span>
                      <span className={styles.thinkingDot}>.</span>
                      <span className={styles.thinkingDot}>.</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && <div className={styles.errorText}>{error.message || 'An error occurred. Please try again.'}</div>}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className={styles.inputArea}>
          <form className={styles.inputWrapper} onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              className={styles.input}
              placeholder="Tell me what you're looking for..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={onKeyDown}
              disabled={isLoading}
              rows={1}
            />
            <div className={styles.inputControls}>
              <button 
                type="button" 
                className={`${styles.voiceButton} ${isListening ? styles.voiceListening : ''}`} 
                onClick={toggleListening}
                title="Voice input"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </button>
              <button type="submit" className={styles.sendButton} aria-label="Send message" disabled={isLoading || !input.trim()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
