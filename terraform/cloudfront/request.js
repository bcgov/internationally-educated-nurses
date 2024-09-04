// Next.js request handler
// Helper function to generate a random nonce
function generateNonce(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  for (let i = 0; i < length; i++) {
    nonce += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return nonce;
}

function handler(event) {
  var request = event.request;

  // Generate a nonce
  var nonce = generateNonce(16); // You can adjust the length as needed

  // Optionally, you might want to pass the nonce as a custom header or embed it in the HTML
  request.headers['x-nonce'] = [{ key: 'X-Nonce', value: nonce }];

  var uri = request.uri;

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
