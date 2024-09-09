import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPFormValues {
  email: string;
  otp: string;
}

const OTPVerification: React.FC<{ email: string }> = ({ email }) => {
  const { handleSubmit, control } = useForm<OTPFormValues>();
  const { verifyOTP } = useAuth();

  const onSubmit: SubmitHandler<OTPFormValues> = async (data) => {
    const result = await verifyOTP(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} className="h-14 w-14" />
          <InputOTPSlot index={1} className="h-14 w-14" />
          <InputOTPSlot index={2} className="h-14 w-14" />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} className="h-14 w-14" />
          <InputOTPSlot index={4} className="h-14 w-14" />
          <InputOTPSlot index={5} className="h-14 w-14" />
        </InputOTPGroup>
      </InputOTP>
    </form>
  );
};

export default OTPVerification;
