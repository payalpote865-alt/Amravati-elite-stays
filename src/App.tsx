/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Toaster, toast } from 'sonner';
import { 
  Wifi, 
  ShieldCheck, 
  Zap, 
  Bed, 
  Utensils, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  Star,
  ChevronRight,
  Menu,
  X,
  Users,
  Calendar,
  Calculator,
  Building2,
  Check,
  ArrowRight,
  Video,
  Coffee,
  HeartHandshake,
  Shield,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Static local assets generated for authentic representation
import heroImg from './assets/images/hero_elite_residence_1790532352105.jpg';
import roomImg from './assets/images/room_student_stay_1790532362793.jpg';
import thaliImg from './assets/images/mess_traditional_thali_1790532373482.jpg';
import tiffinImg from './assets/images/mess_tiffin_dabba_1790532384835.jpg';

interface Property {
  id: string;
  name: string;
  category: 'Girls PG' | 'Boys PG';
  locality: string;
  address: string;
  proximity: string;
  singleRent: number;
  doubleRent: number;
  tripleRent: number;
  availableBeds: number;
  image: string;
  features: string[];
}

const LOCALITIES = [
  "All Localities",
  "Dastur Nagar",
  "Gadge Nagar",
  "Camp Area",
  "Rajapeth",
  "Kathora Naka",
  "Sai Nagar"
];

const PROPERTIES: Property[] = [
  {
    id: "aes-dastur-g",
    name: "Saraswati Elite Residence for Girls",
    category: "Girls PG",
    locality: "Dastur Nagar",
    address: "Near HVPM Sports Complex, Dastur Nagar Main Road",
    proximity: "800m from HVPM · 1.2km from GCOEA",
    singleRent: 3200,
    doubleRent: 2400,
    tripleRent: 1800,
    availableBeds: 3,
    image: roomImg,
    features: [
      "Resident Female Warden",
      "Attached Western Washroom",
      "Study Table & Ergonomic Chair",
      "RO Purified Water",
      "High-Speed Wi-Fi",
      "Inverter Power Backup"
    ]
  },
  {
    id: "aes-gadge-b",
    name: "Vidarbha Scholar Stay for Boys",
    category: "Boys PG",
    locality: "Gadge Nagar",
    address: "Opp. SGBAU University Gate 1, Gadge Nagar",
    proximity: "400m from SGBAU Campus · 10 min to Rajapeth",
    singleRent: 3100,
    doubleRent: 2300,
    tripleRent: 1750,
    availableBeds: 4,
    image: heroImg,
    features: [
      "Quiet Academic Environment",
      "Steel Lockers & Almirahs",
      "Individual Charging Stations",
      "Twice-Weekly Housekeeping",
      "24/7 CCTV Surveillance",
      "Filtered Hot Water"
    ]
  },
  {
    id: "aes-camp-g",
    name: "Camp Manor Executive Girls Stay",
    category: "Girls PG",
    locality: "Camp Area",
    address: "Civil Lines, Near Commissioner Office, Camp",
    proximity: "Serene Residential Area · Safe Night Commute",
    singleRent: 3400,
    doubleRent: 2600,
    tripleRent: 1950,
    availableBeds: 2,
    image: roomImg,
    features: [
      "Gated Security Post",
      "Large Ventilated Balconies",
      "Washing Machine Access",
      "Dedicated Study Hall",
      "Strict 9:30 PM Safety Curfew",
      "Daily Common Area Sanitization"
    ]
  },
  {
    id: "aes-rajapeth-b",
    name: "Central Transit PG for Boys",
    category: "Boys PG",
    locality: "Rajapeth",
    address: "Behind Rajapeth Bus Terminal, Amravati",
    proximity: "300m from Bus Stand · Direct City Transit",
    singleRent: 3000,
    doubleRent: 2200,
    tripleRent: 1700,
    availableBeds: 5,
    image: heroImg,
    features: [
      "Instant Transport Connectivity",
      "High-Speed Fiber Internet",
      "RO Water Plant on Premise",
      "Biometric Entry Register",
      "Sub-metered Electricity",
      "Tiffin Service Dining Lounge"
    ]
  },
  {
    id: "aes-kathora-g",
    name: "Greenfield Girls Stay",
    category: "Girls PG",
    locality: "Kathora Naka",
    address: "Kathora Bypass Road, Near Engineering Belt",
    proximity: "Close to PR Pote College & Polytechnic",
    singleRent: 3100,
    doubleRent: 2350,
    tripleRent: 1800,
    availableBeds: 3,
    image: roomImg,
    features: [
      "Lush Green Surroundings",
      "Full Female Staff & Warden",
      "CCTV Corridors",
      "Twin Wardrobes per Sharing",
      "Homestyle Lunch Delivery",
      "Doctor on Call"
    ]
  },
  {
    id: "aes-sainagar-b",
    name: "Sai Nagar Academic PG for Boys",
    category: "Boys PG",
    locality: "Sai Nagar",
    address: "Near Sai Baba Temple, Sai Nagar Main Street",
    proximity: "Quiet student hub · Walking distance to coachings",
    singleRent: 3000,
    doubleRent: 2250,
    tripleRent: 1750,
    availableBeds: 4,
    image: heroImg,
    features: [
      "Spacious Wooden Cots",
      "High-speed 100Mbps Wi-Fi",
      "Solar Water Heating",
      "Weekly Room Cleaning",
      "Motorcycle Parking Facility",
      "Water Cooler with RO"
    ]
  }
];

const WEEKLY_MENU = [
  { day: "Monday", lunch: "Dal Tadka, Mix Veg Sabzi, 4 Phulkas, Steamed Rice, Salad", dinner: "Aloo Gobhi Masala, Moong Dal, 4 Phulkas, Rice, Pickle" },
  { day: "Tuesday", lunch: "Chana Masala (Chole), Jeera Rice, 4 Phulkas, Onion Salad", dinner: "Methi-Aloo Bhaji, Toor Dal, 4 Phulkas, Rice, Papad" },
  { day: "Wednesday", lunch: "Matar Paneer, Dal Fry, 4 Phulkas, Steamed Rice, Buttermilk", dinner: "Baingan Bharta, Masoor Dal, 4 Phulkas, Steamed Rice" },
  { day: "Thursday", lunch: "Rajma Masala, 4 Phulkas, Steamed Basmati Rice, Salad", dinner: "Bhindi Do Pyaza, Dal Tadka, 4 Phulkas, Rice, Pickle" },
  { day: "Friday", lunch: "Soyabean Bhurji, Dal Palak, 4 Phulkas, Steamed Rice, Curd", dinner: "Sev Tamatar Sabzi, Toor Dal, 4 Phulkas, Rice, Roasted Papad" },
  { day: "Saturday (Vidarbha Day)", lunch: "Traditional Pithla-Bhakri, Mirchi Thecha, Kadi & Khichdi", dinner: "Pav Bhaji Homestyle / South Indian Dosa & Sambar (Rotational)" },
  { day: "Sunday (Feast)", lunch: "Authentic Rodge, Vangyachi Bhaji (Vidarbha Special) & Kheer", dinner: "Sev Bhaji Special, Jeera Rice, 4 Phulkas, Gulab Jamun" },
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState("All Localities");
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Girls PG' | 'Boys PG'>('All');
  
  // Cost Calculator State
  const [calcGender, setCalcGender] = useState<'Girls' | 'Boys'>('Girls');
  const [calcRoomType, setCalcRoomType] = useState<'single' | 'double' | 'triple'>('double');
  const [calcMessPlan, setCalcMessPlan] = useState<'none' | 'half' | 'full'>('full');

  // Booking / Inquiry Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    userType: "Student",
    locality: "Dastur Nagar",
    category: "Girls PG",
    roomType: "2-Sharing Room",
    messPlan: "Full Tiffin (Lunch & Dinner)",
    visitDate: "",
    tourType: "Physical In-Person Visit",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  useEffect(() => {
    const socket = io();

    socket.on("new_registration", (data) => {
      toast.info(`Recent Verification Inquiry`, {
        description: `${data.name} just reserved a visit for ${data.location} (${data.roomType})`,
        duration: 5000,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Filtered properties
  const filteredProperties = PROPERTIES.filter((prop) => {
    const matchesLocality = selectedLocality === "All Localities" || prop.locality === selectedLocality;
    const matchesCategory = selectedCategory === "All" || prop.category === selectedCategory;
    return matchesLocality && matchesCategory;
  });

  // Calculate pricing numbers
  const roomPriceMap = {
    single: calcGender === 'Girls' ? 3200 : 3100,
    double: calcGender === 'Girls' ? 2400 : 2300,
    triple: calcGender === 'Girls' ? 1800 : 1750,
  };
  const messPriceMap = {
    none: 0,
    half: 1800,
    full: 2800,
  };

  const calculatedRoomRent = roomPriceMap[calcRoomType];
  const calculatedMessCost = messPriceMap[calcMessPlan];
  const totalMonthlyCost = calculatedRoomRent + calculatedMessCost;
  const refundableSecurityDeposit = calculatedRoomRent;

  const handleCalculateToForm = () => {
    setFormData((prev) => ({
      ...prev,
      category: calcGender === 'Girls' ? 'Girls PG' : 'Boys PG',
      roomType: calcRoomType === 'single' ? 'Single Room' : calcRoomType === 'double' ? '2-Sharing Room' : '3-Sharing Room',
      messPlan: calcMessPlan === 'full' ? 'Full Tiffin (Lunch & Dinner)' : calcMessPlan === 'half' ? 'Half Tiffin (1 Meal/day)' : 'No Mess Plan'
    }));
    scrollToSection('inquiry');
    toast.success("Cost plan applied to booking inquiry form below.");
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Please provide your full name and contact number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();
      if (response.ok) {
        setSubmissionSuccess(resData.inquiryId || "AES-CONFIRMED");
        toast.success("Inquiry Submitted Successfully!", {
          description: `Reference: ${resData.inquiryId}. Our warden will contact you via WhatsApp.`
        });
      } else {
        toast.error("Failed to send inquiry. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again or WhatsApp us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. TOP BAR CONTRACT */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Zone 1: Single text element wordmark */}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
              className="font-display text-xl font-bold tracking-tight text-slate-900 hover:text-amber-800 transition-colors"
            >
              Amravati Elite Stays
            </a>

            {/* Zone 2: 4-6 clean text navigation links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
              <button 
                onClick={() => scrollToSection('rooms')} 
                className="hover:text-slate-900 transition-colors"
              >
                Available Rooms
              </button>
              <button 
                onClick={() => scrollToSection('mess')} 
                className="hover:text-slate-900 transition-colors"
              >
                Mess & Tiffin
              </button>
              <button 
                onClick={() => scrollToSection('calculator')} 
                className="hover:text-slate-900 transition-colors"
              >
                Cost Calculator
              </button>
              <button 
                onClick={() => scrollToSection('amenities')} 
                className="hover:text-slate-900 transition-colors"
              >
                Facilities
              </button>
              <button 
                onClick={() => scrollToSection('safety')} 
                className="hover:text-slate-900 transition-colors"
              >
                Security & Wardens
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="hover:text-slate-900 transition-colors"
              >
                Reviews
              </button>
            </nav>

            {/* Zone 3: 1-2 primary actions */}
            <div className="hidden sm:flex items-center gap-3">
              <a 
                href="tel:+919876543210"
                className="flex items-center gap-2 text-xs font-semibold text-slate-700 px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-700" />
                <span className="font-mono tabular-nums">+91 98765 43210</span>
              </a>
              <button 
                onClick={() => scrollToSection('inquiry')}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm"
              >
                Schedule Visit
              </button>
            </div>

            {/* Mobile menu toggle */}
            <div className="flex items-center sm:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-4 shadow-xl"
            >
              {[
                { label: 'Available Rooms', id: 'rooms' },
                { label: 'Mess & Tiffin', id: 'mess' },
                { label: 'Cost Calculator', id: 'calculator' },
                { label: 'Facilities', id: 'amenities' },
                { label: 'Security & Wardens', id: 'safety' },
                { label: 'Reviews & Campuses', id: 'testimonials' },
                { label: 'Book a Room / Schedule Visit', id: 'inquiry' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-amber-800 border-b border-slate-100 last:border-0"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2">
                <a 
                  href="tel:+919876543210"
                  className="flex items-center justify-center gap-2 w-full py-3 text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg"
                >
                  <Phone className="w-4 h-4 text-amber-700" />
                  Direct Helpline: +91 98765 43210
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              {/* Unboxed editorial category marker */}
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide mb-4">
                <span>Amravati Student & Executive Residences</span>
                <span aria-hidden="true">·</span>
                <span>Maharashtra</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12] mb-6 text-balance">
                Verified Student Rooms & Pure Homestyle Mess in Amravati
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8">
                Providing peaceful, fully furnished student accommodations and hygienic Varhadi tiffin services across Dastur Nagar, Gadge Nagar, Camp, and Rajapeth. Designed specifically for academic focus and parent peace of mind.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
                <button
                  onClick={() => scrollToSection('rooms')}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors text-center shadow-sm flex items-center justify-center gap-2"
                >
                  Browse Available Stays
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToSection('calculator')}
                  className="px-6 py-3.5 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4 text-amber-700" />
                  Calculate Monthly Rent
                </button>
              </div>

              {/* Key Attributable Trust Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-200/80">
                <div>
                  <div className="font-mono text-2xl font-bold text-slate-900 tabular-nums">₹1,800</div>
                  <div className="text-xs text-slate-500 mt-1">Starting monthly rent</div>
                </div>
                <div>
                  <div className="font-mono text-2xl font-bold text-slate-900 tabular-nums">9+</div>
                  <div className="text-xs text-slate-500 mt-1">Campus localities</div>
                </div>
                <div>
                  <div className="font-mono text-2xl font-bold text-slate-900 tabular-nums">24/7</div>
                  <div className="text-xs text-slate-500 mt-1">Warden on-premise</div>
                </div>
                <div>
                  <div className="font-mono text-2xl font-bold text-slate-900 tabular-nums">100%</div>
                  <div className="text-xs text-slate-500 mt-1">RO filtered kitchen</div>
                </div>
              </div>

            </div>

            {/* Right Visual Carrier Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
                <img 
                  src={heroImg} 
                  alt="Student accommodation study desk and comfortable room in Amravati"
                  className="w-full aspect-[4/3] object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Graceful fallback container
                    const target = e.currentTarget;
                    target.style.display = 'none';
                  }}
                />
                {/* Clean metadata badge over image with high-contrast scrim */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 text-white">
                  <div className="flex items-center justify-between text-xs text-slate-200 mb-1">
                    <span>Verified Premises · Dastur Nagar & Gadge Nagar</span>
                    <span className="font-semibold text-amber-300">Available Oct 2026</span>
                  </div>
                  <p className="text-sm font-medium text-slate-100">
                    Spacious personal study desks, orthopedic mattresses, and high-speed Wi-Fi.
                  </p>
                </div>
              </div>

              {/* Fast reassurance banner */}
              <div className="mt-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <span className="font-semibold">Parent & Student Guarantee:</span> Direct management without brokers or hidden agent commissions. Transparent sub-meter electricity and fixed water charges.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. VERIFIED PROPERTY CATALOG & LOCALITY SELECTOR */}
      <section id="rooms" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide mb-2">
                <span>Direct Residence Listings</span>
                <span aria-hidden="true">·</span>
                <span>Zero Brokerage</span>
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
                Verified Student Rooms in Amravati
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-xl">
                Filter by neighborhood or resident category to review room layouts, safety features, and immediate bed availability.
              </p>
            </div>

            {/* Category Segmented Control (Allowed as functional button group) */}
            <div className="flex items-center p-1 bg-white rounded-xl border border-slate-200 shadow-sm shrink-0">
              {(['All', 'Girls PG', 'Boys PG'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Locality Filter Pills (Functional Filter Buttons) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {LOCALITIES.map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocality(loc)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
                  selectedLocality === loc
                    ? 'bg-amber-800 text-white border-amber-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          {/* Property Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop) => (
              <div 
                key={prop.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Property Image Container with Fallback */}
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img 
                      src={prop.image} 
                      alt={prop.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      {prop.category}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-emerald-800 border border-emerald-200 text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      {prop.availableBeds} Beds Open
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="font-medium text-slate-700">{prop.locality}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{prop.proximity}</span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-slate-900 mb-3 leading-snug">
                      {prop.name}
                    </h3>

                    {/* Pricing Tiers Table */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Monthly Rent per Person
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                          <span className="text-slate-500 block text-[10px]">3-Sharing</span>
                          <span className="font-mono font-bold text-slate-900 tabular-nums">₹{prop.tripleRent.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                          <span className="text-slate-500 block text-[10px]">2-Sharing</span>
                          <span className="font-mono font-bold text-slate-900 tabular-nums">₹{prop.doubleRent.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200/60">
                          <span className="text-slate-500 block text-[10px]">Single Room</span>
                          <span className="font-mono font-bold text-slate-900 tabular-nums">₹{prop.singleRent.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-1.5 mb-2">
                      {prop.features.slice(0, 4).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
                  <div className="text-xs text-slate-500">
                    Water & Wi-Fi included
                  </div>
                  <button
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        locality: prop.locality,
                        category: prop.category,
                        message: `Inquiring about ${prop.name} in ${prop.locality}.`
                      }));
                      scrollToSection('inquiry');
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Inquire / Tour
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">No rooms currently listed in this filter</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                We expand vacancies weekly. Contact our helpline directly to check unlisted rooms in {selectedLocality}.
              </p>
              <button 
                onClick={() => { setSelectedLocality('All Localities'); setSelectedCategory('All'); }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 4. TRANSPARENT MONTHLY COST CALCULATOR */}
      <section id="calculator" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-800 tracking-wide mb-2">
              <span>Financial Clarity</span>
              <span aria-hidden="true">·</span>
              <span>No Hidden Charges</span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
              Interactive Monthly Cost Estimator
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Students and parents can configure exact room occupancy and mess plans to calculate the all-inclusive monthly budget upfront.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-12 gap-8 items-start bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
            
            {/* Control Panel (7 cols) */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Gender Preference */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  1. Residence Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCalcGender('Girls')}
                    className={`py-2.5 px-4 text-xs font-semibold rounded-lg border transition-all text-center ${
                      calcGender === 'Girls'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Girls Residence
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcGender('Boys')}
                    className={`py-2.5 px-4 text-xs font-semibold rounded-lg border transition-all text-center ${
                      calcGender === 'Boys'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Boys Residence
                  </button>
                </div>
              </div>

              {/* Occupancy Type */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  2. Room Occupancy
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setCalcRoomType('triple')}
                    className={`p-3 text-left rounded-lg border transition-all ${
                      calcRoomType === 'triple'
                        ? 'bg-amber-50 border-amber-600 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-xs font-bold">3/4 Sharing</span>
                    <span className="text-[11px] text-slate-500 block font-mono tabular-nums">₹{roomPriceMap.triple}/mo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcRoomType('double')}
                    className={`p-3 text-left rounded-lg border transition-all ${
                      calcRoomType === 'double'
                        ? 'bg-amber-50 border-amber-600 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-xs font-bold">2-Sharing</span>
                    <span className="text-[11px] text-slate-500 block font-mono tabular-nums">₹{roomPriceMap.double}/mo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcRoomType('single')}
                    className={`p-3 text-left rounded-lg border transition-all ${
                      calcRoomType === 'single'
                        ? 'bg-amber-50 border-amber-600 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-xs font-bold">Single Room</span>
                    <span className="text-[11px] text-slate-500 block font-mono tabular-nums">₹{roomPriceMap.single}/mo</span>
                  </button>
                </div>
              </div>

              {/* Mess / Dining Plan */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  3. Homestyle Mess & Tiffin Service
                </label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="mess" 
                        checked={calcMessPlan === 'full'} 
                        onChange={() => setCalcMessPlan('full')}
                        className="text-amber-800 focus:ring-amber-800"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Full Tiffin Subscription (Lunch + Dinner)</div>
                        <div className="text-[11px] text-slate-500">7 Days/week · Weekend Vidarbha special feasts included</div>
                      </div>
                    </div>
                    <div className="font-mono text-xs font-semibold text-slate-800 tabular-nums">+₹2,800/mo</div>
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="mess" 
                        checked={calcMessPlan === 'half'} 
                        onChange={() => setCalcMessPlan('half')}
                        className="text-amber-800 focus:ring-amber-800"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Half Tiffin Subscription (Lunch OR Dinner only)</div>
                        <div className="text-[11px] text-slate-500">Daily single meal delivered in insulated stainless dabba</div>
                      </div>
                    </div>
                    <div className="font-mono text-xs font-semibold text-slate-800 tabular-nums">+₹1,800/mo</div>
                  </label>

                  <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="mess" 
                        checked={calcMessPlan === 'none'} 
                        onChange={() => setCalcMessPlan('none')}
                        className="text-amber-800 focus:ring-amber-800"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Room Only (No Mess Subscription)</div>
                        <div className="text-[11px] text-slate-500">You can opt-in to mess services at any time later</div>
                      </div>
                    </div>
                    <div className="font-mono text-xs font-semibold text-slate-800 tabular-nums">₹0</div>
                  </label>
                </div>
              </div>

            </div>

            {/* Total Summary Card (5 cols) */}
            <div className="md:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Itemized Monthly Estimate
                </h3>

                <div className="space-y-3 py-4 text-xs text-slate-600 border-b border-slate-100">
                  <div className="flex justify-between">
                    <span>Room Accommodation:</span>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">₹{calculatedRoomRent.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Homestyle Mess:</span>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">₹{calculatedMessCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Water & RO Purification:</span>
                    <span className="font-semibold text-emerald-700">Included Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High-Speed Wi-Fi & Backup:</span>
                    <span className="font-semibold text-emerald-700">Included Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly Housekeeping:</span>
                    <span className="font-semibold text-emerald-700">Included Free</span>
                  </div>
                </div>

                <div className="pt-4 pb-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Total Monthly Rent</span>
                    <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
                      ₹{totalMonthlyCost.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-slate-500">/mo</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    * Electricity billed per personal room sub-meter (~₹10/unit, avg ₹200-300).
                  </p>
                </div>

                <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-800">Refundable Deposit:</span> 1 Month Room Rent (₹{refundableSecurityDeposit.toLocaleString('en-IN')}), returned immediately upon move-out clearance.
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={handleCalculateToForm}
                  className="w-full py-3 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  Apply to Booking Inquiry
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. HOMESTYLE MESS & TIFFIN SERVICE (घरगुती भोजन व डब्बा सेवा) */}
      <section id="mess" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
            
            {/* Visual Media Column */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                  <img 
                    src={thaliImg} 
                    alt="Authentic Indian homestyle thali served at Amravati mess"
                    className="w-full aspect-[4/5] object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900 block">Pure Vegetarian Kitchen:</span>
                  Cooked using fresh morning local market vegetables and 100% RO filtered water.
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                  <img 
                    src={tiffinImg} 
                    alt="Classic stainless steel dabba for student meal delivery"
                    className="w-full aspect-[4/5] object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900 block">Insulated Dabbas:</span>
                  Free doorstep delivery to all registered student rooms within 2.5km radius.
                </div>
              </div>
            </div>

            {/* Explanatory Content Column */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide mb-2">
                <span>Ghar Jaisa Khana</span>
                <span aria-hidden="true">·</span>
                <span>घरगुती खानावळ व डब्बा सेवा</span>
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 mb-4 text-balance">
                Nutritious Homestyle Mess Prepared with Local Heart
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                Most students struggle with oily, commercial hostel food that impacts health and studies. Our mess operates in partnership with local Maharashtrian home-makers (घरगुती महिला बचत गट), ensuring meals taste genuinely like home without artificial colors, heavy soda, or recycled oil.
              </p>

              {/* Key Guarantees */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-amber-700" />
                    Zero Food Soda or Preservatives
                  </div>
                  <p className="text-xs text-slate-500">
                    Freshly rolled whole wheat phulkas and easily digestible light dals every meal.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-amber-700" />
                    Dedicated Food-Grade Tiffins
                  </div>
                  <p className="text-xs text-slate-500">
                    High-quality stainless steel lunch carriers sanitized in boiling water after every shift.
                  </p>
                </div>
              </div>

              {/* Tiffin Subscription Rates */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Direct Tiffin Subscriptions</div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">Half Tiffin: ₹1,800/mo · Full Tiffin: ₹2,800/mo</div>
                  <div className="text-xs text-slate-500">Available to students living in private apartments as well</div>
                </div>
                <button
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      interest: "Only Mess Service (Tiffin)",
                      message: "Interested in subscribing to home tiffin service in Amravati."
                    }));
                    scrollToSection('inquiry');
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  Order Tiffin Trial
                </button>
              </div>

            </div>

          </div>

          {/* 7-Day Timetable Cycle */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-2">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Weekly Rotating Meal Timetable
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lunch served: 11:30 AM – 1:45 PM · Dinner served: 7:30 PM – 9:30 PM
                </p>
              </div>
              <div className="text-xs text-amber-800 font-semibold">
                Weekend Vidarbha & Maharashtrian Specials
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4 w-32">Day</th>
                    <th className="py-3 px-4">Afternoon Lunch</th>
                    <th className="py-3 px-4">Evening Dinner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {WEEKLY_MENU.map((item, idx) => (
                    <tr key={idx} className={idx >= 5 ? "bg-amber-50/50 font-medium" : "hover:bg-slate-50"}>
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">{item.day}</td>
                      <td className="py-3.5 px-4 text-slate-700 leading-relaxed">{item.lunch}</td>
                      <td className="py-3.5 px-4 text-slate-700 leading-relaxed">{item.dinner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* 6. FACILITIES & LIVING ECOSYSTEM */}
      <section id="amenities" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mx-auto text-center mb-14">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-800 tracking-wide mb-2">
              <span>Standardized Living Amenities</span>
              <span aria-hidden="true">·</span>
              <span>All Branches</span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
              Designed for Focused Academic Success
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every Amravati Elite Stays premise adheres to a mandatory hygiene, utility, and connectivity standard.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center mb-4">
                <Wifi className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">High-Speed Optical Wi-Fi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated multi-access point broadband covering each study room and corridor, ensuring zero buffering for lectures and project submissions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Dual Inverter Power Backup</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Uninterrupted power support for fans, Wi-Fi routers, and desk study lamps during city load-shedding or power cuts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center mb-4">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Commercial RO Water Plant</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-stage reverse osmosis filtration with chilled and normal dispensing, tested monthly for total dissolved solids (TDS).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center mb-4">
                <Bed className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Individual Study Furniture</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every bed includes a dedicated lockable steel wardrobe, study desk, ergonomic chair, and bedside power socket for laptop chargers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Twice-Weekly Housekeeping</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Professional cleaning of washrooms, shared lobbies, and corridors, maintaining immaculate sanitization without student intervention.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">College Transit Proximity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Properties strategically placed within a 5 to 10 minute commute of HVPM, GCOEA, SGBAU, and main coaching clusters.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 7. SAFETY, RESIDENT WARDENS & SECURITY PROTOCOLS */}
      <section id="safety" className="py-20 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wide mb-3">
                <Shield className="w-4 h-4" />
                <span>Zero Compromise on Resident Safety</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6 leading-tight">
                24/7 Monitored Protection for Girls & Boys Residences
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
                Sending a son or daughter to another city is a significant emotional decision for parents. We eliminate anxiety with verified on-site wardens, smart visitor logs, and round-the-clock emergency support.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Dedicated Female Warden on Premise</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      All girls' residences have a full-time, resident female warden who monitors evening entry, oversees well-being, and handles urgent medical needs.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Gated Entry & Parent Pass System</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Strict 9:30 PM entry timings. Any delayed entry requires prior written approval from parents via SMS/WhatsApp confirmation.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Campus Proximity Distances</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      GCOEA: 1.2km (4 min) · HVPM: 850m (3 min walk) · SGBAU University: 2.4km (6 min) · Rajapeth Terminal: 1.6km (5 min).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reassurance Checklist Column */}
            <div className="lg:col-span-6 bg-slate-800/60 p-8 rounded-2xl border border-slate-700">
              <h3 className="font-display text-xl font-bold text-white mb-6">
                Official Standards Compliance Checklist
              </h3>

              <div className="space-y-4">
                {[
                  { title: "24/7 CCTV Recording", desc: "Corridors, entry gates, and dining areas recorded with 30-day encrypted storage." },
                  { title: "Fire Safety & Extinguishers", desc: "Inspected dry chemical fire extinguishers installed on every residential floor." },
                  { title: "Doctor on Call Network", desc: "Direct tie-up with local general physicians in Camp and Dastur Nagar." },
                  { title: "First-Aid Stations", desc: "Equipped first-aid kits and digital thermometers accessible at the warden's desk." },
                  { title: "Verified Police Verification", desc: "All housekeeping, cooks, and delivery staff possess verified background checks." }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-3 border-b border-slate-700/60 last:border-0 last:pb-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">{item.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-300">
                  Want to review premises via live video call?
                </div>
                <button
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, tourType: "WhatsApp Video Tour" }));
                    scrollToSection('inquiry');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
                >
                  Book Video Tour
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. ATTRIBUTABLE REVIEWS & CAMPUS COMMUNITY */}
      <section id="testimonials" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mx-auto text-center mb-14">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-800 tracking-wide mb-2">
              <span>Verified Testimonials</span>
              <span aria-hidden="true">·</span>
              <span>Amravati Students & Parents</span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">
              Trusted by Hundreds of Students & Families
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Real accounts from students attending major Amravati institutions and their parents.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6">
                  "Finding a quiet, secure room near GCOEA was tough until I moved to the Dastur Nagar girls stay. The female warden is genuinely attentive, Wi-Fi never cuts during exam weeks, and the tiffin food is light and healthy."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <div className="font-bold text-xs text-slate-900">Neha Deshmukh</div>
                <div className="text-[11px] text-slate-500">B.Tech 3rd Year · Govt. College of Engineering (GCOEA)</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6">
                  "As a parent from Akola, my biggest fear was food hygiene and who would watch over my daughter in a new city. Amravati Elite Stays solved both. The warden calls me if she is ever delayed, and the meals are just like home."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <div className="font-bold text-xs text-slate-900">Mrs. Sunita Patil</div>
                <div className="text-[11px] text-slate-500">Parent of 1st-Year Student (Akola, MH)</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6">
                  "The monthly cost calculator was 100% accurate. No surprise deposit cuts, no arbitrary water bills. The weekend Pithla-Bhakri and Shev Bhaji tiffin specials are fantastic after heavy study sessions."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <div className="font-bold text-xs text-slate-900">Rohan Kulkarni</div>
                <div className="text-[11px] text-slate-500">MBA Department · Sant Gadge Baba University (SGBAU)</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. SCHEDULE VISIT & VERIFIED INQUIRY FORM */}
      <section id="inquiry" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 text-white grid md:grid-cols-12">
            
            {/* Left Contact & Helpline Column (5 cols) */}
            <div className="md:col-span-5 bg-slate-950 p-8 flex flex-col justify-between border-r border-slate-800/80">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                  Direct Coordination
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">
                  Schedule an In-Person Visit or Video Tour
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-8">
                  Submit your preferred date and locality. Our property manager will confirm your slot within 2 hours and guide you directly to the residence.
                </p>

                <div className="space-y-5 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Central Operations Office</div>
                      <div className="text-slate-400">Dastur Nagar Main Road, Amravati, MH 444605</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Direct Phone Helpline</div>
                      <a href="tel:+919876543210" className="text-slate-400 hover:text-white font-mono tabular-nums">
                        +91 98765 43210
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Inquiry Email</div>
                      <div className="text-slate-400">admissions@amravatielite.com</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-800">
                <div className="text-[11px] text-slate-500">
                  Visiting Hours: Monday – Sunday (9:00 AM – 7:30 PM). Walk-ins welcome with prior phone notice.
                </div>
              </div>
            </div>

            {/* Right Booking Form Column (7 cols) */}
            <div className="md:col-span-7 p-8 bg-white text-slate-900">
              {submissionSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display text-xl font-bold text-slate-900">Visit Inquiry Received</h4>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
                    Booking Reference: <span className="font-bold text-amber-800">{submissionSuccess}</span>
                  </div>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Thank you, {formData.name}. Our resident coordinator will reach out to you at <span className="font-bold">{formData.phone}</span> to confirm your walkthrough time.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={`https://wa.me/919876543210?text=Hello%20Amravati%20Elite%20Stays,%20my%20inquiry%20reference%20is%20${submissionSuccess}.%20I%20would%20like%20to%20confirm%20my%20visit.`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      Connect on WhatsApp
                    </a>
                    <button
                      onClick={() => setSubmissionSuccess(null)}
                      className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                      <input 
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma / Sneha Patil"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">WhatsApp Mobile *</label>
                      <input 
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800 font-mono tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Locality of Interest</label>
                      <select
                        value={formData.locality}
                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800 bg-white"
                      >
                        {LOCALITIES.filter(l => l !== "All Localities").map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Residence Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800 bg-white"
                      >
                        <option value="Girls PG">Girls PG Residence</option>
                        <option value="Boys PG">Boys PG Residence</option>
                        <option value="Only Mess Service (Tiffin)">Only Mess (Tiffin Subscription)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Room Occupancy</label>
                      <select
                        value={formData.roomType}
                        onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800 bg-white"
                      >
                        <option value="Single Room">Single Room (Private)</option>
                        <option value="2-Sharing Room">2-Sharing Room (Twin)</option>
                        <option value="3-Sharing Room">3-Sharing Room (Budget)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tour Preference</label>
                      <select
                        value={formData.tourType}
                        onChange={(e) => setFormData({ ...formData, tourType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800 bg-white"
                      >
                        <option value="Physical In-Person Visit">Physical In-Person Visit</option>
                        <option value="WhatsApp Video Tour">WhatsApp Video Tour</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Preferred Visit Date & College/Institution</label>
                    <input 
                      type="text"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Visit this Saturday 4 PM · Student at SGBAU"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting Inquiry..." : "Confirm & Schedule Visit"}
                    </button>
                    <p className="text-[11px] text-slate-500 text-center mt-2">
                      Zero registration fee · No broker commission · Immediate slot confirmation
                    </p>
                  </div>

                </form>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 10. QUIET PROFESSIONAL FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-slate-800">
            
            {/* Col 1: Wordmark & Purpose */}
            <div className="space-y-3">
              <span className="font-display text-base font-bold text-white block">
                Amravati Elite Stays & Mess
              </span>
              <p className="text-slate-400 leading-relaxed text-xs">
                Dedicated student accommodations and pure Maharashtrian homestyle tiffin kitchen in Amravati, Maharashtra. Supporting local homemakers and empowering student careers.
              </p>
            </div>

            {/* Col 2: Locations Covered */}
            <div>
              <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
                Covered Localities
              </div>
              <ul className="space-y-1.5 text-slate-400">
                <li>Dastur Nagar (Near HVPM)</li>
                <li>Gadge Nagar (Near SGBAU)</li>
                <li>Camp Area (Civil Lines)</li>
                <li>Rajapeth Central</li>
                <li>Kathora Naka & Sai Nagar</li>
              </ul>
            </div>

            {/* Col 3: Campus Proximities */}
            <div>
              <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
                Nearby Campuses
              </div>
              <ul className="space-y-1.5 text-slate-400">
                <li>Govt. College of Engg (GCOEA)</li>
                <li>Sant Gadge Baba Amravati Univ (SGBAU)</li>
                <li>HVPM Degree College of PE</li>
                <li>P. R. Pote Patil College of Engg</li>
                <li>Vidyabharati Mahavidyalaya</li>
              </ul>
            </div>

            {/* Col 4: Verified Contact */}
            <div>
              <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
                Helpline & Operations
              </div>
              <div className="space-y-2 text-slate-400">
                <div>Direct: +91 98765 43210</div>
                <div>WhatsApp: +91 98765 43210</div>
                <div>Hours: 9:00 AM – 8:00 PM (Daily)</div>
                <div className="text-amber-400 font-medium">Wardens on-site 24/7</div>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <div>
              © 2026 Amravati Elite Stays & Mess. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-400 cursor-pointer">Security Policy</span>
              <span className="hover:text-slate-400 cursor-pointer">Resident Code of Conduct</span>
              <span className="hover:text-slate-400 cursor-pointer">Refund Policy</span>
            </div>
          </div>

        </div>
      </footer>

      <Toaster position="top-right" richColors />
    </div>
  );
}
