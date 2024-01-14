// utilities
var get = function (selector, scope) {
  scope = scope ? scope : document;
  return scope.querySelector(selector);
};

var getAll = function (selector, scope) {
  scope = scope ? scope : document;
  return scope.querySelectorAll(selector);
};

// setup typewriter effect in the terminal demo
if (document.getElementsByClassName("demo").length > 0) {
  var i = 0;
  var txt = `Welcome to my website! 
            I'm a 24-year-old full-stack developer with a passion for backend development and low-level concepts such as optimization. I find joy in unraveling core concepts and continuously seek knowledge. Always eager to learn and explore things about this field. 
            `;
  var speed = 20;

  function typeItOut() {
    if (i < txt.length) {
      document.getElementsByClassName("demo")[0].innerHTML += txt.charAt(i);
      i++;
      setTimeout(typeItOut, speed);
    }
  }

  setTimeout(typeItOut, 1800);
}

function showDemo(filename) {
  const modal = document.getElementById("modal");
  modal.classList.add("modal_open");
  const video = modal.querySelector("video");
  video.src = "/assests/demos/" + filename;
}

function closeDemo() {
  const modal = document.getElementById("modal");
  modal.classList.remove("modal_open");
  const video = modal.querySelector("video");
  video.src = "";
}
