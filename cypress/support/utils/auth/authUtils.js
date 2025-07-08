

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
    return 'eyJhbGciOiJIUz...TokenExpiradoFake';
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