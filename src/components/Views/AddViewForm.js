export default function AddViewForm({ view, onAddFormSubmit, onAddInputChange }) {
    return (
        <form onSubmit={onAddFormSubmit} className="mb-8 px-3 pt-3">
            <div className="mb-4">
                <label
                    className="mb-2 block text-sm font-bold text-gray-800 dark:text-gray-100"
                    htmlFor="view"
                >
                    Create View
                </label>
                <input
                    className="focus:shadow-outline w-full appearance-none rounded border bg-slate-100 py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none dark:bg-slate-700 dark:text-gray-100"
                    name="view"
                    type="text"
                    placeholder="Create new view"
                    value={view}
                    onChange={onAddInputChange}
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                    className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
                    type="submit"
                    onClick={onAddFormSubmit}
                >
                    Add View
                </button>
            </div>
        </form>
    );
}
