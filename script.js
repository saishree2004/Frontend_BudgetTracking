let transactions = [];
let totalIncome = 0;
let totalExpense = 0;

const API_URL = "https://backend-budgettracking.onrender.com/api/transactions";

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
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
    }
});

// Load transactions from backend on page load
async function loadTransactions() {
    try {
        const res = await fetch(API_URL);
        transactions = await res.json();

        totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        updateUI();
    } catch (err) {
        console.error("Failed to load transactions:", err);
    }
}

// Add transaction
async function addTransaction() {
    const title = document.getElementById('title').value;
    const amount = Number(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (title === '' || amount <= 0) {
        alert('Please enter valid data');
        return;
    }

    const transaction = { title, amount, type };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
        });

        const newTransaction = await res.json();
        transactions.push(newTransaction);

        if (type === 'income') totalIncome += amount;
        else totalExpense += amount;

        updateUI();
        clearForm();
    } catch (err) {
        console.error("Failed to add transaction:", err);
    }
}

// Delete transaction
async function deleteTransaction(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

        const t = transactions.find(tr => tr._id === id);
        if (!t) return;

        if (t.type === 'income') totalIncome -= t.amount;
        else totalExpense -= t.amount;

        transactions = transactions.filter(tr => tr._id !== id);
        updateUI();
    } catch (err) {
        console.error("Failed to delete transaction:", err);
    }
}

// Update UI
function updateUI() {
    document.getElementById('incomeAmount').innerText = totalIncome;
    document.getElementById('expenseAmount').innerText = totalExpense;
    document.getElementById('balanceAmount').innerText = totalIncome - totalExpense;

    const list = document.getElementById('transactionList');
    list.innerHTML = '';

    transactions.forEach(t => {
        list.innerHTML += `
            <tr>
                <td>${t.title}</td>
                <td>${t.amount}</td>
                <td>${t.type}</td>
                <td><button onclick="deleteTransaction('${t._id}')">Delete</button></td>
            </tr>
        `;
    });

    financeChart.data.datasets[0].data = [totalIncome, totalExpense];
    financeChart.update();
}

// Clear form
function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('amount').value = '';
}

// Initialize
loadTransactions();
