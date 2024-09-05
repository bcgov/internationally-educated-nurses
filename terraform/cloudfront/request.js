// Next.js request handler
// Helper function to generate a random nonce
function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Generate a nonce
  var nonce = getFormattedDate(); // You can adjust the length as needed

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
