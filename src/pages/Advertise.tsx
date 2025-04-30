
import { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ad, DollarSign } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function Advertise() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send this data to your backend
    console.log('Advertiser inquiry:', formData);
    
    toast({
      title: "Inquiry Received",
      description: "Thank you for your interest! We'll get back to you shortly.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      message: '',
    });
  };

  return (
    <MainLayout>
      {/* Hero section */}
      <div className="bg-accent">
        <div className="container py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <Ad className="h-5 w-5 text-shield" />
              <h1 className="text-2xl md:text-3xl font-bold">Advertise with Data Shield Blogs</h1>
            </div>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Reach industry professionals in real estate, finance, healthcare, supply chain, and cybersecurity
            </p>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Complete the form below to discuss advertising opportunities on Data Shield Blogs. 
              Our team will contact you with available options and pricing.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name *
                  </label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email *
                  </label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">
                  Company
                </label>
                <Input 
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message *
                </label>
                <Textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full md:w-auto bg-shield hover:bg-shield-dark">
                Send Inquiry
              </Button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Why Advertise With Us?</h2>
            
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-shield/10 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-shield" />
                  </div>
                  <h3 className="font-semibold">Targeted Audience</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Reach professionals specifically interested in technology solutions for their industries.
                </p>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-shield/10 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-shield" />
                  </div>
                  <h3 className="font-semibold">Multiple Ad Formats</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Choose from banner ads, sponsored content, newsletter features, and more.
                </p>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-shield/10 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-shield" />
                  </div>
                  <h3 className="font-semibold">Growing Readership</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our blog audience is continuously growing with professionals from various sectors.
                </p>
              </Card>
              
              <div className="bg-accent p-4 rounded-lg mt-6">
                <Badge className="mb-2">Special Offer</Badge>
                <p className="font-medium mb-1">First-time advertisers</p>
                <p className="text-sm text-muted-foreground mb-2">Get 15% off your first campaign</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
