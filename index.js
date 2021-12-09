const ERROR1 = 'Помилковий текст задачі. Речення мають бути розділенні одним із знаків "!?.".  Використовуйте ці знаки виключно у кінці речення. Також задача не може мати більше двох питань.'
const ERROR2 = "Перше речення умови-це вхідні данні, обов'язково має включати в себе принаймні одне число, якщо на початку немає предметів використайте у реченні щось накшталт \"0 предметів\" "
const ERROR3 = "Друге речення задачі описує дію і обов'язково має тільки одну дію, дії можуть бути такими \"з'їв, забрав, поклав\".";
const ERROR4 = "Друге речення задачі описує дію і обов'язково має в собі мінімум одне число.";

const FRUITS = ["яблука", "груші", "апельсини", "мандарини"];
const ACTIONS = ["з'їв", "забрав", "поклав"];

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
        // parse(" 3 апельсини 5 яблук,10 мандарин та 4 олівці лежали на столі. Хлопчик з'їв 4 мандарини та 2 апельсини. Скільки всього фруктів з'їв хлопчик? Скільки залишилось мандарин на столі?")
    };
};

function parse(startText) {

    const regexp = /[^.!?]+[.!?]/igs;
    const textArray = startText.match(regexp);
    if (!textArray) {
        textField.placeholder = ERROR1;
        return
    };
    if (textArray.length < 3 || textArray.length > 5) {
        textField.placeholder = ERROR1;
        return
    };

    const initData = initDataHandler(transformToArray(textArray[0]));
    if (initData.length < 1) {
        textField.placeholder = ERROR2;
        return
    };

    const normalizedInitData = normalize(initData);
    console.log(normalizedInitData);

    const action = actionHandler(transformToArray(textArray[1]));
    if (action.length !== 1) {
        textField.placeholder = ERROR3;
    }
    console.log(action);

    const actionData = initDataHandler(transformToArray(textArray[1]));
    if (actionData.length < 1) {
        textField.placeholder = ERROR4;
        return
    };

    const normalizedActionData = normalize(actionData)
    console.log(normalizedActionData);
};

function normalize(initData) {
    let newData = {};
    FRUITS.forEach((element) => {
        const regexp = new RegExp(element.slice(0, element.length - 2), "i");

        initData.forEach((oldElement) => {
            if (regexp.test(oldElement[1])) {
                newData[element] = oldElement[0];
            }
        })
    });
    return newData;
};

function transformToArray(text) {
    const wordArray = text.split(/[, ]/);
    return wordArray;
};

function initDataHandler(wordsArray) {
    let initData = [];
    wordsArray.forEach((element, index) => {
        if (/^[0-9]+$/.test(element)) {
            initData.push([element, wordsArray[index + 1]])
        }
    });
    return initData
};

function actionHandler(textArray) {
    let action = [];

    ACTIONS.forEach((element => {
        const wordsArray = (textArray.filter((el) => el === element));
        if (wordsArray.length > 1) {
            textField.placeholder = ERROR3;
        } else if (wordsArray[0]) { action.push(wordsArray[0]) };
    }))
    return action
}


textField.placeholder = "Введіть текст задачі";
startButton.addEventListener('click', onClickSubmit);
