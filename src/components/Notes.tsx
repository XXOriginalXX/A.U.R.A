import React, { useState } from 'react';
import { Search, Filter, FileText, AlertTriangle } from 'lucide-react';

interface FileItem {
  name: string;
  path: string;
  type: string;
}

const Notes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // This will be replaced with actual GitHub repository data
  const dummyFiles: FileItem[] = [
    { name: 'Digital Signal Processing.pdf', path: '/dsp/notes.pdf', type: 'DSP' },
    { name: 'Computer Networks.pdf', path: '/cn/notes.pdf', type: 'CN' },
    { name: 'Operating Systems.pdf', path: '/os/notes.pdf', type: 'OS' }
  ];

  const subjects = ['all', 'DSP', 'CN', 'OS', 'DBMS'];

  const filteredFiles = dummyFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || file.type === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Search and Filter Bar */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
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
      </div>

      {/* Files Grid */}
      {filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-blue-400" />
                <div>
                  <h3 className="font-medium">{file.name}</h3>
                  <p className="text-sm text-gray-400">{file.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100%-5rem)]">
          <AlertTriangle size={48} className="text-yellow-500 mb-4" />
          <p className="text-gray-400">No notes found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default Notes;