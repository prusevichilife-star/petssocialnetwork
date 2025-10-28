
import React from 'react';

interface MfaProps {
  onSubmit: (trustDevice: boolean) => void;
}

const Mfa: React.FC<MfaProps> = ({ onSubmit }) => {
  const [code, setCode] = React.useState('');
  const [trustDevice, setTrustDevice] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Simulate MFA code check
    if (code === '123456') {
      onSubmit(trustDevice);
    } else {
      setError('Invalid code. Please enter 123456.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Two-Factor Authentication</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Enter the 6-digit code from your authenticator app.
            </p>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1"> (Use code: 123456)</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="mfa-code" className="sr-only">Verification Code</label>
              <input
                id="mfa-code"
                name="code"
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 text-center tracking-[0.5em] font-mono text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                placeholder="_ _ _ _ _ _"
                required
              />
            </div>
            <div className="flex items-center">
                <input
                    id="trust-device"
                    name="trust-device"
                    type="checkbox"
                    checked={trustDevice}
                    onChange={(e) => setTrustDevice(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="trust-device" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Trust this device for 30 days
                </label>
            </div>
          </div>
           {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Mfa;
