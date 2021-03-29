let p = 100;
const note = 48;

//let scorePP = Math.pow(1.22, 4);
//let scoreNN = Math.pow(1.2, 4);
let scorePP = 2.1 * Math.pow(1.22, 3);
let scoreNN = 2 * Math.pow(1.2, 3);

while (p >= 0) {
    //let pScore = 2.1 * scorePP * p / 100 + (1 - p / 100);
    let pScore = 1.22 * scorePP * p / 100 + (1 - p / 100);
    pScore = 4.1472;

    //判分计算
    //let scoreBeforeG = 2.2 * (p / 100 * scorePP + (1 - p / 100));
    //let scoreAfterG = 1.7 * (p / 100 * scorePP + (1 - p / 100));
    //let scoreBeforeG = 2.2 * scoreNN;
    //let scoreAfterG = 1.7 * scoreNN;

    //let scoreBeforeG = 1.24 * (p / 100 * scorePP + (1 - p / 100));
    //let scoreAfterG = 1.14 * (p / 100 * scorePP + (1 - p / 100));
    let scoreBeforeG = 1.24 * scoreNN;
    let scoreAfterG = 1.14 * scoreNN;

    let score = 0;
    for (let i = 0; i < note; ++i) {
        let rate = Math.pow(p / 100, i);
        score += rate * scoreBeforeG + scoreAfterG * (1 - rate);
    }
    let result = score / note;

    console.log(`${p} ${result} ${pScore}`);
    if (result < pScore) break;

    p -= 0.1;
}

