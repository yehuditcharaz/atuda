const ErrorMessages = {
    REJECT: "",
    UPDATE_ELEMENTS: "⛔ Error during element setup:",
};

const HTMLElements = {
    INFO: `
    <div class="m-auto max-w-full w-[56rem] shadow-3xl min-h-fit scrollbar-hidden bg-gray-50 dark:bg-gray-900 rounded-2xl svelte-fq1rhy" dir="rtl" style="text-align: right;">
        <div class="text-gray-700 dark:text-gray-100">
            <div class="flex justify-between dark:text-gray-300 px-5 pt-4 pb-1">
                <div class="text-lg font-medium self-center">הוראות שימוש בצ'אטבוט</div>
                <button id="closeDialog" class="self-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"></path>
                    </svg>
                </button>
            </div>

            <div class="px-5 py-4 text-gray-800 dark:text-gray-100">
                <p class="mb-4 text-lg font-semibold">🚁 ברוך הבא לצ'אטבוט התמיכה למערכות המסוק! 🚁</p>
                <p>הצ'אטבוט כאן כדי לעזור לך להבין את מערכות המסוק והפעלתן, עם מידע מדויק מהתיעוד הרשמי.</p>

                <h2 class="mt-4 font-semibold text-xl">איך לשאול שאלות?</h2>
                <p><strong>המערכת תומכת בשאלות בעברית ובאנגלית, אבל התשובות תמיד יתקבלו באנגלית.</strong></p>
                <p>כששואלים בעברית, <strong>מומלץ לציין מושגים טכניים באנגלית</strong> כדי לשפר את הדיוק של התשובה.</p>

                <h2 class="mt-4 font-semibold text-lg">🔹 דוגמה לשאלה בעברית עם מושגים באנגלית:</h2>
                <div class="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg my-2">
                    ❌ איך מפעילים את מערכת ההידראוליקה? <br>
                    ✅ איך מפעילים את ה-<strong>Hydraulic System</strong>?
                </div>

                <p class="mt-4"><strong>אם לא מתקבלת תשובה מדויקת או ברורה מספיק, כדאי לנסות לשאול מחדש ישירות באנגלית – זה עשוי לשפר את הדיוק והפירוט של התשובה.</strong></p>

                <h2 class="mt-4 font-semibold text-xl">מה תקבל בתשובה?</h2>
                <ul class="list-disc pr-5">
                    <li>📖 מידע ישירות מהתיעוד הרשמי</li>
                    <li>🔗 קישורים לפרקים הרלוונטיים במדריך</li>
                    <li>📷 תמונות להמחשה</li>
                </ul>
                <p class="mt-2">🔹 קישורים ותמונות יתווספו לפי העניין – בהתאם לתוכן השאלה ולצורך בהמחשה.</p>

                <div class="mt-4 p-3 bg-green-100 dark:bg-green-800 rounded-lg">
                    <h2 class="font-semibold text-xl">💡 טיפ:</h2>
                    <p>ככל שהשאלה תהיה יותר ברורה וממוקדת – התשובה תהיה יותר מועילה! 🚀</p>
                </div>
            </div>
        </div>
    </div>
    `,
    DIALOG: `
    <div class="m-auto max-w-full w-[56rem] shadow-3xl min-h-fit scrollbar-hidden bg-gray-50 dark:bg-gray-900 rounded-2xl svelte-fq1rhy">
        <div class="text-gray-700 dark:text-gray-100">
            <button id="closeDialog" class="self-center" style="text-align="left";">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"></path>
                </svg>
            </button>
            <p style="text-align: center;">מקורות</p>
        </div>
    </div>
    `
};

const DocumentsLinks = {
    PREFIX: "https://signurl-service:5000/get_link?url=knowledge-rag-v1/corpus/",
    DOCUMENTS: [
        {
            text: 'RFM',
            url: 'RFM%20%D7%A2%D7%93%D7%9B%D7%95%D7%9F%208.2.24/RFM%20%D7%A2%D7%93%D7%9B%D7%95%D7%9F%208.2.24.pdf'
        },
        {
            text: 'הסבה טכנאים',
            url: '%D7%97%D7%95%D7%91%D7%A8%D7%AA%20%D7%94%D7%A1%D7%91%D7%94%20%D7%98%D7%9B%D7%A0%D7%90%D7%99%D7%9D/%D7%97%D7%95%D7%91%D7%A8%D7%AA%20%D7%94%D7%A1%D7%91%D7%94%20%D7%98%D7%9B%D7%A0%D7%90%D7%99%D7%9D.pdf'
        },
        {
            text: 'GARMIN G1000H NXi',
            url: 'GARMIN%20G1000H%20NXi/GARMIN%20G1000H%20NXi.pdf'
        },
        {
            text: 'חוברת הסבה מאי 24',
            url: '%D7%97%D7%95%D7%91%D7%A8%D7%AA%20%D7%94%D7%A1%D7%91%D7%94%20%D7%9E%D7%90%D7%99%2024/%D7%97%D7%95%D7%91%D7%A8%D7%AA%20%D7%94%D7%A1%D7%91%D7%94%20%D7%9E%D7%90%D7%99%2024.pdf'
        },
        {
            text: 'ממשקים בין מערכות תצורה ישראלית',
            url: '%D7%9E%D7%9E%D7%A9%D7%A7%D7%99%D7%9D%20%D7%91%D7%99%D7%9F%20%D7%9E%D7%A2%D7%A8%D7%9B%D7%95%D7%AA%20%D7%AA%D7%A6%D7%95%D7%A8%D7%94%20%D7%99%D7%A9%D7%A8%D7%90%D7%9C%D7%99%D7%AA/%D7%9E%D7%9E%D7%A9%D7%A7%D7%99%D7%9D%20%D7%91%D7%99%D7%9F%20%D7%9E%D7%A2%D7%A8%D7%9B%D7%95%D7%AA%20%D7%AA%D7%A6%D7%95%D7%A8%D7%94%20%D7%99%D7%A9%D7%A8%D7%90%D7%9C%D7%99%D7%AA.pdf'
        },
        {
            text: 'תצורה ישראלית',
            url: '%D7%AA%D7%A6%D7%95%D7%A8%D7%94%20%D7%99%D7%A9%D7%A8%D7%90%D7%9C%D7%99%D7%AA/%D7%AA%D7%A6%D7%95%D7%A8%D7%94%20%D7%99%D7%A9%D7%A8%D7%90%D7%9C%D7%99%D7%AA.pdf'
        },
        {
            text: 'helicopter_flying_handbook-2',
            url: 'helicopter_flying_handbook-2/helicopter_flying_handbook-2.pdf'
        },
        {
            text: 'IQRH_28.7.24',
            url: 'IQRH_28.7.24/IQRH_28.7.24.pdf'
        }
    ]
};


window.navigation.addEventListener("navigate", () => {
    runUpdateElements();
})

function waitForElementByObserver(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const targetNode = document.body;
        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(targetNode, { childList: true, subtree: true });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found after ${timeout}ms`));
        }, timeout);
    });
}

async function runUpdateElements() {
    try {
        const infoPlace = await waitForElementByObserver('[aria-label="New Chat"]', 8000);

        if (!document.getElementById("InstructionsDiv")) {
            setInfo(infoPlace);
            await waitForElementByObserver("#InstructionsDiv");
            setFiles();
        }

        observeMenuContainer();
        deleteHelps();
    } catch (err) {
        console.error(ErrorMessages.UPDATE_ELEMENTS, err);
    }
}

function observeMenuContainer() {
    const observer = new MutationObserver(() => {
        const menu = document.querySelector('[role="menu"]');
        const isAdmin = document.querySelector('[href="/admin"]');

        if (menu && isAdmin && !menu.querySelector('#feedback')) {
            setFeedback(menu);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function setInfo(infoPlace) {
    const infoDiv = document.createElement('div');
    infoDiv.className = "flex";
    infoDiv.id = "InstructionsDiv";
    const buttonI = createButton(ClickInfo, "Instructions", 'flex cursor-pointer px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition');
    infoDiv.appendChild(buttonI);
    const iconDiv = document.createElement('div');
    iconDiv.className = "m-auto self-center";
    buttonI.appendChild(iconDiv);
    const svgInfo = createSVGElement("M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z");
    iconDiv.appendChild(svgInfo);
    infoPlace.insertAdjacentElement('beforebegin', infoDiv);
}

function createSVGElement(d){
    const svgElementNamespace = "http://www.w3.org/2000/svg";

    const svgElement = document.createElementNS(svgElementNamespace, "svg");
    svgElement.setAttribute("xmlns", svgElementNamespace);
    svgElement.setAttribute("fill", "none");
    svgElement.setAttribute("viewBox", "0 0 24 24");
    svgElement.setAttribute("stroke-width", "2");
    svgElement.setAttribute("stroke", "currentColor");
    svgElement.setAttribute("class", "size-5");
    
    const pathElement = createPathElement(svgElementNamespace, d);
    svgElement.appendChild(pathElement);
    return svgElement;
}

function createPathElement(svgElementNamespace, d){
    const pathElement = document.createElementNS(svgElementNamespace, "path");
    pathElement.setAttribute("stroke-linecap", "round");
    pathElement.setAttribute("stroke-linejoin", "round");
    pathElement.setAttribute("d", d);
    return pathElement;
}

function createButton(ClickFunction, buttonID, className){
    const button = document.createElement('button');
    button.id = buttonID;
    button.className = className;
    button.addEventListener('click', function () { ClickFunction() });
    return button;
}

function setFiles() {
    const fileDiv = document.createElement('div');
    fileDiv.className = "flex";
    const filesButton = createButton(ClickSources, 'files', 'flex cursor-pointer px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition');
    fileDiv.appendChild(filesButton);
    const iconFileDiv = document.createElement('div');
    iconFileDiv.className = "m-auto self-center";
    filesButton.appendChild(iconFileDiv);
    const svgFile = createSVGElement("M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z");
    iconFileDiv.appendChild(svgFile);
    const filePlace = document.getElementById("InstructionsDiv");
    filePlace.insertAdjacentElement('beforebegin', fileDiv);
}

function deleteHelps() {
    const helps = document.getElementsByClassName('text-gray-600 dark:text-gray-300 bg-gray-300/20 size-5 flex items-center justify-center text-[0.7rem] rounded-full');
    [...helps].forEach((help) => {
        help.style.display = 'none';
    });
}

function ClickInfo() {
    const dialog = document.createElement('dialog');
    dialog.innerHTML = HTMLElements.INFO;
    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.querySelector('#closeDialog').onclick = function () {
        dialog.close();
        document.body.removeChild(dialog);
    };
}

function ClickSources() {
    const dialog = createDialog();
    const ul = createUL();
    dialog.querySelector('.text-gray-700.dark\\:text-gray-100').appendChild(ul);
    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.querySelector('#closeDialog').onclick = function () {
        dialog.close();
        document.body.removeChild(dialog);
    };
}

function createDialog(){
    const dialog = document.createElement('dialog');
    dialog.style.position = 'relative';
    dialog.style.width = "50%";
    dialog.style.bottom = '75%'
    dialog.style.left = '30%';
    dialog.style.borderRadius = "8px";
    dialog.innerHTML = HTMLElements.DIALOG;
    return dialog;
}

function createUL(){
    const ul = document.createElement('ul');
    ul.setAttribute('dir', 'rtl');
    ul.style.textAlign = 'right';

    DocumentsLinks.DOCUMENTS.forEach(doc => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `${DocumentsLinks.PREFIX}${doc.url}&page=1`;
        a.target = '_blank';
        a.textContent = `🔗 ${doc.text}`;
        li.appendChild(a);
        ul.appendChild(li);
    });

    return ul;
}

function setFeedback(menu) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = "flex";
    const feedbackButton = createButton(ClickFeedback, "feedback", 'flex rounded-md py-2 px-3 w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition');
    feedbackDiv.appendChild(feedbackButton);
    const iconFeedbackDiv = document.createElement('div');
    iconFeedbackDiv.className = "self-center mr-3";
    feedbackButton.appendChild(iconFeedbackDiv);
    const svgFeedback = createSVGElement("M7 11c.889-.086 1.416-.543 2.156-1.057a22.323 22.323 0 0 0 3.958-5.084 1.6 1.6 0 0 1 .582-.628 1.549 1.549 0 0 1 1.466-.087c.205.095.388.233.537.406a1.64 1.64 0 0 1 .384 1.279l-1.388 4.114M7 11H4v6.5A1.5 1.5 0 0 0 5.5 19v0A1.5 1.5 0 0 0 7 17.5V11Zm6.5-1h4.915c.286 0 .372.014.626.15.254.135.472.332.637.572a1.874 1.874 0 0 1 .215 1.673l-2.098 6.4C17.538 19.52 17.368 20 16.12 20c-2.303 0-4.79-.943-6.67-1.475");
    iconFeedbackDiv.appendChild(svgFeedback);
    const feedbackLabel = createLabel();
    feedbackButton.appendChild(feedbackLabel);
    menu.appendChild(feedbackDiv)
}

function createLabel(){
    const feedbackLabel = document.createElement('div');
    feedbackLabel.className = "self-center truncate";
    feedbackLabel.innerHTML = "פידבק";
    return feedbackLabel;
}

function ClickFeedback() {
    fetch("https://open-service:8080/download/feedback-report")
    .then(response => {
        if (response.status === 404) {
            return response.json().then(err => {
                alert(err.error); 
            });
        }
        return response.blob();
    })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'feedback-report';
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
