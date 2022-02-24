export default function EditForm({
    currentView,
    setIsEditing,
    onEditInputChange,
    onEditFormSubmit,
}) {
    return (
        <form onSubmit={onEditFormSubmit} className="mb-8 px-3 pt-3">
            <label
                htmlFor="updateView"
                className="mb-2 block text-sm font-bold text-gray-800 dark:text-gray-100"
            >
                Edit View
            </label>
            <input
                className="focus:shadow-outline w-full appearance-none rounded border bg-slate-100 py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none dark:bg-slate-700 dark:text-gray-100"
                name="updateView"
                type="text"
                placeholder="Edit View"
                value={currentView.text}
                onChange={onEditInputChange}
            />
            <div className="my-4 space-x-2">
                <button
                    type="submit"
                    className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
                    onClick={onEditFormSubmit}
                >
                    Update
                </button>
                <button
                    type="button"
                    className="focus:shadow-outline rounded bg-amber-600 py-2 px-4 font-bold text-white hover:bg-amber-700 focus:outline-none"
                    onClick={() => setIsEditing(false)}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
