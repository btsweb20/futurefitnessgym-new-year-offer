import { useEffect } from 'react';

/**
 * UI-Level Source Protection Hook
 * This is intentional friction only - NOT security.
 * Prevents casual copying and misuse.
 */
export const useSourceProtection = () => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Block common keyboard shortcuts for viewing source
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl/Cmd + Shift + I (DevTools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl/Cmd + Shift + J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl/Cmd + Shift + C (Inspect Element)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      
      // F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl/Cmd + S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
    };

    // Prevent text selection (except for inputs/textareas)
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return true;
      }
      e.preventDefault();
      return false;
    };

    // Prevent image dragging
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent copy (except for inputs/textareas)
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return true;
      }
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);

    // Add CSS to prevent selection and dragging
    const style = document.createElement('style');
    style.id = 'source-protection-styles';
    style.textContent = `
      body {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }
      
      input, textarea {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      
      img {
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
        pointer-events: none;
      }
      
      /* Re-enable pointer events for interactive images */
      img.interactive {
        pointer-events: auto;
      }
    `;
    document.head.appendChild(style);

    // DevTools detection (soft mode) - DISABLED in development/preview
    // Only enable on production domain to avoid false positives in Lovable preview
    const isProduction = window.location.hostname.includes('futurefitnessgym') || 
                         (!window.location.hostname.includes('lovableproject.com') && 
                          !window.location.hostname.includes('localhost'));
    
    let devToolsOpen = false;
    const threshold = 200; // Increased threshold to reduce false positives
    
    const checkDevTools = () => {
      // Skip detection if not on production
      if (!isProduction) return;
      
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          showDevToolsWarning();
        }
      } else {
        if (devToolsOpen) {
          devToolsOpen = false;
          hideDevToolsWarning();
        }
      }
    };

    const showDevToolsWarning = () => {
      let overlay = document.getElementById('devtools-warning-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'devtools-warning-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          color: white;
          font-family: 'Poppins', sans-serif;
          text-align: center;
          padding: 20px;
        `;
        overlay.innerHTML = `
          <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
          <h2 style="font-size: 24px; margin-bottom: 10px; color: #39FF14;">Developer Tools Detected</h2>
          <p style="font-size: 16px; color: #888; max-width: 400px;">
            This experience is protected to ensure fair participation.
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            Please close developer tools to continue.
          </p>
        `;
        document.body.appendChild(overlay);
      }
    };

    const hideDevToolsWarning = () => {
      const overlay = document.getElementById('devtools-warning-overlay');
      if (overlay) {
        overlay.remove();
      }
    };

    // Check periodically
    const devToolsInterval = setInterval(checkDevTools, 1000);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      
      const styleElement = document.getElementById('source-protection-styles');
      if (styleElement) {
        styleElement.remove();
      }
      
      clearInterval(devToolsInterval);
      hideDevToolsWarning();
    };
  }, []);
};

export default useSourceProtection;
