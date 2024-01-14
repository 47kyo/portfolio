var converter = new showdown.Converter();
fetch(mdPath)
  .then((response) => response.text())
  .then((mdContent) => {
    var html = converter.makeHtml(mdContent);
    $content.innerHTML = html;
    hljs.highlightAll();
    const titles = $content.getElementsByTagName("h3");
    let index = 1;
    for (let i of titles) {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#${i.id}">${i.textContent}</a>`;
      $ul.appendChild(li);
      const childs = document.querySelectorAll(`h4[id^="${index}"]`);
      if (childs.length) {
        const ul = document.createElement("ul");
        for (let child of childs) {
          const li = document.createElement("li");
          li.innerHTML = `<a href="#${child.id}">${child.textContent}</a>`;
          ul.appendChild(li);
        }
        li.appendChild(ul);
        $ul.appendChild(li);
      }
      index++;
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
