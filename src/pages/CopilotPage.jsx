import { useEffect, useRef, useState } from 'react'
import TrustBadge from '../components/TrustBadge.jsx'
import { MessageCircleIcon, SendIcon } from '../components/Icons.jsx'
import {
  askCopilot,
  parseCopilotResponse,
  COPILOT_UNAVAILABLE_MESSAGE,
} from '../api/copilot.js'
import { COPILOT_SUGGESTED_QUESTIONS } from '../data/visaData.js'

// Matches the server-side cap in api/copilot.js (keeps requests within the
// free-tier token budget).
const MAX_HISTORY_MESSAGES = 10

function AIResponse({ message }) {
  if (message.error) {
    return <p className="ai-bubble__error">{COPILOT_UNAVAILABLE_MESSAGE}</p>
  }
  const { parsed, content } = message
  if (!parsed) {
    // Model replied with something unparseable — show it raw rather than nothing.
    return <p className="ai-bubble__section-text">{content}</p>
  }
  const sections = [
    { key: 'verified', variant: 'verified' },
    { key: 'community', variant: 'community' },
    { key: 'recommendation', variant: 'ai' },
  ]
  return (
    <div className="ai-bubble__sections">
      {sections.map(({ key, variant }) =>
        parsed[key] ? (
          <section key={key} className="ai-bubble__section">
            <TrustBadge variant={variant} />
            <p className="ai-bubble__section-text">{parsed[key]}</p>
          </section>
        ) : null,
      )}
    </div>
  )
}

export default function CopilotPage({
  messages,
  setMessages,
  isLoading,
  setIsLoading,
  pendingQuestion,
  onPendingQuestionConsumed,
  onNavigateToSearch,
}) {
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef(null)
  const messagesRef = useRef(messages)
  messagesRef.current = messages

  const sendQuestion = async (question) => {
    const text = question.trim()
    if (!text || isLoading) return

    const userMessage = { role: 'user', content: text }
    const nextMessages = [...messagesRef.current, userMessage]
    setMessages(nextMessages)
    setInputValue('')
    setIsLoading(true)

    try {
      // Multi-turn: pass the full conversation history on each call,
      // skipping failed turns (they have no content for the API).
      const history = nextMessages
        .filter((m) => !m.error && m.content)
        .map(({ role, content }) => ({ role, content }))
        .slice(-MAX_HISTORY_MESSAGES)
      while (history.length > 1 && history[0].role === 'assistant') history.shift()
      const raw = await askCopilot(history)
      const parsed = parseCopilotResponse(raw)
      setMessages([...nextMessages, { role: 'assistant', content: raw, parsed }])
    } catch {
      setMessages([...nextMessages, { role: 'assistant', content: '', error: true }])
    } finally {
      setIsLoading(false)
    }
  }

  // A question handed over from the Home page is sent immediately.
  useEffect(() => {
    if (pendingQuestion) {
      onPendingQuestionConsumed()
      sendQuestion(pendingQuestion)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuestion])

  // Keep the newest message in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSubmit = (e) => {
    e.preventDefault()
    sendQuestion(inputValue)
  }

  return (
    <div className="copilot">
      {/* Suggested Questions panel */}
      <aside className="copilot__suggestions" aria-label="Suggested questions">
        <div className="copilot__suggestions-label">Suggested Questions</div>
        <div className="copilot__suggestions-list">
          {COPILOT_SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              className="suggestion-pill"
              onClick={() => sendQuestion(q)}
              disabled={isLoading}
            >
              {q}
            </button>
          ))}
        </div>
      </aside>

      {/* Chat interface */}
      <div className="copilot__chat">
        <div className="copilot__tip-banner" role="note">
          <span>
            💡 For exact fees, always confirm on the{' '}
            <strong>Visa Search</strong> page — the Copilot's numbers can be
            wrong.
          </span>
          <button type="button" className="copilot__tip-link" onClick={onNavigateToSearch}>
            Go to Visa Search
          </button>
        </div>

        <div className="copilot__messages" ref={scrollRef}>
          {messages.length === 0 && !isLoading ? (
            <div className="copilot__empty">
              <MessageCircleIcon size={56} />
              <p className="copilot__empty-title">
                Ask any question about the UK Standard Visitor Visa.
              </p>
              <p className="copilot__empty-sub">
                Every answer is structured by verified requirements, community
                experience, and AI guidance.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) =>
                message.role === 'user' ? (
                  <div key={index} className="chat-bubble chat-bubble--user">
                    {message.content}
                  </div>
                ) : (
                  <div key={index} className="chat-bubble chat-bubble--ai">
                    <AIResponse message={message} />
                  </div>
                ),
              )}
              {isLoading && (
                <div className="chat-bubble chat-bubble--ai" aria-label="AI Copilot is typing">
                  <div className="typing-indicator">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <form className="copilot__input-bar" onSubmit={handleSubmit}>
          <input
            className="copilot__input"
            type="text"
            placeholder="Ask about UK visa requirements, documents, funds…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            maxLength={1000}
            aria-label="Ask the AI Copilot a question"
          />
          <button
            type="submit"
            className="btn btn--primary copilot__send"
            disabled={isLoading || !inputValue.trim()}
          >
            <SendIcon size={14} /> Send
          </button>
        </form>
      </div>
    </div>
  )
}
