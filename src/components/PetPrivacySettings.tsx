import React from 'react';
import { PetPrivacySettings, Visibility } from '../types';

interface PetPrivacySettingsProps {
  settings: PetPrivacySettings;
  onUpdate: (section: keyof PetPrivacySettings, visibility: Visibility | 'friends' | 'private') => void;
}

const PrivacySettingRow: React.FC<{
    label: string;
    description: string;
    section: keyof PetPrivacySettings;
    value: string;
    options: { value: string; label: string }[];
    onChange: (section: keyof PetPrivacySettings, value: any) => void;
}> = ({ label, description, section, value, options, onChange }) => {
    return (
        <div className="flex items-center justify-between py-4">
            <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {description}
                </p>
            </div>
            <select
                value={value}
                onChange={(e) => onChange(section, e.target.value)}
                className="w-40 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                aria-label={`Visibility for ${label}`}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    )
}

const PetPrivacySettingsComponent: React.FC<PetPrivacySettingsProps> = ({ settings, onUpdate }) => {
  const profileOptions = [
    { value: 'public', label: 'Public' },
    { value: 'friends', label: 'Friends Only' },
    { value: 'private', label: 'Private' },
  ];

  const playdateOptions = [
    { value: 'friends', label: 'Friends Only' },
    { value: 'private', label: 'Private' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Pet Privacy Settings</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Manage this pet's visibility and interactions.
      </p>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <PrivacySettingRow 
            label="Profile Visibility"
            description="Who can see this pet's profile page."
            section="profile"
            value={settings.profile}
            options={profileOptions}
            onChange={onUpdate}
        />
        <PrivacySettingRow 
            label="Playdate Requests"
            description="Who can request a playdate with this pet."
            section="playdates"
            value={settings.playdates}
            options={playdateOptions}
            onChange={onUpdate}
        />
      </div>
    </div>
  );
};

export default PetPrivacySettingsComponent;