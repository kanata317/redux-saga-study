function* generatorFunc() {
    let count = 0;
    while(count < 4) {
        // yield count++;
        count = yield count + 1;
    }
    return 5;
}

const g = generatorFunc();
let result = g.next();
console.log(result.value);
result = g.next(result.value);
console.log(result.value);
result = g.next(result.value);
console.log(result.value);
result = g.next(result.value);
console.log(result.value);
result = g.next(result.value);
console.log(result.value);
result = g.next(result.value);
console.log(result.value);
result = g.next(result.value);
