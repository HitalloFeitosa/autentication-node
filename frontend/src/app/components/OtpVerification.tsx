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
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </form>
  );
};

export default OTPVerification;
