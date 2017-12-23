// 非同期処理をpromiseでラップ
function promiseFunc(a, time) {
    return new Promise((resolve, reject) => {
        console.log(`${time}秒はかります。`);
        setTimeout(() => {
            resolve(a + 100);
        } ,time);
    });
}
// genetaor関数
function* generatorFunc() {
    let a = 10;
    console.log(a);
    a = yield promiseFunc(a, 100);
    console.log(a);
    a = yield promiseFunc(a, 1000);
    console.log(a);
}

const g = generatorFunc();
execGenerator(g);

// generatorを再帰的に実行する関数
function execGenerator(generator) {
    function next(value) {
        let result = generator.next(value);
        if (result.done) {
            console.log('complete');
            return result.value;
        }
        value = result.value;
        if (value && typeof value.then === 'function') {
            // promiseの場合は非同期処理が終わったあとに自分自身を呼ぶ
            value.then(next);
        } else {
            // 同期処理が終わったあとに自分自身を呼ぶ
            next(value);
        }
    }
    next();
}
