'use client';

import React, { useState, useEffect } from 'react';
import styles from './Chat.module.css';

interface PromptChipsProps {
  onSelectPrompt: (promptText: string) => void;
  visible: boolean;
}

interface PromptItem {
  text: string;
  category: 'Discover' | 'Strategy' | 'Compare' | 'Plan';
  emoji: string;
}

const ALL_PROMPTS: PromptItem[] = [
  { text: "Find fully funded Master's scholarships in Europe for 2026.", category: 'Discover', emoji: '🎓' },
  { text: "Show me upcoming technology internships for international students.", category: 'Discover', emoji: '💼' },
  { text: "What funding opportunities are open for public health research?", category: 'Discover', emoji: '🔬' },
  
  { text: "Give me a step-by-step checklist to write a winning motivation letter.", category: 'Strategy', emoji: '📝' },
  { text: "How should I structure my resume for a competitive fellowship?", category: 'Strategy', emoji: '📄' },
  { text: "What strategies can help me secure a tuition waiver from professors?", category: 'Strategy', emoji: '💡' },
  
  { text: "Compare Rhodes and Chevening scholarships in terms of benefits and criteria.", category: 'Compare', emoji: '⚖️' },
  { text: "Should I apply for a Fellowship or a research assistantship?", category: 'Compare', emoji: '🔍' },
  { text: "Compare Germany and Canada for fully funded graduate study options.", category: 'Compare', emoji: '🌍' },
  
  { text: "Build a 6-month application roadmap for US graduate admissions.", category: 'Plan', emoji: '📅' },
  { text: "Draft an outreach email to potential academic supervisors.", category: 'Plan', emoji: '✉️' },
  { text: "Create a timeline for securing recommendation letters and taking exams.", category: 'Plan', emoji: '⏱️' }
];

export function PromptChips({ onSelectPrompt, visible }: PromptChipsProps) {
  const [activeTab, setActiveTab] = useState<'Discover' | 'Strategy' | 'Compare' | 'Plan'>('Discover');
  const [rotatedPrompts, setRotatedPrompts] = useState<PromptItem[]>([]);

  // Rotate randomly on mount
  useEffect(() => {
    const shuffled = [...ALL_PROMPTS].sort(() => 0.5 - Math.random());
    setRotatedPrompts(shuffled);
  }, [visible]);

  if (!visible) return null;

  const filteredPrompts = rotatedPrompts.filter(p => p.category === activeTab);

  const handleSurpriseMe = () => {
    const randomPrompt = ALL_PROMPTS[Math.floor(Math.random() * ALL_PROMPTS.length)];
    onSelectPrompt(randomPrompt.text);
  };

  const tabs: ('Discover' | 'Strategy' | 'Compare' | 'Plan')[] = ['Discover', 'Strategy', 'Compare', 'Plan'];

  return (
    <div className={styles.promptChipsContainer}>
      <div className={styles.categoryTabs}>
        <div className={styles.tabsList}>
          {tabs.map(tab => (
            <button
              key={tab}
              className={`${styles.tabButton} ${activeTab === tab ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className={styles.surpriseButton} onClick={handleSurpriseMe}>
          ✨ Surprise me
        </button>
      </div>

      <div className={styles.chipsGrid}>
        {filteredPrompts.slice(0, 3).map((prompt, idx) => (
          <button
            key={idx}
            className={styles.promptChip}
            onClick={() => onSelectPrompt(prompt.text)}
          >
            <span className={styles.chipEmoji}>{prompt.emoji}</span>
            <span className={prompt.text.length > 55 ? styles.chipTextLong : styles.chipText}>
              {prompt.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
