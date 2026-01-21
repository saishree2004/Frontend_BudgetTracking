let transactions = [];
let totalIncome = 0;
let totalExpense = 0;

// Chart
const ctx = document.getElementById('financeChart').getContext('2d');
const financeChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Income', 'Expense'],
        datasets: [{
            data: [0, 0],
            backgroundColor: [
                'rgba(46, 204, 113, 0.8)',
                'rgba(231, 76, 60, 0.8)'
            ],
            borderRadius: 8
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Add transaction
function addTransaction() {
    const title = document.getElementById('title').value;
    const amount = Number(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (title === '' || amount <= 0) {
        alert('Please enter valid data');
        return;
    }

    const transaction = { title, amount, type };
    transactions.push(transaction);

    if (type === 'income') {
        totalIncome += amount;
    } else {
        totalExpense += amount;
    }

    updateUI();
    clearForm();
}

// Update UI
function updateUI() {
    document.getElementById('incomeAmount').innerText = totalIncome;
    document.getElementById('expenseAmount').innerText = totalExpense;
    document.getElementById('balanceAmount').innerText = totalIncome - totalExpense;

    const list = document.getElementById('transactionList');
    list.innerHTML = '';

    transactions.forEach((t, index) => {
        list.innerHTML += `
            <tr>
                <td>${t.title}</td>
                <td>${t.amount}</td>
                <td>${t.type}</td>
                <td><button onclick="deleteTransaction(${index})">Delete</button></td>
            </tr>
        `;
    });

    financeChart.data.datasets[0].data = [totalIncome, totalExpense];
    financeChart.update();
}

// Delete
function deleteTransaction(index) {
    const t = transactions[index];

    if (t.type === 'income') totalIncome -= t.amount;
    else totalExpense -= t.amount;

    transactions.splice(index, 1);
    updateUI();
}

// Clear form
function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('amount').value = '';
}

fetch("https://budget-backend.onrender.com/api/transactions")

const API_URL = "https://backend-budgettracking.onrender.com/api/transactions";
