const ERROR1 = 'Помилковий текст задачі. Речення мають бути розділенні одним із знаків "!?.".  Використовуйте ці знаки виключно у кінці речення. Текст має складатись щонайменьше з 3 речень '
const ERROR2 = "Перше речення умови-це вхідні данні, обов'язково має включати в себе принаймні одне число, якщо на початку немає предметів використайте у реченні щось накшталт \"0 предметів\" "
const ERROR3 = "Друге речення задачі описує дію і обов'язково має тільки одну дію, дії можуть бути такими \"з'їв,  поклав\".";
const ERROR4 = "Друге речення задачі описує дію і обов'язково має в собі мінімум одне число.";
const ERROR5 = "Третє та подальші речення задачі це запитання, обов'язково починаються зі слова \"Скільки\". Також перевірте крапки між попередніми реченнями.";
const ERROR6 = "Кожне речення запитання має включити в себе тільки один об'єкт це \"хлопчик\" або \"столі\".";
const ERROR7 = "Питання мають обов'язково включати одну з фраз, також слова з цих фраз не мають двічі зустрічатись в одному реченні \" залишилось на столі\",\"з'їв хлопчик\",\"поклав хлопчик\".";


const FRUITS = ["яблука", "груші", "апельсини", "мандарини"];
const ACTIONS = ["з'їв", "поклав"];
const TARGET = ["столі", "хлопчик"];
const DOBOY = ["з'їв", "поклав"];
const DOTABLE = ["залишилось"];
const THINKS = [...FRUITS, "фрукти"];

const startButton = document.querySelector('.form--button');
const textField = document.querySelector('.form--text');

let errorState = false;
let startText = "";


function onClickSubmit(ev) {
    ev.preventDefault();

    if (!errorState) {
        startText = textField.value.trim();
        if (startText === "") {
            textField.placeholder = "Введіть текст задачі";
            textField.value = "";
        } else {

            textField.placeholder = "";
            textField.value = "";
            parse(startText);
            // parse(" 3 апельсини 5 яблук,10 мандарин та 4 олівці лежали на столі. Хлопчик з'їв 4 мандарини та 2 апельсини. Скільки всього фруктів з'їв хлопчик? Скільки залишилось мандарин на столі?")
        };
    } else {

        textField.placeholder = "";
        errorState = false;
        startButton.innerText = "Відправити";
        startButton.style.background = 'darkorange';
        textField.value = startText;
    }
};

function parse(startText) {

    const regexp = /[^.!?]+[.!?]/igs;
    const textArray = startText.match(regexp);
    if (!textArray) {
        errorHandler(ERROR1);
        return
    };
    if (textArray.length < 3) {
        errorHandler(ERROR1);
        return
    };

    const initData = initDataHandler(transformToArray(textArray[0]));
    if (initData.length < 1) {
        errorHandler(ERROR2);
        return
    };

    const normalizedInitData = normalize(initData);
    console.log(normalizedInitData);

    const action = actionHandler(transformToArray(textArray[1]));
    if (action.length !== 1) {
        errorHandler(ERROR3);
    }
    console.log(action);

    const actionData = initDataHandler(transformToArray(textArray[1]));
    if (actionData.length < 1) {
        errorHandler(ERROR4);
        return
    };

    const normalizedActionData = normalize(actionData)
    console.log(normalizedActionData);

    for (let index = 2; index < textArray.length; index++) {
        let questionAction = [];
        const wordsArray = transformToArray(textArray[index].trim(''))
        if (wordsArray[0] !== "Скільки") {
            errorHandler(ERROR5);
            return
        };

        const questionObject = comparationArrays(TARGET, wordsArray);

        if (questionObject.length !== 1) {
            errorHandler(ERROR6);
            return
        };
        console.log(questionObject);

        if (questionObject[0] === "столі") {
            const DOTABLE = ["залишилось"];
            questionAction = comparationArrays(DOTABLE, wordsArray)
        } else if (questionObject[0] === "хлопчик") {
            questionAction = comparationArrays(DOBOY, wordsArray)
        };

        if (questionAction.length !== 1) {
            errorHandler(ERROR7);
            return
        };
        console.log(questionAction);


    }
};

function comparationArrays(startDataArr, currentArr) {
    let resArray = [];
    startDataArr.forEach((element) => {
        const regexp = createRegexp(element);

        currentArr.forEach((word) => {
            if (regexp.test(word)) { resArray.push(element) }
        })
    })
    return resArray
}



function normalize(initData) {
    let newData = {};
    FRUITS.forEach((element) => {
        const regexp = createRegexp(element);

        initData.forEach((oldElement) => {
            if (regexp.test(oldElement[1])) {
                newData[element] = oldElement[0];
            }
        })
    });
    return newData;
};

function createRegexp(element) {
    return new RegExp(element.slice(0, element.length - 2), "i")
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
            errorHandler(ERROR3);
        } else if (wordsArray[0]) { action.push(wordsArray[0]) };
    }))
    return action
};

function errorHandler(err) {
    textField.placeholder = err;
    errorState = true;
    startButton.innerText = "Повернутись";
    startButton.style.background = 'red';
}


textField.placeholder = "Введіть текст задачі";
startButton.addEventListener('click', onClickSubmit);
