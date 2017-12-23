function* generatorFunc() {
  console.log("test1");
  yield;
  console.log("test2");
  yield;
  console.log("test3");
}
const g = generatorFunc();
g.next();
g.next();
g.next();
