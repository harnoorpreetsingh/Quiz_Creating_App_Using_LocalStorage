
//____________________________CODE STARTS HERE____________________________________
console.log("Script running successfully");

// Taking references
let questionInput = document.getElementById("question_input");
let option1 = document.getElementById("option1_input");
let option2 = document.getElementById("option2_input");
let option3 = document.getElementById("option3_input");
let option4 = document.getElementById("option4_input");
let answerInput = document.getElementById("answer_input");
let sbmtbtn = document.getElementById("addQues");
let loadAllQues = document.getElementById("loadAllQues");
let delAllData = document.getElementById("delQ");

const quizQuestions = [];

// Event listener to log value on input change
questionInput.addEventListener('input', (e) => {
    console.log(e.target.value);
});

// Taking input of options
let options = [option1, option2, option3, option4];

options.forEach(option => {
    option.addEventListener('input', (e) => {
        console.log(e.target.value);
    });
});

sbmtbtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission
    
    let question = questionInput.value;
    let options = [option1.value, option2.value, option3.value, option4.value];
    let answer = parseInt(answerInput.value) - 1; // Convert to zero-based index
    
    // Preventing blank value submission
    if (!question || options.some(option => !option)) {
        alert("Please fill all the fields");
        console.log("Question or options are empty");
        return;
    }

    else if (answer < 0 || answer >= options.length) {
        alert("Please enter a valid answer number between 1 and 4.");
        return;
    }

    let newQuestion = {
        question: question,
        options: options,
        answer: answer
    };

    quizQuestions.push(newQuestion);

    // Display the saved question
    JSON.stringify(newQuestion);
    document.getElementById("viewQuestion").innerText = newQuestion.question;
    document.getElementById("viewOptions").innerText = newQuestion.options.join(", ");
    document.getElementById("viewAnswer").innerText = newQuestion.answer + 1;

    // Clear the input fields
    questionInput.value = '';
    option1.value = '';
    option2.value = '';
    option3.value = '';
    option4.value = '';
    answerInput.value = '';

    // Save to localStorage
    setStorageData(quizQuestions);
});

loadAllQues.addEventListener("click", () => {
    const existingQuestions = getStorageData();
    if (existingQuestions.length === 0) {
        alert("No Questions Added by User.");
    }

    // Clear previous content
    document.getElementById("viewAQ").innerHTML = '';
    document.getElementById("viewAO").innerHTML = '';
    document.getElementById("viewAAn").innerHTML = '';

    // Display all questions
    existingQuestions.forEach((question, index) => {
        document.getElementById("viewAQ").innerHTML += `
            <p id="questionText${index}">Question ${index + 1}: ${question.question}</p>
            <button type="button" onclick="deleteOne(${index})" id="delete_one_${index}">Delete This Question</button>
            <button type="button" onclick="editOne(${index})" id="editQues${index}">Edit This Question</button>
        `;
    
        document.getElementById("viewAO").innerHTML += `
            <p id="optionsText${index}">Options- Question No. ${index + 1}: ${question.options.join(", ")}</p>
            <button type="button" onclick="editOptions(${index})" id="editOpts${index}">Edit The Options</button>
        `;
    
        document.getElementById("viewAAn").innerHTML += `
            <p id="answerText${index}">Answer- Question No. ${index + 1}: ${question.answer + 1}</p>
            <button type="button" onclick="editAnswer(${index})" id="editAns${index}">Edit This Answer</button>
        `;
    });
});

//____________________EDIT ONE_______________________________

function editOne(index) {
    const existingQuestions = getStorageData();
    const question = existingQuestions[index];

    // Replace question text with input field
    document.getElementById(`questionText${index}`).innerHTML = `
        <input type="text" id="editQuestionInput${index}" value="${question.question}" />
        <button type="button" onclick="saveChanges(${index})">Save Changes</button>
    `;
}

//____________________EDIT OPTIONS_______________________________

function editOptions(index) {
    const existingQuestions = getStorageData();
    const question = existingQuestions[index];

    // Replace options with input fields
    const optionsHTML = question.options.map((option, optIndex) => `
        <input type="text" id="editOption${index}_${optIndex}" value="${option}" />
    `).join('');
    
    document.getElementById(`optionsText${index}`).innerHTML = optionsHTML + `
        <button type="button" onclick="saveOptions(${index})">Save Options</button>
    `;
}

//____________________EDIT ANSWER_______________________________

function editAnswer(index) {
    const existingQuestions = getStorageData();
    const question = existingQuestions[index];

    // Replace answer with input field
    document.getElementById(`answerText${index}`).innerHTML = `
        <input type="number" id="editAnswerInput${index}" value="${question.answer + 1}" min="1" max="4" />
        <button type="button" onclick="saveAnswer(${index})">Save Answer</button>
    `;
}

//____________________SAVE CHANGES_______________________________

function saveChanges(index) {
    const existingQuestions = getStorageData();
    const editedQuestion = document.getElementById(`editQuestionInput${index}`).value;

    // Update the existing question data
    existingQuestions[index].question = editedQuestion;

    // Save updated questions to localStorage
    setStorageData(existingQuestions);

    // Reload the displayed questions
    loadAllQues.click();
}

//____________________SAVE OPTIONS_______________________________

function saveOptions(index) {
    const existingQuestions = getStorageData();
    const editedOptions = [
        document.getElementById(`editOption${index}_0`).value,
        document.getElementById(`editOption${index}_1`).value,
        document.getElementById(`editOption${index}_2`).value,
        document.getElementById(`editOption${index}_3`).value
    ];

    // Update the existing options data
    existingQuestions[index].options = editedOptions;

    // Save updated options to localStorage
    setStorageData(existingQuestions);

    // Reload the displayed questions
    loadAllQues.click();
}

//____________________SAVE ANSWER_______________________________

function saveAnswer(index) {
    const existingQuestions = getStorageData();
    const editedAnswer = parseInt(document.getElementById(`editAnswerInput${index}`).value) - 1; // Convert back to zero-based index

    // Update the existing answer data
    existingQuestions[index].answer = editedAnswer;

    // Save updated answer to localStorage
    setStorageData(existingQuestions);

    // Reload the displayed questions
    loadAllQues.click();
}

// Delete one question
const deleteOne = (index) => {
    const exQns = JSON.parse(localStorage.getItem('quizQuestions')) || [];
    
    // Ensure index is valid
    if (exQns.length > index) {
        exQns.splice(index, 1); // Remove the question at the specified index
        window.localStorage.setItem('quizQuestions', JSON.stringify(exQns)); // Update local storage
        alert(`Selected Question no ${index + 1} has been Deleted Successfully.`);
        loadAllQues.click(); // Refresh the displayed questions
    } else {
        alert('No Question exists in storage. Please add.');
    }
};

// Setting up get, set localStorage functions
const setStorageData = (data) => {
    window.localStorage.setItem('quizQuestions', JSON.stringify(data));
};

const getStorageData = () => {
    return JSON.parse(window.localStorage.getItem('quizQuestions')) || [];
};

const deleteStorageData = () => {
    window.localStorage.removeItem('quizQuestions');
};

delAllData.addEventListener("click", () => {
    deleteStorageData();
    alert("Data's Empty!");
    location.reload();
});
