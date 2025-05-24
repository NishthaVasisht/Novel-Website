import { useState, useEffect } from 'react';
import { Button } from "./components/ui/button";
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  Moon, 
  Sun, 
  Home,
  Info,
  List
} from "lucide-react";
import './App.css';

// Define chapter interface
interface Chapter {
  id: number;
  title: string;
  content: string;
}

// Define view types
type ViewType = 'home' | 'about' | 'chapter';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [currentView, setCurrentView] = useState<ViewType>('home');

  // Debug logging
  useEffect(() => {
    console.log('Current view:', currentView);
    console.log('Current chapter:', currentChapter);
  }, [currentView, currentChapter]);

  useEffect(() => {
    // Check for saved preferences
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('fontSize') || '16');
    setDarkMode(savedDarkMode);
    setFontSize(savedFontSize);
    
    // Load chapters data
    fetch('/chapters.json')
      .then(response => response.json())
      .then(data => {
        setChapters(data);
        setLoading(false);
        console.log('Chapters loaded:', data.length);
      })
      .catch(error => {
        console.error('Error loading chapters:', error);
        setLoading(false);
      });
      
    // Check URL hash for initial view
    const hash = window.location.hash;
    if (hash === '#about') {
      setCurrentView('about');
    } else if (hash.startsWith('#chapter-')) {
      const chapterNum = parseInt(hash.replace('#chapter-', ''));
      if (!isNaN(chapterNum) && chapterNum > 0) {
        setCurrentChapter(chapterNum);
        setCurrentView('chapter');
      }
    }
  }, []);

  useEffect(() => {
    // Save preferences
    localStorage.setItem('darkMode', darkMode.toString());
    localStorage.setItem('fontSize', fontSize.toString());
    
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, fontSize]);

  // Update URL hash when view changes
  useEffect(() => {
    if (currentView === 'home') {
      window.history.pushState(null, '', '#home');
    } else if (currentView === 'about') {
      window.history.pushState(null, '', '#about');
    } else if (currentView === 'chapter') {
      window.history.pushState(null, '', `#chapter-${currentChapter}`);
    }
  }, [currentView, currentChapter]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Simplified navigation functions with explicit logging
  const navigateToChapter = (chapterNum: number) => {
    console.log('Navigating to chapter:', chapterNum);
    if (chapterNum >= 1 && chapterNum <= chapters.length) {
      // Force view change first, then chapter
      setCurrentView('chapter');
      setTimeout(() => {
        setCurrentChapter(chapterNum);
        setMenuOpen(false);
        window.scrollTo(0, 0);
      }, 10);
    }
  };

  const navigateToHome = () => {
    console.log('Navigating to home');
    setCurrentView('home');
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navigateToAbout = () => {
    console.log('Navigating to about');
    setCurrentView('about');
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 1);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 1);
    }
  };

  // Explicit handler for Begin Reading button
  const handleBeginReading = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Begin Reading clicked');
    navigateToChapter(1);
  };

  // Explicit handler for Read Chapter button
  const handleReadChapter = (chapterId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Read Chapter clicked for chapter:', chapterId);
    navigateToChapter(chapterId);
  };

  const currentChapterData = chapters.find(chapter => chapter.id === currentChapter);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-amber-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`fixed top-0 w-full z-10 ${darkMode ? 'bg-gray-800' : 'bg-amber-100'} shadow-md`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="ml-3 text-xl font-serif hidden sm:block">Nishtha Vasisht</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={decreaseFontSize} title="Decrease font size">
              <span className="text-lg">A-</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={increaseFontSize} title="Increase font size">
              <span className="text-lg">A+</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar Menu */}
      <div className={`fixed inset-y-0 left-0 transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} w-64 md:w-80 z-20 transition-transform duration-300 ease-in-out ${darkMode ? 'bg-gray-800' : 'bg-amber-100'} shadow-lg`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-serif">Contents</h2>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mb-6">
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={navigateToHome}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start mb-2" onClick={navigateToAbout}>
              <Info className="mr-2 h-4 w-4" />
              About the Novel
            </Button>
          </div>
          
          <h3 className="font-medium mb-2 flex items-center">
            <List className="mr-2 h-4 w-4" />
            Chapters
          </h3>
          <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
            {chapters.map(chapter => (
              <Button 
                key={chapter.id}
                variant={currentChapter === chapter.id && currentView === 'chapter' ? "secondary" : "ghost"}
                className="w-full justify-start text-left"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToChapter(chapter.id);
                }}
              >
                {chapter.id}. {chapter.title}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-20 pb-24">
        {loading ? (
          <div className="flex justify-center items-center h-[70vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Home Page */}
            {currentView === 'home' && (
              <div id="home" className="max-w-3xl mx-auto">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-amber-100'} p-8 rounded-lg shadow-lg mb-8`}>
                  <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-center">Silicon Visionaries</h1>
                  <h2 className="text-xl md:text-2xl font-serif mb-6 text-center">A Tale of Power, Passion, and Platforms</h2>
                  
                  <div className="flex justify-center mb-8">
                    <div className={`w-32 h-1 ${darkMode ? 'bg-amber-400' : 'bg-amber-700'} rounded`}></div>
                  </div>
                  
                  <p className="text-center mb-8">
                    A thrilling romantic novel centered on key relationships and pivotal decisions 
                    between tech founders and leaders, revealing behind-the-scenes conflicts and 
                    turning points that shaped their companies' journeys.
                  </p>
                  
                  <div className="flex justify-center">
                    <a 
                      href="#chapter-1"
                      onClick={handleBeginReading}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      <BookOpen className="mr-2 h-5 w-5" />
                      Begin Reading
                    </a>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {[1, 6, 12].map(chapterId => {
                    const chapter = chapters.find(c => c.id === chapterId);
                    return chapter ? (
                      <div 
                        key={chapter.id} 
                        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
                      >
                        <h3 className="text-lg font-bold mb-2">Chapter {chapter.id}</h3>
                        <h4 className="font-medium mb-3">{chapter.title}</h4>
                        <p className="text-sm opacity-80 line-clamp-4">
                          {chapter.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </p>
                        <a 
                          href={`#chapter-${chapter.id}`}
                          onClick={(e) => handleReadChapter(chapter.id, e)}
                          className="inline-flex items-center text-primary underline-offset-4 hover:underline mt-2 p-0"
                        >
                          Read Chapter
                        </a>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* About Page */}
            {currentView === 'about' && (
              <div id="about" className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold font-serif mb-6">About the Novel</h1>
                
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md mb-8`}>
                  <h2 className="text-xl font-bold mb-4">Visionaries Entanglements</h2>
                  <p className="mb-4">
                    "Visionaries Entanglements" is a thrilling 61,000-word romantic novel that explores the complex 
                    relationships and pivotal decisions between tech founders and leaders inspired by figures like 
                    Jack Dorsey and Elon Musk.
                  </p>
                  <p className="mb-4">
                    The story follows Jackson Reed (inspired by Dorsey) and Elias Mercer (inspired by Musk), 
                    along with Sophia Chen, a brilliant product executive with romantic connections to both men. 
                    The narrative explores their professional rivalries, personal relationships, and the pivotal 
                    decisions that shape their companies, with a focus on a revolutionary neural interface 
                    technology that brings them together in unexpected ways.
                  </p>
                  <p>
                    With rich character development, dramatic corporate intrigue, and philosophical exploration 
                    of human connection and consciousness, this novel takes readers behind the scenes of the 
                    tech world while delivering a compelling romantic narrative.
                  </p>
                </div>
                
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
                  <h2 className="text-xl font-bold mb-4">Main Characters</h2>
                  
                  <div className="mb-4">
                    <h3 className="font-bold">Jackson Reed</h3>
                    <p>
                      Visionary founder of Pulse, a social media platform. Thoughtful, principled, and 
                      focused on ethical technology development. Former romantic partner of Sophia Chen.
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-bold">Elias Mercer</h3>
                    <p>
                      Bold, ambitious founder of multiple companies including Velocity. Known for his 
                      risk-taking and transformative vision. Forms a complex relationship with both 
                      Jackson and Sophia.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold">Sophia Chen</h3>
                    <p>
                      Brilliant product executive with expertise in human-centered design and neural 
                      interface technology. Has romantic history with Jackson and develops a complex 
                      connection with both men throughout the story.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter View */}
            {currentView === 'chapter' && currentChapterData && (
              <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold font-serif mb-2">
                  Chapter {currentChapterData.id}: {currentChapterData.title}
                </h1>
                <div className="mb-8 flex justify-center">
                  <div className={`w-24 h-0.5 ${darkMode ? 'bg-gray-600' : 'bg-amber-700'}`}></div>
                </div>
                
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert"
                  style={{ fontSize: `${fontSize}px` }}
                  dangerouslySetInnerHTML={{ __html: currentChapterData.content }}
                />
                
                <div className="mt-12 flex justify-between">
                  <a 
                    href={`#chapter-${currentChapter - 1}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToChapter(currentChapter - 1);
                    }}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex items-center chapter-nav-button prev ${currentChapter <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous Chapter
                  </a>
                  
                  <a 
                    href={`#chapter-${currentChapter + 1}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToChapter(currentChapter + 1);
                    }}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex items-center chapter-nav-button next ${currentChapter >= chapters.length ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    Next Chapter
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Not Found */}
            {currentView === 'chapter' && !currentChapterData && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Chapter not found</h2>
                <a 
                  href="#chapter-1"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToChapter(1);
                  }}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Return to Chapter 1
                </a>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={`fixed bottom-0 w-full ${darkMode ? 'bg-gray-800' : 'bg-amber-100'} shadow-inner`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-sm">
            Nishtha Vasisht © 2025
          </div>
          <div className="flex space-x-4">
            <a 
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                navigateToHome();
              }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-sm"
            >
              Home
            </a>
            <a 
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                navigateToAbout();
              }}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-sm"
            >
              About
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
