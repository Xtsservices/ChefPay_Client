import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // Import Shadcn's useToast hook

const Login: React.FC = () => {
  const [mobile, setMobile] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [step, setStep] = useState<number>(1); // 1: Enter mobile, 2: Enter OTP
  const navigate = useNavigate();
  const { toast } = useToast(); // Shadcn's toast hook

  const handleMobileSubmit = (): void => {
    // Validate mobile: exactly 10 digits
    if (!/^\d{10}$/.test(mobile)) {
      toast({
        variant: "destructive",
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }

    // Simulate OTP sending
    toast({
      title: "OTP Sent",
      description: "A one-time password has been sent to your mobile (simulated).",
    });
    setStep(2);
  };

  const handleOtpSubmit = (): void => {
    // Basic OTP validation: exactly 6 digits
    if (!/^\d{6}$/.test(otp)) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
      });
      return;
    }

    if (otp === '111111') {
      toast({
        title: "Login Successful",
        description: "Welcome to your dashboard!",
      });
      navigate('/restaurant-admin'); // Navigate to dashboard
    } else {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted relative overflow-hidden">
      {/* Food-themed infinite animations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="food-animation pizza">🍕</div>
        <div className="food-animation burger">🍔</div>
        <div className="food-animation apple">🍎</div>
        <div className="food-animation taco">🌮</div>
        <div className="food-animation icecream">🍦</div>
        <div className="food-animation pizza">🍕</div>

      </div>

      <Card className="w-full max-w-md hover:shadow-elegant transition-all duration-300 z-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Login to Your Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 ? (
            <>
              <Input
                type="tel"
                placeholder="Enter your 10-digit mobile number"
                value={mobile}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMobile(e.target.value)}
                className="w-full"
                maxLength={10} // Limit input to 10 characters
              />
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={handleMobileSubmit}
              >
                Send OTP <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Input
                type="text"
                placeholder="Enter the 6-digit OTP"
                value={otp}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                className="w-full"
                maxLength={6} // Limit input to 6 characters
              />
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={handleOtpSubmit}
              >
                Verify OTP <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
          <p className="text-sm text-muted-foreground text-center">
            {step === 1 ? 'We\'ll send a one-time password to your mobile.' : 'For demo, use OTP: 111111'}
          </p>
        </CardContent>
      </Card>

      {/* Inline CSS for food animations */}
      <style>{`
        .food-animation {
          position: absolute;
          font-size: 3rem;
          opacity: 0.3;
          animation: float 10s infinite ease-in-out;
        }
        .pizza { top: 10%; left: 20%; animation-duration: 8s; animation-delay: 0s; }
        .burger { top: 30%; left: 70%; animation-duration: 12s; animation-delay: 2s; }
        .apple { top: 50%; left: 10%; animation-duration: 10s; animation-delay: 4s; }
        .taco { top: 70%; left: 80%; animation-duration: 9s; animation-delay: 6s; }
        .icecream { top: 20%; left: 50%; animation-duration: 11s; animation-delay: 8s; }
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.3; }
          50% { transform: translateY(-30px) rotate(360deg) scale(1.2); opacity: 0.5; }
          100% { transform: translateY(0) rotate(720deg) scale(1); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default Login;
