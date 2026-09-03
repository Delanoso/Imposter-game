import { useState, useEffect } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { useMultiplayerRoom } from './hooks/useMultiplayerRoom';

import { HomeScreen } from './components/HomeScreen';
import { SetupScreen } from './components/SetupScreen';
import { CategorySelectScreen } from './components/CategorySelectScreen';
import { PassScreen } from './components/PassScreen';
import { RoleRevealScreen } from './components/RoleRevealScreen';
import { DiscussionCluesScreen } from './components/DiscussionCluesScreen';
import { VotingScreen } from './components/VotingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { HowToPlayModal } from './components/HowToPlayModal';
import { InstallAppModal } from './components/InstallAppModal';

import { MultiplayerJoinModal } from './components/MultiplayerJoinModal';
import { MultiplayerLobby } from './components/MultiplayerLobby';
import { MultiplayerRoleReveal } from './components/MultiplayerRoleReveal';
import { MultiplayerCluesScreen } from './components/MultiplayerCluesScreen';
import { MultiplayerVotingScreen } from './components/MultiplayerVotingScreen';
import { MultiplayerResultsScreen } from './components/MultiplayerResultsScreen';

export function App() {
  const {
    screen,
    setScreen,
    settings,
    updateSettings,
    players,
    handleSetPlayerCount,
    updatePlayerName,
    updatePlayerAvatar,
    allCategories,
    addCustomCategory,
    removeCustomCategory,
    activeRound,
    startNewRound,
    onCardRevealAcknowledge,
    timerSecondsLeft,
    setTimerSecondsLeft,
    isTimerRunning,
    setIsTimerRunning,
    startVotingPhase,
    votingTurnIndex,
    selectedVotePlayerId,
    setSelectedVotePlayerId,
    submitCurrentVote,
    skipToGroupDecision,
    handleImposterGuessWord,
    resetAllScores,
    showHowToPlayModal,
    setShowHowToPlayModal,
  } = useGameEngine();

  // Multiplayer Hook
  const {
    roomState,
    localPlayerId,
    localPlayer,
    isHost,
    errorMessage,
    setErrorMessage,
    selectedVoteId,
    setSelectedVoteId,
    createRoom,
    joinRoom,
    updateSettings: updateRoomSettings,
    toggleReady,
    startRound: startMultiplayerRound,
    markCardViewed,
    advanceToClues,
    toggleTimer: toggleMultiTimer,
    resetTimer: resetMultiTimer,
    startVoting: startMultiVoting,
    castVote,
    submitGroupDecision,
    submitImposterGuess,
    leaveRoom
  } = useMultiplayerRoom();

  const [showMultiJoinModal, setShowMultiJoinModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [initialRoomCode, setInitialRoomCode] = useState('');

  // Auto detect ?room=ABCD query param from invite link
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam) {
      setInitialRoomCode(roomParam.toUpperCase());
      setShowMultiJoinModal(true);
    }
  }, []);

  const handleToggleCategory = (id: string) => {
    const current = settings.selectedCategoryIds;
    if (current.includes(id)) {
      if (current.length > 1) {
        updateSettings({ selectedCategoryIds: current.filter(cid => cid !== id) });
      }
    } else {
      updateSettings({ selectedCategoryIds: [...current, id] });
    }
  };

  const handleSelectAllCategories = () => {
    if (settings.selectedCategoryIds.length === allCategories.length) {
      updateSettings({ selectedCategoryIds: [allCategories[0].id] });
    } else {
      updateSettings({ selectedCategoryIds: allCategories.map(c => c.id) });
    }
  };

  // -------------------------------------------------------------
  // ONLINE MULTIPLAYER RENDER BRANCH
  // -------------------------------------------------------------
  if (roomState && localPlayer && localPlayerId) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
        {roomState.phase === 'lobby' && (
          <MultiplayerLobby
            roomState={roomState}
            localPlayerId={localPlayerId}
            isHost={isHost}
            onUpdateSettings={updateRoomSettings}
            onToggleReady={toggleReady}
            onStartGame={startMultiplayerRound}
            onLeaveRoom={leaveRoom}
          />
        )}

        {roomState.phase === 'role-reveal' && (
          <MultiplayerRoleReveal
            roomState={roomState}
            localPlayer={localPlayer}
            isHost={isHost}
            onCardViewed={markCardViewed}
            onAdvanceToClues={advanceToClues}
          />
        )}

        {roomState.phase === 'clues' && (
          <MultiplayerCluesScreen
            roomState={roomState}
            localPlayer={localPlayer}
            isHost={isHost}
            onToggleTimer={toggleMultiTimer}
            onResetTimer={resetMultiTimer}
            onStartVoting={startMultiVoting}
          />
        )}

        {roomState.phase === 'voting' && (
          <MultiplayerVotingScreen
            roomState={roomState}
            localPlayer={localPlayer}
            isHost={isHost}
            selectedTargetId={selectedVoteId}
            onSelectTarget={setSelectedVoteId}
            onSubmitVote={castVote}
            onSubmitGroupDecision={submitGroupDecision}
          />
        )}

        {roomState.phase === 'results' && (
          <MultiplayerResultsScreen
            roomState={roomState}
            localPlayer={localPlayer}
            isHost={isHost}
            onPlayNextRound={startMultiplayerRound}
            onLeaveRoom={leaveRoom}
            onImposterGuess={submitImposterGuess}
          />
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // SINGLE PHONE PASS & PLAY RENDER BRANCH
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      {/* Dynamic Screen View */}
      {screen === 'home' && (
        <HomeScreen
          onNavigate={(scr) => setScreen(scr)}
          onStartQuickGame={startNewRound}
          onOpenHowToPlay={() => setShowHowToPlayModal(true)}
          onOpenMultiplayer={() => setShowMultiJoinModal(true)}
          onOpenInstallModal={() => setShowInstallModal(true)}
          settings={settings}
          playerCount={players.length}
        />
      )}

      {screen === 'setup' && (
        <SetupScreen
          settings={settings}
          onUpdateSettings={updateSettings}
          players={players}
          onSetPlayerCount={handleSetPlayerCount}
          onUpdatePlayerName={updatePlayerName}
          onUpdatePlayerAvatar={updatePlayerAvatar}
          onBack={() => setScreen('home')}
          onStartGame={startNewRound}
        />
      )}

      {screen === 'category-select' && (
        <CategorySelectScreen
          categories={allCategories}
          selectedIds={settings.selectedCategoryIds}
          onToggleCategory={handleToggleCategory}
          onSelectAll={handleSelectAllCategories}
          onAddCustomCategory={addCustomCategory}
          onRemoveCustomCategory={removeCustomCategory}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'pass-screen' && activeRound && (
        <PassScreen
          player={activeRound.players[activeRound.currentPlayerRevealIndex]}
          playerIndex={activeRound.currentPlayerRevealIndex}
          totalPlayers={activeRound.players.length}
          categoryName={activeRound.categoryName}
          onReadyToReveal={() => setScreen('role-reveal')}
        />
      )}

      {screen === 'role-reveal' && activeRound && (
        <RoleRevealScreen
          player={activeRound.players[activeRound.currentPlayerRevealIndex]}
          categoryName={activeRound.categoryName}
          onNext={onCardRevealAcknowledge}
          isLastPlayer={activeRound.currentPlayerRevealIndex === activeRound.players.length - 1}
        />
      )}

      {screen === 'discussion-clues' && activeRound && (
        <DiscussionCluesScreen
          categoryName={activeRound.categoryName}
          players={activeRound.players}
          firstPlayerIndex={activeRound.firstPlayerIndex}
          timerSecondsLeft={timerSecondsLeft}
          isTimerRunning={isTimerRunning}
          onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
          onResetTimer={() => setTimerSecondsLeft(settings.discussionTimeSeconds || 60)}
          onProceedToVoting={startVotingPhase}
        />
      )}

      {screen === 'voting' && activeRound && (
        <VotingScreen
          players={activeRound.players}
          currentVoterIndex={votingTurnIndex}
          selectedTargetId={selectedVotePlayerId}
          onSelectTarget={(id) => setSelectedVotePlayerId(id)}
          onSubmitVote={submitCurrentVote}
          onSkipToGroupDecision={skipToGroupDecision}
        />
      )}

      {screen === 'results' && activeRound && (
        <ResultsScreen
          roundData={activeRound}
          onPlayNextRound={startNewRound}
          onGoHome={() => setScreen('home')}
          onOpenLeaderboard={() => setScreen('leaderboard')}
          onImposterGuess={handleImposterGuessWord}
        />
      )}

      {screen === 'leaderboard' && (
        <LeaderboardScreen
          players={players}
          onResetScores={resetAllScores}
          onBack={() => setScreen('home')}
        />
      )}

      {/* Rules / How to play modal */}
      {showHowToPlayModal && (
        <HowToPlayModal onClose={() => setShowHowToPlayModal(false)} />
      )}

      {/* Install App / PWA Modal */}
      {showInstallModal && (
        <InstallAppModal onClose={() => setShowInstallModal(false)} />
      )}

      {/* Multiplayer Join / Create Modal */}
      {showMultiJoinModal && (
        <MultiplayerJoinModal
          initialRoomCode={initialRoomCode}
          onJoin={(code, name, avatar) => {
            joinRoom(code, name, avatar);
            setShowMultiJoinModal(false);
          }}
          onCreate={(name, avatar) => {
            createRoom(name, avatar);
            setShowMultiJoinModal(false);
          }}
          onClose={() => setShowMultiJoinModal(false)}
        />
      )}

      {/* Error alert toast */}
      {errorMessage && (
        <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50 bg-rose-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between animate-bounce">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="ml-2 p-1 font-black">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
