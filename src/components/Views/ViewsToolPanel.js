/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useFeature } from '../../context/featureContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import AddViewForm from './AddViewForm';
import EditForm from './EditForm';
import ViewItem from './ViewItem';

const addViewNotify = () => toast('Added View');
const updateViewNotify = () => toast('Updated the View');
const deleteViewNotify = () => toast('Deleted the View');
const loadViewNotify = () => toast('Loaded the View');

export default function ViewsToolPanel(props) {
    // const [views, setViews] = useState(() => {
    //     const savedViews = localStorage.getItem('views');
    //     if (savedViews) {
    //         return JSON.parse(savedViews);
    //     }
    //     return [];
    // });
    // useEffect(() => {
    //     localStorage.setItem('views', JSON.stringify(views));
    // }, [views]);
    const { localKey } = useFeature();
    const [views, setViews] = useLocalStorage(localKey, []);
    const [view, setView] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentView, setCurrentView] = useState({});

    function handleAddInputChange(e) {
        setView(e.target.value);
    }

    function handleEditInputChange(e) {
        setCurrentView({
            ...currentView,
            text: e.target.value,
            filterState: props.api.getFilterModel(),
            columnState: props.columnApi.getColumnState(),
        });
        console.log(currentView);
    }

    function handleAddFormSubmit(e) {
        e.preventDefault();

        if (view !== '') {
            setViews([
                ...views,
                {
                    id: new Date(),
                    text: view.trim(),
                    filterState: props.api.getFilterModel(),
                    columnState: props.columnApi.getColumnState(),
                },
            ]);
            addViewNotify();
        }

        setView('');
    }

    function handleEditFormSubmit(e) {
        e.preventDefault();

        // eslint-disable-next-line no-use-before-define
        handleUpdateView(currentView.id, currentView);
        updateViewNotify();
    }

    function handleDeleteClick(id) {
        const removeItem = views.filter((view) => view.id !== id);
        setViews(removeItem);
        deleteViewNotify();
    }

    function handleUpdateView(id, updatedTodo) {
        const updatedItem = views.map((view) => (view.id === id ? updatedTodo : view));
        setIsEditing(false);
        setViews(updatedItem);
    }

    function handleEditClick(view) {
        setIsEditing(true);
        setCurrentView({ ...view });
    }

    const onLoadFilterAndColumnState = (selectedView) => {
        // const viewId = views.find((view) => view.id === id);
        console.log(selectedView);

        const obj = selectedView;

        if (obj.filterState) {
            console.log(obj.filterState);
            props.api.setFilterModel(obj.filterState);
        }
        if (obj.columnState) {
            props.columnApi.applyColumnState({
                state: obj.columnState,
                applyOrder: true,
            });
        }
        loadViewNotify();
    };

    return (
        <>
            <div>
                {isEditing ? (
                    <EditForm
                        currentView={currentView}
                        setIsEditing={setIsEditing}
                        onEditInputChange={handleEditInputChange}
                        onEditFormSubmit={handleEditFormSubmit}
                    />
                ) : (
                    <AddViewForm
                        view={view}
                        onAddInputChange={handleAddInputChange}
                        onAddFormSubmit={handleAddFormSubmit}
                    />
                )}

                <ul className="list-none">
                    {views.map((view) => (
                        <ViewItem
                            view={view}
                            onLoad={onLoadFilterAndColumnState}
                            onEditClick={handleEditClick}
                            onDeleteClick={handleDeleteClick}
                        />
                    ))}
                </ul>
            </div>
            <Toaster
                toastOptions={{
                    className: 'bg-gray-700 dark:bg-gray-100 text-white dark:text-gray-900',
                }}
            />
        </>
    );
}
