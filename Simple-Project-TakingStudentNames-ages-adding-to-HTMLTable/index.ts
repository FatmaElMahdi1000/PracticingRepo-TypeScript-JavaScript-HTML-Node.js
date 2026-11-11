

//let's add 5 student first, take info from the form, add to the list:
//add one by one to the table as record
//create table from the list:

export type Student = {
    Name: string;
    Age: number;
};

const studentsMap = new Map<number, Student>();

const  studentName = document.getElementById("name") as HTMLInputElement;
const  studentAge = document.getElementById("age") as HTMLInputElement;
const studentTableSection = document.getElementById("table-section") as HTMLTableSectionElement;
const studentForm = document.getElementById("form") as HTMLFormElement;
const studentsTable = document.getElementById("studentsTable") as HTMLTableElement;
// const button = document.getElementById("submit-button") as HTMLButtonElement;



function addStudent(): void   {

    const name = studentName.value;
    const age =Number(studentAge.value);


    // Generate student ID
    const studentID = studentsMap.size + 1
    studentsMap.set(studentID, {Name: name, Age: age});

    // Add student to HTML table
    const row = studentsTable.insertRow();
    row.insertCell(0).textContent = String(studentID);
    row.insertCell(1).textContent = name;
    row.insertCell(2).textContent = String(age);

    // Clear inputs so, we can add another student's info
    studentName.value = "";
    studentAge.value = "";
    console.log(studentsMap);
}

// Listen for form submission
//event take a type, another function that takes our own func of insertin student:
studentForm.addEventListener("submit", (event) =>

{
    event.preventDefault(); //prevents the page from refreshin
    if(studentsMap.size  >= 5)
    {
        alert("only 4 students allowed to be added")
        return;
    }
    addStudent();
});


