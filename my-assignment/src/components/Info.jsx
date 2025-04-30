import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaLink, FaTwitter, FaBuilding } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { useTheme } from './ThemeContext';

export default function DisplayInfo() {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  const fetchDisplayInfo = async (query = 'octocat') => {
    setIsLoading(true);
    setError(false);
    try {
      const response = await fetch(`https://api.github.com/users/${query}`);
      if (!response.ok) throw new Error('No Result!!! User not found.');
      const data = await response.json();
      setUser(data);
    } catch {
      setError(true);
      setUser({});
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      fetchDisplayInfo(trimmed);
    } else {
      setError(true);
      setUser({});
    }
  };

  useEffect(() => {
    fetchDisplayInfo(); 
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'bg-[#141D2F] text-white' : 'bg-[#F6F8FF] text-gray-900'} min-h-screen py-10 transition-all`}>
      <div className="max-w-2xl mx-auto px-4 flex flex-col gap-8">

        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="font-bold text-2xl">devfinder</h1>
          <ThemeToggle />
        </header>

        {/* Search Form */}
        <form onSubmit={handleSearch} className={`relative flex items-center rounded-xl shadow-md px-4 py-2 ${isDark ? 'bg-[#1E2A47]' : 'bg-white'}`}>
          <input
            type="text"
            name="username"
            placeholder="Search GitHub username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-transparent text-sm outline-none px-2 py-2"
          />
          {error && (
            <span className="absolute left-80 text-red-500 text-sm font-semibold">No results!!! User not found.</span>
          )}
          <button
            type="submit"
            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg text-sm"
          >
            Search
          </button>
        </form>

        {/* Loading */}
        {isLoading ? (
          <p className="text-center italic text-gray-400">Loading...</p>
        ) : (
          // Profile Card
          <div className={`rounded-xl p-6 shadow-lg ${isDark ? 'bg-[#1E2A47]' : 'bg-white'} transition-all`}>
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={user.avatar_url || 'https://github.com/octocat.png'}
                alt={user.login || 'octocat'}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between mb-2">
                  <div>
                    <h2 className="font-bold text-xl">{user.name || 'The Octocat'}</h2>
                    <p className="text-blue-400">@{user.login || 'octocat'}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Joined {user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {user.bio || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec odio. Quisque volutpat mattis eros.'}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-4 text-center mt-6 rounded-lg py-4 ${isDark ? 'bg-[#141D2F]' : 'bg-[#F6F8FF]'}`}>
              <div>
                <p className="text-xs text-gray-400">Repos</p>
                <p className="font-bold text-lg">{user.public_repos ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Followers</p>
                <p className="font-bold text-lg">{user.followers ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Following</p>
                <p className="font-bold text-lg">{user.following ?? 0}</p>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt /> {user.location || 'San Francisco'}
              </p>
              <p className="flex items-center gap-2">
                <FaLink />
                {user.blog ? (
                  <a
                    href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.blog}
                  </a>
                ) : (
                  'https://github.blog'
                )}
              </p>
              <p className="flex items-center gap-2">
                <FaTwitter /> {user.twitter_username ? `@${user.twitter_username}` : 'Twitter'}
              </p>
              <p className="flex items-center gap-2">
                <FaBuilding /> {user.company || 'GitHub'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
