require('dotenv').config(); // Load variables from .env if present
const fs = require('fs');

try {
    // Read the template
    let html = fs.readFileSync('template.html', 'utf8');

    // Get the allowed domain from the environment, defaulting to localhost for local testing
    const allowedDomain = process.env.ALLOWED_DOMAIN || 'localhost';

    // Replace the placeholder
    html = html.replace(/__ALLOWED_DOMAIN__/g, allowedDomain);

    // Clean up duplicate ending tags if they exist from original download
    html = html.replace(/<\/body>\s*<\/html>\s*<\/body>\s*<\/html>/, '</body>\n</html>');

    // Write to index.html
    fs.writeFileSync('index.html', html);
    console.log(`Build successful! index.html created with ALLOWED_DOMAIN = ${allowedDomain}`);
} catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
}
