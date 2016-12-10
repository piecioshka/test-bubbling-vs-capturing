'use strict';

var DELAY = 400;
var $div1 = document.querySelector('body > div');
var $div2 = document.querySelector('body > div > div');
var $button = document.querySelector('body > div > div > button');
var $select = document.querySelector('select');
var queue = [];
var useCapture = null;

function getType() {
    var type = $select.value;

    switch (type) {
        case 'capturing':
            return true;

        case 'bubbling':
            return false;

        default:
            throw new Error('mistake');
    }
}

function addClickTask($element) {
    queue.push(function () {
        $element.classList.add('click');

        setTimeout(function () {
            $element.classList.remove('click');
        }, DELAY);
    });
}

function clickHandler(evt) {
    evt.preventDefault();
    addClickTask(evt.currentTarget);
}

function buttonClickHandler() {
    var firstTask = queue.shift();
    if (!firstTask) return;
    firstTask();
}

function registerClicks(useCapture) {
    $div1.addEventListener('click', clickHandler, useCapture);
    $div2.addEventListener('click', clickHandler, useCapture);
    $button.addEventListener('click', clickHandler, useCapture);
}

function unregisterClicks(useCapture) {
    $div1.removeEventListener('click', clickHandler, useCapture);
    $div2.removeEventListener('click', clickHandler, useCapture);
    $button.removeEventListener('click', clickHandler, useCapture);
}

function setupSelectType() {
    $select.addEventListener('change', function () {
        unregisterClicks(useCapture);
        useCapture = getType();
        registerClicks(useCapture);
    });

    $select.focus();
}

function startWaitingForClicks() {
    setInterval(buttonClickHandler, DELAY);
}

function bootstrap() {
    setupSelectType();
    startWaitingForClicks();
}

bootstrap();
