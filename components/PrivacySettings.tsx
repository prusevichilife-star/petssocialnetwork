import React from 'react';
import { PrivacySettings, Visibility } from '../types';

interface PrivacySettingsProps {
  settings: PrivacySettings;
  onUpdate: (section: keyof PrivacySettings, visibility: Visibility) => void;
}

const PrivacySettingRow: React.FC<{
    label: string;
    section: keyof PrivacySettings;
    value: Visibility;
    onChange: (section: keyof PrivacySettings, value: Visibility) => void;
}> = ({ label, section, value, onChange }) => {
    return (
        <div className="flex items-center justify-between py-4">
            <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Control who can see this on your profile and in the feed.
                </p>
            </div>
            <select
                value={value}
                onChange={(e) => onChange(section, e.target.value as Visibility)}
                className="w-40 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                aria-label={`Visibility for ${label}`}
            >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
            </select>
        </div>
    )
}

const PrivacySettingsComponent: React.FC<PrivacySettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-2">Privacy Settings</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Manage what information you share on PetSocial.
      </p>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <PrivacySettingRow 
            label="Profile Basics"
            section="profileBasics"
            value={settings.profileBasics}
            onChange={onUpdate}
        />
        <PrivacySettingRow 
            label="Your Pets"
            section="pets"
            value={settings.pets}
            onChange={onUpdate}
        />
        <PrivacySettingRow 
            label="Your Activity"
            section="activity"
            value={settings.activity}
            onChange={onUpdate}
        />
      </div>
    </div>
  );
};

export default PrivacySettingsComponent;
