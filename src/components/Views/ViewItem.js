import { PencilAltIcon, TrashIcon, UploadIcon } from '@heroicons/react/solid';

export default function ViewItem({ view, onLoad, onEditClick, onDeleteClick }) {
    return (
        <li key={view.id} className="my-4 flex justify-between border-b border-slate-600 px-3">
            {view.text}
            <span className="flex space-x-2 rounded-full transition duration-500 ease-in-out">
                {/* <button type="button" onClick={() => onLoad(view)}> */}
                <UploadIcon
                    onClick={() => onLoad(view)}
                    className="h-4 w-4 cursor-pointer text-2xl text-emerald-500 dark:text-emerald-400"
                />
                <PencilAltIcon
                    onClick={() => onEditClick(view)}
                    className="h-4 w-4 cursor-pointer text-2xl text-blue-500 dark:text-blue-400"
                />
                <TrashIcon
                    onClick={() => onDeleteClick(view.id)}
                    className="h-4 w-4 cursor-pointer text-2xl text-red-800 dark:text-red-400"
                />
                {/* </button> */}
                {/* <button type="button" onClick={() => onEditClick(todo)}>
                    Edit
                </button>
                <button type="button" onClick={() => onDeleteClick(todo.id)}>
                    Delete
                </button> */}
            </span>
        </li>
    );
}
