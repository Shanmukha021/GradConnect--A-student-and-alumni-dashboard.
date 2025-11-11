import React, { useState, useEffect } from 'react';
import api from '../api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Heart, DollarSign, Calendar, Plus } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Donation {
  id: number;
  amount: number;
  message?: string;
  created_at: string;
  donor_name?: string;
}

const Donations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDonation, setNewDonation] = useState({
    payer_name: '',
    amount: '',
    currency: 'INR',
    reference_id: '',
    paid_at: '',
    notes: '',
    screenshot_path: '',
    status: 'pending',
  });
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0);

  useEffect(() => {
    fetchDonations();
    fetchUsers();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await api.get('/donations/');
      setDonations(response.data);
    } catch (error) {
      console.error('Failed to fetch donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (
      !newDonation.payer_name.trim() ||
      !newDonation.amount || isNaN(parseFloat(newDonation.amount)) ||
      !newDonation.currency.trim() ||
      !newDonation.reference_id.trim() ||
      !newDonation.status.trim()
    ) {
      alert('Please fill all required fields.');
      return;
    }
    try {
      // Convert paid_at to ISO string if provided, else null
      let paidAtValue = null;
      if (newDonation.paid_at && newDonation.paid_at.trim() !== '') {
        paidAtValue = new Date(newDonation.paid_at).toISOString();
      }
      // Only optional fields can be null
      const payload = {
        amount: parseFloat(newDonation.amount), // required
        payer_name: newDonation.payer_name, // required
        currency: newDonation.currency, // required
        reference_id: newDonation.reference_id, // required
        paid_at: paidAtValue, // optional
        notes: newDonation.notes === '' ? null : newDonation.notes, // optional
        screenshot_path: newDonation.screenshot_path === '' ? null : newDonation.screenshot_path, // optional
        status: newDonation.status, // required
      };
      await api.post('/donations/', payload);
      setNewDonation({
        payer_name: '',
        amount: '',
        currency: 'INR',
        reference_id: '',
        paid_at: '',
        notes: '',
        screenshot_path: '',
        status: 'pending',
      });
      setIsDialogOpen(false);
      fetchDonations();
      alert('Thank you for your donation!');
    } catch (error) {
      console.error('Failed to process donation:', error);
      alert('Failed to process donation. Please try again.');
    }
  };

  const recentDonations = donations
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)
    .map((donation) => (
      <div key={donation.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-[#90EE90] rounded-full flex items-center justify-center">
            <Heart className="text-black" size={20} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-black">
                {donation.donor_name || 'Anonymous Donor'}
              </span>
              <span className="text-[#90EE90] font-bold">
                ₹{donation.amount}
              </span>
            </div>
            {donation.message && (
              <p className="text-sm text-gray-600 mt-1">"{donation.message}"</p>
            )}
            <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2">
              <Calendar size={12} />
              <span>{new Date(donation.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    ));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-[#90EE90] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
  <div className="space-y-6">
      {/* User list removed as requested */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Donations</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#90EE90] hover:bg-[#7FDD7F] text-black">
              <Heart size={20} className="mr-2" />
              Make Donation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Make a Donation</DialogTitle>
              <DialogDescription>
                Support your alma mater with a donation.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleDonate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payer_name">Your Name</Label>
                <Input
                  id="payer_name"
                  value={newDonation.payer_name}
                  onChange={(e) => setNewDonation({ ...newDonation, payer_name: e.target.value })}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Donation Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={newDonation.amount}
                  onChange={(e) => setNewDonation({ ...newDonation, amount: e.target.value })}
                  required
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference_id">Reference ID</Label>
                <Input
                  id="reference_id"
                  value={newDonation.reference_id}
                  onChange={(e) => setNewDonation({ ...newDonation, reference_id: e.target.value })}
                  required
                  placeholder="Enter reference ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={newDonation.notes}
                  onChange={(e) => setNewDonation({ ...newDonation, notes: e.target.value })}
                  placeholder="Add any notes (optional)"
                />
              </div>
              <Button type="submit" className="w-full bg-[#90EE90] text-black">
                <Heart size={16} className="mr-2" />
                Donate ₹{newDonation.amount || '0.00'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Donation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-[#90EE90]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="text-[#90EE90]" size={24} />
              <span>Total Raised</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#90EE90]">
              ₹{totalRaised.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        {/* Recent Donations block */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Thank you to our generous donors!</CardDescription>
          </CardHeader>
          <CardContent>
            {donations.length > 0 ? (
              <div className="space-y-4">{recentDonations}</div>
            ) : (
              <div className="text-center py-8">
                <Heart className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No donations yet. Be the first to contribute!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Donations;