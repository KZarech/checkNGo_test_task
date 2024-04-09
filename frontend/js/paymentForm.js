class UserPaymentForm {
    constructor(totalAmount, tableId) {
        this.totalAmount = totalAmount;
        this.tableId = tableId;
    }

    clearFormInputs() {
        document.querySelector('#name').value = '';
        document.querySelector('#email').value = '';
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    userPaymentRecalculate() {
        const table = document.querySelector('#usersTable');
        const userAmount = (this.totalAmount / (table.rows.length - 1)).toFixed(2);

        for (let i = 1; i < table.rows.length; i++) {
            const cells = table.rows[i].cells;
            cells[2].innerText = userAmount;
        }
    }

    addToTable() {
        let name = document.querySelector("#name").value;
        let email = document.querySelector("#email").value;

        if (!name.trim() && !email.trim()) {
            alert('Имя и email обязательны для заполения');
            return null;
        } else if (!this.validateEmail(email)) {
            alert('Введите корректный email');
            return null;
        } else {
            const table = document.querySelector(`#${this.tableId}`);
            const newRow = table.insertRow(-1);

            const ceil1 = newRow.insertCell(0);
            ceil1.innerHTML = name;
            const ceil2 = newRow.insertCell(1);
            ceil2.innerHTML = email;
            const ceil3 = newRow.insertCell(2);
            ceil3.innerHTML = '0';

            this.clearFormInputs();
            this.userPaymentRecalculate();
        }
    }

    clearTable() {
        console.log('clear table works')
        const table = document.querySelector(`#${this.tableId}`);
        for (let i = table.rows.length -1; i > 0 ; i--) {
            table.rows[i].parentNode.removeChild(table.rows[i]);
        }
        this.userPaymentRecalculate();
    }

    savePayment() {
        const table = document.querySelector(`#${this.tableId}`);
        const usersPayments = [];

        for (let i = 1; i < table.rows.length; i++) {
            const cells = table.rows[i].cells;
            const userData = {};
            userData.name = cells[0].innerText.trim();
            userData.email = cells[1].innerText.trim();
            userData.amount = cells[2].innerText;

            usersPayments.push(userData);
        }

        if (usersPayments.length === 0) {
            alert('Добавьте пользователей для отправки формы');
        } else {
            fetch('../../backend/paymentFormSaveData.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({usersPayments: usersPayments})
            })
                .then(r => {
                    console.log('response from fetch:')
                    console.log(r)
                    if (r.status == 500) {
                        alert('Ошибка при отправке формы');
                    } else {
                        alert('Данные формы сохранились');
                        this.clearTable();
                        this.clearFormInputs();
                    }
                })
                .catch(error => {
                    alert('Ошибка при отправке формы');
                    console.log(error)
                })
        }
    }
}

const userForm = new UserPaymentForm(100, 'usersTable');

document.querySelector('#userTableSaveBtn').addEventListener('click', userForm.savePayment.bind(userForm));
document.querySelector('#userTableResetBtn').addEventListener('click', userForm.clearTable.bind(userForm));
document.querySelector('#userTableAddBtn').addEventListener('click', userForm.addToTable.bind(userForm));