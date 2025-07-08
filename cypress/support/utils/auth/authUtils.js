

import {
    generateValidAuth,
    generateInvalidPassword,
    generateInvalidUsername,
    generateNullAuth,
    generateEmptyAuth,
    generateNumericAuth
} from './authFactory';

export function getValidToken() {
    const auth = generateValidAuth();

    return cy.request({
        method: 'POST',
        url: '/auth/login',
        body: auth,
        failOnStatusCode: false
    }).then((res) => {
        const {
            accessToken,
            refreshToken,
            ...user
        } = res.body;

        return {
            accessToken,
            refreshToken,
            userData: {
                ...user,
                status: res.status // agora userData tem o status embutido
            }
        };
    });
}
export function getValidUser() {
    const auth = generateValidAuth();
    return auth
}


export function getInvalidToken() {
    return 'invalid.token.exemplo';
}


export function getExpiredToken() {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJlbWlseXMiLCJlbWFpbCI6ImVtaWx5LmpvaG5zb25AeC5kdW1teWpzb24uY29tIiwiZmlyc3ROYW1lIjoiRW1pbHkiLCJsYXN0TmFtZSI6IkpvaG5zb24iLCJnZW5kZXIiOiJmZW1hbGUiLCJpbWFnZSI6Imh0dHBzOi8vZHVtbXlqc29uLmNvbS9pY29uL2VtaWx5cy8xMjgiLCJpYXQiOjE3NTE4OTE5ODEsImV4cCI6MTc1MTg5NTU4MX0.lZfLMzJHz-LnHzw3FvdShTkVBt3-aUUDO6b4iNwFHTk';
}


export function getLoginWithInvalidPassword() {
    const auth = generateInvalidPassword();

    return cy.request({
        method: 'POST',
        url: '/auth/login',
        body: auth,
        failOnStatusCode: false
    });
}


export function getLoginWithUsernameInvalid() {
    const auth = generateInvalidUsername();

    return cy.request({
        method: 'POST',
        url: '/auth/login',
        body: auth,
        failOnStatusCode: false
    });
}

export function getLoginWithEmptyAuth() {
    const auth = generateEmptyAuth();

    return cy.request({
        method: 'POST',
        url: '/auth/login',
        body: auth,
        failOnStatusCode: false
    });
}
export function getLoginWithNullAuth() {
    const auth = generateNullAuth();

    return cy.request({
        method: 'POST',
        url: '/auth/login',
        body: auth,
        failOnStatusCode: false
    });
}

export function getLoginWithNumericAuth() {
    const auth = generateNumericAuth();

    return cy.request({
        method: 'POST',
        url: '/auth/login',
        body: auth,
        failOnStatusCode: false
    });
}