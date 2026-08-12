/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import { ChatMessage } from '@/types/chat';
import { UserProfile, GoalStage, ContextPill } from '@/types/user';
import { experimental_useObject } from '@ai-sdk/react';
import { AtlasResponseSchema } from '@/lib/gemini/prompts/systemPrompt';

function generateId() {
  return Date.now().toString();
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [savedOpps, setSavedOpps] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('saved_opportunities');
    if (saved) {
      try {
        setSavedOpps(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleSaveOpportunity = (opp: any) => {
    setSavedOpps((prev) => {
      const isSaved = prev.some((o) => o.id === opp.id);
      let updated;
      if (isSaved) {
        updated = prev.filter((o) => o.id !== opp.id);
      } else {
        updated = [...prev, opp];
      }
      localStorage.setItem('saved_opportunities', JSON.stringify(updated));
      return updated;
    });
  };

  const { submit, isLoading, object, error } = experimental_useObject({
    api: '/api/chat',
    schema: AtlasResponseSchema,
    onError: (err) => {
      console.error('[Chat Page Error]', err);
      // Attempt to parse JSON error from AI SDK
      let errorMsg = err?.message || 'Unknown error';
      if (err?.message?.includes('JSON')) {
        // Sometimes the SDK wraps it. Try to parse.
        errorMsg = err.message;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'agent',
          content: `⚠️ Agent is temporarily unavailable. [${errorMsg}]`,
          timestamp: new Date().toISOString(),
        }
      ]);
    },
    onFinish: ({ object: finalObject }) => {
      if (finalObject) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'agent',
            content: finalObject.message || '',
            timestamp: new Date().toISOString(),
            opportunityCards: finalObject.opportunities as any,
            adviceCards: finalObject.advice as any,
            contextPillsAdded: finalObject.contextPills as any,
          }
        ]);
      }
    }
  });

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, object]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        const fakeEvent = new Event('submit', { cancelable: true }) as unknown as React.FormEvent;
        handleSubmit(fakeEvent);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    submit({ 
      message: userMessage.content, 
      history: messages.map(m => ({ role: m.role, content: m.content })) 
    });
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
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.messageRow} ${msg.role === 'user' ? styles.messageUser : styles.messageAgent}`}>
              <div className={styles.messageContent}>
                {msg.role === 'agent' && (
                  <div className={styles.agentAvatar}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                      <path d="M2 17L12 22L22 17" />
                      <path d="M2 12L12 17L22 12" />
                    </svg>
                  </div>
                )}
                
                <div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleAgent}`}>
                  <div className={styles.messageText}>{msg.content}</div>
                </div>

                {/* Safe Optional Chaining for Components */}
                {msg.opportunityCards && msg.opportunityCards.length > 0 && (
                  <div className={styles.cardsContainer}>
                    {msg.opportunityCards.map((opp: any) => (
                      opp.name && opp.matchScore && (
                        <div key={opp.id} className={styles.oppCard}>
                          <div className={styles.oppCardHeader}>
                            <h4 className={styles.oppCardTitle}>{opp.name}</h4>
                            <div className={styles.matchBadge}>{opp.matchScore}%</div>
                          </div>
                          <p><strong>Deadline:</strong> {opp.deadline || 'Unknown'}</p>
                          <p><strong>Why Match:</strong> {opp.whyMatch}</p>
                          {opp.concerns && <p><strong>Concerns:</strong> {opp.concerns}</p>}
                          {opp.nextAction && <p><strong>Next Action:</strong> {opp.nextAction}</p>}
                        </div>
                      )
                    ))}
                  </div>
                )}

                {msg.adviceCards && msg.adviceCards.length > 0 && (
                  <div className={styles.adviceContainer}>
                    {msg.adviceCards.map((advice: any, idx: number) => (
                      advice.type && advice.content && (
                        <div key={idx} className={styles.adviceCard}>
                          <strong>{advice.type.toUpperCase()}:</strong> {advice.content}
                        </div>
                      )
                    ))}
                  </div>
                )}

                {msg.contextPillsAdded && msg.contextPillsAdded.length > 0 && (
                  <div className={styles.suggestionsInline}>
                    {msg.contextPillsAdded.map((pill: any, idx: number) => (
                      pill.label && pill.value && (
                        <span key={idx} className={styles.suggestionChip}>
                          {pill.label}: {pill.value}
                        </span>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Streaming Agent Response */}
          {isLoading && (
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
                    {object?.message || (
                      <span className={styles.thinkingIndicator}>
                        <span className={styles.thinkingDot}>.</span>
                        <span className={styles.thinkingDot}>.</span>
                        <span className={styles.thinkingDot}>.</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Safe Optional Chaining for Streaming Components */}
                {object?.opportunities && object.opportunities.length > 0 && (
                  <div className={styles.cardsContainer}>
                    {object.opportunities.map((opp: any, idx: number) => (
                      opp?.name && opp?.matchScore && (
                        <div key={opp.id || idx} className={styles.oppCard}>
                          <div className={styles.oppCardHeader}>
                            <h4 className={styles.oppCardTitle}>{opp.name}</h4>
                            <div className={styles.matchBadge}>{opp.matchScore}%</div>
                          </div>
                          {opp.deadline && <p><strong>Deadline:</strong> {opp.deadline}</p>}
                          {opp.whyMatch && <p><strong>Why Match:</strong> {opp.whyMatch}</p>}
                          {opp.concerns && <p><strong>Concerns:</strong> {opp.concerns}</p>}
                          {opp.nextAction && <p><strong>Next Action:</strong> {opp.nextAction}</p>}
                        </div>
                      )
                    ))}
                  </div>
                )}

                {object?.advice && object.advice.length > 0 && (
                  <div className={styles.adviceContainer}>
                    {object.advice.map((advice: any, idx: number) => (
                      advice?.type && advice?.content && (
                        <div key={idx} className={styles.adviceCard}>
                          <strong>{advice.type.toUpperCase()}:</strong> {advice.content}
                        </div>
                      )
                    ))}
                  </div>
                )}
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
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
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
