/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useContext, useState } from 'react';

const FeatureContext = createContext();

function FeatureContextProvider({ children }) {
    const [showModal, setShowModal] = useState(false);
    const [localKey, setLocalKey] = useState('');

    return (
        <FeatureContext.Provider
            value={{
                showModal,
                setShowModal,
                localKey,
                setLocalKey,
            }}
        >
            {children}
        </FeatureContext.Provider>
    );
}

export default FeatureContextProvider;

// Create a hook to use the FeatureContext, this is a Kent C. Dodds pattern
export function useFeature() {
    const context = useContext(FeatureContext);
    if (context === undefined) {
        throw new Error('Context must be used within a Provider');
    }
    return context;
}
