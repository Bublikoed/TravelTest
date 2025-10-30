import React from 'react';
import { Loader } from '../../ui/Loader';
import './ContentStateBox.css';

const statusTextMap: Record<number, { header: string; text: string }> = {
    400: {
        header: '400 Некоректний запит',
        text: 'Перевірте обовʼязкові параметри та спробуйте ще раз.',
    },
    402: {
        header: '402 Payment Required',
        text: 'The request requires payment.',
    },
    403: {
        header: '403 Заборонено',
        text: 'У вас немає дозволу для виконання цього запиту.',
    },
    404: {
        header: '404 Не знайдено',
        text: 'Ресурс з таким ідентифікатором не знайдено.',
    },
    425: {
        header: '425 Занадто рано',
        text: 'Результати ще не готові. Будь ласка, зачекайте.',
    },
    500: {
        header: '500 Внутрішня помилка сервера',
        text: 'Сталася неочікувана помилка. Спробуйте пізніше.',
    },
    502: {
        header: '502 Помилкова шлюзова відповідь',
        text: 'Отримано некоректну відповідь від проміжного сервера.',
    },
};

type ContentStateBoxProps = {
    isLoading?: boolean;
    isError?: boolean;
    statusCode?: number | null | undefined;
    message?: string | null;
    children?: React.ReactNode | React.ReactNode[] | null;
};

function ContentStateBox({
    isLoading = false,
    isError = false,
    statusCode = null,
    message = null,
    children = null,
}: ContentStateBoxProps): React.ReactElement | null {
    if (isLoading) {
        return (
            <div className="content-state-box">
                <Loader />
            </div>
        );
    }

    if (isError) {
        const current = statusTextMap[statusCode ?? 500] || {
            header: 'Невідома помилка',
            text: 'Сталася непередбачувана помилка.',
        };

        return (
            <div className="content-state-box">
                <div className="error-box">
                    <h2>{current.header}</h2>
                    <p>{message ?? current.text}</p>
                </div>
            </div>
        );
    }

    return <div className="content-state-box">{children}</div>;
}

export default ContentStateBox;
