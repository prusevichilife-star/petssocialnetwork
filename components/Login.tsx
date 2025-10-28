import React, { useState } from 'react';

type LoginResult = 'success' | 'notFound' | 'suspended';

interface LoginProps {
  onLogin: (username: string) => LoginResult;
  error?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, error: initialError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = onLogin(username.trim());
    if (result === 'notFound') {
      setError('Invalid username. Please try again.');
    } else if (result === 'suspended') {
        setError('This account has been suspended. Please contact support.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="text-center">
            <div className="flex items-center justify-center mb-4">
                <svg
                className="h-10 w-10 text-indigo-500"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path d="M12.6074 8.22152C13.0125 7.84093 13.0332 7.20815 12.6526 6.80306C12.272 6.39797 11.6393 6.37728 11.2342 6.75787L11.2336 6.75841C10.8285 7.13899 10.8078 7.77178 11.1884 8.17687C11.569 8.58196 12.2018 8.60264 12.6068 8.22205L12.6074 8.22152Z" />
                <path d="M9.34961 9.1932C9.80145 8.75628 9.82725 8.05282 9.39033 7.5997C8.95341 7.14658 8.24995 7.12078 7.79683 7.5577L7.79629 7.55823C7.34317 7.99515 7.31737 8.69861 7.75429 9.15173C8.19121 9.60485 8.89467 9.63065 9.34779 9.19373L9.34961 9.1932Z" />
                <path d="M17.411 9.15545C17.8592 8.70605 17.882 8.00164 17.4326 7.55342C16.9832 7.1052 16.2788 7.128 15.8306 7.5774L15.8294 7.57857C15.3812 8.02797 15.3584 8.73238 15.8078 9.1806C16.2572 9.62882 16.9616 9.60605 17.4098 9.15665L17.411 9.15545Z" />
                <path d="M12.0002 21.3498C12.7061 21.3498 13.3852 21.1343 13.9312 20.7342C15.2631 19.7839 17.2285 17.6583 17.3481 15.1511C17.4203 13.5651 16.6343 12.1003 15.2803 11.2407C13.8833 10.352 12.0002 10.5 12.0002 10.5C12.0002 10.5 10.1171 10.352 8.72009 11.2407C7.36609 12.1003 6.58008 13.5651 6.65228 15.1511C6.77188 17.6583 8.73729 19.7839 10.0692 20.7342C10.6152 21.1343 11.2942 21.3498 12.0002 21.3498Z" />
                </svg>
                <span className="ml-2 text-3xl font-bold text-gray-800 dark:text-white">PetSocial</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">Welcome Back!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to continue</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1"> (Use: alicej, bobw, or charlieb. No password needed)</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password-login" className="sr-only">Password</label>
              <input
                id="password-login"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                placeholder="Password (ignored for demo)"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
