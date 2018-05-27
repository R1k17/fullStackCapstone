const MOCK_EMPLOYEES = {
    "employees":
[{
    "id": 1,
    "first_name": "Adelbert",
    "last_name": "Kennealy",
    "gender": "Male",
    "hours": 20
  }, {
    "id": 2,
    "first_name": "Arlen",
    "last_name": "Barnham",
    "gender": "Female",
    "hours": 20
  }, {
    "id": 3,
    "first_name": "Audry",
    "last_name": "Reppaport",
    "gender": "Female",
    "hours": 40
  }, {
    "id": 4,
    "first_name": "Rosana",
    "last_name": "Kipling",
    "gender": "Female",
    "hours": 40
  }, {
    "id": 5,
    "first_name": "Gale",
    "last_name": "Payton",
    "gender": "Male",
    "hours": 30
  }, {
    "id": 6,
    "first_name": "Free",
    "last_name": "Eastment",
    "gender": "Male",
    "hours": 30
  }, {
    "id": 7,
    "first_name": "Georgetta",
    "last_name": "Burghall",
    "gender": "Female",
    "hours": 40
  }, {
    "id": 8,
    "first_name": "Benetta",
    "last_name": "Gartside",
    "gender": "Female",
    "hours": 30
  }, {
    "id": 9,
    "first_name": "Sidoney",
    "last_name": "McReidy",
    "gender": "Female",
    "hours": 20
  }, {
    "id": 10,
    "first_name": "Hasheem",
    "last_name": "Christy",
    "gender": "Male",
    "hours": 30
  }]}

// get the api
function getAllEmployees(callbackFn) {
  // we use a `setTimeout` to make this asynchronous
  // as it would be with a real AJAX call.
	setTimeout(function(){ callbackFn(MOCK_EMPLOYEES)}, 1);
}

// render data to screen
function displayAllEmployees(data) {
    for (index in data.employees) {
	   $('body').append(
        '<ul>' + 
            '<li>' + data.employees[index].id + '</li>' +
            '<li>' + data.employees[index].first_name + '</li>' +
            '<li>' + data.employees[index].last_name + '</li>' +
            '<li>' + data.employees[index].gender + '</li>' +
            '<li>' + data.employees[index].hours + '</li>' +
        '<ul>'
    );
    }
}

function getAndDisplayAllEmployees() {
	getAllEmployees(displayAllEmployees);
}

$(function() {
	getAndDisplayAllEmployees();
})