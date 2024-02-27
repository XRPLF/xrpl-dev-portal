/**
 * Slugify function, has to match the formula used in interactive-tutorial.js
 */
import { useEffect, useState } from 'react';

export const useThemeFromClassList = (classNames) => {
  const [currentTheme, setCurrentTheme] = useState(null);

  useEffect(() => {
    // Function to update the theme based on the class list
    const updateTheme = () => {
      for (const className of classNames) {
        if (document.documentElement.classList.contains(className)) {
          setCurrentTheme(className);
          return;
        }
      }
    };

    // Initial update
    updateTheme();

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(() => {
      updateTheme();
    });

    // Start observing the target node for configured mutations
    observer.observe(document.documentElement, {
      attributes: true, // Listen for attribute changes
      attributeFilter: ['class'], // Specifically, listen only to "class" attribute changes
    });

    // Cleanup: Disconnect the observer
    return () => {
      observer.disconnect();
    };
  }, [classNames]);

  return currentTheme;
};

export function slugify(s) {
  const unacceptable_chars = /[^A-Za-z0-9._ ]+/g;
  const whitespace_regex = /\s+/g;
  s = s.replace(unacceptable_chars, "");
  s = s.replace(whitespace_regex, "_");
  s = s.toLowerCase();
  if (!s) {
    s = "_";
  }
  return s;
}

export function idify(s: string) {
  // like slugify, but more unicode-friendly.
  // for some reason the better version using \p gives an "s12 is undefined" TypeError sometimes,
  // so it's disabled for now. With that fixed, we could use localized step names in interactive tutorials.
  //s = s.replace(/[^\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]/gu, '').trim().toLowerCase()
  //s = s.replace(/[^\w\s-]/gu, '').trim().toLowerCase()
  s = s.replace(/([^\w]|[\s-])/gu, '').trim().toLowerCase() 
  s = s.replace(/[\s-]+/gu, '-')
  if (!s) {
    s = "_";
  }
  return s
}
