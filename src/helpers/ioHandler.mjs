import inquirer from "inquirer";
import chalk from "chalk";

function decorate(msg, type = 'regular') {
    const colors = {
        'password': str => chalk.blue(str),
        'confirm': str => chalk.yellow(str),
        'queryResult': str => chalk.magenta(str),
        'success': str => chalk.green(str),
        'failure': str => chalk.red(str),
        'regular': str => chalk.gray(str)
    }

    if (!(type in colors)) type = 'regular';

    return colors[type](msg);
}

function showOutput(msg, type = 'regular') {
    process.stdout.write(decorate(`${msg}\n`, type));
}

function showError(msg) {
    process.stderr.write(decorate(`Error: ${msg}\n`, 'failure'));
}

async function getInput(msg, type = 'input') {
    const query = {
        name: 'userInput',
        type,
        message: decorate(msg, type),
        validate: input => {
            if (input) return true;
            
            return 'Input cannot be empty';
        }
    };

    if (type === 'password') {
        query.mask = '*';
    }

    return (await inquirer.prompt(query)).userInput;
}

export default { showOutput, showError, getInput };