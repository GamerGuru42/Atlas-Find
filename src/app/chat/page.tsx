"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import { ChatMessage, AdviceCard } from '@/types/chat';
import { UserProfile, GoalStage, ContextPill } from '@/types/user';
import { MatchResult } from '@/types/opportunity';

const EMPTY_PROFILE: UserProfile = {
  nationality: null,
  fieldOfStudy: null,
  degreeLevel: null,
  gpa: null,
  fundingNeeds: null,
  targetCountries: [],
  targetRegions: [],
  workExperience: null,
  timeline: null,
  constraints: [],
  languages: [],
};

const GOAL_STAGES: { key: GoalStage; label: string }[] = [
  { key: 'goal_identified', label: 'Goal Set' },
  { key: 'profile_built', label: 'Profile Built' },
  { key: 'options_researched', label: 'Options Found' },
  { key: 'strategy_set', label: 'Strategy Set' },
  { key: 'documents_ready', label: 'Docs Ready' },
  { key: 'submitted', label: 'Submitted' },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [goalStage, setGoalStage] = useState<GoalStage>('goal_identified');
  const [contextPills, setContextPills] = useState<ContextPill[]>([]);
  const [agentSteps, setAgentSteps] = useState<{ label: string; status: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Show agent thinking steps
    setAgentSteps([
      { label: 'Parsing your intent...', status: 'running' },
    ]);

    try {
      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, history, profile, goalStage }),
      });

      setAgentSteps([
        { label: 'Parsing your intent', status: 'done' },
        { label: 'Searching verified database...', status: 'running' },
      ]);

      await new Promise((r) => setTimeout(r, 400));

      setAgentSteps([
        { label: 'Parsing your intent', status: 'done' },
        { label: 'Searching verified database', status: 'done' },
        { label: 'Scoring matches...', status: 'running' },
      ]);

      await new Promise((r) => setTimeout(r, 300));

      const data = await res.json();

      setAgentSteps([
        { label: 'Parsing your intent', status: 'done' },
        { label: 'Searching verified database', status: 'done' },
        { label: 'Scoring matches', status: 'done' },
        { label: 'Building response', status: 'done' },
      ]);

      await new Promise((r) => setTimeout(r, 200));

      if (data.response) {
        setMessages((prev) => [...prev, data.response]);
      }
      if (data.updatedProfile) {
        setProfile(data.updatedProfile);
      }
      if (data.goalStage) {
        setGoalStage(data.goalStage);
      }
      if (data.response?.contextPillsAdded) {
        setContextPills((prev) => {
          const existing = new Set(prev.map((p) => p.key));
          const newPills = data.response.contextPillsAdded.filter(
            (p: ContextPill) => !existing.has(p.key)
          );
          return [...prev, ...newPills];
        });
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'agent',
          content: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setAgentSteps([]);
    }
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
  };

  const goalIndex = GOAL_STAGES.findIndex((s) => s.key === goalStage);

  return (
    <div className={styles.chatContainer}>
      <main className={styles.mainChat}>
        {/* Context Pills */}
        {contextPills.length > 0 && (
          <div className={styles.contextPillsBar}>
            <span className={styles.contextPillsLabel}>I know:</span>
            {contextPills.map((pill) => (
              <span key={pill.key} className={styles.contextPill}>
                <span>{pill.icon}</span> {pill.label}
              </span>
            ))}
          </div>
        )}

        {/* Goal Progress Bar */}
        <div className={styles.goalBar}>
          {GOAL_STAGES.map((stage, i) => (
            <div
              key={stage.key}
              className={`${styles.goalStage} ${i <= goalIndex ? styles.goalStageActive : ''} ${stage.key === goalStage ? styles.goalStageCurrent : ''}`}
            >
              <div className={styles.goalDot}>
                {i < goalIndex ? '✓' : i === goalIndex ? (i + 1) : (i + 1)}
              </div>
              <span className={styles.goalLabel}>{stage.label}</span>
            </div>
          ))}
          <div className={styles.goalLine}>
            <div
              className={styles.goalLineFill}
              style={{ width: `${(goalIndex / (GOAL_STAGES.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Chat Messages */}
        <div className={styles.chatHistory}>
          {messages.length === 0 && !isLoading && (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17" />
                  <path d="M2 12L12 17L22 12" />
                </svg>
              </div>
              <h2 className={styles.emptyTitle}>I&apos;m AtlasFind</h2>
              <p className={styles.emptyText}>
                Tell me about yourself — your education level, field of study, and preferred continents.
                I&apos;ll find verified opportunities that match your profile.
              </p>
              <div className={styles.suggestionChips}>
                {[
                  "I'm a Nigerian CS grad with 3.7 GPA, looking for funded Masters in Europe",
                  "Find me PhD scholarships in North America for engineering",
                  "What scholarships can I get for Asia?",
                ].map((q) => (
                  <button
                    key={q}
                    className={styles.suggestionChip}
                    onClick={() => handleSuggestionClick(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.messageRow} ${msg.role === 'user' ? styles.messageUser : styles.messageAgent}`}>
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
                <p className={styles.messageText}>{msg.content}</p>

                {/* Opportunity Cards */}
                {msg.opportunityCards && msg.opportunityCards.length > 0 && (
                  <div className={styles.cardsContainer}>
                    {msg.opportunityCards.map((match: MatchResult) => (
                      <div key={match.opportunity.id} className={styles.oppCard}>
                        <div className={styles.oppCardHeader}>
                          <div className={styles.oppCardTitleRow}>
                            <h4 className={styles.oppCardTitle}>{match.opportunity.title}</h4>
                            <div className={`${styles.matchBadge} ${styles[`match${match.tier.replace('_', '')}`] || ''}`}>
                              <span className={styles.matchScore}>{match.score}%</span>
                            </div>
                          </div>
                          <p className={styles.oppCardSponsor}>{match.opportunity.sponsor}</p>
                        </div>

                        <div className={styles.oppCardMeta}>
                          <span>📍 {match.opportunity.hostCountry}</span>
                          <span>🎓 {match.opportunity.degreeLevel.join(', ')}</span>
                          <span>💰 {match.opportunity.fundingType.replace('_', ' ')}</span>
                        </div>

                        {/* Coverage */}
                        <div className={styles.coverageRow}>
                          {match.opportunity.coverage.tuition && <span className={styles.coverageYes}>✓ Tuition</span>}
                          {match.opportunity.coverage.travel && <span className={styles.coverageYes}>✓ Travel</span>}
                          {match.opportunity.coverage.living && <span className={styles.coverageYes}>✓ Living</span>}
                          {match.opportunity.coverage.insurance && <span className={styles.coverageYes}>✓ Insurance</span>}
                          {!match.opportunity.coverage.travel && <span className={styles.coverageNo}>✗ Travel</span>}
                          {!match.opportunity.coverage.living && <span className={styles.coverageNo}>✗ Living</span>}
                        </div>

                        {match.opportunity.coverage.stipendAmount && (
                          <p className={styles.stipend}>{match.opportunity.coverage.stipendAmount}</p>
                        )}

                        {/* Why You Match */}
                        {match.reasons.whyYouMatch.length > 0 && (
                          <div className={styles.reasonsBox}>
                            <span className={styles.reasonsTitle}>Why you match:</span>
                            {match.reasons.whyYouMatch.map((r, i) => (
                              <span key={i} className={styles.reasonGood}>✓ {r}</span>
                            ))}
                          </div>
                        )}
                        {match.reasons.whyYouDont.length > 0 && (
                          <div className={styles.reasonsBox}>
                            <span className={styles.reasonsTitle}>Watch out:</span>
                            {match.reasons.whyYouDont.map((r, i) => (
                              <span key={i} className={styles.reasonBad}>⚠ {r}</span>
                            ))}
                          </div>
                        )}

                        {/* Verification + Source + Deadline */}
                        <div className={styles.oppCardFooter}>
                          <div className={styles.verifiedBadge}>
                            <span className={styles.verifiedDot} />
                            Verified · {match.opportunity.sourceDomain}
                          </div>
                          <div className={styles.deadline}>
                            ⏰ Deadline: {new Date(match.opportunity.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>

                        <div className={styles.oppCardActions}>
                          <a href={match.opportunity.applyUrl} target="_blank" rel="noopener noreferrer" className={styles.applyBtn}>
                            Apply →
                          </a>
                          <a href={match.opportunity.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.sourceBtn}>
                            View Source
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Advice Cards */}
                {msg.adviceCards && msg.adviceCards.length > 0 && (
                  <div className={styles.adviceContainer}>
                    {msg.adviceCards.map((advice: AdviceCard, i: number) => (
                      <div key={i} className={`${styles.adviceCard} ${styles[`advice${advice.priority}`] || ''}`}>
                        <div className={styles.adviceHeader}>
                          <span className={styles.adviceIcon}>{advice.icon}</span>
                          <span className={styles.advicePriority}>{advice.priority}</span>
                        </div>
                        <h4 className={styles.adviceTitle}>{advice.title}</h4>
                        <p className={styles.adviceBody}>{advice.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Questions */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className={styles.suggestionsInline}>
                    {msg.suggestedQuestions.map((q, i) => (
                      <button key={i} className={styles.suggestionChip} onClick={() => handleSuggestionClick(q)}>
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Agent Thinking Indicator */}
          {isLoading && (
            <div className={`${styles.messageRow} ${styles.messageAgent}`}>
              <div className={styles.agentAvatar}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17" />
                  <path d="M2 12L12 17L22 12" />
                </svg>
              </div>
              <div className={styles.thinkingContainer}>
                {agentSteps.map((step, i) => (
                  <div key={i} className={`${styles.thinkingStep} ${step.status === 'done' ? styles.thinkingDone : styles.thinkingRunning}`}>
                    {step.status === 'done' ? '✓' : '⟳'} {step.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className={styles.inputArea}>
          <form className={styles.inputWrapper} onSubmit={handleSubmit}>
            <input
              type="text"
              className={styles.input}
              placeholder="Tell me what you're looking for..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
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

      {/* Memory / Profile Panel */}
      <aside className={styles.memoryPanel}>
        <h3 className={styles.panelTitle}>Your Profile</h3>

        {Object.values(profile).every((v) => v === null || (Array.isArray(v) && v.length === 0)) ? (
          <p className={styles.panelEmpty}>I&apos;ll build your profile here as we talk.</p>
        ) : (
          <div className={styles.profileFields}>
            {profile.nationality && <ProfileField label="Nationality" value={profile.nationality} icon="🌍" />}
            {profile.fieldOfStudy && <ProfileField label="Field" value={profile.fieldOfStudy} icon="📚" />}
            {profile.degreeLevel && <ProfileField label="Degree" value={profile.degreeLevel} icon="🎓" />}
            {profile.gpa && <ProfileField label="GPA" value={`${profile.gpa.value}/${profile.gpa.scale}`} icon="📊" />}
            {profile.fundingNeeds && <ProfileField label="Funding" value={profile.fundingNeeds.replace('_', ' ')} icon="💰" />}
            {profile.workExperience && <ProfileField label="Experience" value={`${profile.workExperience.years}yr — ${profile.workExperience.field || profile.workExperience.details || 'Professional'}`} icon="💼" />}
            {profile.targetRegions.length > 0 && <ProfileField label="Target" value={profile.targetRegions.join(', ')} icon="🗺️" />}
            {profile.targetCountries.length > 0 && <ProfileField label="Countries" value={profile.targetCountries.join(', ')} icon="📍" />}
          </div>
        )}

        {/* Competitiveness Score */}
        {profile.nationality && (
          <div className={styles.competitiveness}>
            <h4 className={styles.panelSubtitle}>Profile Strength</h4>
            <div className={styles.strengthBar}>
              <div
                className={styles.strengthFill}
                style={{ width: `${getProfileStrength(profile)}%` }}
              />
            </div>
            <span className={styles.strengthLabel}>
              {getProfileStrength(profile)}% — {getProfileStrength(profile) >= 70 ? 'Strong' : getProfileStrength(profile) >= 40 ? 'Building' : 'Getting started'}
            </span>
          </div>
        )}
      </aside>
    </div>
  );
}

function ProfileField({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-light)' }}>
      <span>{icon}</span>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  );
}

function getProfileStrength(profile: UserProfile): number {
  let strength = 0;
  if (profile.nationality) strength += 15;
  if (profile.fieldOfStudy) strength += 15;
  if (profile.degreeLevel) strength += 15;
  if (profile.gpa) strength += 15;
  if (profile.fundingNeeds) strength += 10;
  if (profile.workExperience) strength += 15;
  if (profile.targetCountries.length > 0 || profile.targetRegions.length > 0) strength += 10;
  if (profile.languages.length > 0) strength += 5;
  return Math.min(100, strength);
}
