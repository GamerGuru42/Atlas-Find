'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Menu, Plus, RefreshCw, Send, Sparkles, WifiOff, X } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { PromptChips } from './PromptChips';
import { SaveProgressModal } from './SaveProgressModal';
import styles from './Chat.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status?: 'sending' | 'sent' | 'error';
  createdAt?: string;
}

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
}

export function ChatInterface() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string>('default');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  // History loading states
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Offline Mode states
  const [isOnline, setIsOnline] = useState(true);

  // Scroll behavior refs & states
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const [showNewMessagesPill, setShowNewMessagesPill] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Handle browser online/offline status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connection restored. Syncing messages...");
      syncOfflineQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("You are offline. User messages will be queued.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [conversationId]);

  // Initial load
  useEffect(() => {
    // Generate or load current conversation ID
    const savedConvId = localStorage.getItem('atlas_current_conv_id') || 'default';
    setConversationId(savedConvId);

    // Load conversation list
    loadConversationList();

    // Check login status & sync guest details if authenticated
    checkLoginStatus();
  }, []);

  // Fetch messages whenever conversationId changes
  useEffect(() => {
    if (conversationId) {
      loadMessagesHistory(conversationId);
    }
  }, [conversationId]);

  const checkLoginStatus = async () => {
    try {
      const res = await fetch('/api/tracker');
      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(data.isLoggedIn);
        if (data.isLoggedIn) {
          triggerGuestDataMigration();
        }
      }
    } catch {}
  };

  const triggerGuestDataMigration = async () => {
    try {
      const guestProfileStr = localStorage.getItem('atlas_guest_profile');
      if (!guestProfileStr) return;

      const guestProfile = JSON.parse(guestProfileStr);
      const savedConvs = localStorage.getItem('atlas_conversations');
      const convList = savedConvs ? JSON.parse(savedConvs) : [];
      const guestConversations = [];

      for (const conv of convList) {
        const key = `atlas_chat_history_${conv.id}`;
        const historyStr = localStorage.getItem(key);
        if (historyStr) {
          guestConversations.push({
            conversationId: conv.id,
            messages: JSON.parse(historyStr)
          });
        }
      }

      const syncRes = await fetch('/api/user/sync-guest-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestProfile, guestConversations })
      });

      if (syncRes.ok) {
        localStorage.removeItem('atlas_guest_profile');
        document.cookie = 'atlas_guest_profile=; path=/; max-age=0; SameSite=Lax';
        toast.success("Sync complete! Your guest profile and chat history have been saved to your account. 🎉");
      }
    } catch (e) {
      console.error('[Guest Migration Error]', e);
    }
  };

  const handleContinueAsGuest = () => {
    localStorage.setItem('atlas_guest_warned', 'true');
    setShowSaveModal(false);
  };

  const loadConversationList = () => {
    try {
      const saved = localStorage.getItem('atlas_conversations');
      if (saved) {
        setConversations(JSON.parse(saved));
      } else {
        const defaultConv = [{ id: 'default', title: 'Default Conversation', createdAt: new Date().toISOString() }];
        setConversations(defaultConv);
        localStorage.setItem('atlas_conversations', JSON.stringify(defaultConv));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveConversationToList = (id: string, firstMessageText: string) => {
    try {
      const saved = localStorage.getItem('atlas_conversations');
      let list: Conversation[] = saved ? JSON.parse(saved) : [];
      
      const existingIdx = list.findIndex(c => c.id === id);
      const title = firstMessageText.length > 30 ? firstMessageText.slice(0, 30) + '...' : firstMessageText;
      
      if (existingIdx !== -1) {
        if (list[existingIdx].title === 'Default Conversation' || list[existingIdx].title === 'New Conversation') {
          list[existingIdx].title = title;
        }
      } else {
        list.unshift({
          id,
          title,
          createdAt: new Date().toISOString()
        });
      }
      
      setConversations(list);
      localStorage.setItem('atlas_conversations', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const loadMessagesHistory = async (id: string, beforeTimestamp?: string | null) => {
    if (historyLoading) return;
    setHistoryLoading(true);
    setHistoryError(false);

    try {
      const query = new URLSearchParams();
      query.set('conversationId', id);
      query.set('limit', '50');
      if (beforeTimestamp) {
        query.set('before', beforeTimestamp);
      }

      const res = await fetch(`/api/chat/history?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch history");

      const data = await res.json();
      if (data.success) {
        if (beforeTimestamp) {
          // Prepend older history
          setMessages(prev => [...data.messages, ...prev]);
        } else {
          // Fresh conversation load
          setMessages(data.messages);
        }
        setHasMoreHistory(data.hasMore);
        setNextCursor(data.nextCursor);
      } else {
        throw new Error(data.error || "Failed to parse history response");
      }
    } catch (e) {
      console.error('Error loading history:', e);
      setHistoryError(true);
      // If DB fails, load matching messages from localStorage (guest backup)
      if (!beforeTimestamp) {
        try {
          const guestHistory = localStorage.getItem(`atlas_chat_history_${id}`);
          if (guestHistory) {
            setMessages(JSON.parse(guestHistory));
          } else {
            setMessages([]);
          }
        } catch {}
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  // Start new conversation without deleting old ones
  const handleNewConversation = () => {
    const newId = crypto.randomUUID();
    setConversationId(newId);
    localStorage.setItem('atlas_current_conv_id', newId);
    setMessages([]);
    setHasMoreHistory(false);
    setNextCursor(null);
    setSidebarOpen(false);

    // Save to list
    const newConv = { id: newId, title: 'New Conversation', createdAt: new Date().toISOString() };
    setConversations(prev => [newConv, ...prev]);
    try {
      const saved = localStorage.getItem('atlas_conversations');
      let list = saved ? JSON.parse(saved) : [];
      list.unshift(newConv);
      localStorage.setItem('atlas_conversations', JSON.stringify(list));
    } catch {}
  };

  // Sync offline queue
  const syncOfflineQueue = async () => {
    try {
      const queued = localStorage.getItem(`atlas_offline_queue_${conversationId}`);
      if (!queued) return;

      const queue: Message[] = JSON.parse(queued);
      if (queue.length === 0) return;

      localStorage.removeItem(`atlas_offline_queue_${conversationId}`);

      for (const msg of queue) {
        await handleSend(msg.content, true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      // Remove placeholder loading if it exists at the end
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'assistant' && !last.content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    }
  };

  const handleSend = async (text: string, isFromQueue = false) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // If streaming, abort current before sending next
    if (isStreaming) {
      handleStopStream();
    }

    // Nudge guest on the 3rd user message
    const userMsgsCount = messages.filter(m => m.role === 'user').length;
    if (!isLoggedIn && userMsgsCount === 2 && !localStorage.getItem('atlas_guest_warned')) {
      setShowSaveModal(true);
    }

    const userMsgId = crypto.randomUUID();
    const newUserMsg: Message = {
      id: userMsgId,
      role: 'user',
      content: trimmed,
      status: isOnline ? 'sending' : 'sending', // will transition status
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');

    // If offline, queue message
    if (!isOnline) {
      newUserMsg.status = 'sending'; // show as sending placeholder
      try {
        const key = `atlas_offline_queue_${conversationId}`;
        const queue = JSON.parse(localStorage.getItem(key) || '[]');
        queue.push({ ...newUserMsg, content: trimmed });
        localStorage.setItem(key, JSON.stringify(queue));
      } catch {}
      return;
    }

    // Save to list title if first message
    if (messages.length === 0) {
      saveConversationToList(conversationId, trimmed);
    }

    await executeStream(trimmed, userMsgId);
  };

  const executeStream = async (text: string, userMsgId: string, retryAttempt = 0) => {
    setIsStreaming(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Save user message to database
    fetch('/api/chat/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'user', content: text, conversationId })
    }).catch(console.error);

    const assistantMsgId = crypto.randomUUID();
    const assistantPlaceholder: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString()
    };

    setMessages(prev => 
      prev.map(m => m.id === userMsgId ? { ...m, status: 'sent' as const } : m).concat(assistantPlaceholder)
    );

    try {
      // Gather active messages for context (filtering out placeholders)
      const currentHistory = messages
        .filter(m => m.content && m.id !== userMsgId)
        .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', content: m.content }));
      
      const payloadMessages = [...currentHistory, { role: 'user', content: text }];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          conversationId
        }),
        signal: controller.signal
      });

      // Handle Rate Limit 429
      if (res.status === 429) {
        if (retryAttempt === 0) {
          // Remove placeholder and show retry notification
          setMessages(prev => prev.slice(0, -1)); // Remove placeholder
          toast.info("Atlas is experiencing high demand. Retrying in 3 seconds...");
          setTimeout(() => {
            executeStream(text, userMsgId, 1);
          }, 3000);
          return;
        } else {
          throw new Error("Atlas is experiencing high demand. Please try again in a moment.");
        }
      }

      if (!res.ok) {
        throw new Error(`Server returned status code ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No readable stream response");

      const decoder = new TextDecoder();
      let accumulatedText = '';
      
      // Parse ReadableStream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        // Parse Next.js UI Stream response format
        const lines = chunk.split('\n').filter(Boolean);
        for (const line of lines) {
          if (line.startsWith('0:')) {
            // Strip out standard 0: stream envelope
            let rawContent = line.slice(2);
            // Handle quotes in response envelope
            if (rawContent.startsWith('"') && rawContent.endsWith('"')) {
              try {
                rawContent = JSON.parse(rawContent);
              } catch {}
            }
            accumulatedText += rawContent;
          } else {
            // Raw text chunk fallback
            accumulatedText += line;
          }
        }

        // Live update messages state
        setMessages(prev => 
          prev.map(m => m.id === assistantMsgId ? { ...m, content: accumulatedText } : m)
        );
      }

      // Empty response guard
      if (!accumulatedText.trim()) {
        accumulatedText = "I didn't catch that. Could you rephrase?";
        setMessages(prev => 
          prev.map(m => m.id === assistantMsgId ? { ...m, content: accumulatedText } : m)
        );
      }

      // Save assistant message to database
      fetch('/api/chat/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'assistant', content: accumulatedText, conversationId })
      }).catch(console.error);

      // Parse any :::profile blocks inside the response
      const profileRegex = /:::profile\s*([\s\S]*?)\s*:::/;
      const profileMatch = profileRegex.exec(accumulatedText);
      if (profileMatch) {
        try {
          const profileData = JSON.parse(profileMatch[1].trim());
          localStorage.setItem('atlas_guest_profile', JSON.stringify(profileData));
          document.cookie = `atlas_guest_profile=${encodeURIComponent(JSON.stringify(profileData))}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
          
          if (isLoggedIn) {
            fetch('/api/user/sync-guest-data', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ guestProfile: profileData })
            }).catch(console.error);
          }
        } catch (err) {
          console.error('Error parsing profile JSON:', err);
        }
      }

      // Backup full conversation history to localstorage for guest/offline recovery
      backupMessagesLocally(conversationId, text, accumulatedText);

    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.log('Streaming aborted by user');
        return;
      }
      console.error('Error during streaming:', e);
      
      // Mark user message as errored to display Retry prompt
      setMessages(prev => 
        prev.map(m => m.id === userMsgId ? { ...m, status: 'error' } : m)
      );

      // Remove assistant placeholder on complete failure
      setMessages(prev => prev.filter(m => m.id !== assistantMsgId));
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const backupMessagesLocally = (id: string, userText: string, assistantText: string) => {
    try {
      const key = `atlas_chat_history_${id}`;
      const saved = localStorage.getItem(key);
      let list = saved ? JSON.parse(saved) : [];
      list.push(
        { id: crypto.randomUUID(), role: 'user', content: userText, status: 'sent', createdAt: new Date().toISOString() },
        { id: crypto.randomUUID(), role: 'assistant', content: assistantText, createdAt: new Date().toISOString() }
      );
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}
  };

  const handleRetry = (erroredMsgId: string, text: string) => {
    // Remove errored user message + subsequent messages
    const idx = messages.findIndex(m => m.id === erroredMsgId);
    if (idx !== -1) {
      setMessages(prev => prev.slice(0, idx));
      handleSend(text);
    }
  };

  // Scroll behavior handlers
  const handleScroll = () => {
    if (!chatHistoryRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatHistoryRef.current;
    
    // User is scrolling up if the gap from bottom is > 100px
    const gap = scrollHeight - scrollTop - clientHeight;
    const isUp = gap > 100;
    
    isUserScrollingRef.current = isUp;
    if (!isUp) {
      setShowNewMessagesPill(false);
    }
  };

  useEffect(() => {
    if (!isUserScrollingRef.current) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (isStreaming) {
      setShowNewMessagesPill(true);
    }
  }, [messages, isStreaming]);

  const handleForceScrollBottom = () => {
    isUserScrollingRef.current = false;
    setShowNewMessagesPill(false);
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.chatInterface}>
      {/* Sidebar Conversation List */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <button className={styles.newChatBtn} onClick={handleNewConversation}>
            <Plus size={16} /> New Chat
          </button>
        </div>
        <div className={styles.conversationList}>
          {conversations.map(conv => (
            <button
              key={conv.id}
              className={`${styles.conversationItem} ${conversationId === conv.id ? styles.conversationItemActive : ''}`}
              onClick={() => {
                setConversationId(conv.id);
                localStorage.setItem('atlas_current_conv_id', conv.id);
                setSidebarOpen(false);
              }}
            >
              <span className={styles.convTitle}>{conv.title}</span>
              <span className={styles.convDate}>
                {new Date(conv.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className={styles.mainChat}>
        {/* Header */}
        <header className={styles.chatHeader}>
          <div className={styles.headerTitleInfo}>
            <button className={styles.sidebarToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={20} />
            </button>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Atlas AI Agent</h2>
            <div className={styles.statusDot} />
            <span className={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </header>

        {/* Offline Banner */}
        {!isOnline && (
          <div className={styles.offlineBanner}>
            <WifiOff size={16} />
            <span>You&apos;re offline. Messages will queue and send when connected.</span>
          </div>
        )}

        {/* Chat Message Stream */}
        <div 
          className={styles.chatHistory} 
          ref={chatHistoryRef}
          onScroll={handleScroll}
        >
          {/* History loading indicator & retry */}
          {hasMoreHistory && (
            <button
              className={styles.loadEarlierBtn}
              onClick={() => loadMessagesHistory(conversationId, nextCursor)}
              disabled={historyLoading}
            >
              {historyLoading ? 'Loading older messages...' : 'Load earlier messages'}
            </button>
          )}

          {historyError && (
            <div className={styles.historyRetryContainer}>
              <p style={{ margin: 0, color: 'var(--status-danger)' }}>Couldn&apos;t load conversation history.</p>
              <button 
                className={styles.inlineRetryBtn}
                onClick={() => loadMessagesHistory(conversationId)}
              >
                <RefreshCw size={12} style={{ marginRight: '4px' }} /> Retry Load
              </button>
            </div>
          )}

          {messages.length === 0 && !historyLoading && (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>✨</div>
              <h3 className={styles.emptyTitle}>Hi, I&apos;m Atlas.</h3>
              <p className={styles.emptyText}>Ask me any questions about global scholarships, internships, or building your profile strategy.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <MessageBubble
              key={msg.id || index}
              message={msg}
              onRetryLastMsg={() => handleRetry(msg.id, msg.content)}
              onAskMore={(oppTitle) => handleSend(`Tell me more about the "${oppTitle}"`)}
            />
          ))}

          {/* Thinking / Streaming loader at the bottom */}
          {isStreaming && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
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
                  <span className={styles.thinkingIndicator}>
                    <span className={styles.thinkingDot}>.</span>
                    <span className={styles.thinkingDot}>.</span>
                    <span className={styles.thinkingDot}>.</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* New messages pill */}
        {showNewMessagesPill && (
          <button className={styles.newMessagesPill} onClick={handleForceScrollBottom}>
            ⬇️ New messages
          </button>
        )}

        {/* Prompt Chips */}
        <PromptChips
          onSelectPrompt={(prompt) => handleSend(prompt)}
          visible={messages.length === 0}
        />

        {/* Chat Input */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={() => handleSend(input)}
          isLoading={isStreaming}
          onStop={handleStopStream}
        />
      </main>

      {/* Overlay to close sidebar on click (mobile layout) */}
      {sidebarOpen && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9,
            cursor: 'pointer'
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {showSaveModal && (
        <SaveProgressModal 
          onClose={() => setShowSaveModal(false)}
          onContinueAsGuest={handleContinueAsGuest}
        />
      )}
    </div>
  );
}
