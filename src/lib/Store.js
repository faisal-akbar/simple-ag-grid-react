const Store = (store) => ({
    setItem: (key, item) => {
        if (!key) {
            return null;
        }
        return store.setItem(key, JSON.stringify(item));
    },
    getItem: (key) => {
        if (!key) {
            return null;
        }
        return JSON.parse(store.getItem(key));
    },
    clear: () => store.clear(),
});

export default Store;
