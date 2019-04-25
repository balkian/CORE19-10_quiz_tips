/*
  Checker launcher
 */

const Mocha = require("mocha");
const assignment_path = "./tests/checks.test.js";
const Utils = require('./utils');

function corereporter(runner) {
    let score = 0;
    let score_total = 0;
    let pad = '#'.repeat(20)

    runner
        .on('suite', function (suite) {
            if(suite.title)  {
                console.log('\n' + pad, suite.title, pad)
            }
            suite.ctx.score = 1;
        })
        .on('suite end', function (suite) {
            if(suite.title)  {
                console.log('\n' + pad.repeat(4))
            }
        })
        .on('pass', function (test) {
            let delta = test.ctx.score || 1;
            score_total += delta;
            score += delta;
            process.stdout.write(`- Pass (${score}/${score_total}):\t ${test.title}.\n`);
        })
        .on('fail', function (test, err) {
            if ((test.title.indexOf('"after all" hook')<0) && (test.title.indexOf('"before all" hook')<0)) {
                let delta = test.ctx.score || 1;
                score_total += delta
                process.stdout.write(`**Fail**(${delta}/${score_total}):\t ${test.title} \n\tReason: ${err.message}\n`);
                Utils.debug(err);
            } else {
                console.error("Launcher Error: ", err);
            }
        })
        .on('end', function(){
            process.stdout.write(`\n\tFinal Result: ${score}/${score_total}\n`);
        });
}

new Mocha({
    timeout: 60 * 1000,
    reporter: corereporter
})
    .addFile(assignment_path)
    .run()
