import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { RadioGroup } from "./radio";
import { useToast } from "./toast";

interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

interface AddressBookProps {
  addresses: Address[];
  onAddAddress: (address: Partial<Address>) => void;
  onEditAddress: (address: Partial<Address>) => void;
  onDeleteAddress: (id: string) => void;
}

export function AddressBook({
  addresses,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
}: AddressBookProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    isDefault: false,
  });
  const { toast } = useToast();

  const handleSaveAddress = () => {
    if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.zip || !formData.phone) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    if (editingAddress) {
      onEditAddress({ ...editingAddress, ...formData });
    } else {
      onAddAddress(formData);
    }
    setShowForm(false);
    setEditingAddress(null);
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
      isDefault: false,
    });
    toast({
      title: "Success",
      description: editingAddress ? "Address updated" : "Address added",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">Address Book</h2>

      {/* Address List */}
      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="border rounded-lg p-4 hover:bg-gray-50"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{address.name}</p>
                <p className="text-sm text-gray-600">{address.address}</p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.state} {address.zip}
                </p>
                <p className="text-sm text-gray-600">{address.phone}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingAddress(address);
                    setFormData(address);
                    setShowForm(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteAddress(address.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
            {address.isDefault && (
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                Default
              </span>
            )}
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No addresses saved yet</p>
          </div>
        )}
      </div>

      {/* Add/Edit Address Form Toggle */}
      <div className="mt-6">
        <Button
          variant={showForm ? "destructive" : "default"}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Hide Form" : "Add New Address"}
        </Button>
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="mt-4 space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="New York"
              />
            </div>
            <div>
              <Label>State</Label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="NY"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ZIP Code</Label>
              <Input
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                placeholder="10001"
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
          <div>
            <Label>Set as Default</Label>
            <RadioGroup
              value={formData.isDefault}
              onValueChange={(value) =>
                setFormData({ ...formData, isDefault: value === "true" })
              }
            >
              <RadioGroup.Item
                value="true"
                id="default-yes"
                className="flex items-center space-x-3"
              >
                <RadioGroup.Label>Yes</RadioGroup.Label>
              </RadioGroup.Item>
              <RadioGroup.Item
                value="false"
                id="default-no"
                className="flex items-center space-x-3"
              >
                <RadioGroup.Label>No</RadioGroup.Label>
              </RadioGroup.Item>
            </RadioGroup>
          </div>
          <Button onClick={handleSaveAddress} className="w-full">
            Save Address
          </Button>
        </div>
      )}
    </div>
  );
}
