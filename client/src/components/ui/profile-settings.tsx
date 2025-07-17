import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { RadioGroup } from "./radio";
import { Select } from "./select";
import { useToast } from "./toast";

interface ProfileSettingsProps {
  user: {
    name: string;
    email: string;
    phone: string;
    notifications: string[];
  };
  onUpdate: (data: any) => void;
}

export function ProfileSettings({ user, onUpdate }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    notifications: user.notifications,
  });
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      await onUpdate(formData);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">Profile Settings</h2>

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

        {/* Profile Picture */}
        <div>
          <h3 className="font-semibold mb-4">Profile Picture</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Upload image</span>
              </div>
            </div>
            <Button variant="outline">Change Photo</Button>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="font-semibold mb-4">Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Input
                type="checkbox"
                checked={formData.notifications.includes("email")}
                onChange={(e) => {
                  const newNotifications = e.target.checked
                    ? [...formData.notifications, "email"]
                    : formData.notifications.filter((n) => n !== "email");
                  setFormData({ ...formData, notifications: newNotifications });
                }}
              />
              <Label>Email Notifications</Label>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="checkbox"
                checked={formData.notifications.includes("sms")}
                onChange={(e) => {
                  const newNotifications = e.target.checked
                    ? [...formData.notifications, "sms"]
                    : formData.notifications.filter((n) => n !== "sms");
                  setFormData({ ...formData, notifications: newNotifications });
                }}
              />
              <Label>SMS Notifications</Label>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="checkbox"
                checked={formData.notifications.includes("push")}
                onChange={(e) => {
                  const newNotifications = e.target.checked
                    ? [...formData.notifications, "push"]
                    : formData.notifications.filter((n) => n !== "push");
                  setFormData({ ...formData, notifications: newNotifications });
                }}
              />
              <Label>Push Notifications</Label>
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
