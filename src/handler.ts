/**
 * Handles incoming request
 *
 * @export
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function handleRequest(request: Request): Promise<Response> {
    // Get browser fingerprint if it exists
    const browserFingerprint = generateRequestFingerprint(request.headers);
    const hashedFingerprint = btoa(JSON.stringify(browserFingerprint));

    // Get the number of times we've heard it
    const count = Number((await REQUEST_FINGERPRINTS.get(hashedFingerprint)) || 0);

    // Update times seen using hashed value as key
    await REQUEST_FINGERPRINTS.put(hashedFingerprint, String(count + 1));

    // Create json in text form
    const json = JSON.stringify({ ...browserFingerprint, count }, null, 4);

    // Respond with JSON
    return new Response(json, { headers: { 'content-type': 'application/json' } });
}

/**
 * Creates object with specified header values, if they exist
 *
 * @param {Headers} [headers=new Headers()]
 * @returns {Record<string, string>}
 */
function generateRequestFingerprint(headers: Headers = new Headers()): Record<string, string> {
    const headerMappings = {
        userAgent: 'user-agent',
        ip: 'cf-connecting-ip',
        country: 'cf-ipcountry',
        language: 'accept-language',
    };

    return Object.keys(headerMappings).reduce((accumulator, friendlyName) => {
        const headerValue = headers.get(headerMappings[friendlyName]);

        if (headerValue) {
            accumulator[friendlyName] = headerValue;
        }

        return accumulator;
    }, {});
}
