 // Check if there is any data in localStorage
 let budgetData = JSON.parse(localStorage.getItem("budgetData")) || {
    totalBudget: 0,
    totalExpenses: 0,
    budgetLeft: 0,
    expenses: []
};

    
// Function to update UI
function updateUI() {
    document.getElementById('totalBudget').textContent = budgetData.totalBudget.toFixed(2);
    document.getElementById('totalExpenses').textContent = budgetData.totalExpenses.toFixed(2);
    document.getElementById('budgetLeft').textContent = budgetData.budgetLeft.toFixed(2);

    // Render expenses table
    let tableBody = document.querySelector('.table-container tbody');
    tableBody.innerHTML = '';
    budgetData.expenses.forEach(function (expense) {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.title}</td>
            <td>${expense.amount.toFixed(2)}</td>
            <td><button class="btn btn-sm btn-danger">Remove</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to update local storage
function updateLocalStorage() {
    localStorage.setItem("budgetData", JSON.stringify(budgetData));
}

function resetAll() {
    // Reset budget data
    budgetData.totalBudget = 0;
    budgetData.totalExpenses = 0;
    budgetData.budgetLeft = 0;
    budgetData.expenses = [];

    // Update local storage and UI
    updateLocalStorage();
    updateUI();
}

document.addEventListener("DOMContentLoaded", function () {
    // Update UI with initial data
    updateUI();

    // Add Budget form submission
    document.querySelector('.add-budget-container form').addEventListener('submit', function (event) {
        event.preventDefault();
        let budgetInput = document.getElementById('budget');
        let budgetAmount = parseFloat(budgetInput.value.trim());

        if (isNaN(budgetAmount) || budgetAmount <= 0) {
            alert('Please enter a valid budget amount.');
            return;
        }

        budgetData.totalBudget = budgetAmount;
        budgetData.budgetLeft = budgetAmount;
        updateLocalStorage();
        updateUI();
        budgetInput.value = '';
    });

    // Add Expense form submission
    document.querySelector('.add-expense-container form').addEventListener('submit', function (event) {
        event.preventDefault();
        let expenseInput = document.getElementById('expense');
        let amountInput = document.getElementById('amount');

        let expenseTitle = expenseInput.value.trim();
        let expenseAmount = parseFloat(amountInput.value.trim());

        if (expenseTitle === '' || isNaN(expenseAmount) || expenseAmount <= 0) {
            alert('Please enter a valid expense.');
            return;
        }

        // Update expenses array
        budgetData.expenses.push({
            title: expenseTitle,
            amount: expenseAmount
        });

        // Update total expenses and budget left
        budgetData.totalExpenses += expenseAmount;
        budgetData.budgetLeft -= expenseAmount;

        updateLocalStorage();
        updateUI();

        // Clear input fields
        expenseInput.value = '';
        amountInput.value = '';
    });

    // Remove Expense button click event
    document.querySelector('.table-container').addEventListener('click', function (event) {
        if (event.target && event.target.matches("button.btn-danger")) {
            let rowIndex = event.target.closest('tr').rowIndex - 1;
            let removedExpense = budgetData.expenses.splice(rowIndex, 1)[0];
            budgetData.totalExpenses -= removedExpense.amount;
            budgetData.budgetLeft += removedExpense.amount;
            updateLocalStorage();
            updateUI();
        }
    });
});