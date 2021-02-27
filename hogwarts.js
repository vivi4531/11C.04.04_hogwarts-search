"use strict";

//To activate the function hackTheSystem() - go to the console and type hackTheSystem()

window.addEventListener("DOMContentLoaded", initPage);

//Variables
let json;
let bloodstatus; 
const link = "https://petlatkea.dk/2021/hogwarts/students.json";  
const bloodstatuslink = "https://petlatkea.dk/2021/hogwarts/families.json"; 
const allStudents = [];

let temp = document.querySelector("template");
let container = document.querySelector("section");
let filterType = "all";
let sortBy = "sorting";
const search = document.querySelector(".search");
search.addEventListener("input", startSearch);
//Students 
let numberOfStudents = document.querySelector(".studentnumber");

let selectedStudent;

//Expelled student list
let expelledstudents = []; 

//Hack the system 
let systemIsHacked = false;

//Create new object
const studentTemplate = {
  firstname: "-not set yet-",
  lastname: "-not set yet-",
  middlename: "-not set yet-",
  nickname: "-not set yet-",
  photo: "-not set yet-",
  house: "-not set yet-",
  gender: " ",
  prefect: false, 
  expelled: false, 
  bloodstatus: "", 
  inquisitorialsquad: false
};

function initPage() {
  console.log("ready");

  readBtns();
  fetchStudentData();
}

//Search 
function startSearch(event) {
  let searchList = allStudents.filter((student) => {
    let name = "";
    if (student.lastname === null) {
      name = student.firstname;
    } else {
      name = student.firstname + " " + student.lastname;
    }
    return name.toLowerCase().includes(event.target.value);
  });

  //Show number of students
  numberOfStudents.textContent = `Students: ${searchList.length}`;
  showStudentList(searchList);
}

function readBtns() {
  //adds an eventlistener to each filterbutton
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectedFilter));

  //looks after changes in the options under #sortingList
  document.querySelector("#sortingList").onchange = function () {
    selectedSort(this.value);

  };
}

function selectedFilter(event) {
  //Reads which button is clicked
  const filter = event.target.dataset.filter;
  console.log(`Use this ${filter}`);
  //filterList(filter);
  setFilter(filter);
}

function setFilter(filter) {
  filterType = filter;
  buildList();
}

function filterList(filterredList) {
  //adds the selected students to filteredList
  //let filteredList = allStudents;
  if (filterType === "gryffindor") {
    filterredList = allStudents.filter(isGryffindor);
  } else if (filterType === "hufflepuff") {
    filterredList = allStudents.filter(isHufflepuff);
  } else if (filterType === "ravenclaw") {
    filterredList = allStudents.filter(isRavenclaw);
  } else if (filterType === "slytherin") {
    filterredList = allStudents.filter(isSlytherin);
  } else if (filterType === "expelled"){
    filterredList = expelledstudents; 
  }else if (filterType === "inquisitorial-squad") {
    filterredList = inquisitorialsquad;
  }
  //TODO: filter on expelled and unexpelled

  //Show number of students
  numberOfStudents.textContent = `Students: ${filterredList.length}`;

  console.log(filterredList);
  return filterredList;
  
}

function isGryffindor(house) {
  //rerutns true if a students house is Gryffindor
  return house.house === "Gryffindor";
}

function isHufflepuff(house) {
  //rerutns true if a students house is Hufflepuff
  return house.house === "Hufflepuff";
}

function isRavenclaw(house) {
  //rerutns true if a students house is Ravenclaw
  return house.house === "Ravenclaw";
}

function isSlytherin(house) {
  //rerutns true if a students house is Slytherin
  return house.house === "Slytherin";
}

function selectedSort(event) {
  //checks what option is clicked
  sortBy = event;
  console.log(`Use this ${sortBy}`);
  
  //sortList(sortBy);
  buildList();
}

function sortList(sortedList) {
  //based on what is clicked, calls the matching function
  //let sortedList = allStudents;

  if (sortBy === "firstnamea-z") {
    sortedList = sortedList.sort(sortByFirstnameAZ);
  } else if (sortBy === "firstnamez-a") {
    sortedList = sortedList.sort(sortByFirstnameZA);
  } else if (sortBy === "lastnamea-z") {
    sortedList = sortedList.sort(sortByLastnameAZ);
  } else if (sortBy === "lastnamez-a") {
    sortedList = sortedList.sort(sortByLastnameZA);
  } else if (sortBy === "housea-z") {
    sortedList = sortedList.sort(sortByHouseAZ);
  } else if (sortBy === "housez-a") {
    sortedList = sortedList.sort(sortByHouseZA);
  }

  return sortedList;
}

//sorts by firstname a-z
function sortByFirstnameAZ(firstnameA, firstnameB) {
  if (firstnameA.firstname < firstnameB.firstname) {
    return -1;
  } else {
    return 1;
  }
}

//sorts by firstname z-a
function sortByFirstnameZA(firstnameA, firstnameB) {
  if (firstnameA.firstname < firstnameB.firstname) {
    return 1;
  } else {
    return -1;
  }
}

//sorts by lastname a-z
function sortByLastnameAZ(lastnameA, lastnameB) {
  if (lastnameA.lastname < lastnameB.lastname) {
    return -1;
  } else {
    return 1;
  }
}

//sorts by lastname z-a
function sortByLastnameZA(lastnameA, lastnameB) {
  if (lastnameA.lastname < lastnameB.lastname) {
    return 1;
  } else {
    return -1;
  }
}

//sorts by house a-z
function sortByHouseAZ(houseA, houseB) {
  if (houseA.house < houseB.house) {
    return -1;
  } else {
    return 1;
  }
}

//sorts by house z-a
function sortByHouseZA(houseA, houseB) {
  if (houseA.house < houseB.house) {
    return 1;
  } else {
    return -1;
  }
}

function buildList() {
  let currentList = filterList(allStudents);
  currentList = sortList(currentList);

  showStudentList(currentList);
}

async function fetchStudentData() {
  //Get student data
  const respons = await fetch(link);
  json = await respons.json();

  //Get families/bloodstatus data
  const respons1 = await fetch(bloodstatuslink); 
  bloodstatus = await respons1.json(); 

  prepareObjects(json);
}

async function fetchBloodstatusData() {
  const respons = await fetch(bloodstatuslink);
  bloodstatus = await respons.json();
}

function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    const fullname = jsonObject.fullname.trim();

    //Split "fullname" into smaller parts after each space
    const fullName = jsonObject.fullname.toLowerCase().trim();
    const splitFullName = fullName.split(" ");
    const house = jsonObject.house.toLowerCase().trim();

    const firstSpaceBeforeName = fullName.indexOf(" ");
    const lastSpaceBeforeName = fullName.lastIndexOf(" ");

    const firstQuotationMark = fullName.indexOf('"');
    const lastQuotationMark = fullName.indexOf('"');

    let lastName = "";
    let indexhyphen = 0;
    let firstLetterAfterHyphen = "";
    let smallLettersAfterHyphen = "";

    //Create the new object from the empty object template
    const student = Object.create(studentTemplate);

    //Insert value/string/substring into place
    //Firstname inserts in index 0
    let firstName =
      splitFullName[0].substring(0, 1).toUpperCase() +
      splitFullName[0].substring(1);

    student.firstname = firstName;

    if (splitFullName.length > 1) {
      //Lastname inserts in at lastIndexOf
      lastName =
        splitFullName[splitFullName.length - 1].substring(0, 1).toUpperCase() +
        splitFullName[splitFullName.length - 1].substring(1);

      //Check for a hyphen in the lastnames
      indexhyphen = lastName.indexOf("-");
      if (indexhyphen != -1) {
        const nameBeforeHyphen = lastName.substring(0, indexhyphen + 1);
        firstLetterAfterHyphen = lastName
          .substring(indexhyphen + 1, indexhyphen + 2)
          .toUpperCase();
        smallLettersAfterHyphen = lastName.substring(indexhyphen + 2);
        lastName =
          nameBeforeHyphen + firstLetterAfterHyphen + smallLettersAfterHyphen;
      }

      student.lastname = lastName;

      //Middlename inserts in index 2
      let middlename = "";
      let nickname = null;
      if (splitFullName.length > 2) {
        if (splitFullName[1].indexOf('"') >= 0) {
          nickname = splitFullName[1].replaceAll('"', "");

          nickname =
            nickname.substring(0, 1).toUpperCase() + nickname.substring(1);
          middlename = null;
        } else {
          middlename =
            splitFullName[1].substring(0, 1).toUpperCase() +
            splitFullName[1].substring(1);
          nickname = null;
        }
      } else {
        middlename = null;
      }

      student.middlename = middlename;
      student.nickname = nickname;

      //console.log(middlename);
      //console.log(nickname);
    } else {
      student.lastname = null;
      student.middlename = null;
      student.nickname = null;
    }

    //Photo
    if (student.lastname != null) {
      if (indexhyphen == -1) {
        //Checks Patil sisters firstname to match photo
        if (student.firstname == "Padma" || student.firstname == "Parvati") {
          student.photo =
            lastName.toLowerCase() +
            "_" +
            firstName.substring(0).toLowerCase() +
            ".png";
        } else {
          student.photo =
            lastName.toLowerCase() +
            "_" +
            firstName.substring(0, 1).toLowerCase() +
            ".png";
        }
      } else {
        student.photo =
          firstLetterAfterHyphen.toLocaleLowerCase() +
          smallLettersAfterHyphen +
          "_" +
          firstName.substring(0, 1).toLowerCase() +
          ".png";
      }
    } else {
      student.photo = null;
    }

    //House is already a seperate string so just adds the age to the object
    student.house = house.substring(0, 1).toUpperCase() + house.substring(1);

    //Bloodstatus
    student.bloodstatus = checkBloodStatus(student);

    //Gender 
    student.gender = jsonObject.gender; 

    //Prefect
    student.prefect = false; 

    //Adds all objects (students) into the array
    allStudents.push(student);
  });
  showStudentList(allStudents);
}

//Check bloodstatus
function checkBloodStatus(student){
  if (bloodstatus.half.indexOf(student.lastname) !=-1){
    return "Half blood"; 
  } else if (bloodstatus.pure.indexOf(student.lastname) !=-1){
    return "Pure blood"; 
  } else {
    return "Muggle"; 
  }
}

function showStudentList(student) {
  console.log(student);
  container.innerHTML = "";
  student.forEach((student) => {
    const klon = temp.cloneNode(true).content;
    if (student.lastname == null) {
      klon.querySelector(".fullname").textContent = student.firstname;
    } else {
      klon.querySelector(".fullname").textContent =
        student.firstname + " " + student.lastname;
    }
    if (student.photo != null) {
      klon.querySelector("img").src = "images/" + student.photo;
    }
    klon
      .querySelector("article")
      .addEventListener("click", () => openSingleStudent(student));

    container.appendChild(klon);
  });

  //Show number of students
  numberOfStudents.textContent = `Students: ${student.length}`;

}

//Popup/modal for single student
function openSingleStudent(student) {

  popup.style.display = "block";

  //knapper check 
  if (student.prefect != true) {
    document.querySelector("#prefectbutton").classList.remove("clickedprefectbutton");
  } else {
    document.querySelector("#prefectbutton").classList.add("clickedprefectbutton");
  }
  
  if (student.middlename == null && student.nickname == null) {
    if (student.lastname == null) {
      popup.querySelector("h2").textContent = student.firstname;
    } else {
      popup.querySelector("h2").textContent =
        student.firstname + " " + student.lastname;
    }
  } else if (student.middlename != null) {
    popup.querySelector("h2").textContent =
      student.firstname + " " + student.middlename + " " + student.lastname;
  } else if (student.nickname != null) {
    popup.querySelector("h2").textContent =
      student.firstname +
      " " +
      '"' +
      student.nickname +
      '"' +
      " " +
      student.lastname;
  } if (student.expelled !=true) {
    document.querySelector("#expellbutton").textContent = "Expell student";
  } else {
    popup.querySelector(".ifExpelled").textContent = "";
  }
  if (student.inquisitorialsquad != true) {
    document.querySelector("#squadbutton").classList.remove("clickedprefectbutton");
  } else {
    document.querySelector("#squadbutton").classList.add("clickedprefectbutton");
  }

  //Bloodstatus
  popup.querySelector(".bloodstatus").textContent = student.bloodstatus;

  popup.querySelector(".house").textContent = student.house;

  popup.querySelector(".housecrest").src = "housecrest/" + student.house.toLowerCase() + ".png";
    if (student.photo != null) {
    popup.querySelector("img").src = "images/" + student.photo;
  }

  //Prefect button
  document.querySelector("#prefectbutton").addEventListener("click", makeStudentPrefect);

  //Expell student button
  document.querySelector("#expellbutton").addEventListener("click", expellStudent);

  //Inquisitorial squad button
  document.querySelector("#squadbutton").addEventListener("click", addStudentToInquisitorialSquad);

  //Close popup
  document.querySelector("#close").addEventListener("click", () => {popup.style.display = "none";
    document.querySelector("#expellbutton").removeEventListener("click", () => {});
    document.querySelector("#prefectbutton").removeEventListener("click", () => {});
    document.querySelector("#squadbutton").removeEventListener("click", () => {});
  });

  selectedStudent = student;

//Div where the theme color will show
const housecolor = document.querySelector('.housecolor');
//Color for each house
//Code from - https://www.w3schools.com/js/js_switch.asp
switch (true) {
  //If there is a match, the associated block of code is executed
  //If there is no match, the default code block is executed (white background)
  case student.house === 'Gryffindor':
    housecolor.setAttribute('style', 'background: linear-gradient(180deg, rgba(238,186,48,1) 0%, rgba(238,186,48,1) 25%, rgba(188,126,28,1) 50%, rgba(116,0,1,1) 75%, rgba(116,0,1,1) 100%);'); 
    break;
  case student.house === 'Slytherin':
    housecolor.setAttribute('style', 'background: linear-gradient(180deg, rgba(42,98,61,1) 0%, rgba(26,71,42,1) 50%, rgba(0,0,0,1) 100%);');
    break;
  case student.house === 'Hufflepuff':
    housecolor.setAttribute('style', 'background: linear-gradient(180deg, rgba(255,244,177,1) 0%, rgba(255,244,177,1) 25%, rgba(255,237,134,1) 50%, rgba(255,219,0,1) 75%, rgba(0,0,0,1) 100%);');
    break;
  case student.house === 'Ravenclaw':
    housecolor.setAttribute('style', 'background: linear-gradient(180deg, rgba(34,47,91,1) 0%, rgba(14,26,64,1) 75%, rgba(0,0,0,1) 100%);');
    break;
}
}
//PREFECT 
 //click prefect
 document.querySelector(".prefect-icon").onclick = () => {
  clickAddAsPrefect();
};

//EXPELL 
function expellStudent(){
  console.log("Expell button clicked")
  expelled(student); 
}

function expelled(student) {
  if (student.expelled === true) {
    console.log("This student is alredy expelled!");
    //TODO: show warning dialogue box
  } else {
    student.expelled = true;
    
    let expelledIndex = allStudents.indexOf(students);
    console.log(expelledIndex);
    let expelledStudent = allStudents.splice(expelledIndex, 1);
    console.log(expelledStudent, "the one expelled student");
    expelledstudents.push(expelledStudent);
    console.log(expelledstudents, "Expelled students array");
  }
  buildList();
}

function makeStudentPrefect() {
  console.log("toggle prefect");
  if (student.expelled === false) {
    const index = allStudents.indexOf(student);
    if (student.prefect === false) {
      housePrefectCheck();
    } else {
      removePrefect(student);
    }
  } else {
    alert("This student is expelled! Expelled students can't be made Prefects.");
  }

  function housePrefectCheck() {
    console.log("chekking for house prefects");
    const houseprefects = [];
    allStudents.filter((student) => {
      if (student.house === student.house && student.prefect === true) {
        houseprefects.push(student);
      }
    });
    console.log("prefect house: " + houseprefects.length);
    const numberOfPrefects = houseprefects.length;
    const other = [];
    houseprefects.filter((student) => {
      if (student.gender === student.gender) {
        other.push(student);
      }
    });
    console.log("other: " + other.length);
    //if there is another of the same type
    if (other.length >= 1) {
      removeOther(other[0]);
    } else if (numberOfPrefects >= 2) {
      console.log("There can only be two prefects of each house!");
      removePrefectAorB(houseprefects[0], houseprefects[1]);
    } else {
      // allStudents[index].prefect = true;
      console.log("add prefect");
      makePrefect(student);
    }
  }

  function removePrefect(studentPrefect) {
    document.querySelector("#prefectbutton").classList.remove("clickprefectbutton");
    const index = allStudents.indexOf(studentPrefect);
    allStudents[index].prefect = false;
  }

  function makePrefect(studentPrefect) {
    document.querySelector("#prefectbutton").classList.add("clickprefectbutton");
    const index = allStudents.indexOf(studentPrefect);
    allStudents[index].prefect = true;
  }

  function removeOther(other) {
    //ask the user to ignore ore remove the other
    document.querySelector("#onlytwoprefects").classList.remove("hide");
    document
      .querySelector("#onlytwoprefects .closebutton")
      .addEventListener("click", closeDialog);
    document
      .querySelector("#onlytwoprefects [data-action=remove1]")
      .addEventListener("click", clickRemoveOther);

    //add name to button
    document.querySelector("#onlytwoprefects .prefect1").textContent =
      other.firstname;

    //if ignore - do nothing..
    function closeDialog() {
      document.querySelector("#onlytwoprefects").classList.add("hide");
      document
        .querySelector("#onlytwoprefects .closebutton")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#onlytwoprefects [data-action=remove1]")
        .removeEventListener("click", clickRemoveOther);
    }

    //if remove other:
    function clickRemoveOther() {
      removePrefect(other);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }
}

//Add student to inquisitorial squad
function addStudentToInquisitorialSquad(){
  console.log("toggle squad");
  const index = allStudents.indexOf(student);
  if (student.expelled === false) {
    if (student.inquisitorialsquad === false) {
      houseSquadCheck();
    } else {
      removeSquad();
    }
  } else {
    alert(
      "This student is expelled! An expelled student can't be a part of the Inquisitorial Squad!"
    );
  }

  function houseSquadCheck() {
    console.log("checking for house squads");
    if (
      //From single student popup
      student.bloodstatus === "Pure blood" &&
      student.house === "Slytherin"
    ) {
      makeSquad();
    } else {
      alert(
        "Only pure-blooded students from Slytherin can join the Inquisitorial Squad!"
      );
    }
  }

  function makeSquad() {
    //If the system has been hacked
    if (systemIsHacked === true) {
      setTimeout(function () {
        toggleSquad();
      }, 100);
    }

    allStudents[index].inquisitorialsquad = true;
    document.querySelector("#squadbutton").classList.add("prefectbuttonclicked");
  }

  function removeSquad() {
    document.querySelector("#squadbutton").classList.remove("prefectbuttonclicked");
    //If the system has been hacked
    if (systemIsHacked === true) {
      setTimeout(function () {
        alert("Wuups.. Can't do that.. HA HA HA!");
      }, 100);
      //alert("Wuups.. Can't do that.. HA HA HA!");
    }

    allStudents[index].inquisitorialsquad = false;
  }
}

function hackTheSystem() {
  if (systemIsHacked === false) {
    //add me to studentlist
    console.log("You have been hacked!");
    const thisIsMe = Object.create(studentTemplate);
    thisIsMe.firstname = "Vivi";
    thisIsMe.lastname = "Mortensen";
    thisIsMe.middlename = null;
    thisIsMe.nickname = "Hermione";
    thisIsMe.photo = "me.png";
    thisIsMe.house = "Hufflepuff";
    thisIsMe.gender = "girl";
    thisIsMe.prefect = true;
    thisIsMe.expelled = false;
    thisIsMe.bloodstatus = "Pure-blood";
    thisIsMe.squad = false;

    allStudents.unshift(thisIsMe);

    //fuck up blood-status
    systemIsHacked = true;

    messWithBloodstatus();

    buildList();
  } else {
    alert("Wuups.. System's allready been hacked!");
  }
  setTimeout(function () {
    alert("You have been hacked! ☠️☠️☠️");
  }, 1000);
}

function messWithBloodstatus() {
  allStudents.forEach((student) => {
    if (student.bloodstatus === "Muggle") {
      student.bloodstatus = "Pure blood";
    } else if (student.bloodstatus === "Half blood") {
      student.bloodstatus = "Pure blood";
    } else {
      let bloodNumber = Math.floor(Math.random() * 3);
      if (bloodNumber === 0) {
        student.bloodstatus = "Muggle";
      } else if (bloodNumber === 1) {
        student.bloodstatus = "Half blood";
      } else {
        student.bloodstatus = "Pure blood";
      }
    }
  });

}

