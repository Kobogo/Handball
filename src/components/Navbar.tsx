import { useState } from 'react';

interface NavbarProps {
  currentView: 'tracker' | 'history';
  onNavigate: (view: 'tracker' | 'history') => void;
  onOpenModal: () => void;
}

export function Navbar({ currentView, onNavigate, onOpenModal }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = (view: 'tracker' | 'history') => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <nav className="top-nav">
      <div className="nav-content">
        <span className="nav-logo" onClick={() => onNavigate('tracker')}>
          MålmandStats 🤾
        </span>
        <button className="burger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {isMenuOpen && (
        <div className="nav-menu">
          {/* Vis kun "Se Historik" hvis vi er på tælleren */}
          {currentView === 'tracker' && (
            <>
              <button onClick={() => handleLinkClick('history')}>📊 Se Historik</button>
              <button onClick={() => { onOpenModal(); setIsMenuOpen(false); }}>🆕 Start Ny Kamp</button>
            </>
          )}

          {/* Vis kun "Tilbage til tæller" hvis vi er i historikken */}
          {currentView === 'history' && (
            <button onClick={() => handleLinkClick('tracker')}>🏠 Tilbage til tæller</button>
          )}
        </div>
      )}
    </nav>
  );
}