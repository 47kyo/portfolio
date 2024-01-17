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
            I'm an experienced full-stack developer with a focus on server-side development and a keen interest in optimizing low-level concepts. Actively contributing to different projects, I currently work as a full-stack developer in a fastgrowing company in Uppsala, Sweden. In addition to my university degree, I've completed several online courses focusing on specific technologies and concepts. My commitment to continuous learning and exploration drives my passion for this field.
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
