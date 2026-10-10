'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Menu, X, Sun, Moon, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Logo } from './Logo';

// Command palette is keyboard-driven and heavy — load after shell paints
const CommandPalette = dynamic(
  () => import('./CommandPalette').then((m) => ({ default: m.CommandPalette })),
  { ssr: false }
);

const LINKS = [
  { href: '/programs', label: 'Programs' },
  { href: '/organizations', label: 'Organizations' },
  { href: '/projects', label: 'Projects' },
  { href: '/proposal-studio', label: 'Proposal Studio' },
  { href: '/resources', label: 'Resources' },
  { href: '/matcher', label: 'Orbit AI', isAi: true },
  { href: '/dashboard', label: 'Dashboard' },
];

export function Navbar({ authButton }: { authButton?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isDark = (resolvedTheme || theme) === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-close menu on navigation without cascading effect renders
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  return (
    <header className="fixed top-2.5 sm:top-3 left-0 right-0 z-50 px-3 sm:px-4 lg:px-6 pointer-events-none flex justify-center">
      <div className={`w-full max-w-[1400px] bg-surface/85 dark:bg-[#18110D]/85 backdrop-blur-md border border-hairline rounded-full px-3.5 sm:px-5 lg:px-5 py-1.5 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all pointer-events-auto relative z-50 ${isScrolled ? 'border-hairline shadow-[0_12px_40px_rgba(0,0,0,0.06)]' : ''}`}>
        
        {/* Logo with Branch Monogram (Left) */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 mr-2 lg:mr-3 xl:mr-5 group">
            <Logo className="w-9 h-9 sm:w-10 sm:h-10 transition-transform group-hover:scale-105 shrink-0" />
            <span className="font-extrabold text-lg sm:text-xl text-primary font-sans tracking-tight group-hover:text-accent transition-colors">
              Contri<span className="text-accent">bo</span>
            </span>
          </Link>
        </div>
        
        {/* Navigation Links (Center) — active from lg (1024px, all Mac and laptop screens) */}
        <nav className="hidden lg:flex items-center justify-center flex-1 gap-1 xl:gap-2.5 2xl:gap-4 text-[13px] lg:text-[13px] xl:text-[14px] 2xl:text-[14.5px] font-medium">
          {LINKS.map(link => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`relative px-2.5 xl:px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap flex items-center gap-1 ${
                  isActive 
                    ? 'text-accent font-semibold bg-accent/10 dark:bg-accent/15 border border-accent/25 shadow-2xs' 
                    : 'text-secondary hover:text-primary hover:bg-surface-raised/80 font-medium'
                }`}
              >
                {link.isAi && (
                  <Sparkles size={13} className="text-accent shrink-0 animate-pulse" />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        {/* Right Controls (Theme Toggle & AuthButton) */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
          {/* Segmented Theme Switcher on wide screens (xl+), Single sleek toggle on laptop screens (lg) */}
          {mounted ? (
            <>
              {/* Dual-segmented on xl+ */}
              <div 
                role="radiogroup" 
                aria-label="Theme switcher"
                className="hidden xl:flex items-center p-1 rounded-full border border-hairline/80 bg-surface-raised/70 shadow-2xs backdrop-blur-xs gap-0.5"
              >
                <button
                  onClick={() => setTheme('light')}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    !isDark
                      ? 'bg-surface text-amber-500 shadow-xs border border-hairline/70 scale-105'
                      : 'text-muted hover:text-primary hover:scale-105'
                  }`}
                  aria-label="Switch to light mode"
                  title="Light mode"
                >
                  <Sun size={15} className="transition-transform duration-200" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    isDark
                      ? 'bg-surface text-sky-400 shadow-xs border border-hairline/70 scale-105'
                      : 'text-muted hover:text-primary hover:scale-105'
                  }`}
                  aria-label="Switch to dark mode"
                  title="Dark mode"
                >
                  <Moon size={14} className="transition-transform duration-200" />
                </button>
              </div>

              {/* Compact single toggle on lg screens (MacBooks / compact laptops) */}
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="flex xl:hidden w-8.5 h-8.5 items-center justify-center border border-hairline/80 rounded-full bg-surface-raised/60 hover:bg-surface-raised transition-all cursor-pointer text-secondary hover:text-primary shadow-2xs active:scale-95"
                aria-label="Toggle theme"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <Sun size={16} className="text-amber-400" />
                ) : (
                  <Moon size={15} className="text-secondary" />
                )}
              </button>
            </>
          ) : (
            <div className="w-8.5 h-8.5 rounded-full border border-hairline/50 bg-surface-raised/40 animate-pulse" />
          )}
          
          {authButton && <div className="ml-0.5 pl-2.5 xl:pl-3 border-l border-hairline/80">{authButton}</div>}
        </div>

        {/* Global search command palette */}
        <CommandPalette hideTrigger={true} />
        
        {/* Mobile & Tablet Menu Button & Controls (< lg, e.g. phones and portrait tablets) */}
        <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
          {mounted ? (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="w-10 h-10 flex items-center justify-center border border-hairline rounded-full bg-surface/70 hover:bg-surface-raised transition-all duration-200 cursor-pointer shadow-2xs text-secondary hover:text-primary active:scale-95"
              aria-label="Toggle theme"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun size={18} className="text-amber-400 transition-transform duration-300" />
              ) : (
                <Moon size={17} className="text-secondary transition-transform duration-300" />
              )}
            </button>
          ) : (
            <div className="w-10 h-10 rounded-full border border-hairline bg-surface-raised/40 animate-pulse" />
          )}
          
          {authButton && <div>{authButton}</div>}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 flex items-center justify-center text-muted hover:text-primary hover:bg-surface-raised/50 border border-hairline rounded-full transition-all focus:outline-none cursor-pointer shadow-2xs active:scale-95"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay to dismiss on tap */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-xs z-40 pointer-events-auto"
        />
      )}

      {/* Mobile & Tablet Dropdown Card */}
      {isOpen && (
        <div className="lg:hidden fixed top-[68px] left-4 right-4 z-50 pointer-events-auto border border-hairline bg-surface/98 dark:bg-[#18110D]/98 backdrop-blur-xl rounded-2xl shadow-2xl p-2.5 animate-[fade_0.2s_ease-out_forwards]">
          <div className="flex flex-col gap-1">
            {LINKS.map(link => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all pointer-events-auto cursor-pointer ${
                    isActive 
                      ? 'text-accent bg-accent/10 font-bold border border-accent/20' 
                      : 'text-primary hover:bg-surface-raised active:bg-surface-raised'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isAi && (
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
                      AI Powered
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
