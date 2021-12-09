const ERROR1 = 'Помилковий текст задачі. Речення мають бути розділенні одним із знаків "!?.".  Використовуйте ці знаки виключно у кінці речення. Також задача не може мати більше двох питаннь.'

const startButton = document.querySelector('.form--button');
const textField = document.querySelector('.form--text');

function onClickSubmit(ev) {
    ev.preventDefault();
    const startText = textField.value.trim();
    if (startText === "") {
        textField.placeholder = "Введіть текст задачі";
        textField.value = "";
    } else {

        textField.placeholder = "";
        textField.value = "";
        parse(startText);
    };
};

function parse(startText) {
    const regexp = /[^.!?]+[.!?]/igs;
    const textArray = startText.match(regexp);
    if (!textArray) {
        textField.placeholder = ERROR1;
        return
    }
    if (textArray.length < 3 || textArray.length > 5) {
        textField.placeholder = ERROR1;
        return
    };

    initDataHandler(transformToArray(textArray[0]));

};

function transformToArray(text) {
    // console.log(text);
    const wordArray = text.split(/[, ]/);
    return wordArray;
    // console.log(wordArray);
}

function initDataHandler(wordsArray) {
    console.log(wordsArray);
    let initData = [];
    wordsArray.forEach((element, index) => {
        if (/^[0-9]+$/.test(element)) {
            initData.push([element, wordsArray[index + 1]])
        }
    });
    console.log(initData);
}


textField.placeholder = "Введіть текст задачі";
startButton.addEventListener('click', onClickSubmit);
