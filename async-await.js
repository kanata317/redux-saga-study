// 非同期処理をpromiseでラップ
function promiseFunc(a, time) {
  return new Promise((resolve, reject) => {
    console.log(`${time}秒はかります。`);
    setTimeout(() => {
      resolve(a + 100);
    }, time);
  });
}

const asyncFunc = async () => {
  let a = 10;
  a = await promiseFunc(a, 100);
  a = await promiseFunc(a, 200);
  a = await promiseFunc(a, 300);
  return a;
};

asyncFunc().then(a => console.log(a));
