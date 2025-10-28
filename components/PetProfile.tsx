import React from 'react';
import { Pet } from '../types';
import PawIcon from './icons/PawIcon';
import CakeIcon from './icons/CakeIcon';
import TagIcon from './icons/TagIcon';

interface PetProfileProps {
  pet: Pet;
  onReturn: () => void;
}

const calculateAge = (birthdate: string): string => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 0 ? `${age} years old` : 'Less than a year old';
};

const InfoPill: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex flex-col items-center justify-center bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg text-center">
        <div className="text-indigo-500 dark:text-indigo-300 mb-2">{icon}</div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
);

const PetProfile: React.FC<PetProfileProps> = ({ pet, onReturn }) => {
  const age = calculateAge(pet.birthdate);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button
        onClick={onReturn}
        className="mb-6 px-4 py-2 text-sm bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        &larr; Back to Profile
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src={pet.avatarUrl} alt={`Photo of ${pet.name}`} />
          </div>
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{pet.name}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{pet.breed}</p>
          </div>
        </div>
        
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">About {pet.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <InfoPill icon={<PawIcon />} label="Type" value={pet.type} />
                <InfoPill icon={<TagIcon />} label="Breed" value={pet.breed} />
                <InfoPill icon={<CakeIcon />} label="Age" value={age} />
            </div>

            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{pet.bio}</p>
        </div>

        {pet.photos && pet.photos.length > 0 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4">Photo Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {pet.photos.map((photo, index) => (
                        <div key={index} className="aspect-w-1 aspect-h-1">
                            <img 
                                src={photo} 
                                alt={`${pet.name} photo ${index + 1}`} 
                                className="object-cover w-full h-full rounded-lg shadow-md hover:scale-105 transition-transform duration-200" 
                            />
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default PetProfile;