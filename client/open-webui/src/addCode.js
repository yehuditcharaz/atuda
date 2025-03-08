window.navigation.addEventListener("navigate", () => {
    setTimeout(userLogin, 1000);
    setTimeout(UpdateElements, 3500);
    setTimeout(selectModel, 3500);
})

let flag = true;

function UpdateElements() {
    if (!document.getElementById("InstructionsDiv")) {
        const infoPlace = document.querySelector('[aria-label="New Chat"]');
        const infoDiv = document.createElement('div');
        infoDiv.className = "flex"
        infoDiv.id = "InstructionsDiv"
        const buttonI = document.createElement('button');
        buttonI.id = "Instructions"
        buttonI.className = 'flex cursor-pointer px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition';
        infoDiv.appendChild(buttonI)
        buttonI.addEventListener('click', function () { ClickInfo() })
        const iconDiv = document.createElement('div');
        iconDiv.className = "m-auto self-center"
        buttonI.appendChild(iconDiv)
        const svgInfoNamespace = "http://www.w3.org/2000/svg";
        const svgInfo = document.createElementNS(svgInfoNamespace, "svg");
        svgInfo.setAttribute("xmlns", svgInfoNamespace);
        svgInfo.setAttribute("fill", "none");
        svgInfo.setAttribute("viewBox", "0 0 24 24");
        svgInfo.setAttribute("stroke-width", "2");
        svgInfo.setAttribute("stroke", "currentColor");
        svgInfo.setAttribute("class", "size-5");
        const pathInfo = document.createElementNS(svgInfoNamespace, "path");
        pathInfo.setAttribute("stroke-linecap", "round");
        pathInfo.setAttribute("stroke-linejoin", "round");
        pathInfo.setAttribute("d", "M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z");
        svgInfo.appendChild(pathInfo);
        iconDiv.appendChild(svgInfo);
        infoPlace.insertAdjacentElement('beforebegin', infoDiv)

        const filePlace = document.getElementById("InstructionsDiv")
        const fileDiv = document.createElement('div');
        fileDiv.className = "flex";
        const buttonF = document.createElement('button');
        buttonF.id = "files"
        buttonF.className = 'flex cursor-pointer px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition';
        fileDiv.appendChild(buttonF)
        const iconFileDiv = document.createElement('div');
        iconFileDiv.className = "m-auto self-center"
        buttonF.appendChild(iconFileDiv);
        const svgFileNamespace = "http://www.w3.org/2000/svg";
        const svgFile = document.createElementNS(svgFileNamespace, "svg");
        svgFile.setAttribute("xmlns", svgFileNamespace);
        svgFile.setAttribute("fill", "none");
        svgFile.setAttribute("viewBox", "0 0 24 24");
        svgFile.setAttribute("stroke-width", "2");
        svgFile.setAttribute("stroke", "currentColor");
        svgFile.setAttribute("class", "size-5");
        const pathFile = document.createElementNS(svgFileNamespace, "path");
        pathFile.setAttribute("stroke-linecap", "round");
        pathFile.setAttribute("stroke-linejoin", "round");
        pathFile.setAttribute("d", "M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z");
        svgFile.appendChild(pathFile);
        iconFileDiv.appendChild(svgFile);
        filePlace.insertAdjacentElement('beforebegin', fileDiv);

        const ul = document.createElement('ul');
        ul.style.position = 'absolute';
        ul.style.bottom = '85%';
        ul.style.left = '78%';

        const options = [
            {
                name: "מקורות"
            },
            {
                name: " RFM 🔗",
                link: "https://signed-url-service-633427059080.us-central1.run.app/get_link?url=knowledge-rag/corpus/RFM%20%D7%A2%D7%93%D7%9B%D7%95%D7%9F%208.2.24/RFM%20%D7%A2%D7%93%D7%9B%D7%95%D7%9F%208.2.24.pdf&page=1"
            },
            {
                name: " הסבה טכנאים 🔗",
                link: "https://signed-url-service-633427059080.us-central1.run.app/get_link?url=knowledge-rag/corpus/%D7%97%D7%95%D7%91%D7%A8%D7%AA%20%D7%94%D7%A1%D7%91%D7%94%20%D7%9E%D7%90%D7%99%2024/%D7%97%D7%95%D7%91%D7%A8%D7%AA%20%D7%94%D7%A1%D7%91%D7%94%20%D7%9E%D7%90%D7%99%2024.pdf&page=1"
            }
        ];

        options.forEach(option => {
            const li = document.createElement('li');
            li.className = 'text-[0.7rem] text-gray-500 font-primary'
            li.style.textAlign = 'right';
            if (option.link) {
                const a = document.createElement('a');
                a.href = option.link;
                a.target = '_blank';
                a.innerHTML = option.name
                li.appendChild(a);
            }
            else{
                li.innerHTML = option.name;
                li.style.textAlign = 'center';
            }
            ul.appendChild(li);
        })

        const aa = document.getElementsByClassName('overflow-auto w-full h-full flex items-center');
        [...aa].forEach((ab) => {
            ab.appendChild(ul);
        })
    }

    const helps = document.getElementsByClassName('text-gray-600 dark:text-gray-300 bg-gray-300/20 size-5 flex items-center justify-center text-[0.7rem] rounded-full');
    [...helps].forEach((help) => {
        help.style.display = 'none';
    });

    const interpreter = document.querySelector('ml-1 self-end gap-0.5 flex items-center flex-1 max-w-[80%]');
    interpreter.style.display='none';

    let headphones = document.querySelector('path[d="M12 5a7 7 0 0 0-7 7v1.17c.313-.11.65-.17 1-.17h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a3 3 0 0 1-3-3v-6a9 9 0 0 1 18 0v6a3 3 0 0 1-3 3h-2a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h2c.35 0 .687.06 1 .17V12a7 7 0 0 0-7-7Z"]');
    headphones.style.display = 'none';
    const pElement = document.getElementById('chat-input');
    pElement.addEventListener('input', (event) => {
        const hasP = pElement.querySelector('p');
        if (!(hasP && hasP.innerText.trim() !== '')) {
            setTimeout(headPhonesNone, 20);
        }
    })
}

function headPhonesNone() {
    let headphones = document.querySelector('path[d="M12 5a7 7 0 0 0-7 7v1.17c.313-.11.65-.17 1-.17h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a3 3 0 0 1-3-3v-6a9 9 0 0 1 18 0v6a3 3 0 0 1-3 3h-2a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h2c.35 0 .687.06 1 .17V12a7 7 0 0 0-7-7Z"]');
    headphones.style.display = 'none';
}

function ClickInfo() {
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
    <div class="m-auto max-w-full w-[56rem] mx-2 shadow-3xl min-h-fit scrollbar-hidden bg-gray-50 dark:bg-gray-900 rounded-2xl svelte-fq1rhy" dir="rtl" style="text-align: right;">
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
                <p>💬 **הצ'אטבוט תומך בשאלות הן באנגלית והן בעברית.**  
                עם זאת, **בגרסה הנוכחית עדיף לשאול באנגלית** כדי לקבל תשובות מדויקות יותר.  
                אם אתה מעדיף לשאול בעברית, מומלץ לציין מושגים טכניים באנגלית, במיוחד כשמדובר במונחים מורכבים.</p>

                <h2 class="mt-4 font-semibold text-lg">🎯 דוגמאות לשאלות טובות באנגלית:</h2>
                <ul class="list-disc pr-5">
                    <li><strong>How do I activate the Hydraulic System?</strong></li>
                    <li><strong>What should I do in case of low oil pressure?</strong></li>
                </ul>

                <h2 class="mt-4 font-semibold text-lg">🔹 דוגמאות לשאלות בעברית עם מושגים באנגלית:</h2>
                <div class="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg my-2">
                    ❌ איך מפעילים את מערכת ההידראוליקה? <br>
                    ✅ איך מפעילים את ה-<strong>Hydraulic System</strong>?
                </div>

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
    `;
    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.querySelector('#closeDialog').onclick = function () {
        dialog.close();
        document.body.removeChild(dialog);
    };
}

function userLogin() {
    const login = document.getElementsByClassName('pf-v5-c-button pf-m-primary pf-m-block ');
    let userEmail, userPassword;
    [...login].forEach((entry) => {
        entry.addEventListener('click', function () {
            console.log("click");
            const emails = document.getElementById('username');
            console.log("emails ", emails);
            [...emails].forEach((email) => {
                userEmail = email.value;
            })
            const passwords = document.getElementById('password');
            console.log("password ", passwords);
            [...passwords].forEach((password) => {
                userPassword = password.value;
            })
            !(userEmail === "chaya@gmail.com" && userPassword === "chaya123!") ? flag = false : null;
        })
    })
}

function selectModel() {
    const setAsDefaults = document.getElementsByClassName('absolute text-left mt-[1px] ml-1 text-[0.7rem] text-gray-500 font-primary');
    if (flag) {
        [...setAsDefaults].forEach((setAsDefault) => {
            setAsDefault.addEventListener('click', function () {
                if (!document.getElementById('Ofer-chat')) {
                    this.style.display = 'none';
                    flag = false;
                    currentModel('flex w-full max-w-fit');
                }
            })
        });
    }
    else {
        [...setAsDefaults].forEach((setAsDefault) => {
            setAsDefault.style.display = 'none';
        });
        if (!document.getElementById('Ofer-chat')) {
            currentModel('flex flex-col w-full items-start');
        }
    }
}

function currentModel(className) {
    const selectedPipeline = document.getElementsByClassName(className);
    [...selectedPipeline].forEach((pipeline) => {
        pipeline.style.display = 'none';
    });
    const pipelines = document.getElementsByClassName('flex-1 overflow-hidden max-w-full py-0.5 ');
    const model = document.createElement('div');
    model.id = 'Ofer-chat'
    model.textContent = "Ofer chat";
    [...pipelines].forEach((pipeline) => {
        pipeline.appendChild(model);
    });
}
