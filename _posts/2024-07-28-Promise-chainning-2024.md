---
layout:     post   				    # 使用的布局（不需要改ti）
title:      Promise chainning 				# 标题 
subtitle:   promise-chain       #副标题
date:       2024-07-28 				# 时间
author:     BY 陈凯旋		 				# 作者
header-img: img/post-bg-2015.jpg 	#这篇文章标题背景图片
catalog: true 						# 是否归档
tags:								#标签
    - Javascript
    - Promise
---
# Promise chainning

## what is Promise chainning

It's a mechanism in Promise-chain which formed like this:

```js
new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000); // (*)

}).then(function(result) { // (**)

  alert(result); // 1
  return result * 2;

}).then(function(result) { // (***)

  alert(result); // 2
  return result * 2;

}).then(function(result) {

  alert(result); // 4
  return result * 2;

});
```

## why it's created

we have a sequence of asynchronous tasks to be performed one after another  for instance, loading scripts.
we can't hold all tasks in one "then" handler
And if you notice above: the result is passed through the chain of `.then` handlers.

It's known that When a handler returns a value, it becomes the result of that promise and in this chainning system
the promise holding a value peformed by the last handler become the input of next handler

analogy:
If you look at this in a broad way 
you can see Promise keep a emerge-dive pattern like a joyful fish
The Promise-wrapper is the same just the inside-value(or result) changes each time emerge-dive

## returning promise 

A handler, used in `.then(handler)` may create and return a promise.
In that case further handlers **wait** until it settles, and then get its result. 


For instance:

```javascript
new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000);

}).then(function(result) {

  alert(result); // 1

  return new Promise((resolve, reject) => { // (*)
    setTimeout(() => resolve(result * 2), 1000);
  });

}).then(function(result) { // (**)

  alert(result); // 2

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result * 2), 1000);
  });

}).then(function(result) {

  alert(result); // 4

});
```

Here the first `.then` shows `1` and returns `new Promise(…)` in the line `(*)`. After one second it resolves, and the result (the argument of `resolve`, here it’s `result * 2`) is passed on to the handler of the second `.then`. That handler is in the line `(**)`, it shows `2` and does the same thing.

So the output is the same as in the previous example: 1 → 2 → 4, but now with 1 second delay between `alert` calls.

## Here we go ! Useful example : loadscript

```javascript
loadScript("/article/promise-chaining/one.js")
  .then(function(script) {
    return loadScript("/article/promise-chaining/two.js");
  })
  .then(function(script) {
    return loadScript("/article/promise-chaining/three.js");
  })
  .then(function(script) {
    // use functions declared in scripts
    // to show that they indeed loaded
    one();
    two();
    three();
  });
```

This code can be made bit shorter with arrow functions:

```javascript
loadScript("/article/promise-chaining/one.js")
  .then(script => loadScript("/article/promise-chaining/two.js"))
  .then(script => loadScript("/article/promise-chaining/three.js"))
  .then(script => {
    // scripts are loaded, we can use functions declared there
    one();
    two();
    three();
  });
```

## A special feature 

This feature will allow us to integrate custom objects with promise chains without having to inherit from Promise
What does above mean ? To understand that there should be a clarification:
Actually in the promise-chain It's not promise that continuely flow up and down (return and input)(that means what the handler returns is not Promise ) It's another special object called _“thenable” object_ 
All the things we said above still valid because this “thenable” object has _.then_ method and can be treated like Promise.So actually it gives us flexibilty!Because we can build like an architect on a object that has already implemented with basic Promise-function

```js
class Thenable {
  constructor(num) {
    this.num = num;
  }
  then(resolve, reject) {
    alert(resolve); // function() { native code }
    // resolve with this.num*2 after the 1 second
    setTimeout(() => resolve(this.num * 2), 1000); // (**)
  }
}

new Promise(resolve => resolve(1))
  .then(result => {
    return new Thenable(result); // (*)
  })
  .then(alert); // shows 2 after 1000ms
```

JavaScript checks the object returned by the `.then` handler in line `(*)`: if it has a callable method named `then`, then it calls that method providing native functions `resolve`, `reject` as arguments (similar to an executor) and waits until one of them is called. In the example above `resolve(2)` is called after 1 second `(**)`. Then the result is passed further down the chain.

## example associated with _fetch_

We’ll use the [fetch](https://javascript.info/fetch) method to load the information about the user from the remote server. It has a lot of optional parameters covered in [separate chapters](https://javascript.info/fetch), but the basic syntax is quite simple:

```javascript
let promise = fetch(url);
```

fetch(url) is saying :make a network request to the `url` and returns a promise. The promise resolves with a `response` object when the remote server responds with headers, but *before the full response is downloaded*.   

> [!NOTE]
>
> You haven't got the infomation now

To read the full response, we should call the method `response.text()`: it returns a promise that resolves when the full text is downloaded from the remote server, with that text(information we require) as a result.
So response is a promise and response.text() is also a promise 

The code below makes a request to `user.json` and loads its text from the server:

```javascript
fetch('/article/promise-chaining/user.json')
  // .then below runs when the remote server responds
  .then(function(response) {
    // response.text() returns a new promise that resolves with the full response text
    // when it loads
    return response.text();
  })
  .then(function(text) {
    // ...and here's the content of the remote file
    alert(text); // {"name": "iliakan", "isAdmin": true}
  });
```



The `response` object returned from `fetch` also includes the method `response.json()` that reads the remote data and parses it as JSON. In our case that’s even more convenient

```js
// same as above, but response.json() parses the remote content as JSON
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => alert(user.name)); // iliakan, got user name
```


let's see a more complex one :

```js
// Make a request for user.json
fetch('/article/promise-chaining/user.json')
  // Load it as json
  .then(response => response.json())
  // Make a request to GitHub
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  // Load the response as json
  .then(response => response.json())
  // Show the avatar image (githubUser.avatar_url) for 3 seconds (maybe animate it)
  .then(githubUser => {
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(() => img.remove(), 3000); // (*)
  });
```

this works but below is much better :

```js
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  .then(response => response.json())
  .then(githubUser => new Promise(function(resolve, reject) { // (*)
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(() => {
      img.remove();
      resolve(githubUser); // (**)
    }, 3000);
  }))
  // triggers after 3 seconds
  .then(githubUser => alert(`Finished showing ${githubUser.name}`));
```

As a good practice, an asynchronous action should always return a promise. That makes it possible to plan actions after it; even if we don’t plan to extend the chain now, we may need it later.

## When should you consider about Promise

In the last chapter _Promise_ we bury a seed in the last.This is the position it should get settled
So promise is actually used in a situation : 1.the task is gonna need some time 2. there are two possible consequences of the task3.mostly have to do with networking connection
let us see some egs

1. ```js
   fetch("https://api.examplecom/data")
     .then((response) => response.json())
     .then((data) => console.log(data))
     .catch((error) => console.log(error));
   ```

   fetch is a api that allows us to input a url as a door to get data and this api return a promise
   (of course! 1.Getting is absolutely a task that requires some time2.two consequences : get it or miss it)
   And during each level of the chain promise.result is passed as paramter for handler

2. ```js
   function LoadImage(url) {
     return new Promise((resolve, reject) => {
       const img = new Image(); //create a img
       img.src = url;
       img.onload = () => resolve(img);
       img.onerror = () => reject(new Error("fail loading"));
     });
   }
   LoadImage("path/to/image.jpg")
     .then((img) => document.body.appendChild(img))
     .catch((error) => console.error(error));
   ```

   Why do you need to bind functionc to events of img?
   Cause two callback must be called .And when you wanna use then/catch handler to link the function(LoadImage).It should be a produced (fully formed)promise in front of these handlers 

3. Custom Promise 
   Promise basically follow this pattern:

   ```js
   function doSomething() {
     return new Promise((resolve, reject) => {
       if (success) {
         resolve(result);
       } else {
         reject(new Error("error"));
       }
     });
   }
   doSomething()
     .then((result) => console.log(result))
     .catch((error) => console.error(error));
   ```

4. Ajax with XMLHttpRequest

   ```js
   function ajax(url) {
     return new Promise((resolve, reject) => {
       const xhr = new XMLHttpRequest();
       xhr.open("GET", url);
       xhr.onload = () => resolve(xhr.responseText);
       xhr.onerror = () => reject(new Error("ajax failed"));
       xhr.send();
     });
   }
   ajax("https://")
     .then((data) => console.log(data))
     .catch((error) => console.log(error));
   ```
