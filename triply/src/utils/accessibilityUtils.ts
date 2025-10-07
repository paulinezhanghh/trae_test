/**
 * Utility functions for accessibility features
 */

// Skip to content functionality
export const skipToContent = (contentId: string): void => {
  const contentElement = document.getElementById(contentId);
  if (contentElement) {
    contentElement.tabIndex = -1;
    contentElement.focus();
  }
};

// Keyboard navigation helper for custom components
export const handleKeyboardNavigation = (
  event: React.KeyboardEvent,
  onEnterAction?: () => void,
  onSpaceAction?: () => void,
  onEscapeAction?: () => void
): void => {
  switch (event.key) {
    case 'Enter':
      if (onEnterAction) {
        event.preventDefault();
        onEnterAction();
      }
      break;
    case ' ':
      if (onSpaceAction) {
        event.preventDefault();
        onSpaceAction();
      }
      break;
    case 'Escape':
      if (onEscapeAction) {
        event.preventDefault();
        onEscapeAction();
      }
      break;
    default:
      break;
  }
};

// Announce messages to screen readers
export const announceToScreenReader = (message: string, politeness: 'polite' | 'assertive' = 'polite'): void => {
  // Create or get the aria-live region
  let ariaLiveRegion = document.getElementById(`aria-live-${politeness}`);
  
  if (!ariaLiveRegion) {
    ariaLiveRegion = document.createElement('div');
    ariaLiveRegion.id = `aria-live-${politeness}`;
    ariaLiveRegion.setAttribute('aria-live', politeness);
    ariaLiveRegion.setAttribute('aria-atomic', 'true');
    ariaLiveRegion.classList.add('sr-only'); // Screen reader only
    document.body.appendChild(ariaLiveRegion);
  }
  
  // Set the message
  ariaLiveRegion.textContent = message;
  
  // Clear the message after a delay (optional)
  setTimeout(() => {
    if (ariaLiveRegion) {
      ariaLiveRegion.textContent = '';
    }
  }, 5000);
};

// Focus trap for modals and dialogs
export const createFocusTrap = (containerRef: React.RefObject<HTMLElement>): {
  activate: () => void;
  deactivate: () => void;
} => {
  let previouslyFocusedElement: HTMLElement | null = null;
  
  const activate = (): void => {
    previouslyFocusedElement = document.activeElement as HTMLElement;
    
    if (containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  };
  
  const deactivate = (): void => {
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  };
  
  return { activate, deactivate };
};

// High contrast mode detection
export const isHighContrastMode = (): boolean => {
  // This is a simple detection method, might not work in all browsers
  const testElement = document.createElement('div');
  testElement.style.color = 'windowText';
  testElement.style.backgroundColor = 'window';
  document.body.appendChild(testElement);
  
  const computedStyle = window.getComputedStyle(testElement);
  const colorValue = computedStyle.color;
  const backgroundValue = computedStyle.backgroundColor;
  
  document.body.removeChild(testElement);
  
  // In high contrast mode, these values will be different from the CSS values
  return colorValue !== 'rgb(0, 0, 0)' || backgroundValue !== 'rgb(255, 255, 255)';
};

// Get appropriate contrast color for text based on background
export const getContrastTextColor = (backgroundColor: string): string => {
  // Convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Calculate relative luminance
  const getLuminance = (rgb: { r: number; g: number; b: number }): number => {
    const a = [rgb.r, rgb.g, rgb.b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#000000'; // Default to black if invalid hex

  const luminance = getLuminance(rgb);
  return luminance > 0.5 ? '#000000' : '#FFFFFF'; // Dark text for light backgrounds, light text for dark backgrounds
};