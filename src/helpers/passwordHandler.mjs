import ioHandler from "./ioHandler.mjs";
import secureNoteHandler from "./secureNoteHandler.mjs";


async function askForExistingPasswords({isSecure = false} = {}) {
    let globalPassword;
    let secondPassword;
    if (!isSecure) {
        isSecure = await ioHandler.getInput('Is the note encrypted?', 'confirm');
    }

    if (isSecure) {
        const passwordStatus = await askForGlobalPassword();
        if (!passwordStatus.status) {
            return passwordStatus;
        }

        globalPassword = passwordStatus.globalPassword;
        const checkSecLayer = await ioHandler.getInput(
            'In case of a second security layer is used, wanna enter the password to access it?'
            , 'confirm');
    
        if (checkSecLayer) {
            secondPassword = (await askForSecondPassword()).secondPassword;
        }
    }

    return {
        status: true,
        globalPassword,
        secondPassword
    };
}

async function askForNewPasswords() {
    const passwordStatus = await askForGlobalPassword();
    if (!passwordStatus.status) {
        return passwordStatus;
    }

    const globalPassword = passwordStatus.globalPassword;
    
    const allowSecLayer = await ioHandler.getInput('Do you wanna add a second security layer password?', 'confirm');
    
    let secondPassword;
    if (allowSecLayer) {
        secondPassword = (await askForSecondPassword()).secondPassword;
    }

    return {
        status: true,
        globalPassword,
        secondPassword
    }
}

async function askForGlobalPassword() {
    const globalPassword = await ioHandler.getInput('Enter the global password for notes:', 'password');
    if (!secureNoteHandler.checkGlobalPassword(globalPassword)) {
        return {
            status: false,
            errorMsg: 'Global Password Incorrect'
        };
    }

    return {
        status: true,
        globalPassword
    }
}

async function askForSecondPassword() {
    return {
        status: true,
        secondPassword: await ioHandler.getInput('Enter second security layer password:', 'password')
    }
}

export default { askForNewPasswords, askForExistingPasswords, askForGlobalPassword, askForSecondPassword}