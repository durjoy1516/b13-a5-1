1/ What is the difference between var, let, and const?

#Answer:

var is a old way to declare variables. One of the reason of not recommended to use it in js is, it's not a block scope, it's a function scope. some way it gives Undefined in return.

let is block scoped and it can be updated but not redeclared in the same scope.

const is also block scoped but the value of const can't update or redeclared.



2/ What is the spread operator (...)?

#Answer:

Spread Operator(...) is used to expend elements of an Array or Object, like copying, merging or bringing the values easily.

ex: let numbers = [1, 2];

    let allNumbers = [...numbers, 3, 4, 5];

    console.log(allNumbers);

    it will returns [1, 2, 3, 4, 5];
    


3/ What is the difference between map(), filter(), and forEach()?

#Answer:

map() is used for transforming all elements of an array in the same logic and returns a new array.

filter() returns all the elements of an array that match the condition of the function.

forEach() is used to loop through each element of an array and work on them separately. But it doesn't return anything.



4/ What is an arrow function?

#Answer:
An arrow function (=>) is a shorter way to write a function in JavaScript.

ex: Normal Function:-

    function add(a, b){

        return a + b;

    };

    Arrow function:-

    const add = (a, b) => a + b;



5/ What are template literals?

#Answer:
Template Literals are special strings that written in the backtick(`) instead of quotes and allow to insert variables inside them using ${}.

ex: let someone = "World";

    let msg = `Hello ${someone}!`

    console.log(msg);

    will return, Hello World!