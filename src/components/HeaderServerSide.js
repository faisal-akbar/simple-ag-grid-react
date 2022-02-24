import React from 'react';
import Toggle from './Theme/ThemeToggle';

const HeaderServerSide = ({ onSave, onLoad }) => (
    // <nav className="sticky top-0 z-30 flex justify-center items-center w-full px-4 py-4 my-0 mb-8 backdrop-filter backdrop-blur-lg bg-opacity-10 firefox:bg-opacity-90 border-b border-primary">
    <nav className="firefox:bg-opacity-90 sticky top-0 z-30 flex w-full flex-col items-center justify-between bg-opacity-10 p-4 shadow-md backdrop-blur-lg backdrop-filter sm:flex-row">
        <div className="mb-2 flex items-center sm:mb-0">
            <a
                className="ml-2 font-bold text-gray-900 hover:text-yellow-700 dark:text-gray-100 dark:hover:text-blue-400 sm:text-2xl md:ml-4"
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

        <div className="flex items-center justify-between">
            <button
                onClick={onSave}
                type="button"
                className="mx-3 cursor-pointer rounded-lg bg-gray-300 px-3 py-2"
            >
                Save
            </button>
            <button
                onClick={onLoad}
                type="button"
                className="mx-3 cursor-pointer rounded-lg bg-gray-300 px-3 py-2"
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
