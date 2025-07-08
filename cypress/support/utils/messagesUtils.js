const MessagesUtils = {
    INVALID_CREDENTIALS: 'Invalid credentials',
    USERNAME_PASSWORD_REQUIRED: 'Username and password required',
    USERNAME_INVALID: 'Username is not valid',
    TOKEN_EXPIRED: 'Token Expired!',
    TOKEN_INVALID: 'invalid token',
    INVALID_EXPIRED_TOKEN: 'Invalid/Expired Token!',
    ACCESS_TOKEN_REQUIRED: 'Access Token is required',
    USERNAME_TOLOWERCASE_ERROR: 'username.toLowerCase is not a function',

    getUserNotFoundMessage(id) {
        return `User with id '${id}' not found`;
    },

    getProductNotFoundMessage(id) {
        return `Product with id '${id}' not found`;
    }
};

export default MessagesUtils;