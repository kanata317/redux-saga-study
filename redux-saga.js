function saga () {
    const CALL = 'CALL';
    const TAKE = 'TAKE';
    const PUT = 'PUT';
    let currentTakers = [];
    let nextTakers = [];

    function ensureCanMutateNextTakers() {
        if (nextTakers !== currentTakers) {
            return
        }
        nextTakers = currentTakers.slice()
    }

    function call(func, ...args) {
        return [CALL, func, ...args]; 
    }

    function take(actionType) {
        return [TAKE, actionType];
    }

    function put(action) {
        return [PUT, action.type, action];
    }

    function runSaga(saga) {
        const generator = saga();
        function next(value) {
            let result = generator.next(value);
            if (result.done) {
                return result.value;
            }
            value = result.value;
            const [effectType, ...args] = value;
            switch(effectType) {
                case CALL:
                return callFunc(args, next);
                case TAKE:
                return takeFunc(args, next);
                case PUT:
                return putFunc(args, next);
                default:
                throw Error('effectTypeにないよ。');
            }
        }
        next();
    }
    function callFunc([func, ...args] = args, next) {
        const result = func(...args);
        if (result && typeof result.then === 'function') {
            // promiseの場合は非同期処理が終わったあとに自分自身を呼ぶ
            result.then(next);
        } else {
            // 同期処理が終わったあとに自分自身を呼ぶ
            next(result);
        }
    }
    function takeFunc([actionType] = args, next) {
        ensureCanMutateNextTakers();
        nextTakers.push({
            actionType,
            func: action => next(action)
        });
    }
    function putFunc([actionType, action] = args, next) {
        const takers = (currentTakers = nextTakers);
        for (let taker of takers) {
            if (taker.actionType === actionType) {
                ensureCanMutateNextTakers();
                remove(nextTakers, taker)
                taker.func(action);
            }
        }
        next();

        function remove(array, item) {
            const index = array.indexOf(item)
            if (index >= 0) {
                array.splice(index, 1)
            }
        }
    }
    return {call, put, take, runSaga};
}

// 非同期処理をpromiseでラップ
function promiseFunc(a, time) {
    return new Promise((resolve, reject) => {
        console.log(`${time}秒はかります。`);
        setTimeout(() => {
            resolve(a + 100);
        } ,time);
    });
}

const {call, put, take, runSaga} = saga();

// genetaor関数
function* generatorFunc1() {
    yield take('takeTest');
    let a = 10;
    console.log(a);
    a = yield call(promiseFunc, a, 100);
    console.log(a);
    a = yield call(promiseFunc, a, 1000);
    console.log(a);
    console.log('complete1');
}

function* generatorFunc2() {
    let a = 20;
    console.log(a);
    a = yield call(promiseFunc, a, 200);
    console.log(a);
    a = yield call(promiseFunc, a, 2000);
    console.log(a);
    yield put({type: 'takeTest'});
    console.log('complete2');
}

runSaga(generatorFunc1);
runSaga(generatorFunc2);
