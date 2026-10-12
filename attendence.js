let students = JSON.parse(
    localStorage.getItem("attendanceStudents") || "[]"
);

const today = new Date().toLocaleDateString("en-CA");

document.getElementById("today").textContent = today;

function saveData() {
    localStorage.setItem(
        "attendanceStudents",
        JSON.stringify(students)
    );
}

function addStudent() {
    const input = document.getElementById("studentName");
    const name = input.value.trim();

    if (name === "") {
        alert("Please enter a student name!");
        return;
    }

    students.push({
        id: Date.now(),
        name: name,
        records: {}
    });

    input.value = "";
    saveData();
    displayStudents();
}

function markAttendance(id, status) {
    const student = students.find(s => s.id === id);

    if (student) {
        student.records[today] = status;
        saveData();
        displayStudents();
    }
}

function deleteStudent(id) {
    if (confirm("Delete this student?")) {
        students = students.filter(s => s.id !== id);
        saveData();
        displayStudents();
    }
}

function getPercentage(student) {
    const records = Object.values(student.records);
    const totalDays = records.length;

    if (totalDays === 0) {
        return 0;
    }

    const presentDays = records.filter(
        status => status === "Present"
    ).length;

    return Math.round((presentDays / totalDays) * 100);
}

function displayStudents() {
    const list = document.getElementById("studentList");
    list.innerHTML = "";

    let present = 0;
    let absent = 0;

    students.forEach((student, index) => {
        const status = student.records[today] || "Not Marked";

        if (status === "Present") present++;
        if (status === "Absent") absent++;

        const row = document.createElement("tr");

        const rollCell = document.createElement("td");
        rollCell.textContent = index + 1;

        const nameCell = document.createElement("td");
        nameCell.textContent = student.name;

        const statusCell = document.createElement("td");
        statusCell.className =
            status === "Present" ? "present" :
            status === "Absent" ? "absent" : "";

        const select = document.createElement("select");

        ["Not Marked", "Present", "Absent"].forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });

        select.value = status;

        select.addEventListener("change", function () {
            if (this.value === "Not Marked") {
                delete student.records[today];
                saveData();
                displayStudents();
            } else {
                markAttendance(student.id, this.value);
            }
        });

        statusCell.appendChild(select);

        const percentageCell = document.createElement("td");
        percentageCell.textContent = getPercentage(student) + "%";

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";
        deleteButton.onclick = function () {
            deleteStudent(student.id);
        };

        actionCell.appendChild(deleteButton);

        row.append(
            rollCell,
            nameCell,
            statusCell,
            percentageCell,
            actionCell
        );

        list.appendChild(row);
    });

    document.getElementById("total").textContent = students.length;
    document.getElementById("presentCount").textContent = present;
    document.getElementById("absentCount").textContent = absent;

    document.getElementById("emptyMessage").style.display =
        students.length === 0 ? "block" : "none";
}

displayStudents();