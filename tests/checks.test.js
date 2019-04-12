/**
 * Corrector para la práctica CORE19-10_quiz_tips
 */

// IMPORTS
const should = require('chai').should();
const path = require('path');
const fs = require('fs-extra');
const Utils = require('./utils');
const to = require('./to');
const child_process = require("child_process");
const spawn = require("child_process").spawn;
const Browser = require('zombie');

// CRITICAL ERRORS
let error_critical = null;

// CONSTANTS
const T_WAIT = 2; // Time between commands
const T_TEST = 2 * 60; // Time between tests (seconds)
const path_assignment = path.resolve(path.join(__dirname, "../quiz_2019"));
const path_json = path.join(path_assignment, 'package.json');
const quizzes_orig = path.join(path_assignment, 'quizzes.sqlite');
const quizzes_back = path.join(path_assignment, 'quizzes.original.sqlite');
const quizzes_test = path.join(__dirname, 'quizzes.sqlite');
const browser = new Browser();
let url = "http://localhost:5000";

// HELPERS
const timeout = ms => new Promise(res => setTimeout(res, ms));
let server = null;

//TESTS
describe("CORE19-10_quiz_tips", function () {

    this.timeout(T_TEST * 1000);

    it('', async function () {
        this.name = `1(Precheck): Checking that the assignment directory exists...`;
        this.score = 0;
        this.msg_ok = `Found the directory '${path_assignment}'`;
        this.msg_err = `Couldn't find the directory '${path_assignment}'`;
        const [error_path, path_ok] = await to(fs.pathExists(path_assignment));
        if (error_path) {
            error_critical = this.msg_err;
        }
        path_ok.should.be.equal(true);
    });

    it('', async function () {
        this.name = `2(Precheck): Checking that the 'package.json' file exists...`;
        this.score = 0;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "Dependencies installed successfully";
            this.msg_err = "Error installing dependencies";
            const path_json = path.join(path_assignment, 'package.json');
            const [json_nok, json_ok] = await to(fs.pathExists(path_json));
            if (json_nok || !json_ok) {
                this.msg_err = `The file '${path_json}' has not been found`;
                error_critical = this.msg_err;
            }
            json_ok.should.be.equal(true);
        }
    });

    it('', async function () {
        this.name = `3(Precheck): Checking the 'package.json' file format...`;
        this.score = 0;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "The 'package.json' file has the right format";
            this.msg_err = "Error parsing the 'package.json' file";
            const [error_json, contenido] = await to(fs.readFile(path_json, 'utf8'));
            if (error_json) {
                this.msg_err = `The file '${path_json}' doesn't have the right format`;
                error_critical = this.msg_err;
            }
            should.not.exist(error_json);
            const is_json = Utils.isJSON(contenido);
            if (!is_json) {
                error_critical = this.msg_err;
            }
            is_json.should.be.equal(true);
        }
    });

    it('', async function () {
        const expected = "npm install";
        this.name = `4(Precheck): Installing dependencies...`;
        this.score = 0;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "Dependencies installed successfully";
            this.msg_err = "Error installing dependencies";
            //install dependencies
            [error_deps, output] = await to(new Promise((resolve, reject) => {
                child_process.exec(expected, {cwd: path_assignment}, (err, stdout) =>
                    err ? reject(err) : resolve(stdout))
            }));
            if (error_deps) {
                this.msg_err = "Error installing dependencies: " + error_deps;
                error_critical = this.msg_err;
            }
            should.not.exist(error_critical);
        }
    });

    it('', async function () {
        this.name = `5(Precheck): Replacing answers file...`;
        this.score = 0;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "'quizzes.sqlite' replaced successfully";
            this.msg_err = "Error replacing 'quizzes.sqlite'";
            let error_deps;
            try {
                fs.copySync(quizzes_orig, quizzes_back, {"overwrite": true});
            } catch (e) {
            }
            [error_deps, _] = await to(fs.copy(quizzes_test, quizzes_orig, {"overwrite": true}));
            if (error_deps) {
                this.msg_err = "Error copying the answers file: " + error_deps;
            }
            should.not.exist(error_deps);
        }
    });

    it('', async function () {
        const expected = "bin/www";
        this.name = `6: Launching the server...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `'${expected}' has been launched correctly`;
            server = spawn("node", [expected], {cwd: path_assignment});
            let error_launch = "";
            server.on('error', function (data) {
                error_launch += data
            });
            await to(timeout(T_WAIT * 1000));
            this.msg_err = `Error launching '${expected}'<<\n\t\t\tReceived: ${error_launch}`;
            if (error_launch.length) {
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            error_launch.should.be.equal("");
        }
    });

    it('', async function () {
        const expected = url;
        this.name = `7: Checking that the server responds at ${expected}...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Server responded at ${expected}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(expected));
            if (error_nav) {
                this.msg_err = `Server not responding at ${expected}\nError:${error_nav}\nReceived:${browser.text('body')}`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            should.not.exist(error_nav);
        }
    });

    it('', async function () {
        const expected = url + '/quizzes';
        this.name = `8: Checking that the server responds at ${expected}...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Server responded at ${expected}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(expected));
            if (error_nav) {
                this.msg_err = `Server not responding at ${expected}\nError:${error_nav}\nReceived:${browser.text('body')}`;
                error_critical = this.msg_err;
                should.not.exist(error_critical);
            }
            should.not.exist(error_nav);
        }
    });

    it('', async function () {
        const expected = url + '/quizzes/randomplay';
        this.name = `9: Checking that the server responds at ${expected}...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Server responded at ${expected}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(expected));
            this.msg_err = `Server not responding at ${expected}\nError:${error_nav}\nReceived:${browser.text('body')}`;
            should.not.exist(error_nav);
        }
    });

    it('', async function () {
        const expected = 'Anonymous';
        let url = url + '/quizzes/1';
        this.name = `10: Checking that the server shows the anonymous user...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Found the anonymous user '${expected}' at ${url}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(url));
            this.msg_err = `Server not responding at ${url}\n\t\tError:${error_nav}\n\t\tReceived:${browser.text('body')}`;
            should.not.exist(error_nav);
            this.msg_err = `Anonymous user not found at ${url}\n\t\tReceived:${browser.text('body')}`;
            Utils.search(expected, browser.text('body')).should.be.equal(true);
        }
    });

    it('', async function () {
        const expected = 'registrado';
        let url = url + '/quizzes/5';
        this.name = `11: Checking that the server shows the registered user...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Found the registered user '${expected}' at ${url}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(url));
            this.msg_err = `Server not responding at ${url}\n\t\tError:${error_nav}\n\t\tReceived:${browser.text('body')}`;
            should.not.exist(error_nav);
            this.msg_err = `Registered user not found at ${url}\n\t\tReceived:${browser.text('body')}`;
            Utils.search(expected, browser.text('body')).should.be.equal(true);
        }
    });

    it('', async function () {
        const expected = 'meaning';
        const user = 'registrado';
        let url_login = url + "/session";
        let url = url + '/quizzes/5';
        this.name = `12: Checking that the server shows clues to the registered user...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Found clues for the registered user '${user}' at ${url}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(url_login));
            this.msg_err = `Could not open login url '${url_login}'\n\t\t\tError: >>${error_nav}`;
            [error_nav, resp] = await to(browser.assert.element('input[id=login]'));
            this.msg_err = `Could not find login input at '${url_login}'\n\t\t\tError: >>${error_nav}`;
            [error_nav, resp] = await to(browser.assert.element('input[id=password]'));
            this.msg_err = `Could not find login password at '${url_login}'\n\t\t\tError: >>${error_nav}`;
            [error_nav, resp] = await to(browser.fill('input[id=login]', user));
            this.msg_err = `Could not fill login input at '${url_login}'\n\t\t\tError: >>${error_nav}`;
            [error_nav, resp] = await to(browser.fill('input[id=password]', user));
            this.msg_err = `Could not fill login password at '${url_login}'\n\t\t\tError: >>${error_nav}`;
            [error_nav, resp] = await to(browser.pressButton("[name=commit]"));
            this.msg_err = `Could not send login form at '${url_login}'\n\t\t\tError: >>${error_nav}`;
            [error_nav, resp] = await to(browser.visit(url));
            this.msg_err = `Server not responding at ${url}\n\t\tError:${error_nav}\n\t\tReceived:${browser.text('body')}`;
            should.not.exist(error_nav);
            this.msg_err = `Clues for the registered user not found at ${url}\n\t\tReceived:${browser.text('body')}`;
            Utils.search(expected, browser.text('body')).should.be.equal(true);
        }
    });

    it('', async function () {
        const expected = 'registrado';
        let url = url + '/quizzes/5';
        this.name = `13: Checking that the server shows the registered user in the clues...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Found the registered user '${expected}' in the clues  at ${url}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(url));
            this.msg_err = `Server not responding at ${url}\n\t\tError:${error_nav}\n\t\tReceived:${browser.text('body')}`;
            should.not.exist(error_nav);
            this.msg_err = `Registered user not found in the clues at ${url}\n\t\tReceived:${browser.text('body')}`;
            Utils.search(expected, browser.text('body')).should.be.equal(true);
        }
    });

    it('', async function () {
        let url = url + '/quizzes/randomcheck/1?answer=NOK';
        this.name = `10: Checking that the server accepts wrong answers at ${url}...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Wrong answer sent successfully to ${url}\n\t\tReceived:${browser.text('body')}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(url));
            this.msg_err = `Server not responding at ${url}\n\t\tError:${error_nav}\n\t\tReceived:${browser.text('body')}`;
            should.not.exist(error_nav);
        }
    });


    it('', async function () {
        const expected = '0';
        let url = url + '/quizzes/randomcheck/1?answer=NOK';
        this.name = `11: Checking the score at ${url}...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Found the right score '${expected}' at ${url}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(url));
            this.msg_err = `Server not responding at ${url}\n\t\tError:${error_nav}\n\t\tReceived:${browser.text('body')}`;
            should.not.exist(error_nav);
            Utils.search(expected, browser.text('body')).should.be.equal(true);
        }
    });

    it('', async function () {
        let url = url + '/randomcheck/1?answer=OK';
        this.name = `12: Checking that the server accepts right answers at ${url}...`;
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Right answer sent successfully to ${url}\n\t\tReceived:${browser.text('body')}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(url));
            this.msg_err = `Server not responding at ${url}\n\t\tError:${error_nav}\n\t\tReceived:${browser.text('body')}`;
            should.not.exist(error_nav);
        }
    });


    it('', async function () {
        const expected = '1';
        let url = url + '/randomcheck/1?answer=OK';
        this.name = `13: Checking the score at ${url}...`;
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = `Found the right score '${expected}' at ${url}`;
            let error_nav;
            [error_nav, resp] = await to(browser.visit(url));
            this.msg_err = `Server not responding at ${url}\n\t\tError:${error_nav}\n\t\tReceived:${browser.text('body')}`;
            should.not.exist(error_nav);
            this.msg_err = `The right score '${expected}' has not been found at ${url}\n\t\tReceived:${browser.text('body')}`;
            Utils.search(expected, browser.text('body')).should.be.equal(true);
        }
    });

    after("Restoring the original file", async function () {
        if (server) {
            server.kill();
            await timeout(T_WAIT * 1000);
        }
        try {
            fs.copySync(quizzes_back, quizzes_orig, {"overwrite": true});
        } catch (e) {
        }
    });

});