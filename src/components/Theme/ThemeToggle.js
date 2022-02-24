import { MoonIcon, SunIcon } from '@heroicons/react/solid';
import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const Toggle = () => {
    const { theme, setTheme } = useContext(ThemeContext);
    return (
        <div className="rounded-full p-2 transition duration-500 ease-in-out">
            {theme === 'dark' ? (
                <SunIcon
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="h-5 w-5 cursor-pointer text-2xl text-gray-500 dark:text-gray-400"
                />
            ) : (
                <MoonIcon
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="h-5 w-5 cursor-pointer text-2xl text-gray-500 dark:text-gray-400"
                />
            )}
        </div>
    );
};
export default Toggle;
