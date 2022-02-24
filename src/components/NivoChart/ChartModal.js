import React from 'react';
import { useFeature } from '../../context/featureContext';
import NivoChart from './NivoChart';

export default function ChartModal({ segment, region, category }) {
    const { showModal, setShowModal } = useFeature();
    return (
        <>
            {/* <button
                className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(true)}
            >
                Open regular modal
            </button> */}
            {showModal ? (
                <>
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
                        <div className="relative my-6 mx-auto w-auto max-w-7xl">
                            {/* content */}
                            <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                                {/* header */}
                                <div className="border-blueGray-200 flex items-start justify-between rounded-t border-b border-solid p-5">
                                    <h3 className="text-2xl font-semibold text-black">
                                        Sales by Order Date for {segment} Segment, {region} Region
                                        and {category} Category
                                    </h3>
                                    <button
                                        type="button"
                                        className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/* body */}
                                <div className="relative flex-auto p-6">
                                    <NivoChart
                                        segment={segment}
                                        region={region}
                                        category={category}
                                    />
                                </div>
                                {/* footer */}
                                <div className="border-blueGray-200 flex items-center justify-end rounded-b border-t border-solid p-6">
                                    <button
                                        className="background-transparent mr-1 mb-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                    {/* <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Save Changes
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 z-40 bg-black opacity-25" />
                </>
            ) : null}
        </>
    );
}
