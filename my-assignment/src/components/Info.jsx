import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaLink, FaTwitter, FaBuilding } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { useTheme } from './ThemeContext';

export default function DisplayInfo() {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false); // NEW: track error
  const { theme } = useTheme();

  async function fetchDisplayInfo(query) {
    setIsLoading(true);
    setError(false);
    try {
      const response = await fetch(`https://api.github.com/users/${query}`);
      if (!response.ok) {
        throw new Error('No Result!');
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Unable to fetch data", error);
      setError(true);
      setUser({});
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.username.value.trim();
    if (searchTerm) {
      fetchDisplayInfo(searchTerm);
    }
  };

  useEffect(() => {
    fetchDisplayInfo();
  }, []);

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F6F8FF]'} min-h-screen py-10 transition-all`}>
      <div className="max-w-2xl mx-auto px-4 flex flex-col gap-8">
        
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="font-bold text-2xl">devfinder</h1>
          <ThemeToggle />
        </header>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className={`flex items-center rounded-xl shadow-md p-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <input
            type="text"
            name="username"
            placeholder="Search GitHub username..."
            className="flex-grow px-4 py-2 bg-transparent text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg text-sm"
          >
            Search
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <p className="text-center text-red-500 font-semibold">No results found. Try another username!</p>
        )}

        {/* User Info */}
        {!error && (
          isLoading ? (
            <p className="text-center text-gray-400 italic">Loading...</p>
          ) : (
            <div className={`rounded-xl shadow-md p-8 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} flex flex-col gap-6`}>
              
              {/* Top Section */}
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Avatar */}
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                />
                
                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div>
                      <h2 className="font-bold text-2xl">{user.name || ""}</h2>
                      <p className="text-blue-500">@{user.login}</p>
                    </div>
                    <time className="text-gray-400 text-sm">
                      Joined {user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                    </time>
                  </div>

                  {/* Bio */}
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                    {user.bio || "This profile has no bio"}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className={`rounded-lg p-6 flex justify-around text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-[#F6F8FF]'}`}>
                <div>
                  <p className="text-xs text-gray-500">Repos</p>
                  <p className="font-bold text-lg">{user.public_repos}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Followers</p>
                  <p className="font-bold text-lg">{user.followers}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Following</p>
                  <p className="font-bold text-lg">{user.following}</p>
                </div>
              </div>

              {/* Bottom Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt /> {user.location || ''}
                </p>
                <p className="flex items-center gap-2">
                  <FaLink />
                  {user.blog ? (
                    <a
                      href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-500"
                    >
                      {user.blog}
                    </a>
                  ) : (
                    'Not Available'
                  )}
                </p>
                <p className="flex items-center gap-2">
                  <FaTwitter />
                  {user.twitter_username ? `@${user.twitter_username}` : ''}
                </p>
                <p className="flex items-center gap-2">
                  <FaBuilding /> {user.company ||''}
                </p>
              </div>

            </div>
          )
        )}
      </div>
    </div>
  );
}
