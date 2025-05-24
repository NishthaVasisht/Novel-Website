import { useEffect, useState } from 'react';

// Custom hook for reading progress
export function useReadingProgress() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    function updateScrollCompletion() {
      // Get scrollable content
      const currentHeight = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      
      if (scrollHeight) {
        setCompletion(Number((currentHeight / scrollHeight).toFixed(2)) * 100);
      }
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', updateScrollCompletion);
    
    // Trigger on initial load
    updateScrollCompletion();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('scroll', updateScrollCompletion);
  }, []);

  return completion;
}

// Custom hook for bookmarks
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  
  // Load bookmarks from localStorage on initial render
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);
  
  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);
  
  const toggleBookmark = (chapterId: number) => {
    setBookmarks(prev => {
      if (prev.includes(chapterId)) {
        return prev.filter(id => id !== chapterId);
      } else {
        return [...prev, chapterId];
      }
    });
  };
  
  const isBookmarked = (chapterId: number) => {
    return bookmarks.includes(chapterId);
  };
  
  return { bookmarks, toggleBookmark, isBookmarked };
}

// Custom hook for reading history
export function useReadingHistory() {
  const [lastRead, setLastRead] = useState<{chapterId: number, position: number} | null>(null);
  
  // Load reading history from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem('readingHistory');
    if (savedHistory) {
      setLastRead(JSON.parse(savedHistory));
    }
  }, []);
  
  // Save reading history to localStorage whenever it changes
  useEffect(() => {
    if (lastRead) {
      localStorage.setItem('readingHistory', JSON.stringify(lastRead));
    }
  }, [lastRead]);
  
  const updateReadingPosition = (chapterId: number) => {
    const position = window.scrollY;
    setLastRead({ chapterId, position });
  };
  
  const restoreReadingPosition = (chapterId: number) => {
    if (lastRead && lastRead.chapterId === chapterId) {
      setTimeout(() => {
        window.scrollTo(0, lastRead.position);
      }, 100);
    }
  };
  
  return { lastRead, updateReadingPosition, restoreReadingPosition };
}
