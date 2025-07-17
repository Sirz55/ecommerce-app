import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";

interface CouponCodeProps {
  onApply: (code: string) => void;
}

export function CouponCode({ onApply }: CouponCodeProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleApply = () => {
    if (!code.trim()) {
      setError("Please enter a coupon code");
      return;
    }
    setError("");
    onApply(code);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          placeholder="Enter coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleApply}>Apply</Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
