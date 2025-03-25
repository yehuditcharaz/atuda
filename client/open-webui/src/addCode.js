window.navigation.addEventListener("navigate", () => {
    setTimeout(UpdateElements, 2500);  
})

function UpdateElements(){
    if (!document.getElementById("InstructionsDiv")){
        const infoPlace = document.querySelector('[aria-label="New Chat"]');
        const infoDiv = document.createElement('div');
        infoDiv.className = "flex"
        infoDiv.id = "InstructionsDiv"
        const buttonI = document.createElement('button');
        buttonI.id = "Instructions"
        buttonI.className = 'flex cursor-pointer px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition';
        infoDiv.appendChild(buttonI)
        buttonI.addEventListener('click', function(){ClickInfo()})
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
        pathInfo.setAttribute("d","M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z");
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
        buttonF.addEventListener('click', function () { sources() });
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
        pathFile.setAttribute("d","M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z");
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
    `;
    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.querySelector('#closeDialog').onclick = function() {
        dialog.close();
        document.body.removeChild(dialog);
    };
}

function sources() {
    const dialog = document.createElement('dialog');
    dialog.style.position = 'relative';
    dialog.style.width = "50%";
    dialog.style.bottom = '75%'
    dialog.style.left = '30%';
    dialog.style.borderRadius = "8px";
    dialog.innerHTML = `
        <div class="m-auto max-w-full w-[56rem] shadow-3xl min-h-fit scrollbar-hidden bg-gray-50 dark:bg-gray-900 rounded-2xl svelte-fq1rhy">
            <div class="text-gray-700 dark:text-gray-100">
                <button id="closeDialog" class="self-center" style="text-align="left";">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"></path>
                    </svg>
                </button>
                    <p style="text-align: center;">מקורות</p>
                    <ul dir="rtl"; style="text-align: right;"> 
                        <li><a href='https://signed-url-service-633427059080.us-central1.run.app/get_link?url=knowledge-rag/corpus/RFM%20%D7%A2%D7%93%D7%9B%D7%95%D7%9F%208.2.24/RFM%20%D7%A2%D7%93%D7%9B%D7%95%D7%9F%208.2.24.pdf&page=1' target='_blank'>🔗 RFM</a></li>
                        <li><a href='https://signed-url-service-633427059080.us-central1.run.app/get_link?url=knowledge-rag/corpus/%D7%97%D7%95%D7%91%D7%A8%D7%AA%20%D7%94%D7%A1%D7%91%D7%94%20%D7%9E%D7%90%D7%99%2024/%D7%97%D7%95%D7%91%D7%A8%D7%AA%20%D7%94%D7%A1%D7%91%D7%94%20%D7%9E%D7%90%D7%99%2024.pdf&page=1' target='_blank'>🔗 הסבה טכנאים</a></li>
                    </ul>
            </div>
        </div>
    `    
    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.querySelector('#closeDialog').onclick = function () {
        dialog.close();
        document.body.removeChild(dialog);
    };
}
