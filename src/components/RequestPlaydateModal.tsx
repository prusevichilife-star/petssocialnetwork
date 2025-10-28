
import React from 'react';
import { User, Pet } from '../types';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface RequestPlaydateModalProps {
  currentUser: User;
  targetUser: User;
  targetPet: Pet;
  onClose: () => void;
  onSendRequest: (fromPetId: string, date: string, location: string) => void;
}

const RequestPlaydateModal: React.FC<RequestPlaydateModalProps> = ({
  currentUser,
  targetUser,
  targetPet,
  onClose,
  onSendRequest,
}) => {
  const [selectedPetId, setSelectedPetId] = React.useState(currentUser.pets[0]?.id || '');
  const [date, setDate] = React.useState(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [location, setLocation] = React.useState('Central Park');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId || !date || !location) return;
    onSendRequest(selectedPetId, new Date(date).toISOString(), location);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Request a Playdate</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <XMarkIcon className="h-5 w-5"/>
          </button>
        </div>
        
        <div className="flex items-center justify-center space-x-4 mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
                <img src={currentUser.pets.find(p => p.id === selectedPetId)?.avatarUrl || ''} className="h-16 w-16 rounded-full mx-auto" />
                <p className="text-sm font-semibold mt-1">{currentUser.pets.find(p => p.id === selectedPetId)?.name}</p>
            </div>
            <span className="text-xl font-bold text-gray-400 dark:text-gray-500">&harr;</span>
            <div className="text-center">
                <img src={targetPet.avatarUrl} className="h-16 w-16 rounded-full mx-auto" />
                <p className="text-sm font-semibold mt-1">{targetPet.name}</p>
            </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="your-pet" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Pet</label>
              <select
                id="your-pet"
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-900"
              >
                {currentUser.pets.map(pet => (
                  <option key={pet.id} value={pet.id}>{pet.name}</option>
                ))}
              </select>
            </div>
             <div>
              <label htmlFor="playdate-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proposed Date</label>
              <input 
                type="date"
                id="playdate-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-900"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label htmlFor="playdate-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <input 
                type="text"
                id="playdate-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-900"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700" disabled={!selectedPetId}>Send Request</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestPlaydateModal;
