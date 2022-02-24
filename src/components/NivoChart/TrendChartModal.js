/* eslint-disable no-unused-vars */
import React from 'react';
import Modal from 'react-modal';
import { useFeature } from '../../context/featureContext';
import NivoChart from './NivoChart';

Modal.setAppElement('#root');
export default function TrendChartModal({ segment, region, category }) {
    const { showModal, setShowModal } = useFeature();

    const customStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
        },
        content: {
            position: 'absolute',
            top: '80px',
            left: '40px',
            right: '40px',
            bottom: '80px',
            border: '1px solid #ccc',
            background: '#fff',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '4px',
            outline: 'none',
            padding: '20px',
        },
    };

    return (
        <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} style={customStyles}>
            {/* <h2>Title</h2> */}
            <div className="border-blueGray-200 flex items-start justify-between rounded-t border-b border-solid px-6 py-3">
                <h3 className="text-2xl font-semibold text-black">
                    Sales by Order Date for{' '}
                    <span className="underline decoration-sky-500 underline-offset-1">
                        {segment}
                    </span>{' '}
                    Segment,{' '}
                    <span className="underline decoration-sky-500 underline-offset-1">
                        {region}
                    </span>{' '}
                    Region and{' '}
                    <span className="underline decoration-sky-500 underline-offset-1">
                        {category}
                    </span>{' '}
                    Category
                </h3>
                <button
                    type="button"
                    className="float-right ml-auto border-0 p-1 text-3xl font-semibold leading-none outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                >
                    <span className=" block h-6 w-6 text-2xl text-red-800 outline-none focus:outline-none">
                        ×
                    </span>
                </button>
            </div>
            <div className="relative flex-auto p-6">
                <NivoChart segment={segment} region={region} category={category} />
            </div>
            {/* <div className="flex items-center justify-end p-3 border-t border-solid border-blueGray-200 rounded-b">
                <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                >
                    Close
                </button>
            </div> */}
        </Modal>
    );
}
