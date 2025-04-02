import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot as BaseInputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

// Create a wrapper component to provide the index prop
const InputOTPSlot = (props: React.ComponentPropsWithoutRef<typeof BaseInputOTPSlot> & { index: number }) => {
  return <BaseInputOTPSlot {...props} />;
};

interface OtpVerificationProps {
  phoneNumber: string;
  onVerificationComplete: () => void;
  onCancel: () => void;
}

export const OtpVerification = ({ phoneNumber, onVerificationComplete, onCancel }: OtpVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const { toast } = useToast();

  // Start resend timer
  const startResendTimer = () => {
    setResendDisabled(true);
    setTimer(30);
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    // In a real app, this would trigger a new OTP to be sent
    toast({
      title: "OTP Resent",
      description: `A new verification code has been sent to ${phoneNumber}`,
    });
    
    startResendTimer();
  };

  // Handle OTP verification
  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, this would verify the OTP with a backend service
      // For demo purposes, we'll use a simple simulation
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          // Simulate successful verification (any OTP is accepted in demo)
          resolve();
        }, 1500);
      });
      
      toast({
        title: "Phone Verified",
        description: "Your phone number has been successfully verified",
      });
      
      onVerificationComplete();
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to verify your phone number. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Verify Your Phone</CardTitle>
        <CardDescription>
          We've sent a verification code to {phoneNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, i) => (
                    <InputOTPSlot key={i} {...slot} index={i} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          <Button 
            onClick={handleVerify} 
            className="w-full mt-4" 
            disabled={isSubmitting || otp.length !== 6}
          >
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </Button>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">
            Didn't receive a code?
          </div>
          <Button
            variant="link"
            onClick={handleResendOtp}
            disabled={resendDisabled}
            className="text-sm"
          >
            {resendDisabled ? `Resend code in ${timer}s` : "Resend code"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Go Back
        </Button>
      </CardFooter>
    </Card>
  );
};