/* Get any tasks that are already stored. */
var storedTasks = JSON.parse(localStorage.getItem("tasks"));

//#region GENERATE THE HTML

/* Add date to jumbotron */
var dateFormat = "dddd, MMMM Do"
var date = moment().format(dateFormat);
$("#currentDay").text(date);

/* Add taskrows to main container, include any stored data. */
var time_text_list = [ "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM" ];

for(var i = 0; i < time_text_list.length; i++){

    var timePoint = time_text_list[i];

    var task = "";
    if(storedTasks) {
        for(var x = 0; x < storedTasks.length; x++) {
            var xItm = storedTasks[x];
            if(xItm.row == timePoint) {
                task = xItm.description;
                break;
            }
        }
    }

    var loopTxt = `<div id=${timePoint} class="row time-block">
        <div class="hour col-1"><span class="time-txt">${timePoint}</span></div>
        <textarea class="description col-10">${task}</textarea>
        <button type="button" class="btn btn-primary col-1 saveBtn"><i class="fas fa-save"></i></button>       
    </div>`;

    $(".container").append(loopTxt);

};
// #endregion


//#region region COLOR CODE THE ROWS
var taskRows = document.getElementsByClassName("row time-block");
var currentHour = moment().hour();
var time = moment();
for(var i = 0; i < taskRows.length; i++) {
    var trTxt = taskRows[i].innerText;
    var isAM = trTxt.includes('AM');
    if(isAM) {
        time.set({hour: parseInt(trTxt), minute: 0, second: 0});
    }
    else {

        time.set({ hour: (parseInt(trTxt) +12), minute: 0, second: 0 });
    }

    var hour = parseInt(time.hour()) === 0 ? 12 : time.hour();
    var isPast = hour < currentHour;
    var isCurHour = hour === currentHour;
    var isFuture = hour > currentHour;

    // console.log(
    //   `${trTxt}/${currentHour}: isPast=${isPast}, isCurHour= ${isCurHour}, isFuture= ${isFuture}`);

    var color = isCurHour ? "#ff5c33" : isFuture ? "#00e600" : "#adb5bd";

    var curTxtArea = taskRows[i].querySelectorAll("textarea");
    
    curTxtArea[0].style.backgroundColor = color;
}  
//#endregion


//#region SAVE/UPDATE TASKS IN LOCAL STORAGE
var taskData = storedTasks ? storedTasks : [];
// console.log(taskData);

$(".saveBtn").click(function () {

    var rowID = $(this).parent("div").attr("id");
    var task = $(this).prev("textarea").val();

    var taskObj = {
        row: rowID,
        description: task
    };

    if(taskData) {
        updateRow = taskData.find((r) => r.row == rowID);
        console.log(updateRow);
        if (updateRow) {
          updateRow.description = task;
          localStorage.setItem("tasks", JSON.stringify(taskData));
          return;
        }
        else {
          taskData.push(taskObj);
          localStorage.setItem("tasks", JSON.stringify(taskData));
        }
    }
    else {
        taskData.push(taskObj);
        localStorage.setItem("tasks", JSON.stringify(taskData));
    }
});

//#endregion



