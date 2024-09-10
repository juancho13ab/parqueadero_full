//Entry Class: Represent each entry in the parking lot
class Entry {
    constructor(owner, car, licensePlate, entryDate, entryTime, exitDate, exitTime) {
        this.owner = owner;
        this.car = car;
        this.licensePlate = licensePlate;
        this.entryDate = entryDate;
        this.entryTime = entryTime;
        this.exitDate = exitDate;
        this.exitTime = exitTime;
    }
}

//UI Class: Handle User Interface Tasks
class UI {
    static displayEntries() {
        const entries = Store.getEntries();
        entries.forEach((entry) => UI.addEntryToTable(entry));
    }

    static addEntryToTable(entry) {
        const tableBody = document.querySelector('#tableBody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.owner}</td>
            <td>${entry.licensePlate}</td>
            <td>${entry.entryDate}</td>
            <td>${entry.entryTime}</td>
            <td>${entry.exitDate || 'N/A'}</td>
            <td>${entry.exitTime || 'N/A'}</td>
            <td><button class="btn btn-info delete">X</button></td>
        `;
        tableBody.appendChild(row);
    }

    static clearInput() {
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach((input) => input.value = "");
    }

    static deleteEntry(target) {
        if (target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className} w-50 mx-auto`;
        div.appendChild(document.createTextNode(message));
        const formContainer = document.querySelector('.form-container');
        const form = document.querySelector('#entryForm');
        formContainer.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static validateInputs() {
        const owner = document.querySelector('#owner').value;
        const car = document.querySelector('#car').value;
        const licensePlate = document.querySelector('#licensePlate').value;
        const entryDate = document.querySelector('#entryDate').value;
        const entryTime = document.querySelector('#entryTime').value;

        if (owner === '' || car === '' || licensePlate === '' || entryDate === '' || entryTime === '') {
            UI.showAlert('Todos los campos deben ser completados!', 'danger');
            return false;
        }
        return true;
    }
}

//Store Class: Handle Local Storage
class Store {
    static getEntries() {
        let entries;
        if (localStorage.getItem('entries') === null) {
            entries = [];
        } else {
            entries = JSON.parse(localStorage.getItem('entries'));
        }
        return entries;
    }

    static addEntries(entry) {
        const entries = Store.getEntries();
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
    }

    static updateEntry(licensePlate, exitDate, exitTime) {
        const entries = Store.getEntries();
        entries.forEach((entry) => {
            if (entry.licensePlate === licensePlate) {
                entry.exitDate = exitDate;
                entry.exitTime = exitTime;
            }
        });
        localStorage.setItem('entries', JSON.stringify(entries));
    }

    static removeEntries(licensePlate) {
        const entries = Store.getEntries();
        entries.forEach((entry, index) => {
            if (entry.licensePlate === licensePlate) {
                entries.splice(index, 1);
            }
        });
        localStorage.setItem('entries', JSON.stringify(entries));
    }
}

//Event Display
document.addEventListener('DOMContentLoaded', UI.displayEntries);

//Event Add
document.querySelector('#entryForm').addEventListener('submit', (e) => {
    e.preventDefault();

    //Declare Variables
    const owner = document.querySelector('#owner').value;
    const car = document.querySelector('#car').value;
    const licensePlate = document.querySelector('#licensePlate').value;
    const entryDate = document.querySelector('#entryDate').value;
    const entryTime = document.querySelector('#entryTime').value;
    const exitDate = ''; // No se ingresa en el formulario
    const exitTime = ''; // No se ingresa en el formulario

    if (!UI.validateInputs()) {
        return;
    }

    //Instatiate Entry
    const entry = new Entry(owner, car, licensePlate, entryDate, entryTime, exitDate, exitTime);
    //Add the entry to the UI table
    UI.addEntryToTable(entry);
    Store.addEntries(entry);
    //Clear input fields
    UI.clearInput();

    UI.showAlert('Coche agregado con éxito al estacionamiento', 'success');
});

//Event Remove
document.querySelector('#tableBody').addEventListener('click', (e) => {
    //Call to UI function that removes entry from the table
    UI.deleteEntry(e.target);
    //Get license plate to use as unique element of an entry
    var licensePlate = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    //Call to Store function to remove entry from the local storage
    Store.removeEntries(licensePlate);
    //Show alert that entry was removed
    UI.showAlert('Coche eliminado con éxito de la lista de estacionamiento', 'success');
});

//Event Search
document.querySelector('#searchInput').addEventListener('keyup', function searchTable() {
    //Get value of the input search
    const searchValue = document.querySelector('#searchInput').value.toUpperCase();
    //Get all lines of table body
    const tableLine = (document.querySelector('#tableBody')).querySelectorAll('tr');
    //for loop #1 (used to pass all the lines)
    for (let i = 0; i < tableLine.length; i++) {
        var count = 0;
        //Get all columns of each line
        const lineValues = tableLine[i].querySelectorAll('td');
        //for loop #2 (used to pass all the columns)
        for (let j = 0; j < lineValues.length - 1; j++) {
            //Check if any column of the line starts with the input search string
            if ((lineValues[j].innerHTML.toUpperCase()).startsWith(searchValue)) {
                count++;
            }
        }
        if (count > 0) {
            //Si alguna columna contiene el valor de búsqueda, mostrar la fila
            tableLine[i].style.display = '';
        } else {
            //De lo contrario, ocultar la fila
            tableLine[i].style.display = 'none';
        }
    }
});
