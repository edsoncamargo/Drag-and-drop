const dragStart = function (e) {
  document.getElementById(e.target.id).classList.add("grabbing");
};

const dragOver = function (e) {
  const drop = document.querySelectorAll(".drop");
  const x =
    e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
  const y =
    e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;

  drop.forEach((element) => {
    const childs = element.childNodes;

    if (
      x > element.getBoundingClientRect().x &&
      x < element.getBoundingClientRect().x + element.clientWidth &&
      y > element.getBoundingClientRect().y &&
      y < element.getBoundingClientRect().y + element.clientHeight
    ) {
      document.getElementById(element.id).classList.add("over");

      childs.forEach((child) => {
        if (child.nodeName !== "#text") {
          if (
            x > child.getBoundingClientRect().x &&
            x < child.getBoundingClientRect().x + child.clientWidth &&
            y > child.getBoundingClientRect().y &&
            y < child.getBoundingClientRect().y + child.clientHeight
          ) {
            child.classList.add("preview");
          } else {
            child.classList.remove("preview");
          }
        }
      });
    } else {
      document.getElementById(element.id).classList.remove("over");
    }
  });
};

const dragEnd = function (e) {
  const drop = document.querySelectorAll(".drop");
  const x =
    e.touches && e.changedTouches.length > 0
      ? e.changedTouches[0].clientX
      : e.clientX;
  const y =
    e.touches && e.changedTouches.length > 0
      ? e.changedTouches[0].clientY
      : e.clientY;

  const hasGrabbing = document.querySelectorAll(".grabbing");
  if (hasGrabbing && hasGrabbing.length > 0) {
    hasGrabbing.forEach((e) => {
      e.classList.remove("grabbing");
    });
  }

  drop.forEach((element) => {
    if (
      x > element.getBoundingClientRect().x &&
      x < element.getBoundingClientRect().x + element.clientWidth &&
      y > element.getBoundingClientRect().y &&
      y < element.getBoundingClientRect().y + element.clientHeight
    ) {
      if (element.childElementCount === 0) {
        element.appendChild(document.getElementById(e.target.id));
      } else {
        let isAddedBefore = false;
        const childs = element.childNodes;
        childs.forEach((child) => {
          if (child.nodeName !== "#text") {
            if (isAddedBefore === false) {
              if (
                x > child.getBoundingClientRect().x &&
                x < child.getBoundingClientRect().x + child.clientWidth &&
                y > child.getBoundingClientRect().y &&
                y < child.getBoundingClientRect().y + child.clientHeight
              ) {
                element.insertBefore(
                  document.getElementById(e.target.id),
                  child
                );
                isAddedBefore = true;
              } else {
                const oldElement = document.getElementById(e.target.id);
                const newElement = oldElement.cloneNode(true);
                document.getElementById(e.target.id).remove();
                element.appendChild(newElement);
              }
            }
          }
        });
      }
    }
    document.querySelectorAll(".drop > p").forEach((p) => {
      p.classList.remove("preview");
    });

    document.getElementById(element.id).classList.remove("over");
  });
};

// desktop
document.addEventListener("dragstart", dragStart);
document.addEventListener("dragover", dragOver);
document.addEventListener("dragend", dragEnd);

// mobile
document.addEventListener("touchstart", dragStart);
document.addEventListener("touchmove", dragOver);
document.addEventListener("touchend", dragEnd);
