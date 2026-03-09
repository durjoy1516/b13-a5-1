const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";


// LOGIN
function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === "admin" && pass === "admin123") {
        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("dashboardPage").classList.remove("hidden");
        loadIssues("all");
    } else {
        alert("Wrong username or password");
    }
}


// TAB CHANGE
function changeTab(type, event) {
    let buttons = document.querySelectorAll(".tabBtn");

    buttons.forEach(btn => {
        btn.classList.remove("bg-purple-600", "text-white");
        btn.classList.add("bg-gray-200");
    });

    event.target.classList.remove("bg-gray-200");
    event.target.classList.add("bg-purple-600", "text-white");

    loadIssues(type);
}


// CARD RENDERING
function renderCard(issue) {

    let border = issue.status === "open" ? "border-green-500" : "border-purple-500";

    let { iconBorder, icon } =
        issue.status === "open"
        ? { iconBorder: "border-green-200", icon: "./assets/Open-Status.png" }
        : { iconBorder: "border-purple-200", icon: "./assets/Closed- Status .png" };

    let priority = issue.priority === "high" ? "HIGH"
        : issue.priority === "medium" ? "MEDIUM"
        : issue.priority === "low" ? "LOW"
        : issue.priority;

    let priorityClr =
        issue.priority === "high"
        ? "bg-red-100 text-red-500"
        : issue.priority === "medium"
        ? "bg-yellow-100 text-yellow-600"
        : issue.priority === "low"
        ? "bg-gray-200 text-gray-600"
        : "";

    return `
        <div onclick="openModal(${issue.id})"
            class="bg-white rounded-xl shadow-sm border-t-4 ${border} hover:shadow-md transition cursor-pointer overflow-hidden">
            
            <div class="p-5">
                <div class="flex justify-between items-center">

                    <div class="w-7 h-7 rounded-full flex items-center justify-center border-2 ${iconBorder}">
                        <img src="${icon}" class="w-6 h-6">
                    </div>

                    <span class="${priorityClr} text-xs font-semibold px-4 py-1 rounded-full">
                        ${priority}
                    </span>
                </div>

                <h2 class="mt-4 text-lg font-semibold text-gray-800">
                    ${issue.title}
                </h2>

                <div class="flex gap-2 mt-4">
                    <span class="border border-red-300 bg-red-50 text-red-500 text-xs font-semibold px-3 py-1 rounded-full">
                        BUG
                    </span>

                    <span class="border border-yellow-300 bg-yellow-50 text-yellow-600 text-xs font-semibold px-3 py-1 rounded-full">
                        HELP WANTED
                    </span>
                </div>
            </div>

            <div class="bg-gray-50 border-t px-5 py-3 text-sm text-gray-500">
                <p>#${issue.id} by ${issue.author}</p>
                <p>${new Date(issue.updatedAt).toLocaleDateString()}</p>
            </div>
        </div>
    `;
}


// LOAD ISSUES
async function loadIssues(type) {

    let container = document.getElementById("issueContainer");
    let loader = document.getElementById("loader");

    loader.classList.remove("hidden");
    container.innerHTML = "";

    let res = await fetch(API);
    let data = await res.json();

    let issues = data.data;

    if (type === "open") issues = issues.filter(i => i.status === "open");
    if (type === "closed") issues = issues.filter(i => i.status === "closed");

    document.getElementById("issueCount").innerText = issues.length + " Issues";

    issues.forEach(issue => {
        container.innerHTML += renderCard(issue);
    });

    loader.classList.add("hidden");
}


// OPEN MODAL
async function openModal(id) {

    let res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    let data = await res.json();
    let issue = data.data;

    document.getElementById("modal").innerHTML = `
      <div class="bg-white p-6 rounded-xl w-[500px] h-[380px] flex flex-col ">

        <h2 class="text-2xl font-bold text-gray-800 mb-6">${issue.title}</h2>

        <p class="text-sm text-gray-500 mb-5">
            <span class="px-1 py-1 rounded-2xl ${
                issue.status === "open"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"}">

                ${issue.status === "open" ? "OPENED" : "CLOSED"}
            </span>

            <span class="font-semibold"> ● opened by ${issue.assignee}</span> ●
            <span>${new Date(issue.updatedAt).toLocaleDateString()}</span>
        </p>

        <div class="flex gap-2 mb-4">
            <span class="border border-red-300 bg-red-50 text-red-500 text-xs font-semibold px-3 py-1 rounded-full">BUG</span>
            <span class="border border-yellow-300 bg-yellow-50 text-yellow-600 text-xs font-semibold px-3 py-1 rounded-full">HELP WANTED</span>
        </div>

        <p class="text-gray-700 mb-4">${issue.description}</p>

        <div class="grid grid-cols-2 items-start mb-3">
            <div>
                <p class="text-sm font-semibold text-gray-500">Assignee:</p>
                <p class="text-gray-800">${issue.assignee}</p>
            </div>

            <div>
                <p class="text-sm font-semibold text-gray-500 ">Priority:</p>
                <span class="${
                    issue.priority === 'high'
                    ? 'bg-red-100 text-red-500'
                    : issue.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-gray-200 text-gray-600'
                } text-xs font-semibold px-3 py-1 rounded-full m-0">
                    ${issue.priority.toUpperCase()}
                </span>
            </div>
        </div>

        <div class="flex justify-end m-5">
            <button onclick="closeModal()" class="bg-purple-600 px-4 py-2 rounded-md text-white hover:bg-purple-700">
                Close
            </button>
        </div>

      </div>
    `;

    let modal = document.getElementById("modal");

    modal.classList.remove("hidden");
    modal.classList.add("flex","items-center","justify-center","fixed","inset-0","bg-black/40");
}


// CLOSE MODAL
function closeModal() {
    let modal = document.getElementById("modal");
    modal.classList.remove("flex");
    modal.classList.add("hidden");
}


// SEARCH
async function searchIssue() {

    let text = document.getElementById("searchInput").value.trim();

    if (!text) {
        loadIssues("all");
        return;
    }

    let res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`);
    let data = await res.json();

    let container = document.getElementById("issueContainer");
    container.innerHTML = "";

    let buttons = document.querySelectorAll(".tabBtn");
    buttons.forEach(btn => btn.classList.remove("bg-purple-600", "text-white"));

    if (!data.data || data.data.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center text-gray-500 mt-10">
                No issues found for "<b>${text}</b>"
            </div>
        `;
        return;
    }

    data.data.forEach(issue => {
        container.innerHTML += renderCard(issue);
    });
}


// ADD NEW ISSUE
function addNewIssue(){
    alert("Coming Soon...");
}