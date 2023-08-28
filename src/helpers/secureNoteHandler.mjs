import crypto from 'crypto';


const KEYLEN = 32;

function getSecureNote(note, secondKey) {
    const iv = crypto.randomBytes(16).toString('hex');
    const globalKey = hashKey(process.env.SNOTES_PASSWORD, iv);
    const encryptedObject = {iv};

    let content = encrypt(note, {
        key: globalKey,
        iv,
    });

    if (secondKey) {
        secondKey = hashKey(secondKey, iv);
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

function encrypt(msg, {key, iv, inEncoding = 'utf8', outEncoding = 'hex'} = {}) {
    const cipher = crypto.createCipheriv('aes256', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    
    return cipher.update(msg, inEncoding, outEncoding) + cipher.final(outEncoding);
}


function getNoteContent(secureNote, globalKey, secondKey) {
    if (!validateKeys(secureNote.key, globalKey, secondKey)) {
        return {status: false};
    }
    
    if (secondKey) {
        secondKey = hashKey(secondKey, secureNote.iv);
    }

    let content = secureNote.content;
    if (secureNote.key) {
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

function decrypt(msg, {key, iv, inEncoding = 'hex', outEncoding = 'utf8'} = {}) {
    const decipher = crypto.createDecipheriv('aes256', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));

    return decipher.update(msg, inEncoding, outEncoding) + decipher.final(outEncoding);
}

function hashKey(key, iv) {
    return crypto.scryptSync(key, iv, KEYLEN).toString('hex');
}

function validateKeys(secureNote, globalKey, secondKey) {
    if (secondKey) {
        secondKey = hashKey(secondKey, secureNote.iv);
    }

    return checkGlobalPassword(globalKey)
        && (!secureNote.key || secureNote.key === secondKey);
}

function checkGlobalPassword(globalPassword) {
    return globalPassword === process.env.SNOTES_PASSWORD
}

export default { checkGlobalPassword, validateKeys, getSecureNote, getNoteContent };