//UI Class for Exit Page
class UIExit {
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className} w-50 mx-auto`;
        div.appendChild(document.createTextNode(message));
        const formContainer = document.querySelector('.form-container');
        const form = document.querySelector('#exitForm');
        formContainer.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static validateInputs() {
        const licensePlate = document.querySelector('#licensePlate').value;
        const exitDate = document.querySelector('#exitDate').value;
        const exitTime = document.querySelector('#exitTime').value;

        if (licensePlate === '' || exitDate === '' || exitTime === '') {
            UIExit.showAlert('Todos los campos deben ser completados!', 'danger');
            return false;
        }
        return true;
    }

    static clearInput() {
        document.querySelector('#licensePlate').value = '';
        document.querySelector('#exitDate').value = '';
        document.querySelector('#exitTime').value = '';
    }
}

//Store Class for Exit Page
class StoreExit {
    static getEntries() {
        let entries;
        if (localStorage.getItem('entries') === null) {
            entries = [];
        } else {
            entries = JSON.parse(localStorage.getItem('entries'));
        }
        return entries;
    }

    static updateEntry(licensePlate, exitDate, exitTime) {
        const entries = StoreExit.getEntries();
        let found = false;
        entries.forEach((entry) => {
            if (entry.licensePlate === licensePlate) {
                entry.exitDate = exitDate;
                entry.exitTime = exitTime;
                found = true;
            }
        });
        localStorage.setItem('entries', JSON.stringify(entries));
        return found;
    }
}

//Event Add Exit Date and Time
document.querySelector('#exitForm').addEventListener('submit', (e) => {
    e.preventDefault();

    //Declare Variables
    const licensePlate = document.querySelector('#licensePlate').value;
    const exitDate = document.querySelector('#exitDate').value;
    const exitTime = document.querySelector('#exitTime').value;

    if (!UIExit.validateInputs()) {
        return;
    }

    //Update the entry in the local storage
    const success = StoreExit.updateEntry(licensePlate, exitDate, exitTime);

    if (success) {
        UIExit.showAlert('Fecha y hora de salida agregadas con éxito', 'success');
    } else {
        UIExit.showAlert('Placa no encontrada', 'danger');
    }

    //Clear input fields
    UIExit.clearInput();
});
