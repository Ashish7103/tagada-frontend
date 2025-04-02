import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, FileText, Lock, Key } from 'lucide-react';
import tagadaHomeBg from "Images/tagadaHomeBg.png";
// import tagadalogo from "../../Images/Tagadalogo.png";
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center mb-3">
      <Icon size={16} />
    </div>
    <h4 className="font-medium mb-2">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const SecurityCard = ({ icon: Icon, title }) => (
  <div className="flex-1 p-3 bg-gray-50 rounded-lg text-center border border-gray-200">
    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-2">
      <Icon size={16} />
    </div>
    <p className="text-xs">{title}</p>
  </div>
);

const TagadaApp = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white z-50 border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* <img 
          src={tagadalogo} 
          alt="Tagada Logo" 
          className=" size-28" // Adjust height as needed
        />  */}
          <button 
            onClick={() => navigate('/signin')}
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            Login
          </button>
        </div>
      </nav>

      <main className="pt-14">
        {/* Hero Section */}
        <section className="relative h-[400px] overflow-hidden">
          {/* <img 
            src={tagadaHomeBg} 
            alt="Tagada App Background" 
            className="w-full h-full object-cover object-top" 
          />  */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70 flex flex-col justify-end px-4 pb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Buy Your Time with Our App</h2>
            <p className="text-gray-200 mb-6">Streamline your loan management with real-time tracking and automated records</p>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/signup', { state: { userType: 'moneylender' } })}
                className="flex-1 bg-black text-white py-3 rounded-md"
              >
                Moneylender Sign Up
              </button>
              <button 
                onClick={() => navigate('/signup', { state: { userType: 'borrower' } })}
                className="flex-1 bg-white text-black py-3 rounded-md border border-gray-300"
              >
                Borrower Sign Up
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-8 bg-white">
          <h3 className="text-xl font-semibold mb-6 text-center">Why Choose Tagada?</h3>
          <div className="grid grid-cols-2 gap-4">
            <FeatureCard icon={Users} title="For Moneylenders" description="Real-time tracking and automated record keeping" />
            <FeatureCard icon={FileText} title="For Borrowers" description="Clear payment history and transparent terms" />
          </div>
        </section>

        {/* Security Section */}
        <section className="px-4 py-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Security First</h4>
              <ShieldCheck size={20} className="text-black" />
            </div>
            <p className="text-sm text-gray-600 mb-4">Your data is protected with bank-level encryption and security measures</p>
            <div className="flex gap-4">
              <SecurityCard icon={Lock} title="256-bit Encryption" />
              <SecurityCard icon={Key} title="Data Privacy" />
            </div>
          </div>
        </section>
          {/* How It Works Section */}
          <section className="px-4 py-8 bg-white">
          <h3 className="text-xl font-semibold mb-6 text-center">How It Works</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4 p-3 rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">1</div>
              <div>
                <h4 className="font-medium mb-1">Sign Up & Verify</h4>
                <p className="text-sm text-gray-600">Quick registration process with secure verification</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">2</div>
              <div>
                <h4 className="font-medium mb-1">Record Loan Details</h4>
                <p className="text-sm text-gray-600">Enter loan information with customizable terms</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">3</div>
              <div>
                <h4 className="font-medium mb-1">Track Payments</h4>
                <p className="text-sm text-gray-600">Monitor repayments and get real-time updates</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TagadaApp;
