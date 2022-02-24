import { css } from '@emotion/react';
import React from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: none;
`;
const PreLoader = ({ isLoading }) => (
    <div className="mt-5 flex items-center justify-center">
        <PulseLoader color="#36D7B7" loading={isLoading} css={override} size={20} />
    </div>
);

export default PreLoader;
