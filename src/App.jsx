import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import DisclaimerBanner from './components/DisclaimerBanner.jsx'
import PrototypeBanner from './components/PrototypeBanner.jsx'
import BottomNav from './components/BottomNav.jsx'
import HomePage from './pages/HomePage.jsx'
import VisaSearchPage from './pages/VisaSearchPage.jsx'
import CopilotPage from './pages/CopilotPage.jsx'
import CommunityInsightsPage from './pages/CommunityInsightsPage.jsx'

export default function App() {
  // Simple state-based client routing (PRD Section 9).
  const [view, setView] = useState('home')
  const [selectedPurpose, setSelectedPurpose] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Copilot chat state lives here so history survives tab switches.
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pendingQuestion, setPendingQuestion] = useState(null)

  const checkRequirements = (purpose) => {
    setSelectedPurpose(purpose)
    setView('search')
  }

  const askCopilotQuestion = (question) => {
    setPendingQuestion(question)
    setView('copilot')
  }

  return (
    <div className="app">
      <Sidebar
        view={view}
        onNavigate={setView}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((c) => !c)}
      />
      <div className="main">
        <PrototypeBanner />
        <TopBar view={view} />
        <DisclaimerBanner />
        <main
          className={`page-content${view === 'copilot' ? ' page-content--fill' : ''}`}
        >
          {view === 'home' && (
            <HomePage
              onCheckRequirements={checkRequirements}
              onAskCopilot={askCopilotQuestion}
            />
          )}
          {view === 'search' && (
            <VisaSearchPage
              key={selectedPurpose}
              purpose={selectedPurpose}
              onPurposeChange={setSelectedPurpose}
            />
          )}
          {view === 'copilot' && (
            <CopilotPage
              messages={messages}
              setMessages={setMessages}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              pendingQuestion={pendingQuestion}
              onPendingQuestionConsumed={() => setPendingQuestion(null)}
              onNavigateToSearch={() => setView('search')}
            />
          )}
          {view === 'insights' && <CommunityInsightsPage />}
        </main>
      </div>
      <BottomNav view={view} onNavigate={setView} />
    </div>
  )
}
