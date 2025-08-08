import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Shield } from "lucide-react";

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (title, description, variant = "default") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 4000);
  };

  const handleMobileSubmit = async () => {
    if (!/^\d{10}$/.test(mobile)) {
      showToast("Invalid Mobile Number", "Please enter a valid 10-digit mobile number.", "destructive");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    showToast("OTP Sent", "A one-time password has been sent to your mobile.");
    setStep(2);
    setIsLoading(false);
  };

  const handleOtpSubmit = async () => {
    if (!/^\d{6}$/.test(otp)) {
      showToast("Invalid OTP", "Please enter a valid 6-digit OTP.", "destructive");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (otp === '111111') {
      showToast("Login Successful", "Welcome to your dashboard!");
      setTimeout(() => {
        // navigate('/admin-dashboard');
        console.log('Navigating to dashboard...');
      }, 1500);
    } else {
      showToast("Invalid OTP", "Please try again.", "destructive");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated 3D Background */}
      <div className="absolute inset-0">
        {/* Geometric shapes */}
        <div className="geometric-bg">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
        </div>

        {/* Floating food icons */}
        <div className="food-particles">
          {['🍕', '🍔', '🍎', '🌮', '🍦', '🍰', '🥗', '🍜'].map((emoji, index) => (
            <div key={index} className={`food-particle food-${index + 1}`}>
              {emoji}
            </div>
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-gray-800/20"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* 3D Card Container */}
          <div className="card-3d-container">
            <Card className="login-card backdrop-blur-xl bg-black/20 border-gray-700/30 shadow-2xl">
              <CardHeader className="text-center space-y-2 pb-8">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center mb-4 shadow-lg border border-gray-600">
                  {step === 1 ? (
                    <Smartphone className="w-10 h-10 text-white" />
                  ) : (
                    <Shield className="w-10 h-10 text-white" />
                  )}
                </div>
                <CardTitle className="text-3xl sm:text-4xl font-bold text-white">
                  {step === 1 ? 'Welcome Back' : 'Verify Identity'}
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  {step === 1 ? 'Enter your mobile to continue' : 'Enter the OTP sent to your phone'}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {step === 1 ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        className="input-3d h-14 text-lg pl-6 bg-black/30 border-gray-600/50 text-white placeholder-gray-500 focus:bg-black/50 transition-all duration-300"
                        maxLength={10}
                        disabled={isLoading}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    <Button 
                      className="btn-3d w-full h-14 text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 border border-gray-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                      onClick={handleMobileSubmit}
                      disabled={isLoading || mobile.length !== 10}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Sending OTP...</span>
                        </div>
                      ) : (
                        <>
                          Send OTP <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="input-3d h-14 text-lg text-center tracking-[0.5em] bg-black/30 border-gray-600/50 text-white placeholder-gray-500 focus:bg-black/50 transition-all duration-300"
                        maxLength={6}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <Button 
                      className="btn-3d w-full h-14 text-lg font-semibold bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 border border-gray-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                      onClick={handleOtpSubmit}
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        <>
                          Verify & Login <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>

                    <Button 
                      variant="ghost"
                      className="w-full text-gray-400 hover:text-white hover:bg-black/20 border border-gray-700"
                      onClick={() => setStep(1)}
                      disabled={isLoading}
                    >
                      ← Back to mobile entry
                    </Button>
                  </div>
                )}

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    {step === 1 ? 
                      'We\'ll send a secure OTP to your mobile' : 
                      <span>Demo OTP: <code className="bg-black/30 px-2 py-1 rounded text-gray-300 border border-gray-700">111111</code></span>
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg backdrop-blur-md transform transition-all duration-300 ${
          toast.variant === 'destructive' 
            ? 'bg-red-500/20 border border-red-500/30 text-red-100' 
            : 'bg-green-500/20 border border-green-500/30 text-green-100'
        }`}>
          <h4 className="font-semibold">{toast.title}</h4>
          <p className="text-sm opacity-90">{toast.description}</p>
        </div>
      )}

      {/* Enhanced Styles */}
      <style>{`
        /* 3D Card Styles */
        .card-3d-container {
          perspective: 1000px;
        }
        
        .login-card {
          transform-style: preserve-3d;
          animation: cardFloat 6s ease-in-out infinite;
        }
        
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0) rotateX(0) rotateY(0); }
          50% { transform: translateY(-10px) rotateX(2deg) rotateY(1deg); }
        }

        /* 3D Input Effects */
        .input-3d {
          box-shadow: 
            0 4px 8px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .input-3d:focus {
          box-shadow: 
            0 8px 16px rgba(139, 69, 19, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 0 0 3px rgba(139, 69, 19, 0.1);
          transform: translateY(-2px);
        }

        /* 3D Button Effects */
        .btn-3d {
          box-shadow: 
            0 6px 12px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .btn-3d:hover {
          box-shadow: 
            0 12px 24px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        
        .btn-3d:active {
          transform: translateY(2px) scale(0.98);
        }

        /* Geometric Background */
        .geometric-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .shape {
          position: absolute;
          opacity: 0.1;
          background: linear-gradient(45deg, #374151, #111827, #1f2937);
          border-radius: 20% 40% 60% 80%;
          animation: morphFloat 15s ease-in-out infinite;
        }
        
        .shape-1 { width: 120px; height: 120px; top: 10%; left: 10%; animation-delay: 0s; }
        .shape-2 { width: 80px; height: 80px; top: 20%; right: 15%; animation-delay: 2s; }
        .shape-3 { width: 150px; height: 100px; bottom: 20%; left: 20%; animation-delay: 4s; }
        .shape-4 { width: 100px; height: 120px; top: 50%; right: 10%; animation-delay: 6s; }
        .shape-5 { width: 90px; height: 90px; bottom: 10%; right: 30%; animation-delay: 8s; }
        .shape-6 { width: 110px; height: 80px; top: 30%; left: 50%; animation-delay: 10s; }
        
        @keyframes morphFloat {
          0%, 100% { 
            transform: translateY(0) rotate(0deg) scale(1);
            border-radius: 20% 40% 60% 80%;
          }
          25% { 
            transform: translateY(-20px) rotate(90deg) scale(1.1);
            border-radius: 60% 20% 80% 40%;
          }
          50% { 
            transform: translateY(-40px) rotate(180deg) scale(0.9);
            border-radius: 40% 80% 20% 60%;
          }
          75% { 
            transform: translateY(-20px) rotate(270deg) scale(1.1);
            border-radius: 80% 60% 40% 20%;
          }
        }

        /* Food Particles */
        .food-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .food-particle {
          position: absolute;
          font-size: 2rem;
          opacity: 0.3;
          animation: foodFloat 12s infinite ease-in-out;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }
        
        .food-1 { top: 15%; left: 15%; animation-duration: 10s; animation-delay: 0s; }
        .food-2 { top: 25%; right: 20%; animation-duration: 14s; animation-delay: 2s; }
        .food-3 { top: 45%; left: 8%; animation-duration: 11s; animation-delay: 4s; }
        .food-4 { bottom: 25%; right: 15%; animation-duration: 13s; animation-delay: 6s; }
        .food-5 { top: 35%; right: 45%; animation-duration: 9s; animation-delay: 8s; }
        .food-6 { bottom: 15%; left: 25%; animation-duration: 12s; animation-delay: 10s; }
        .food-7 { top: 60%; left: 60%; animation-duration: 8s; animation-delay: 12s; }
        .food-8 { bottom: 35%; right: 55%; animation-duration: 15s; animation-delay: 14s; }
        
        @keyframes foodFloat {
          0%, 100% { 
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-30px) rotate(90deg) scale(1.2);
            opacity: 0.5;
          }
          50% { 
            transform: translateY(-50px) rotate(180deg) scale(0.8);
            opacity: 0.4;
          }
          75% { 
            transform: translateY(-30px) rotate(270deg) scale(1.1);
            opacity: 0.6;
          }
        }

        /* Responsive Design */
        @media (max-width: 640px) {
          .login-card {
            margin: 1rem;
          }
          
          .food-particle {
            font-size: 1.5rem;
          }
          
          .shape {
            opacity: 0.05;
          }
          
          .shape-1, .shape-3 { width: 80px; height: 80px; }
          .shape-2, .shape-5 { width: 60px; height: 60px; }
          .shape-4, .shape-6 { width: 70px; height: 70px; }
        }
        
        @media (max-width: 480px) {
          .card-3d-container {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;