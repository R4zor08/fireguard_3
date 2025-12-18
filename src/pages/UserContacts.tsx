import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, SearchIcon, UsersIcon, ShieldIcon, UserIcon, HeartIcon, Trash2Icon, Edit2Icon } from 'lucide-react';
import { ContactCard, ContactType } from '../components/ContactCard';
import { ContactModal } from '../components/ContactModal';
import { LoadingState } from '../components/LoadingState';
interface Contact {
  id: string;
  name: string;
  number: string;
  type: ContactType;
  role?: string;
}
const mockContacts: Contact[] = [{
  id: '1',
  name: 'BFP Emergency',
  number: '0955-710-7810',
  type: 'emergency',
  role: 'Fire Department'
}, {
  id: '2',
  name: 'Barangay Captain',
  number: '0912-345-6789',
  type: 'official',
  role: 'Local Official'
}, {
  id: '3',
  name: 'Maria Santos',
  number: '0998-765-4321',
  type: 'personal',
  role: 'Wife'
}, {
  id: '4',
  name: 'Juan Dela Cruz Jr.',
  number: '0922-555-1234',
  type: 'personal',
  role: 'Son'
}, {
  id: '5',
  name: 'City Health Office',
  number: '0917-888-9999',
  type: 'official',
  role: 'Ambulance'
}];
export function UserContacts() {
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | ContactType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setContacts(mockContacts);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || contact.number.includes(searchQuery) || contact.role?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || contact.type === activeTab;
    return matchesSearch && matchesTab;
  });
  const handleSaveContact = (contactData: Omit<Contact, 'id'> | Contact) => {
    if ('id' in contactData && contactData.id) {
      // Edit existing
      setContacts(prev => prev.map(c => c.id === contactData.id ? contactData as Contact : c));
    } else {
      // Add new
      const newContact = {
        ...contactData,
        id: Math.random().toString(36).substr(2, 9)
      };
      setContacts(prev => [...prev, newContact]);
    }
  };
  const handleDeleteContact = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(prev => prev.filter(c => c.id !== id));
    }
  };
  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };
  const handleAddContact = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };
  if (isLoading) return <LoadingState />;
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 lg:p-8 pb-20 lg:pb-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Emergency Contacts
          </h1>
          <p className="text-slate-400">
            Manage your emergency contact list and quick dials
          </p>
        </div>
        <button onClick={handleAddContact} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/20">
          <PlusIcon className="w-5 h-5" />
          Add Contact
        </button>
      </div>

      {/* Controls */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 animate-slide-up" style={{
      animationDelay: '0.1s'
    }}>
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search contacts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
          {[{
          id: 'all',
          label: 'All',
          icon: UsersIcon
        }, {
          id: 'emergency',
          label: 'Emergency',
          icon: ShieldIcon
        }, {
          id: 'official',
          label: 'Official',
          icon: UserIcon
        }, {
          id: 'personal',
          label: 'Personal',
          icon: HeartIcon
        }].map(tab => {
          const Icon = tab.icon;
          return <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-700'}`}>
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>;
        })}
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up" style={{
      animationDelay: '0.2s'
    }}>
        <AnimatePresence>
          {filteredContacts.map(contact => <motion.div key={contact.id} layout initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.9
        }} className="relative group">
              <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEditContact(contact)} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700">
                  <Edit2Icon className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteContact(contact.id)} className="p-2 bg-slate-800 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border border-slate-700">
                  <Trash2Icon className="w-4 h-4" />
                </button>
              </div>
              <ContactCard name={contact.name} number={contact.number} type={contact.type} role={contact.role} onCall={() => console.log(`Calling ${contact.number}`)} onMessage={() => console.log(`Messaging ${contact.number}`)} />
            </motion.div>)}
        </AnimatePresence>

        {/* Add New Card Placeholder */}
        <motion.button onClick={handleAddContact} whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }} className="h-full min-h-[200px] rounded-2xl border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-900/20 hover:bg-slate-900/40 flex flex-col items-center justify-center gap-4 transition-all group">
          <div className="w-16 h-16 rounded-full bg-slate-800 group-hover:bg-cyan-500/10 flex items-center justify-center transition-colors">
            <PlusIcon className="w-8 h-8 text-slate-600 group-hover:text-cyan-400 transition-colors" />
          </div>
          <span className="text-slate-500 group-hover:text-cyan-400 font-medium transition-colors">
            Add New Contact
          </span>
        </motion.button>
      </div>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveContact} initialData={editingContact} />
    </div>;
}