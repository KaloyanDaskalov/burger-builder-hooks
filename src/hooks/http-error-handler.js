import { useEffect, useState } from 'react';

const useHttpErrorHandler = httpClient => {
    const [error, setError] = useState(null);

    const { request, response } = httpClient.interceptors;

    const reqInterceptor = request.use(req => {
        setError(null);
        return req;
    });
    const resInterceptor = response.use(res => res, err => {
        setError(err);
        return Promise.reject(err);
    });

    const errorConfirmedHandler = () => {
        setError(null);
    };


    useEffect(() => {
        return () => {
            request.eject(reqInterceptor);
            response.eject(resInterceptor);
        };
    }, [reqInterceptor, resInterceptor, request, response]);

    return [error, errorConfirmedHandler];
};

export default useHttpErrorHandler;