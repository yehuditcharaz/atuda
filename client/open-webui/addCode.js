console.log('aaaaaaaaaaaaaaaaaaaaaaa')

window.navigation.addEventListener("navigate", (event) => {
    setTimeout(AddInstructions, 1000)
})

function AddInstructions(){
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
    }
}

function ClickInfo() {
    console.log("ClickInfo activate");
    
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
    <div  dir="rtl" style="text-align: right;">
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
                <p>💬 <strong>המערכת מספקת תשובות מדויקות יותר באנגלית, ולכן ההמלצה היא לשאול ישירות באנגלית.</strong></p>
                <p>✅ ניתן לשאול שאלות בעברית, אך חשוב לציין מושגים באנגלית – למשל:</p>

                <div class="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg my-2">
                    ❌ איך מפעילים את מערכת ההידראוליקה? <br>
                    ✅ איך מפעילים את ה-<strong>Hydraulic System</strong>?
                </div>

                <h2 class="mt-4 font-semibold text-xl">דוגמאות לשאלות טובות:</h2>
                <ul class="list-disc pr-5">
                    <li><strong>How do I activate the Hydraulic System?</strong></li>
                    <li><strong>What should I do in case of low oil pressure?</strong></li>
                </ul>

                <h2 class="mt-4 font-semibold text-xl">מה תקבל בתשובה?</h2>
                <ul class="list-disc pr-5">
                    <li>📖 מידע ישירות מהתיעוד הרשמי</li>
                    <li>🔗 קישורים לפרקים הרלוונטיים במדריך</li>
                    <li>📷 תמונות (אם זמינות) שיעזרו לך להבין טוב יותר</li>
                </ul>

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
