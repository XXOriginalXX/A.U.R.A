import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Award, 
  AlertTriangle, 
  Info, 
  Star 
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

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

const ActivityPointsTracker: React.FC = () => {
  // State for file upload and processing
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [predictedPoints, setPredictedPoints] = useState<number | null>(null);
  const [certificateType, setCertificateType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: '', 
    totalPoints: 0,
    certificates: []
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (16MB limit)
      if (file.size > 16 * 1024 * 1024) {
        toast.error('File size exceeds 16MB limit');
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
        toast.error('Invalid file type. Please upload JPG, PNG, or PDF');
        return;
      }

      setSelectedFile(file);
      setPredictedPoints(null);
      setCertificateType(null);
      setError(null);
    }
  };

  const predictCertificatePoints = (extractedText: string): { points: number, type: string } => {
    const lowercaseText = extractedText.toLowerCase();

    // Define keyword mappings for certificate types
    const certificateTypePatterns = [
      { 
        type: 'NPTEL', 
        keywords: ['nptel', 'national programme on technology enhanced learning'], 
        points: 50 
      },
      { 
        type: 'Hackathon', 
        keywords: ['hackathon', 'competition', 'innovation', 'challenge'], 
        points: 40 
      },
      { 
        type: 'Internship', 
        keywords: ['internship', 'intern', 'training'], 
        points: 30 
      },
      { 
        type: 'Professional Development', 
        keywords: ['workshop', 'seminar', 'conference', 'training', 'professional development'], 
        points: 20 
      }
    ];

    // Find the first matching certificate type
    for (const certType of certificateTypePatterns) {
      if (certType.keywords.some(keyword => lowercaseText.includes(keyword))) {
        return { 
          points: certType.points, 
          type: certType.type 
        };
      }
    }

    // Default to other certificates
    return { 
      points: 10, 
      type: 'Other' 
    };
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPredictedPoints(null);
    setCertificateType(null);

    try {
      // Simulate OCR processing
      const mockExtractedText = selectedFile.name;

      // Predict points based on simulated text
      const { points, type } = predictCertificatePoints(mockExtractedText);

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
      toast.success(`${type} Certificate Processed! ${points} points awarded.`);
    } catch (err) {
      console.error('Certificate processing error:', err);
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred during certificate processing.';

      setError(errorMessage);
      toast.error(errorMessage);
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
    toast.success('Certificate removed');
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center p-4">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      
      <div className="w-full max-w-4xl space-y-6">
        {/* User Profile Header */}
        <div className="bg-gray-800 rounded-xl p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Star className="mr-3 text-yellow-500" size={32} />
              {userProfile.username}Activity Points
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

          <div 
            className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center 
            hover:border-blue-500 transition-all duration-300 cursor-pointer"
          >
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
              <p className="text-gray-400">
                {selectedFile 
                  ? `Selected: ${selectedFile.name}` 
                  : 'Upload Certificate (PDF, JPG, PNG)'}
              </p>
            </label>
          </div>

          {selectedFile && (
            <button 
              onClick={handleFileUpload}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg 
              hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Predict Points'}
            </button>
          )}

          {isLoading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
          )}

          {/* Point Calculation Info */}
          <div className="bg-gray-700 rounded-lg p-4 text-sm text-gray-300 flex items-start">
            <Info className="mr-3 mt-1 text-blue-400" size={20} />
            <div>
              <p className="font-semibold mb-2">Point Calculation</p>
              <ul className="list-disc list-inside space-y-1">
                <li>NPTEL Certificates: 50 points</li>
                <li>Hackathon/Competition Certificates: 40 points</li>
                <li>Internship Certificates: 30 points</li>
                <li>Professional Development: 20 points</li>
                <li>Other Certificates: 10 points</li>
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