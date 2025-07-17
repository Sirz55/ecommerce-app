import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { RadioGroup } from "./radio";
import { useToast } from "./toast";

interface PaymentMethodsProps {
  onPaymentSubmit: (paymentData: any) => void;
}

export function PaymentMethods({ onPaymentSubmit }: PaymentMethodsProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!cardNumber || !expiryDate || !cvv) {
      toast({
        title: "Error",
        description: "Please fill in all payment details",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onPaymentSubmit({
        method: paymentMethod,
        cardNumber,
        expiryDate,
        cvv,
      });
      toast({
        title: "Success",
        description: "Payment processed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Payment processing failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">Payment Methods</h2>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <Label>Payment Method</Label>
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="space-y-3"
        >
          <RadioGroup.Item
            value="credit-card"
            id="credit-card"
            className="flex items-center space-x-3"
          >
            <RadioGroup.Label>Credit Card</RadioGroup.Label>
          </RadioGroup.Item>
          <RadioGroup.Item
            value="paypal"
            id="paypal"
            className="flex items-center space-x-3"
          >
            <RadioGroup.Label>PayPal</RadioGroup.Label>
          </RadioGroup.Item>
          <RadioGroup.Item
            value="bank-transfer"
            id="bank-transfer"
            className="flex items-center space-x-3"
          >
            <RadioGroup.Label>Bank Transfer</RadioGroup.Label>
          </RadioGroup.Item>
        </RadioGroup>
      </div>

      {/* Credit Card Form */}
      {paymentMethod === "credit-card" && (
        <div className="space-y-4">
          <div>
            <Label>Credit Card Number</Label>
            <Input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              type="tel"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Expiry Date</Label>
              <Input
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                type="tel"
              />
            </div>
            <div>
              <Label>CVV</Label>
              <Input
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                type="tel"
              />
            </div>
          </div>
        </div>
      )}

      {/* PayPal Form */}
      {paymentMethod === "paypal" && (
        <div className="space-y-4">
          <div>
            <Label>PayPal Email</Label>
            <Input
              placeholder="your@email.com"
              type="email"
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              placeholder="••••••••"
              type="password"
            />
          </div>
        </div>
      )}

      {/* Bank Transfer Form */}
      {paymentMethod === "bank-transfer" && (
        <div className="space-y-4">
          <div>
            <Label>Bank Name</Label>
            <Input
              placeholder="Bank Name"
            />
          </div>
          <div>
            <Label>Account Number</Label>
            <Input
              placeholder="1234567890"
            />
          </div>
          <div>
            <Label>Routing Number</Label>
            <Input
              placeholder="123456789"
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={loading}
      >
        {loading ? "Processing..." : "Submit Payment"}
      </Button>
    </div>
  );
}
