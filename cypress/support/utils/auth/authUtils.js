// cypress/support/utils/auth/authUtils.js

import {
    generateValidAuth,
    generateInvalidPassword,
    generateInvalidUsername,
    generateNullAuth,
    generateEmptyAuth,
    generateNumericAuth
} from './authFactory';

/**
 * Retorna um token de acesso válido via login API
 * @returns {Promise<string>} accessToken
 */

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

/**
 * Retorna um token expirado fake (pode simular testes de segurança/401)
 * @returns {string}
 */
export function getExpiredToken() {
    return 'eyJhbGciOiJIUz...TokenExpiradoFake';
}

/**
 * Faz login via API com senha inválida e retorna a resposta
 * @returns {Promise<Response>}
 */
export function getLoginWithInvalidPassword() {
    const auth = generateInvalidPassword();

    return cy.request({
        method: 'POST',
        url: '/auth/login',
        body: auth,
        failOnStatusCode: false
    });
}

/**
 * Faz login via API com username inválido e retorna a resposta
 * @returns {Promise<Response>}
 */
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