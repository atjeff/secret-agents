/**
 * Handles incoming request
 *
 * @export
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function handleRequest(request: Request): Promise<Response> {
    // Get userAgent if it exists
    const userAgent = request.headers.get('User-Agent');
    const hashedUserAgent = btoa(userAgent);

    // Get the number of times we've heard it
    const count = Number((await USER_AGENTS_STORE.get(hashedUserAgent)) || 0);

    // Update times seen
    await USER_AGENTS_STORE.put(hashedUserAgent, String(count + 1));

    // Create json in text form
    const json = JSON.stringify({ userAgent, count }, null, 4);

    // Respond with HTML
    return new Response(json, { headers: { 'content-type': 'application/json' } });
}
