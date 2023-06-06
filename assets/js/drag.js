const dragStart = function (e) {
    document.getElementById(e.target.id).classList.add('grabbing');
}

const dragEnd = function (e) {
    const drop = document.querySelectorAll('.drop');

    document.getElementById(e.target.id).classList.remove('grabbing');

    drop.forEach(element => {
        if ((e.clientX > element.getBoundingClientRect().x && e.clientX < element.getBoundingClientRect().x + element.clientWidth) &&
            (e.clientY > element.getBoundingClientRect().y && e.clientY < element.getBoundingClientRect().y + element.clientHeight)) {

            if (element.childElementCount === 0) {
                element.appendChild(document.getElementById(e.target.id));
            } else {
                let isAddedBefore = false;
                const childs = element.childNodes;

                childs.forEach(child => {
                    if (child.nodeName !== '#text') {
                        if (isAddedBefore === false) {
                            if ((e.clientX > child.getBoundingClientRect().x && e.clientX < child.getBoundingClientRect().x + child.clientWidth) &&
                                (e.clientY > child.getBoundingClientRect().y && e.clientY < child.getBoundingClientRect().y + child.clientHeight)) {
                                element.insertBefore(document.getElementById(e.target.id), child);
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

        document.querySelectorAll('.drop > p').forEach(p => {
            p.classList.remove('preview');
        })

        document.getElementById(element.id).classList.remove('over');
    });
}

const dragOver = function (e) {
    const drop = document.querySelectorAll('.drop');

    drop.forEach(element => {
        const childs = element.childNodes;

        if ((e.clientX > element.getBoundingClientRect().x && e.clientX < element.getBoundingClientRect().x + element.clientWidth) &&
            (e.clientY > element.getBoundingClientRect().y && e.clientY < element.getBoundingClientRect().y + element.clientHeight)) {
            document.getElementById(element.id).classList.add('over');

            childs.forEach(child => {
                if (child.nodeName !== '#text') {
                    if ((e.clientX > child.getBoundingClientRect().x && e.clientX < child.getBoundingClientRect().x + child.clientWidth) &&
                        (e.clientY > child.getBoundingClientRect().y && e.clientY < child.getBoundingClientRect().y + child.clientHeight)) {
                        child.classList.add('preview');
                    } else {
                        child.classList.remove('preview');
                    }
                }
            });
        } else {
            document.getElementById(element.id).classList.remove('over');
        }
    });
}

document.addEventListener('dragstart', dragStart);
document.addEventListener('dragend', dragEnd);
document.addEventListener('dragover', dragOver);