window.navigation.addEventListener("navigate", () => {
    setTimeout(UpdateElements, 1000);
    setTimeout(userLogin, 3500);
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
        buttonF.addEventListener('click', function () {
            window.open('https://www.example.com', '_blank');
        })
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
    }

    const helps = document.getElementsByClassName('text-gray-600 dark:text-gray-300 bg-gray-300/20 size-5 flex items-center justify-center text-[0.7rem] rounded-full');
    [...helps].forEach((help) => {
        help.style.display = 'none';
    });
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
    const userType = document.getElementsByClassName('size-6 object-cover rounded-full');
    console.log(userType[0].src);
    userType[0].src === "https://client-openwebui-199581308623.us-central1.run.app/user.png" ? flag = false : null;
}

function selectModel() {
    const setAsDefaults = document.getElementsByClassName('absolute text-left mt-[1px] ml-1 text-[0.7rem] text-gray-500 font-primary');
    const pipelines = document.getElementsByClassName('flex-1 overflow-hidden max-w-full py-0.5 ');
    if (flag) {
        console.log("in true");
        [...setAsDefaults].forEach((setAsDefault) => {
            setAsDefault.addEventListener('click', function () {
                this.style.display = 'none';
                flag = false;
                selectPipelineDisabled('flex w-full max-w-fit');
                currentModel(pipelines);
            })
        });
    }
    else {
        console.log("in false");
        [...setAsDefaults].forEach((setAsDefault) => {
            setAsDefault.style.display = 'none';
        });
        if (!document.getElementById('Ofer-knowledge-chat')) {
            selectPipelineDisabled('flex flex-col w-full items-start');
            currentModel(pipelines);
        }
    }
}

function selectPipelineDisabled(className) {
    const selectedPipeline = document.getElementsByClassName(className);
    [...selectedPipeline].forEach((pipeline) => {
        pipeline.style.display = 'none';
    });
}

function currentModel(pipelines) {
    const model = document.createElement('div');
    model.id = 'Ofer-knowledge-chat'
    model.textContent = "Ofer knowledge chat";
    [...pipelines].forEach((pipeline) => {
        pipeline.appendChild(model);
    });
}