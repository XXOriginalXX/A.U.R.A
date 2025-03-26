import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, AlertTriangle, Download, Folder } from 'lucide-react';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  subject?: string;
}

const Notes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [items, setItems] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const USERNAME = 'XXOriginalXX';
  const REPO = 'Notes';

  useEffect(() => {
    const fetchGitHubContents = async () => {
      try {
        setLoading(true);
        const url = currentPath 
          ? `https://api.github.com/repos/${USERNAME}/${REPO}/contents/${currentPath}`
          : `https://api.github.com/repos/${USERNAME}/${REPO}/contents/`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch repository contents');
        }
        
        const data = await response.json();
        
        // Map contents to FileItem interface
        const formattedItems: FileItem[] = data.map((item: any) => ({
          name: item.name,
          path: item.path,
          type: item.type,
          download_url: item.type === 'file' ? item.download_url : undefined,
          subject: extractSubjectFromPath(item.path)
        }));

        setItems(formattedItems);
        setLoading(false);
      } catch (err) {
        setError('Unable to fetch notes. Please try again later.');
        setLoading(false);
      }
    };

    fetchGitHubContents();
  }, [currentPath]);

  // Extract subject from file path
  const extractSubjectFromPath = (path: string): string => {
    const pathParts = path.split('/');
    const subjectMap: { [key: string]: string } = {
      'dsp': 'DSP',
      'cn': 'CN',
      'os': 'OS',
      'dbms': 'DBMS'
    };

    // Try to match subject from folder name
    for (const part of pathParts) {
      const lowercasePart = part.toLowerCase();
      for (const [key, value] of Object.entries(subjectMap)) {
        if (lowercasePart.includes(key)) return value;
      }
    }
    return 'Other';
  };

  const subjects = ['all', 'DSP', 'CN', 'OS', 'DBMS', 'Other'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || item.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'dir') {
      // Navigate into directory
      setCurrentPath(item.path);
    } else if (item.download_url) {
      // Download file
      const link = document.createElement('a');
      link.href = item.download_url;
      link.download = item.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleGoBack = () => {
    // Remove last directory from path
    const pathParts = currentPath.split('/');
    pathParts.pop();
    setCurrentPath(pathParts.join('/'));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Loading contents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Navigation and Search Bar */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {currentPath && (
            <button 
              onClick={handleGoBack} 
              className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back
            </button>
          )}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 pl-10 pr-4 py-2 rounded-lg focus:outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-gray-800 pl-10 pr-4 py-2 rounded-lg appearance-none focus:outline-none"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
        {currentPath && (
          <div className="text-sm text-gray-400">
            Current Path: {currentPath}
          </div>
        )}
      </div>

      {/* Contents Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleItemClick(item)}
              className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                {item.type === 'dir' ? (
                  <Folder size={24} className="text-blue-400" />
                ) : (
                  <FileText size={24} className="text-green-400" />
                )}
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-400">
                    {item.type === 'dir' ? 'Folder' : item.subject}
                  </p>
                </div>
              </div>
              {item.type === 'file' && (
                <Download size={20} className="text-gray-400 hover:text-white" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100%-5rem)]">
          <AlertTriangle size={48} className="text-yellow-500 mb-4" />
          <p className="text-gray-400">No items found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default Notes;