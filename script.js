const STORAGE_KEY = "kakeiboRecords";

function loadRecords() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function formatAmount(amount) {
  return amount.toLocaleString("ja-JP") + "円";
}

function calcTotal(records) {
  return records.reduce((sum, record) => {
    return sum + (record.type === "income" ? record.amount : -record.amount);
  }, 0);
}

function renderRecords(records) {
  const tbody = document.getElementById("recordList");
  tbody.innerHTML = "";

  records.forEach((record) => {
    const tr = document.createElement("tr");

    const dateTd = document.createElement("td");
    dateTd.textContent = record.date;

    const itemTd = document.createElement("td");
    itemTd.textContent = record.item;

    const typeTd = document.createElement("td");
    typeTd.textContent = record.type === "income" ? "収入" : "支出";

    const amountTd = document.createElement("td");
    amountTd.textContent = formatAmount(record.amount);
    amountTd.classList.add(record.type === "income" ? "amount-income" : "amount-expense");

    tr.append(dateTd, itemTd, typeTd, amountTd);
    tbody.appendChild(tr);
  });

  document.getElementById("totalAmount").textContent = formatAmount(calcTotal(records));
}

function handleSubmit(event) {
  event.preventDefault();

  const date = document.getElementById("date").value;
  const item = document.getElementById("item").value;
  const type = document.querySelector('input[name="type"]:checked').value;
  const amount = Number(document.getElementById("amount").value);

  const records = loadRecords();
  records.push({ date, item, type, amount });
  saveRecords(records);
  renderRecords(records);

  event.target.reset();
  document.getElementById("typeExpense").checked = true;
}

document.addEventListener("DOMContentLoaded", () => {
  renderRecords(loadRecords());
  document.getElementById("kakeiboForm").addEventListener("submit", handleSubmit);
});
