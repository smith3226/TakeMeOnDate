document.addEventListener("DOMContentLoaded", () => {
    let currentQuestionIndex = 0;
    const responses = [];
    
    const questions = [
        {
            text: "Would you like to go on a date with me?",
            options: ["Yes", "No"],
            nextQuestion: {
                "Yes": 1,
                "No": 0  // Stay on same question
            }
        },
        {
            text: "What time of day would you prefer for the date?",
            options: ["Day", "Evening", "Night"],
            nextQuestion: {
                "Day": 2,
                "Evening": 2,  // Now goes to date selection
                "Night": 2     // Now goes to date selection
            }
        },
        {
            text: "Please choose a date for our date.",
            options: ["31st Dec", "1st Jan", "2nd Jan", "3rd Jan"],
            nextQuestion: {
                "31st Dec": 3,
                "1st Jan": 3,
                "2nd Jan": 3,
                "3rd Jan": 3
            }
        },
        {
            text: "What kind of place would you like to go to?",
            options: ["Movies", "Dinner", "Amusement Park"],
            nextQuestion: {
                "Movies": 4,
                "Dinner": 5,
                "Amusement Park": 6
            }
        },
        {
            text: "Which movie would you like to watch?",
            options: ["Sonic the Hedgehog 3", "PushPa 2", "Babygirl"],
            nextQuestion: {
                "Sonic the Hedgehog 3": 6,
                "PushPa 2": 6,
                "Babygirl": 6
            }
        },
        {
            text: "Which restaurant would you like to have dinner at?",
            options: ["Fishman Lobster Clubhouse Restaurant", "Diana's Oyster Bar & Grill", "Vi Pei Bistro"],
            nextQuestion: {
                "Fishman Lobster Clubhouse Restaurant": 6,
                "Diana's Oyster Bar & Grill": 6,
                "Vi Pei Bistro": 6
            }
        },
        {
            text: "All set! Ready for the date?",
            options: ["Yes, let's go!", "Maybe later"],
            nextQuestion: {
                "Yes, let's go!": null,
                "Maybe later": null
            }
        }
    ];


    const submitButton = document.getElementById("submit-button");
    submitButton.addEventListener("click", sendResponsesByEmail);


    const startButton = document.getElementById("start-button");
    const nextButton = document.getElementById("next-button");
    const prevButton = document.getElementById("prev-button");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const responseSummary = document.getElementById("response-summary");
    const resultPage = document.getElementById("result-page");
    const questionPage = document.getElementById("question-page");
    const landingPage = document.getElementById("landing-page");

    startButton.addEventListener("click", startQuestionnaire);
    nextButton.addEventListener("click", handleNext);
    prevButton.addEventListener("click", handlePrev);

    function startQuestionnaire() {
        landingPage.style.display = "none";
        questionPage.style.display = "block";
        currentQuestionIndex = 0;
        responses.length = 0;
        showQuestion();
    }

    function showQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        
        if (!currentQuestion) {
            console.error("Invalid question at index:", currentQuestionIndex);
            return;
        }

        questionText.textContent = currentQuestion.text;
        optionsContainer.innerHTML = "";

        currentQuestion.options.forEach((option) => {
            const button = document.createElement("button");
            button.textContent = option;
            button.classList.add("option-button");
            
            if (currentQuestionIndex === 0 && option === "No") {
                button.addEventListener("click", moveNoButton);
            } else {
                button.addEventListener("click", () => handleOptionClick(option));
            }
            
            optionsContainer.appendChild(button);
        });

        prevButton.style.display = currentQuestionIndex > 0 ? "inline-block" : "none";
        nextButton.style.display = "none";
    }

    function moveNoButton(event) {
        const button = event.target;
        const maxX = window.innerWidth - button.offsetWidth;
        const maxY = window.innerHeight - button.offsetHeight;
        
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        button.style.position = "fixed";
        button.style.left = `${Math.min(randomX, maxX)}px`;
        button.style.top = `${Math.min(randomY, maxY)}px`;
        
        event.preventDefault();
        event.stopPropagation();
    }

    function handleOptionClick(selectedOption) {
        const currentQuestion = questions[currentQuestionIndex];
        
        if (!currentQuestion) {
            console.error("Invalid question at index:", currentQuestionIndex);
            return;
        }

        // Store the response
        responses[currentQuestionIndex] = {
            question: currentQuestion.text,
            answer: selectedOption
        };

        // Get next question index based on the selected option
        const nextIndex = currentQuestion.nextQuestion[selectedOption];

        if (nextIndex === null) {
            endQuestionnaire();
        } else {
            currentQuestionIndex = nextIndex;
            showQuestion();
        }
    }

    function handleNext() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        }
    }

    function handlePrev() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion();
        }
    }

    function endQuestionnaire() {
        questionPage.style.display = "none";
        resultPage.style.display = "block";

        const formattedResponses = responses
            .filter((response) => response)
            .map((response) => `${response.question}\nYour choice: ${response.answer}`)
            .join("\n\n");

        responseSummary.textContent = "Your Date Plans:\n\n" + formattedResponses;
        sendResponsesByEmail(formattedResponses);
    }

    function sendResponsesByEmail(formattedResponses) {
        console.log("Sending responses by email:", formattedResponses);
        fetch("https://formsubmit.co/smithdias3226@gmail.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ responses: formattedResponses }),
        })
            .then((response) => {
                if (response.ok) {
                    alert("Responses sent to your email!");
                } else {
                    alert("Failed to send responses.");
                }
            })
            .catch((error) => {
                console.error("Error submitting to email:", error);
                alert("An error occurred. Please try again.");
            });
    }
});