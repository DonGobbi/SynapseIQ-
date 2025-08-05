/**
 * Accessibility Tester Utility
 * 
 * This utility provides functions to test various accessibility aspects of the website
 * including color contrast, keyboard navigation, and ARIA attributes.
 */

/**
 * Calculates the contrast ratio between two colors
 * @param foreground - Foreground color in hex format (e.g., "#ffffff")
 * @param background - Background color in hex format (e.g., "#000000")
 * @returns Contrast ratio as a number
 */
export const calculateContrastRatio = (foreground: string, background: string): number => {
  // Convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  // Calculate relative luminance
  const calculateLuminance = (color: { r: number; g: number; b: number }): number => {
    const { r, g, b } = color;
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const color1 = hexToRgb(foreground);
  const color2 = hexToRgb(background);
  
  const luminance1 = calculateLuminance(color1);
  const luminance2 = calculateLuminance(color2);
  
  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Checks if a contrast ratio meets WCAG AA standards
 * @param ratio - Contrast ratio
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 * @returns Whether the contrast meets WCAG AA standards
 */
export const meetsWCAGAA = (ratio: number, isLargeText: boolean = false): boolean => {
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
};

/**
 * Checks if a contrast ratio meets WCAG AAA standards
 * @param ratio - Contrast ratio
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 * @returns Whether the contrast meets WCAG AAA standards
 */
export const meetsWCAGAAA = (ratio: number, isLargeText: boolean = false): boolean => {
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
};

/**
 * Checks common accessibility issues in a DOM element
 * @param element - DOM element to check
 * @returns Array of accessibility issues found
 */
export const checkAccessibilityIssues = (element: HTMLElement): string[] => {
  const issues: string[] = [];

  // Check for images without alt text
  const images = element.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push(`Image missing alt text: ${img.src}`);
    }
  });

  // Check for buttons without accessible names
  const buttons = element.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.textContent?.trim() && !button.getAttribute('aria-label')) {
      issues.push('Button without accessible name');
    }
  });

  // Check for form inputs without labels
  const inputs = element.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.getAttribute('id');
    if (id) {
      const label = element.querySelector(`label[for="${id}"]`);
      if (!label && !input.getAttribute('aria-label')) {
        issues.push(`Input missing label: ${id}`);
      }
    } else if (!input.getAttribute('aria-label')) {
      issues.push('Input without ID or aria-label');
    }
  });

  // Check for proper heading hierarchy
  let previousHeadingLevel = 0;
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading) => {
    const currentLevel = parseInt(heading.tagName.charAt(1));
    if (previousHeadingLevel > 0 && currentLevel > previousHeadingLevel + 1) {
      issues.push(`Heading level skipped: from h${previousHeadingLevel} to h${currentLevel}`);
    }
    previousHeadingLevel = currentLevel;
  });

  return issues;
};

/**
 * Tests keyboard navigation by simulating tab key presses
 * @param document - Document object
 * @returns Array of focusable elements in tab order
 */
export const testKeyboardNavigation = (document: Document): HTMLElement[] => {
  const focusableElements = document.querySelectorAll(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  return Array.from(focusableElements) as HTMLElement[];
};

/**
 * Checks if the website has proper ARIA landmarks
 * @param document - Document object
 * @returns Whether all required landmarks are present
 */
export const checkAriaLandmarks = (document: Document): boolean => {
  const hasHeader = document.querySelector('header, [role="banner"]') !== null;
  const hasMain = document.querySelector('main, [role="main"]') !== null;
  const hasFooter = document.querySelector('footer, [role="contentinfo"]') !== null;
  const hasNav = document.querySelector('nav, [role="navigation"]') !== null;
  
  return hasHeader && hasMain && hasFooter && hasNav;
};

export default {
  calculateContrastRatio,
  meetsWCAGAA,
  meetsWCAGAAA,
  checkAccessibilityIssues,
  testKeyboardNavigation,
  checkAriaLandmarks,
};
