/**
 * Corrector para la práctica CORE19-10_quiz_tips
 */

// IMPORTS
const should = require('chai').should();
const { assert } = require('chai')

const path = require('path');
const fs = require('fs-extra');
const {to, wrap, assert_up, assert_in_url, debug, isJSON} = require('./utils');
const child_process = require("child_process");
const spawn = require("child_process").spawn;

// CRITICAL ERRORS
let error_critical = null;

// CONSTANTS
const T_WAIT = 2; // Time between commands
const T_TEST = 2 * 60; // Time between tests (seconds)
const path_assignment = process.env.PATH_ASSIGNMENT  || path.resolve(path.join(__dirname, "../quiz_2019"));
const path_json = path.join(path_assignment, 'package.json');
const quizzes_orig = path.join(path_assignment, 'quiz.sqlite');
const quizzes_back = path.join(path_assignment, 'quizzes.original.sqlite');
const quizzes_test = path.join(__dirname, 'quizzes.sqlite');
const URL = "http://localhost:3000";

// HELPERS
const timeout = ms => new Promise(res => setTimeout(res, ms));
let server = null;


//TESTS
describe("CORE19-10_quiz_tips", function () {

    this.timeout(T_TEST * 1000);
    this.ctx.score = 0;

    before(async function() {
        console.log('Running pre-checks.')
        console.log(`\t1: Checking that the assignment directory exists...`);
        const [error_path, path_ok] = await to(fs.pathExists(path_assignment));
        path_ok.should.be.true;
        console.log(`\t2: Checking that the 'package.json' file exists...`);

        const path_json = path.join(path_assignment, 'package.json');
        const [json_nok, json_ok] = await to(fs.pathExists(path_json));
        if (json_nok || !json_ok) {
            assert.fail(`The file '${path_json}' has not been found`);
        }
        debug("Dependencies installed successfully");

        const contenido = await wrap(fs.readFile(path_json, "utf8"),
                                     `Error parsing the 'package.json' file, The file '${path_json}' doesn't have the right format`
                                    );
        const is_json = isJSON(contenido);
        if (!is_json) {
            assert.fail(`The file '${path_json}' is not a JSON file`)
        }
        is_json.should.be.true;
        debug("The 'package.json' file has the right format");

        console.log(`\t3: Installing dependencies...`);

        let error_deps;
        let expected = "npm install";

        [error_deps, output] = await to(new Promise((resolve, reject) => {
            child_process.exec(expected, {cwd: path_assignment}, (err, stdout) =>
                               err ? reject(err) : resolve(stdout))
        }));
        if (error_deps) {
            assert.fail("Error installing dependencies: " + error_deps);
        }
        debug("Dependencies installed successfully");


        console.log(`\t4: Replacing answers file...`);
        fs.copySync(quizzes_orig, quizzes_back, {"overwrite": true});
        await wrap(fs.copy(quizzes_test, quizzes_orig, {"overwrite": true}),
                   "Error copying the answers file");
        debug(`'${quizzes_orig}' replaced successfully`);
        should.not.exist(error_deps);

    })

    after("Restoring the original file", async function () {
        if (server) {
            server.kill();
            await timeout(T_WAIT * 1000);
        }
        try {
            // fs.copySync(quizzes_back, quizzes_orig, {"overwrite": true});
        } catch (e) {
        }
    });


    it(`1: launches correctly`, async function () {
        this.score = 1;
        const expected = "bin/www";
        server = spawn("node", [expected], {cwd: path_assignment});
        // server.stdin.pause();
        // server.stdout.pause();
        let error_launch = "";
        server.on('error', function (data) {
            console.log(`Error launching: ${data}: ${data.message}`)
            error_launch += data.message + data.fileName + 'caca'
        });
        await to(timeout(T_WAIT * 1000));
        if (error_launch.length) {
            assert.fail(`Error launching '${expected}'<<\n\t\t\tReceived: ${error_launch}`);
        }
        error_launch.should.be.equal("");
    });

    it(`2: respond at ${URL}`, async function () {
        this.score = 1;
        const expected = URL;
        return assert_up(expected)
    });


    it(`3: responds at /quizzes`, async function () {
        let url = URL + '/quizzes/1';
        this.score = 1;
        assert_up(url);
    });

    it(`4: responds at ${URL}/quizzes/randomplay...`, async function () {
        this.score = 1;
        const url = URL + '/quizzes/randomplay';
        return assert_up(url)
    });

    it('5: shows the author for a tip', async function () {
        // registrado has authored a tip for quizzes/1 in the test sqlite file
        const expected = 'registrado';
        let url = URL + '/quizzes/1';
        this.score = 1;
        return assert_in_url(expected, url, `Registered user not found at ${url}`);
    });

    it(`6: shows tips for the registered user`, async function () {

        const expected = 'meaning';
        const user = 'registrado';
        let url_login = URL + "/session";
        let url = URL + '/quizzes/1';
        this.score = 1;
        browser = await assert_up(url_login);
        browser.assert.element('input[id=login]', `Could not find login input at '${url_login}`);
        browser.assert.element('input[id=password]', `Could not find password input at '${url_login}`);;

        let error_nav
        [error_nav, resp] = await to(browser.fill('input[id=login]', user));
        should.not.exist(error_nav,
                         `Could not fill login input at '${url_login}'`
                        )
        prom = browser.fill('input[id=password]', user);
        [error_nav, resp] = await to(prom);
        should.not.exist(error_nav,
                         `Could not fill login password at '${url_login}'`
                        )
        prom = browser.pressButton("[name=commit]")
        [error_nav, resp] = await to(prom);
        should.not.exist(error_nav,
                         `Could not send login form at '${url_login}'\n\t\t\tError: >>${error_nav}`
                        );
        return assert_in_url(expected, url);
    });

    it(`7: shows the registered user in the clues`, async function () {
        const expected = 'registrado';
        let url = URL + '/quizzes/1';
        this.score = 1;
        await assert_up(url);
        let error_nav;
        await to(assert_in_url(expected, url, 'Registered user not found'));
    });

    it(`8: accepts wrong answers at ${URL}...`, async function () {
        this.score = 1;
        let url = URL + '/quizzes/randomcheck/1?answer=NOK';
        let error_nav;
        return assert_up(url);
    });


    it(`9: does not increment score with wrong answers`, async function () {
        this.score = 1;
        const expected = '0';
        let url = URL + '/quizzes/randomcheck/1?answer=NOK';
        return assert_in_url(expected, url, `Found the right score ('${expected}') at ${url}`);
    });

    it(`10: accepts right answers`, async function () {
        ;
        let url = URL + '/quizzes/randomcheck/1?answer=OK';
        this.score = 1;
        let error_nav;
        return assert_up(url)
    });


    it( `11: increments the score for right answers`, async function () {
        this.score = 2;
        const expected = '1';
        let url = URL + '/quizzes/randomcheck/1?answer=OK';
        return assert_in_url(expected, url, `Right score '${expected}' not found at ${url}`);
    });


    it('10: shows the anonymous user for the tips', async function () {
        this.score = 1;
        const expected = 'Anonymous';
        let url = URL + '/quizzes/1';
        return assert_in_url(expected, url);
    });

});
