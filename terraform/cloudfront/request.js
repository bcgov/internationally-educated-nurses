// Next.js request handler
// Helper function to generate a random nonce
function generateNonce(length) {
  var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var nonce = '';
  for (var i = 0; i < length; i++) {
    nonce += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return nonce;
}

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Generate a nonce
  var nonce = Date.now(); // You can adjust the length as needed

  // Parse existing query parameters
  var url = new URL(uri); // Base URL is required but not used
  url.searchParams.append('nonce', nonce);

  // Update the request URI with the new query parameters
  request.uri = url.pathname + url.search;

  // Add nonce as a header
  request.headers['x-nonce'] = { value: nonce };

  // Convert requests ending in numbers into [step].index
  var numericMatch = uri.match(/\/([0-9]+)$/);
  if (numericMatch) {
    request.uri = uri.substring(0, uri.length - numericMatch[1].length) + '[step].html';
    return request;
  }

  // Append ".html" if no extension given
  if (uri.match(/\/[^/.]+$/)) {
    request.uri = uri + '.html';
    return request;
  }

  // Append "index.html" if ends in a /
  if (uri.match(/.+\/$/)) {
    request.uri = uri + 'index.html';
    return request;
  }

  if (uri.match(/robots.txt|sitemap.xml/)) {
    request.uri = uri.replace(/robots.txt|sitemap.xml/, 'index.html');
    return request;
  }

  return request;
}
