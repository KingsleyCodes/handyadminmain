// components/SignOutButton.js
'use client';

import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { FaSignOutAlt } from 'react-icons/fa';
import { auth } from '@/app/lib/db';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      type="button"
      className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200/80 transition-colors duration-200 cursor-pointer"
    >
      <FaSignOutAlt />
      <span>Sign Out</span>
    </button>
  );
}