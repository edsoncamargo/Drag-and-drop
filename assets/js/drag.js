const dragStart = function (e) {
  const x =
    e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
  const y =
    e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;

  const eDraggable = document.getElementById(e.target.id);
  eDraggable.classList.add("grabbing");
  eDraggable.setAttribute("active-old-draggable", true);

  const width = eDraggable.getBoundingClientRect().width;
  const height = eDraggable.getBoundingClientRect().height;
  const eClone = eDraggable.cloneNode(true);
  eClone.setAttribute("active-draggable", true);
  eClone.style.position = "absolute";
  eClone.style.width = `${width}px`;
  eClone.style.pointerEvents = "none";
  eClone.style.transition = "none";
  eClone.id = "";

  document.querySelector("body").appendChild(eClone);

  eClone.style.left = x - eClone.clientWidth / 2 + "px";
  eClone.style.top = y - eClone.clientHeight / 2 + "px";

  e.dataTransfer?.setDragImage(
    eClone,
    eClone.clientWidth / 2,
    eClone.clientHeight / 2
  );
};

const dragOver = function (e) {
  e.preventDefault();
  const drop = document.querySelectorAll(".drop");
  const x =
    e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
  const y =
    e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;

  const eClone = document.querySelector("[active-draggable=true]");

  if (eClone) {
    eClone.style.left = x - eClone.clientWidth / 2 + "px";
    eClone.style.top = y - eClone.clientHeight / 2 + "px";
  }

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
  e.preventDefault();
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

  const eClone = document.querySelector("[active-draggable=true]");

  let isAdded = false;

  drop.forEach((element, index) => {
    if (
      x > element.getBoundingClientRect().x &&
      x < element.getBoundingClientRect().x + element.clientWidth &&
      y > element.getBoundingClientRect().y &&
      y < element.getBoundingClientRect().y + element.clientHeight
    ) {
      isAdded = true;
      if (element.childElementCount === 0) {
        document.getElementById(e.target.id).style.opacity = 0;
        const eMask = document.createElement("div");
        const width = eClone.getBoundingClientRect().width;
        const height = eClone.getBoundingClientRect().height;
        eMask.style.height = height + 8 + "px";
        eMask.style.width = width + "px";

        element.appendChild(eMask);
        isAddedBefore = true;

        addClone(eClone, eMask).then(() => {
          replaceElement(document.getElementById(e.target.id), eMask);
          document.getElementById(e.target.id).style.opacity = 1;
          console.log(document.getElementById(e.target.id));
          document
            .getElementById(e.target.id)
            .setAttribute("active-old-draggable", false);
        });
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
                document.getElementById(e.target.id).style.opacity = 0;
                const eMask = document.createElement("div");
                const width = eClone.getBoundingClientRect().width;
                const height = eClone.getBoundingClientRect().height;
                eMask.style.height = height + 8 + "px";
                eMask.style.width = width + "px";

                element.insertBefore(eMask, child);
                isAddedBefore = true;

                addClone(eClone, eMask).then(() => {
                  replaceElement(document.getElementById(e.target.id), eMask);
                  document.getElementById(e.target.id).style.opacity = 1;
                  console.log(document.getElementById(e.target.id));
                  document
                    .getElementById(e.target.id)
                    .setAttribute("active-old-draggable", false);
                });
              } else {
                document.getElementById(e.target.id).style.opacity = 0;
                const eMask = document.createElement("div");
                const width = eClone.getBoundingClientRect().width;
                const height = eClone.getBoundingClientRect().height;
                eMask.style.height = height + 8 + "px";
                eMask.style.width = width + "px";

                element.appendChild(eMask);

                addClone(eClone, eMask).then(() => {
                  replaceElement(document.getElementById(e.target.id), eMask);
                  document.getElementById(e.target.id).style.opacity = 1;
                  console.log(document.getElementById(e.target.id));
                  document
                    .getElementById(e.target.id)
                    .setAttribute("active-old-draggable", false);
                });
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

    if (index >= drop.length - 1) {
      if (!isAdded) {
        addClone(eClone).then((eClone) => {
          document.getElementById(e.target.id).style.opacity = 1;
          document
            .getElementById(e.target.id)
            .setAttribute("active-old-draggable", false);
        });
      }
    }
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

function addClone(eClone, eTarget) {
  return new Promise((resolve, reject) => {
    const eOld = eTarget
      ? eTarget
      : document.querySelector("[active-old-draggable=true]");
    eOld.setAttribute("active-old-draggable", false);
    const padding = eTarget ? 0 : 8;

    if (eClone) {
      eClone.style.transition = "all 0.3s linear";

      setTimeout(() => {
        eClone.style.left = eOld.getBoundingClientRect().x - padding + "px";
        eClone.style.top = eOld.getBoundingClientRect().y - padding + "px";

        setTimeout(() => {
          eClone.remove();
          resolve(eClone);
        }, 300);
      }, 10);
    } else {
      reject(new Error("eClone not provided")); // Rejeitando a Promise se eClone não for fornecido
    }
  });
}

function replaceElement(newElement, oldElement) {
  if (oldElement && oldElement.parentNode) {
    oldElement.parentNode.replaceChild(newElement, oldElement);
  } else {
    console.error("Elemento antigo ou o pai não está presente.");
  }
}
