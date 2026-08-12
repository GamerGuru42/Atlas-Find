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

  const { messages, sendMessage, status, error } = useChat({
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
    
    sendMessage({ text: trimmed });
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
                      sendMessage({ text: suggestion });
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

          {error && <div className={styles.errorText}>An error occurred. Please try again.</div>}

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
            <button type="submit" className={styles.sendButton} aria-label="Send message" disabled={isLoading || !input.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
