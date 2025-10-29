import React from 'react';
import './ContentStateBox.css';

const statusTextMap = {
    402: {
        header: 'alert.payment_required.title',
        text: 'alert.payment_required.description',
    },
    403: {
        header: 'alert.access_denied.title',
        text: 'alert.access_denied.description',
    },
    404: {
        header: 'alert.page_not_found.title',
        text: 'alert.page_not_found.description',
    },
    500: {
        header: 'alert.internal_server_error.title',
        text: 'alert.internal_server_error.description',
    },
    502: {
        header: 'alert.bad_gateway.title',
        text: 'alert.bad_gateway.description',
    },
    503: {
        header: 'alert.service_temporarily_unavailable.title',
        text: 'alert.service_temporarily_unavailable.description',
    },
};

type ContentStateBoxProps = {
    isLoading?: boolean;
    isError?: boolean;
    statusCode?: number | null | undefined;
    children?: React.ReactNode | React.ReactNode[] | null;
};
function ContentStateBox({
    isLoading = false,
    isError = false,
    statusCode = null,
    children = null,
}: ContentStateBoxProps): React.ReactElement | null {
    // const currentStatusText = statusTextMap[statusCode] || {};

    // if (isLoading) {
    //     return <Loader />;
    // }
    // if (isError) {

    // }

    return <div>{children}</div>;
}

export default ContentStateBox;
