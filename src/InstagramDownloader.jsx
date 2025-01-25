import React, { useState, useEffect } from 'react';
import { Cloud, Download, XCircle, Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import { BlurText } from "./assets/BlurText";
import Footer from "./assets/Footer";
import logo from "./assets/LOGO.png";

// Separate Status Alert Component
const StatusAlert = ({ type, message }) => {
  const styles = {
    error: {
      bg: 'bg-red-900/30',
      text: 'text-red-400',
      border: 'border-red-800',
    },
    success: {
      bg: 'bg-emerald-900/30',
      text: 'text-emerald-400',
      border: 'border-emerald-800',
    },
  };

  const { bg, text, border } = styles[type] || styles.success;

  return (
    <div className={`mt-4 p-3 sm:p-4 rounded-lg border backdrop-blur-sm ${bg} ${border}`}>
      <p className={`text-xs sm:text-sm ${text}`}>{message}</p>
    </div>
  );
};

// Separate DropZone Component with glass morphism effect
const DropZone = ({ url, setUrl, isDragging, handleDragOver, handleDragLeave, handleDrop, status }) => (
  <div
    className={`border-2 border-dashed rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 transition-all duration-300 backdrop-blur-sm
      ${isDragging ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700 bg-gray-900/30'}
      ${status === 'error' ? 'border-red-800' : ''}`}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
  >
    <div className="flex flex-col items-center justify-center">
      
      <div className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 text-center">
        Drag and drop an Instagram URL here, or paste it below
      </div>
      <div className="w-full max-w-md">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.instagram.com/p/..."
          className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border bg-gray-900 text-gray-100 rounded-lg 
                   border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                   placeholder-gray-500 transition-all duration-300"
        />
      </div>
    </div>
  </div>
);

// Enhanced Download Button Component with gradient
const DownloadButton = ({ handleDownload, status }) => (
  <button
    onClick={handleDownload}
    disabled={status === 'loading'}
    className="w-full py-3 rounded-lg transition-all duration-300
             bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700
             text-white font-medium
             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900
             disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed
             flex items-center justify-center gap-2 shadow-lg"
  >
    {status === 'loading' ? (
      <>
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        Processing...
      </>
    ) : (
      <>
        <Download className="w-5 h-5" />
        Download
      </>
    )}
  </button>
);

// Enhanced Downloaded Files List Component
const DownloadedFiles = ({ files, showSave }) => {
  useEffect(() => {
    if (showSave && files.length > 0) {
      setTimeout(() => {
        files.forEach((file) => {
          const link = document.createElement('a');
          link.href = `/api/download/${file.type}/${file.name}`;
          link.download = file.name;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      }, 500);
    }
  }, [showSave, files]);

  return (
    <div className="mt-4 sm:mt-6">
      <h3 className="text-base sm:text-lg font-medium text-gray-100 mb-2 sm:mb-3">
        Downloaded Files
      </h3>
      <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 sm:p-3 bg-gray-800/50 rounded-lg
                       backdrop-blur-sm border border-gray-700 transition-all duration-300
                       hover:bg-gray-800/70"
          >
            <span className="text-xs sm:text-sm text-gray-300">{file.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 hidden sm:inline">{file.size}</span>
              {showSave && (
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = `/api/download/${file.type}/${file.name}`;
                    link.download = file.name;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-white bg-purple-600 rounded hover:bg-purple-700
                             transition-colors duration-300 flex items-center gap-1"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  Save
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InstagramDownloader = () => {
  const [url, setUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [downloadedFiles, setDownloadedFiles] = useState([]);
  const [showComponents, setShowComponents] = useState(false);
  const [iconLoaded, setIconLoaded] = useState(false);
  const [showSave, setShowSave] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComponents(true);
      setIconLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    if (!url) {
      setStatus('error');
      setMessage('Please enter an Instagram URL');
      return;
    }

    try {
      setStatus('loading');
      setMessage('Processing content...');
      setShowSave(false);

      const requestBody = { url };
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      };

      const API_URL = 'https://socify-backend-production.up.railway.app'; // or whatever port your backend is running on
      console.log('Making POST request to:', `${API_URL}/api/download`);
      console.log('Request options:', requestOptions);
      console.log('Request body:', requestBody);

      const response = await fetch(`${API_URL}/api/download`, requestOptions);
      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Download failed');
      }

      setDownloadedFiles(data.files);
      setStatus('success');
      setMessage('Content processed successfully! Click "Save" to download files.');
      setShowSave(true);
    } catch (error) {
      console.error('Download error:', error);
      setStatus('error');
      setMessage(error.message);
      setShowSave(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const text = e.dataTransfer.getData('text');
    if (text.includes('instagram.com')) {
      setUrl(text);
    } else {
      setStatus('error');
      setMessage('Please drop a valid Instagram URL');
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes slideInFromRight {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-fade-in {
            opacity: 0;
            animation: fadeIn 0.6s ease-out forwards;
          }

          .animate-scale-in {
            opacity: 0;
            animation: scaleIn 0.6s ease-out forwards;
          }

          .animate-slide-in {
            opacity: 0;
            animation: slideInFromRight 0.6s ease-out forwards;
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .animate-bounce {
            animation: bounce 1s infinite;
          }
        `}
      </style>
      <div className="min-h-screen min-w-full fixed inset-0 flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-6 sm:py-12 px-3 sm:px-6 lg:px-8 text-gray-100 overflow-y-auto">
        <div className="flex-grow max-w-3xl w-full mx-auto flex flex-col justify-center -mt-12 sm:mt-0">
          {/* Enhanced Header with gradient text */}
              <div className="text-center mb-4 sm:mb-6 flex flex-col items-center justify-center mx-2 sm:mx-12">
                <div className="flex items-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
                  <BlurText text="SOCIFY" className="text-4xl sm:text-4xl md:text-5xl" delay={50} />
                  <img 
                    src={logo} 
                    alt="logo" 
                    className={`w-16 h-16 sm:w-26 sm:h-26 md:w-20 md:h-20 -ml-5 sm:-ml-8 transition-all duration-500
                              drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] filter
                              ${iconLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
                <p className="text-sm sm:text-base text-gray-400 animate-fade-in mt-2 -mb-8 sm:mt-12" 
                   style={{ lineHeight: '1.5rem', animationDelay: '0.6s' }}>
                   Download images, videos and reels from Instagram. (carousel support coming soon.)
                </p>
              </div>

          {/* Main Card with glass morphism effect */}
          <div className={`bg-gray-800/30 backdrop-blur-md rounded-xl shadow-2xl p-4 sm:p-6
                          border border-gray-700 transition-all duration-500 mt-8 sm:mt-12 animate-scale-in`}
               style={{ animationDelay: '0.8s' }}>
            {showComponents && (
              <>
                <div className="animate-fade-in" style={{ animationDelay: '1s' }}>
                  <DropZone 
                    url={url}
                    setUrl={setUrl}
                    isDragging={isDragging}
                    handleDragOver={handleDragOver}
                    handleDragLeave={handleDragLeave}
                    handleDrop={handleDrop}
                    status={status}
                  />
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '1.2s' }}>
                  <DownloadButton 
                    handleDownload={handleDownload}
                    status={status}
                  />
                </div>

                <div className="my-4 flex items-center justify-center space-x-2 animate-fade-in" 
                     style={{ animationDelay: '1.4s' }}>
                  <Footer />
                </div>

                {status !== 'idle' && (
                  <div className="animate-slide-in">
                    <StatusAlert 
                      type={status === 'error' ? 'error' : 'success'} 
                      message={message} 
                    />
                  </div>
                )}

                {downloadedFiles.length > 0 && (
                  <div className="animate-slide-in">
                    <DownloadedFiles files={downloadedFiles} showSave={showSave} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InstagramDownloader;