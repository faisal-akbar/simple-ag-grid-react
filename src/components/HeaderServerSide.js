import React from 'react';
import Toggle from './Theme/ThemeToggle';

const HeaderServerSide = ({ onSave, onLoad }) => (
    // <nav className="sticky top-0 z-30 flex justify-center items-center w-full px-4 py-4 my-0 mb-8 backdrop-filter backdrop-blur-lg bg-opacity-10 firefox:bg-opacity-90 border-b border-primary">
    <nav className="sticky top-0 z-30 flex flex-col sm:flex-row justify-between items-center w-full shadow-md p-4 backdrop-filter backdrop-blur-lg bg-opacity-10 firefox:bg-opacity-90">
        <div className="mb-2 sm:mb-0 flex items-center">
            <a
                className="sm:text-2xl font-bold text-gray-900 dark:text-gray-100 ml-2 md:ml-4 hover:text-yellow-700 dark:hover:text-blue-400"
                href="https://www.ag-grid.com/"
                target="_blank"
                rel="noreferrer"
            >
                {/* <img src={profilePic} alt="Profile" /> */}
                AG GRID
            </a>
            <div className="ml-2 sm:hidden">
                <Toggle />
            </div>
        </div>

        <div className="flex justify-between items-center">
            <button
                onClick={onSave}
                type="button"
                className="mx-3 px-3 py-2 bg-gray-300 rounded-lg cursor-pointer"
            >
                Save
            </button>
            <button
                onClick={onLoad}
                type="button"
                className="mx-3 px-3 py-2 bg-gray-300 rounded-lg cursor-pointer"
            >
                Load
            </button>
            <div className="ml-2 hidden sm:inline">
                <Toggle />
            </div>
        </div>
    </nav>
    // </nav>
);

export default HeaderServerSide;