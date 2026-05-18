const fs = require('fs');
const crypto = require('crypto');

async function decrypt() {
    const fileContent = fs.readFileSync('c:\\\\Users\\\\USUARIO\\\\Desktop\\\\Proyectos\\\\Hearth\\\\Hearth\\\\www.dedicapag.com\\\\p\\\\6a0765eb33aeb.html', 'utf8');
    
    // Extract variables using regex
    const ivMatch = fileContent.match(/var _IV='([^']+)'/);
    const ctMatch = fileContent.match(/_CT='([^']+)'/);
    const pMatch = fileContent.match(/var _P='([^']+)'\+'([^']+)'\+'([^']+)'\+'([^']+)'/);

    if (!ivMatch || !ctMatch || !pMatch) {
        console.error("Could not extract variables");
        return;
    }

    const _IV = ivMatch[1];
    const _CT = ctMatch[1];
    const _P = pMatch[1] + pMatch[2] + pMatch[3] + pMatch[4];

    // Convert from base64 to buffer
    const iv = Buffer.from(_IV, 'base64');
    const ct = Buffer.from(_CT, 'base64');

    // SHA-256 the key
    const key = crypto.createHash('sha256').update(_P).digest();

    // The tag is the last 16 bytes of the ciphertext in node's createDecipheriv for GCM
    const authTagLength = 16;
    const encryptedText = ct.slice(0, ct.length - authTagLength);
    const authTag = ct.slice(ct.length - authTagLength);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, undefined, 'utf8');
    decrypted += decipher.final('utf8');

    fs.writeFileSync('decrypted.html', decrypted);
    console.log("Decrypted successfully.");
}

decrypt().catch(console.error);
