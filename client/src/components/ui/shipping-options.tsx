import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Select } from "./select";
import { useToast } from "./toast";

interface ShippingAddress {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

interface ShippingOptionsProps {
  addresses: ShippingAddress[];
  onAddAddress: (address: Partial<ShippingAddress>) => void;
  onEditAddress: (address: Partial<ShippingAddress>) => void;
  selectedAddress: string | null;
  onSelectAddress: (addressId: string) => void;
}

export function ShippingOptions({
  addresses,
  onAddAddress,
  onEditAddress,
  selectedAddress,
  onSelectAddress,
}: ShippingOptionsProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
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
    });
    toast({
      title: "Success",
      description: editingAddress ? "Address updated" : "Address added",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">Shipping Options</h2>

      {/* Shipping Address Selection */}
      <div className="mb-6">
        <Label>Shipping Address</Label>
        <Select
          value={selectedAddress}
          onValueChange={onSelectAddress}
          placeholder="Select shipping address"
        >
          {addresses.map((address) => (
            <option key={address.id} value={address.id}>
              {address.name} - {address.address}
            </option>
          ))}
        </Select>
      </div>

      {/* Shipping Method */}
      <div className="mb-6">
        <Label>Shipping Method</Label>
        <Select
          placeholder="Select shipping method"
          defaultValue="standard"
        >
          <option value="standard">Standard Shipping - $5.00</option>
          <option value="express">Express Shipping - $10.00</option>
          <option value="overnight">Overnight Shipping - $20.00</option>
        </Select>
      </div>

      {/* Address Form Toggle */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Hide" : "Add/Edit Address"}
        </Button>
        <p className="text-sm text-gray-500">
          {addresses.length} saved addresses
        </p>
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
          <Button onClick={handleSaveAddress} className="w-full">
            Save Address
          </Button>
        </div>
      )}
    </div>
  );
}
