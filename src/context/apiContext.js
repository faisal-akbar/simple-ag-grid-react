import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { FILTERS_URL } from '../Workers/constants';

const APIContext = createContext();

function APIContextProvider({ children }) {
    const [segmentFilter, setSegmentFilter] = useState([]);
    const [regionFilter, setRegionFilter] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState([]);
    const [subCategoryFilter, setSubCategoryFilter] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(FILTERS_URL)
            .then((res) => res.json())
            .then((data) => {
                const newObj = Object.fromEntries(
                    Object.entries(data[0]).map(([k, v]) => [k.toLowerCase(), v])
                );
                console.log(newObj);
                const segment = data[0].map((item) => item.segment);
                const region = data[1].map((item) => item.region);
                const category = data[2].map((item) => item.category);
                const subCategory = data[3].map((item) => item.sub_category);
                setSegmentFilter(segment);
                setRegionFilter(region);
                setCategoryFilter(category);
                setSubCategoryFilter(subCategory);
                setIsLoading(false);
            })
            .catch((err) => console.log(err));
    }, []);

    const value = useMemo(
        () => [isLoading, segmentFilter, regionFilter, categoryFilter, subCategoryFilter],
        [categoryFilter, isLoading, regionFilter, segmentFilter, subCategoryFilter]
    );

    return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
}

export default APIContextProvider;

// Create a hook to use the APIContext, this is a Kent C. Dodds pattern
export function useAPI() {
    const context = useContext(APIContext);
    if (context === undefined) {
        throw new Error('Context must be used within a Provider');
    }
    return context;
}
