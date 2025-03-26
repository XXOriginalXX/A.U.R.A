import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Award, 
  AlertTriangle, 
  Info, 
  Star 
} from 'lucide-react';

// Interfaces for points tracking
interface Certificate {
  id: string;
  name: string;
  type: string;
  points: number;
  date: string;
}

interface UserProfile {
  username: string;
  totalPoints: number;
  certificates: Certificate[];
}

// Notification Component
const Notification: React.FC<{
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`fixed top-4 right-4 p-4 rounded-lg z-50 ${
        type === 'success' 
          ? 'bg-green-600 text-white' 
          : 'bg-red-600 text-white'
      }`}
    >
      {message}
    </div>
  );
};

// Enhanced Prediction Strategy
const predictCertificatePoints = (filename: string): { points: number, type: string } => {
  const lowercaseFilename = filename.toLowerCase();

  // More comprehensive and hierarchical mapping of certificate types
  const certificateTypePatterns = [
    { 
      type: 'NPTEL', 
      keywords: [
        'nptel', 
        'national programme on technology enhanced learning', 
        'online certification', 
        'coursera nptel', 
        'iitm nptel',
        'online assignments',
        'swayam',
        'skill inida'
      ], 
      points: 50,
      priority: 10
    },
    { 
      type: 'Hackathon', 
      keywords: [
        'hackathon', 
        'innovation challenge', 
        'coding competition', 
        'tech challenge', 
        'startup hackathon',
        'innovation sprint'
      ], 
      points: 40,
      priority: 9
    },
    { 
      type: 'Internship', 
      keywords: [
        'internship certificate', 
        'industrial training', 
        'work experience', 
        'summer internship', 
        'professional internship',
        'industry internship'
      ], 
      points: 30,
      priority: 8
    },
    { 
      type: 'Professional Development', 
      keywords: [
        'professional development', 
        'workshop certificate', 
        'seminar completion', 
        'conference participation', 
        'webinar certificate',
        'skill development workshop'
      ], 
      points: 20,
      priority: 7
    },
    {
      type: 'Academic Achievement',
      keywords: [
        'academic achievement', 
        'course completion', 
        'training completion', 
        'certification of merit',
        'academic excellence',
        'course certificate'
      ],
      points: 15,
      priority: 6
    },
    {
      type: 'Leadership & Soft Skills',
      keywords: [
        'leadership', 
        'communication skills', 
        'soft skills', 
        'personality development',
        'team management'
      ],
      points: 25,
      priority: 5
    },
    {
      type: 'Technical Certification',
      keywords: [
        'technical certification', 
        'programming certification', 
        'cloud certification', 
        'aws', 
        'azure', 
        'google cloud',
        'cybersecurity certification'
      ],
      points: 35,
      priority: 4
    }
  ];

  // Advanced matching algorithm
  const matches = certificateTypePatterns.filter(certType => 
    certType.keywords.some(keyword => 
      lowercaseFilename.includes(keyword)
    )
  );

  // Sort matches by priority and return the highest priority match
  if (matches.length > 0) {
    const bestMatch = matches.sort((a, b) => b.priority - a.priority)[0];
    return { 
      points: bestMatch.points, 
      type: bestMatch.type 
    };
  }

  // Context-based fallback checks
  const contextChecks = [
    { 
      condition: lowercaseFilename.includes('certificate'), 
      type: 'Academic Achievement', 
      points: 15 
    },
    { 
      condition: lowercaseFilename.includes('participation'), 
      type: 'Professional Development', 
      points: 10 
    }
  ];

  const contextMatch = contextChecks.find(check => check.condition);
  if (contextMatch) {
    return { 
      points: contextMatch.points, 
      type: contextMatch.type 
    };
  }

  
  return { 
    points: 0, 
    type: 'Generic/Miscellaneous Certificate' 
  };
};

const ActivityPointsTracker: React.FC = () => {
  // State for file upload and processing
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [predictedPoints, setPredictedPoints] = useState<number | null>(null);
  const [certificateType, setCertificateType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'Student', 
    totalPoints: 0,
    certificates: []
  });

  // Notification state
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (16MB limit)
      if (file.size > 16 * 1024 * 1024) {
        showNotification('File size exceeds 16MB limit', 'error');
        return;
      }

      // Validate file type
      const allowedTypes = [
        'image/jpeg', 
        'image/png', 
        'image/jpg', 
        'application/pdf'
      ];
      if (!allowedTypes.includes(file.type)) {
        showNotification('Invalid file type. Please upload JPG, PNG, or PDF', 'error');
        return;
      }

      setSelectedFile(file);
      setPredictedPoints(null);
      setCertificateType(null);
      setError(null);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      showNotification('Please select a file first', 'error');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPredictedPoints(null);
    setCertificateType(null);

    try {
      // Predict points based on filename
      const { points, type } = predictCertificatePoints(selectedFile.name);

      // Create new certificate entry
      const newCertificate: Certificate = {
        id: `cert-${Date.now()}`,
        name: selectedFile.name,
        type: type,
        points: points,
        date: new Date().toLocaleDateString()
      };

      // Update user profile
      setUserProfile(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + points,
        certificates: [...prev.certificates, newCertificate]
      }));

      setPredictedPoints(points);
      setCertificateType(type);
      
      // Notify user about points
      showNotification(`${type} Processed! ${points} points awarded.`, 'success');
    } catch (err) {
      console.error('Certificate processing error:', err);
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred during certificate processing.';

      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedFile(null);
    }
  };

  const removeCertificate = (certId: string) => {
    setUserProfile(prev => {
      const removedCert = prev.certificates.find(cert => cert.id === certId);
      return {
        ...prev,
        totalPoints: prev.totalPoints - (removedCert?.points || 0),
        certificates: prev.certificates.filter(cert => cert.id !== certId)
      };
    });
    showNotification('Certificate removed', 'success');
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center p-4">
      {/* Notification System */}
      {notification && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
      
      <div className="w-full max-w-4xl space-y-6">
        {/* User Profile Header */}
        <div className="bg-gray-800 rounded-xl p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Star className="mr-3 text-yellow-500" size={32} />
              Activity Points
            </h1>
            <p className="text-gray-400 mt-2">
              Total Points: {userProfile.totalPoints}
            </p>
          </div>
        </div>

        {/* Certificate Upload Section */}
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center">
              <Award className="mr-3 text-yellow-500" size={28} />
              Upload Certificate
            </h2>
            <p className="text-gray-400 mb-6">
              Upload your certificates to earn points
            </p>
          </div>

          {/* Explicit Upload Area with Clear Instructions */}
          <div className="bg-gray-700 rounded-lg p-6 text-center">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              id="certificate-upload"
            />
            <label 
              htmlFor="certificate-upload" 
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload size={48} className="text-blue-400 mb-4" />
              <p className="text-white text-lg mb-4">
                Click to Select Certificate
              </p>
              <p className="text-gray-400 mb-4">
                Supported formats: PDF, JPG, PNG (Max 16MB)
              </p>
              <div className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Choose File
              </div>
            </label>

            {/* Selected File Display */}
            {selectedFile && (
              <div className="mt-4 bg-gray-600 p-4 rounded-lg">
                <p className="text-white">
                  Selected File: {selectedFile.name}
                </p>
                <button 
                  onClick={handleFileUpload}
                  disabled={isLoading}
                  className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg 
                  hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Upload and Predict Points'}
                </button>
              </div>
            )}
          </div>

          {/* Point Calculation Info */}
          <div className="bg-gray-700 rounded-lg p-4 text-sm text-gray-300 flex items-start">
            <Info className="mr-3 mt-1 text-blue-400" size={20} />
            <div>
              <p className="font-semibold mb-2">Point Calculation</p>
              <ul className="list-disc list-inside space-y-1">
                <li>NPTEL Certificates: 50 points</li>
                <li>Technical Certifications: 35 points</li>
                <li>Hackathon Certificates: 40 points</li>
                <li>Internship Certificates: 30 points</li>
                <li>Leadership & Soft Skills: 25 points</li>
                <li>Professional Development: 20 points</li>
                <li>Academic Achievements: 15 points</li>
                <li>Other Certificates: 5 points</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Certificates List */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Uploaded Certificates
          </h2>
          {userProfile.certificates.length === 0 ? (
            <p className="text-gray-400 text-center">
              No certificates uploaded yet
            </p>
          ) : (
            <div className="space-y-4">
              {userProfile.certificates.map((cert) => (
                <div 
                  key={cert.id} 
                  className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-white">{cert.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{cert.type} Certificate</span>
                      <span className="text-yellow-500 font-bold">
                        +{cert.points} Points
                      </span>
                      <span>{cert.date}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeCertificate(cert.id)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityPointsTracker;
