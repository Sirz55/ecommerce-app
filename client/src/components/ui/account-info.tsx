import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Select } from "./select";
import { useToast } from "./toast";

interface AccountInfoProps {
  user: {
    name: string;
    email: string;
    phone: string;
    country: string;
    language: string;
    currency: string;
  };
  onUpdate: (data: any) => void;
}

export function AccountInfo({ user, onUpdate }: AccountInfoProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    country: user.country,
    language: user.language,
    currency: user.currency,
  });
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      await onUpdate(formData);
      toast({
        title: "Success",
        description: "Account information updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account information",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">Account Information</h2>

      <div className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="font-semibold mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                type="email"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="font-semibold mb-4">Preferences</h3>
          <div className="space-y-4">
            <div>
              <Label>Country</Label>
              <Select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              >
                <option value="">Select country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                {/* Add more countries */}
              </Select>
            </div>
            <div>
              <Label>Language</Label>
              <Select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              >
                <option value="">Select language</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                {/* Add more languages */}
              </Select>
            </div>
            <div>
              <Label>Currency</Label>
              <Select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                <option value="">Select currency</option>
                <option value="USD">US Dollar</option>
                <option value="EUR">Euro</option>
                <option value="GBP">British Pound</option>
                {/* Add more currencies */}
              </Select>
            </div>
          </div>
        </div>

        {/* Save Changes */}
        <Button onClick={handleSubmit} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
