import crypto from 'crypto';

const KEYLEN = 32;

function getSecureNote(note, secondKey) {
    const iv = crypto.randomBytes(16).toString('hex');
    const globalKey = crypto.scryptSync(process.env.SNOTES_PASSWORD, iv, KEYLEN).toString('hex');
    const encryptedObject = {iv};

    let content = encrypt(note, {
        key: globalKey,
        iv,
    });

    if (secondKey) {
        secondKey = crypto.scryptSync(secondKey, iv, KEYLEN).toString('hex');
        content = encrypt(content, {
            key: secondKey,
            iv,
            inEncoding: 'hex'
        });

        encryptedObject.key = secondKey;
    }

    encryptedObject.content = content;
    
    return encryptedObject;
};

function encrypt(msg, {key, iv, inEncoding = 'utf8', outEncoding = 'hex'}) {
    const cipher = crypto.createCipheriv('aes256', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    
    return cipher.update(msg, inEncoding, outEncoding) + cipher.final(outEncoding);
}


function getNoteContent(secureNote, globalKey, secondKey) {
    if (secondKey) {
        secondKey = crypto.scryptSync(secondKey, secureNote.iv, KEYLEN).toString('hex');
    }

    if (!validateKeys(secureNote, globalKey, secondKey)) {
        return {status: false};
    }

    let content = secureNote.content;
    if (secureNote.key !== undefined) {
        content = decrypt(content, {
            key: secondKey,
            iv: secureNote.iv,
            outEncoding: 'hex'
        });
    }

    content = decrypt(content, {
        key: crypto.scryptSync(globalKey, secureNote.iv, KEYLEN).toString('hex'),
        iv: secureNote.iv,
    });

    
    return {status: true, content};
}

function decrypt(msg, {key, iv, inEncoding = 'hex', outEncoding = 'utf8'}) {
    const decipher = crypto.createDecipheriv('aes256', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));

    return decipher.update(msg, inEncoding, outEncoding) + decipher.final(outEncoding);
}

function validateKeys(secureNote, globalKey, secondKey) {
    if (globalKey !== process.env.SNOTES_PASSWORD) return false;
    if (secureNote.key && secondKey && secondKey !== secureNote.key) return false;

    return true;
}

export default { getSecureNote, getNoteContent };