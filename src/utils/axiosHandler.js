const axios = require('axios');
const {handleError,handleSuccess} = require("./telegramLog.js");

async function makeRequest({ method, url, headers, body }) {
    try {
        const options = {
            method,
            url,
            headers,
            data: body,
        };
        
        const response = await axios(options);
        handleSuccess(`Success ${method} request to ${url}`)
        return response.data;
    } catch (error) {
        console.error(`Error making request to ${url}:`, error.message);
        handleError(`Error making request ${method} to ${url}:`, error.message);
        throw error;
    }
}

module.exports = {
    get: (url, headers) => makeRequest({ method: 'GET', url, headers }),
    post: (url, body, headers) => makeRequest({ method: 'POST', url, headers, body }),
};