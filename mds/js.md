### Function rest parms

Pass rest params declaration

function x(a, ...b){
console.log(b)
}

x(1,2,3)
B [2,3]

rest params as arguments
function calculateSum(a, b, c) {
return a + b + c;
}

const numbers = [1, 2, 3];
const sum = calculateSum(...numbers);
console.log(sum); // Output: 6

### Apply

function fullName() {
return this.firstName + " " + this.lastName;
}

const person1 = {
firstName: "Mary",
lastName: "Doe"
}

// This will return "Mary Doe":
person.fullName.apply(person1);

The Difference Between call() and apply()
The difference is:
The call() method takes arguments separately.
The apply() method takes arguments as an array.

### 55

BOTH AXIOS AND NORMAL FETCH HAS
RES.STATUS AND RES.OK

### Js splice

const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];

console.log(animals.slice(2));
// Expected output: Array ["camel", "duck", "elephant"]

console.log(animals.slice(2, 4));
// Expected output: Array ["camel", "duck"]

### Propagation

if div2 is inside div1 and we clock on div2, div 1 will be also trigred!
to fix this
add event.stopPropagation(); on div2

Go throu https://www.w3schools.com/jsref/jsref_valueof_array.asp
add all apis

Css sivky vs fixed
https://www.youtube.com/shorts/0xdkp7vGKwk

### js

const array1 = [5, 12, 8, 130, 44];

const isLargeNumber = (element) => element > 13;

console.log(array1.findIndex(isLargeNumber));
// Expected output: 3
5:38
const beasts = ['ant', 'bison', 'camel', 'duck', 'bison'];

console.log(beasts.indexOf('bison'));

### d

spread operator own part
how to use it to pass array as arguments

### ok

```js
if func a return a new promise and run some await code , then it a must to use try catch because if we

  async pullOriginalVideo() {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const getObjectCommand = new GetObjectCommand({
          Bucket: this.s3Bucket,
          Key: `${this.bucketSpace}/orixxxginal.mp4`,
        });
        const response = await this.client.send(getObjectCommand);
        const fileBuffer = response.Body;

        const outputFilePath = `/tmp/${this.bucketSpace}/original.mp4`;

        if (!existsSync(`/tmp/${this.bucketSpace}`)) {
          mkdirSync(`/tmp/${this.bucketSpace}`);
        }

        const writeStream = createWriteStream(outputFilePath);
        (fileBuffer as any).pipe(writeStream);

        writeStream.on("finish", async () => {
          writeStream.close();
          resolve(outputFilePath);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

if we call pullOriginalVideo
We need to use .then.catch or try catch again to get the error
if we use try pullOriginalVideo catch when we dont have try cathc on pullOriginalVideo  then it will crashes
```

### http

```js
https.get(videoBucketPath, function (data) {
      data.pipe(writeStream);
      writeStream.on("finish", async () => {
        writeStream.close();
        resolve(true);
      });

      see how i did post rquest oon node-buid
      with json
```

### await on loop and if

using await inside a foreach wont work! but will inside a for loop! so choose widely

if(await xxx ) // works

### help

on a nodejs app, do fs
