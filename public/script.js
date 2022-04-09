

(function () {
    let optionsContainer = document.querySelector(".options-cont");
    let toolsContainer = document.querySelector(".tool-cont");
    let pencil = document.querySelector(".pencil");
    let pencilToolContainer = document.querySelector(".pencil-tool-cont");
    let eraser = document.querySelector(".eraser");
    let eraserToolContainer = document.querySelector(".eraser-tool-cont");
    let sticky = document.querySelector(".sticky");
    let upload = document.querySelector(".upload");
    let canvas = document.querySelector("canvas");

    console.log(upload);


    let templates = document.querySelector("template");
    let body = document.querySelector("body");

    let pencilFlag = false;
    let erasorFlag = false;
    let optionsFlag = true;

    optionsContainer.addEventListener("click", function () {
        optionsFlag = !optionsFlag;
        let iOptionIco = this.querySelector("i");

        if (optionsFlag) {
            openTools();
        }
        else {
            closeTools();
        }
    });

    //show/hide pencil tool
    pencil.addEventListener("click", togglePencilTool);

    //show/hide eraser tool
    eraser.addEventListener("click", toggleEraserTool);

    //show sticky
    sticky.addEventListener("click", showSticky);

    //upload sticky img
    upload.addEventListener("click", uploadSticky);


    function togglePencilTool(e) {
        e.preventDefault();
        pencilFlag = !pencilFlag;
        drawCanvas = true;
        if (pencilFlag) {
            pencilToolContainer.style.display = "block";
            canvas.className = '';
            canvas.classList.add("pencil-cursor");
        }
        else {
            pencilToolContainer.style.display = "none";
            canvas.style.cursor = '';
            
        }

    }
    function toggleEraserTool(e) {
        e.preventDefault();
        erasorFlag = !erasorFlag;
        if (erasorFlag) {
            canvas.className = '';
            canvas.classList.add("eraser-cursor");

            eraserToolContainer.style.display = "flex";
        }
        else {
            eraserToolContainer.style.display = "none";
            canvas.style.cursor = '';

        }
    }

    // show tool container
    function openTools() {
        let iconElem = optionsContainer.children[0];
        iconElem.classList.remove("fa-xmark");
        iconElem.classList.add("fa-bars");
        toolsContainer.style.display = "flex";
    }

    // hide tool container
    function closeTools() {
        let iconElem = optionsContainer.children[0];
        iconElem.classList.remove("fa-bars");
        iconElem.classList.add("fa-xmark");
        toolsContainer.style.display = "none";
        pencilToolContainer.style.display = "none";
        eraserToolContainer.style.display = "none";

    }

    function showSticky() {

        let divStickyContTemplate = templates.content.querySelector(".sticky-cont");
        let divStickyCont = divStickyContTemplate.cloneNode(true);
        body.appendChild(divStickyCont);

        attachEventsonStickyCont(divStickyCont);


    }
    function attachEventsonStickyCont(divStickyCont) {
        divStickyCont.addEventListener("mousedown", dragNDrop);
        divStickyCont.ondragstart = () => false;
        let divStickyHeaderCont = divStickyCont.querySelector(".sticky-header-cont");
        let divMinMax = divStickyHeaderCont.querySelector(".minimize");
        let divClose = divStickyHeaderCont.querySelector(".close");

        divStickyCont.style.setProperty('box-shadow', 'rgba(0, 0, 0, 0.35) 0px 5px 15px');
        divMinMax.addEventListener("click", miniMaxSticky);
        divClose.addEventListener("click", closeSticky);
    }
    function miniMaxSticky() {

        let divMinMax = this;
        let minMaxIco = divMinMax.querySelector("i");
        let divStickyHeaderCont = divMinMax.parentNode;
        let divStickyCont = divStickyHeaderCont.parentNode;


        let divStickyNoteCont = this.parentNode.nextElementSibling;
        let textArea = divStickyNoteCont.querySelector("textarea");


        if (divMinMax.classList.contains("minimize")) {

            divStickyCont.style.removeProperty('box-shadow');
            divStickyHeaderCont.style.setProperty('box-shadow', 'rgba(0, 0, 0, 0.35) 0px 5px 15px');
            divMinMax.classList.remove("minimize");
            divMinMax.classList.add("maximize");
            minMaxIco.classList.remove("fa-angle-up");
            minMaxIco.classList.add("fa-angle-down");
            divStickyNoteCont.style.display = "none";
            divStickyCont.style.height = "0rem";
        }
        else if (divMinMax.classList.contains("maximize")) {
            divStickyCont.style.setProperty('box-shadow', 'rgba(0, 0, 0, 0.35) 0px 5px 15px');
            divMinMax.classList.remove("maximize");
            divMinMax.classList.add("minimize");
            minMaxIco.classList.remove("fa-angle-down");
            minMaxIco.classList.add("fa-angle-up");
            divStickyNoteCont.style.display = "flex";
            divStickyCont.style.height = "15rem";
        }
    }
    function closeSticky() {
        let divClose = this;
        let divStickyCont = divClose.parentNode.parentNode;
        divStickyCont.remove();
    }

    function dragNDrop(event) {

        let divStickyCont = this;
        let divStickyNoteCont = divStickyCont.querySelector(".sticky-note-cont");

        let shiftX = event.clientX - divStickyCont.getBoundingClientRect().left;
        let shiftY = event.clientY - divStickyCont.getBoundingClientRect().top;

        divStickyCont.style.position = 'absolute';
        divStickyCont.style.zIndex = 1000;
        divStickyCont.style.opacity = '0.5';

        document.body.append(divStickyCont);

        moveAt(event.pageX, event.pageY);

        // moves the ball at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
            divStickyCont.style.left = pageX - shiftX + 'px';
            divStickyCont.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
            divStickyCont.style.cursor = 'move';
        }

        // move the ball on mousemove
        document.addEventListener('mousemove', onMouseMove);

        // drop the ball, remove unneeded handlers
        divStickyCont.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            divStickyCont.style.opacity = '0.9';
            divStickyCont.style.cursor = 'default';

            divStickyCont.onmouseup = null;
        };
    }

    function uploadSticky() {
        let inputElem = document.createElement("input");
        inputElem.setAttribute("type", "file");
        inputElem.addEventListener("change", function () {
            uploadStickyImg(this);
        });
        inputElem.click();
    }

    function uploadStickyImg(inputElem) {
        let file = inputElem.files[0];
        let imgSrc = URL.createObjectURL(file);
        // console.log(imgSrc);


        let divStickyContTemplate = templates.content.querySelector(".sticky-cont");
        let divStickyCont = divStickyContTemplate.cloneNode(true);

        let divStickyNoteCont = divStickyCont.querySelector(".sticky-note-cont");
        divStickyNoteCont.innerHTML = '';
        let img = document.createElement("img");
        img.setAttribute("src", imgSrc);
        divStickyNoteCont.appendChild(img);

        console.log(divStickyCont.innerHTML);

        body.appendChild(divStickyCont);
        attachEventsonStickyCont(divStickyCont);



    }


})();

