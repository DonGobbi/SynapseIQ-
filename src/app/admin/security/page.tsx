'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaKey, FaLock, FaShieldAlt, FaUserLock, FaHistory, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  lastUpdated?: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed?: string;
  permissions: string[];
}

export default function SecurityPage() {
  const { isAuthenticated } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch security settings and API keys from backend
  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        // Fetch security settings
        const settingsResponse = await fetch(`${apiUrl}/security/settings`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!settingsResponse.ok) {
          throw new Error(`Error fetching settings: ${settingsResponse.status}`);
        }

        const settingsData = await settingsResponse.json();
        setSecuritySettings(settingsData);

        // Fetch API keys
        const keysResponse = await fetch(`${apiUrl}/security/api-keys`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!keysResponse.ok) {
          throw new Error(`Error fetching API keys: ${keysResponse.status}`);
        }

        const keysData = await keysResponse.json();
        setApiKeys(keysData);
      } catch (error) {
        console.error('Failed to fetch security data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityData();
  }, []);

  const handleToggleSetting = async (id: string) => {
    try {
      const currentSetting = securitySettings.find(s => s.id === id);
      if (!currentSetting) return;

      const newEnabledState = !currentSetting.enabled;

      setSecuritySettings(prevSettings =>
        prevSettings.map(setting =>
          setting.id === id
            ? { ...setting, enabled: newEnabledState }
            : setting
        )
      );

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/security/settings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          enabled: newEnabledState,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update setting: ${response.status}`);
      }

      const updatedSetting = await response.json();

      setSecuritySettings(prevSettings =>
        prevSettings.map(setting =>
          setting.id === id ? updatedSetting : setting
        )
      );
    } catch (error) {
      console.error('Failed to update security setting:', error);

      setSecuritySettings(prevSettings =>
        prevSettings.map(setting =>
          setting.id === id
            ? { ...setting, enabled: !setting.enabled }
            : setting
        )
      );
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to change password');
      }

      const result = await response.json();
      setPasswordSuccess(result.message || 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Failed to change password:', error);
      setPasswordError(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const [newKeyName, setNewKeyName] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKeyData, setNewKeyData] = useState<ApiKey | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['read:data']);

  const handleCreateApiKey = async () => {
    if (!newKeyName) {
      setNewKeyName('New API Key');
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/security/api-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newKeyName || 'New API Key',
          permissions: selectedPermissions
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create API key: ${response.status}`);
      }

      const newKey = await response.json();

      setNewKeyData(newKey);
      setShowKeyModal(true);

      setApiKeys([{
        ...newKey,
        key: `sk_live_${'•'.repeat(26)}`
      }, ...apiKeys]);

      setNewKeyName('');
      setSelectedPermissions(['read:data']);
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    try {
      setApiKeys(apiKeys.filter(key => key.id !== id));

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/security/api-keys/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete API key: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to delete API key:', error);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      try {
        const response = await fetch(`${apiUrl}/security/api-keys`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const keysData = await response.json();
          setApiKeys(keysData);
        }
      } catch (e) {
        console.error('Failed to refetch API keys:', e);
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';

    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Security Settings
          </motion.h1>
          <Link href="/admin" className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
            Back to Dashboard
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
            >
              <div className="flex items-center mb-4">
                <FaLock className="text-blue-600 dark:text-blue-400 mr-2" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h2>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-gray-500 dark:text-gray-400" />
                      ) : (
                        <FaEye className="text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {passwordError && (
                  <div className="text-red-600 dark:text-red-400 text-sm">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="text-green-600 dark:text-green-400 text-sm">
                    {passwordSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
            >
              <div className="flex items-center mb-4">
                <FaShieldAlt className="text-blue-600 dark:text-blue-400 mr-2" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security Features</h2>
              </div>

              <div className="space-y-6">
                {securitySettings.map((setting) => (
                  <div key={setting.id} className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{setting.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{setting.description}</p>
                      {setting.lastUpdated && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Last updated: {formatDate(setting.lastUpdated)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer" htmlFor={`toggle-${setting.id}`}>
                        <input
                          id={`toggle-${setting.id}`}
                          type="checkbox"
                          className="sr-only peer"
                          checked={setting.enabled}
                          onChange={() => handleToggleSetting(setting.id)}
                          aria-label={`Toggle ${setting.name}`}
                          title={`Enable or disable ${setting.name}`}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  href="/admin/security/activity"
                  className="text-blue-600 dark:text-blue-400 text-sm flex items-center hover:underline"
                >
                  <FaHistory className="mr-1" />
                  View security activity log
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaKey className="text-blue-600 dark:text-blue-400 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">API Keys</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <label htmlFor="apiKeyName" className="sr-only">API Key Name</label>
                  <input
                    id="apiKeyName"
                    type="text"
                    placeholder="API Key Name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-2 py-1"
                    aria-label="API Key Name"
                  />
                  <button
                    onClick={handleCreateApiKey}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md transition duration-300"
                  >
                    Create New
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{apiKey.name}</h3>
                      <button
                        onClick={() => handleDeleteApiKey(apiKey.id)}
                        className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Revoke
                      </button>
                    </div>
                    <p className="text-xs font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded mt-2">
                      {apiKey.key}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {apiKey.permissions.map((permission, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-0.5 rounded"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <p>Created: {formatDate(apiKey.created)}</p>
                      {apiKey.lastUsed && <p>Last used: {formatDate(apiKey.lastUsed)}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                <p>API keys provide access to your account's data. Keep them secure!</p>
              </div>
            </motion.div>
          </div>
        )}

        {showKeyModal && newKeyData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">New API Key Created</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Copy your API key now. For security reasons, it won't be shown again.
              </p>

              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded mb-4">
                <p className="font-mono text-sm break-all">{newKeyData.key}</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowKeyModal(false);
                    setNewKeyData(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
