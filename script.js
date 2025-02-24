// Function to set current date and time
function updateDateTime() {
  const dateElement = document.getElementById("current-date");
  const today = new Date();

  // Format date
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format time (HH:MM:SS AM/PM)
  const formattedTime = today.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Display both date and time
  dateElement.innerHTML = `date: ${formattedDate} <br> time: ${formattedTime}`;
}

// Update time every second
setInterval(updateDateTime, 1000);
updateDateTime(); // Call once to set immediately

// Select DOM elements
const addButton = document.querySelector('.menubar-add-button');
const removeButton = document.querySelector('.menubar-remove-button');
const doneButton = document.querySelector('.menubar-done-button');
const exportButton = document.querySelector('.export-button');
const tableBody = document.querySelector('.list table tbody');

// Function to save inventory to localStorage
function saveInventory() {
  const inventory = [];
  document.querySelectorAll(".list table tbody tr").forEach((row) => {
    inventory.push({
      id: row.querySelector(".item-id").textContent,
      name: row.querySelector(".item-name").textContent,
      quantity: row.querySelector(".item-quantity").textContent,
      status: row.querySelector(".item-status").textContent,
    });
  });
  localStorage.setItem("inventoryData", JSON.stringify(inventory));
}

// Function to load inventory from localStorage
function loadInventory() {
  const savedData = localStorage.getItem("inventoryData");
  if (savedData) {
    const inventory = JSON.parse(savedData);
    inventory.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="item-id">${item.id}</td>
        <td contenteditable="true" class="item-name">${item.name}</td>
        <td contenteditable="true" class="item-quantity">${item.quantity}</td>
        <td class="item-status">${item.status}</td>
        <td>
          <button class="edit-row-button">✏️</button>
        </td>
      `;

      row.querySelector(".item-quantity").addEventListener("input", () => {
        updateStatus(row);
        saveInventory();
      });

      row.querySelector(".edit-row-button").addEventListener("click", function () {
        enableRowEditing(row);
      });

      tableBody.appendChild(row);
      updateStatus(row);
    });
  }
}

// Function to update status automatically
function updateStatus(row) {
  const quantityCell = row.querySelector('.item-quantity');
  const statusCell = row.querySelector('.item-status');

  let quantity = parseInt(quantityCell.textContent) || 0;

  if (quantity >= 5) {
    statusCell.textContent = "High";
    statusCell.className = "item-status high";
  } else if (quantity <= 2) {
    statusCell.textContent = "Low";
    statusCell.className = "item-status low";
  } else {
    statusCell.textContent = "Medium";
    statusCell.className = "item-status medium";
  }
}

// Function to add a new item
addButton.addEventListener('click', function() {
  const row = document.createElement('tr');
  row.setAttribute('draggable', true); // Enable dragging

  row.innerHTML = `
    <td class="item-id">${tableBody.children.length + 1}</td>
    <td contenteditable="true" class="item-name">Enter Name</td>
    <td contenteditable="true" class="item-quantity">0</td>
    <td class="item-status">Low</td>
    <td>
      <button class="edit-row-button">✏️</button>
    </td>
  `;

  // Update status when quantity changes
  row.querySelector('.item-quantity').addEventListener('input', () => {
    updateStatus(row);
    saveInventory();
  });

  row.querySelector('.edit-row-button').addEventListener('click', function() {
    enableRowEditing(row);
  });

  tableBody.appendChild(row);
  saveInventory();
});

// Function to enable editing for a row
function enableRowEditing(row) {
  row.querySelectorAll('td:not(:first-child, :last-child)').forEach(cell => {
    cell.setAttribute('contenteditable', 'true');
  });

  doneButton.style.display = "inline-block"; // Show "Done" button
}

// Function to remove the last item
removeButton.addEventListener('click', function() {
  const rows = tableBody.querySelectorAll('tr');
  if (rows.length > 0) {
    rows[rows.length - 1].remove();
    saveInventory();
  }
});

// Function to exit editing mode
doneButton.addEventListener('click', function() {
  document.querySelectorAll('.list table tr').forEach(row => {
    row.querySelectorAll('td[contenteditable="true"]').forEach(cell => {
      cell.removeAttribute('contenteditable');
    });
  });

  doneButton.style.display = "none"; // Hide "Done" button
});

// Function to export inventory
exportButton.addEventListener("click", function() {
  let receiptWindow = window.open("", "", "width=400,height=600");

  let today = new Date();
  let formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  let formattedTime = today.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  let receiptContent = `
    <html>
    <head>
      <style>
        body {
          font-family: 'Courier New', Courier, monospace;
          text-align: center;
          padding: 20px;
        }
        h2 {
          margin-bottom: 10px;
        }
        .receipt-container {
          border: 1px dashed black;
          padding: 15px;
          width: 90%;
          margin: auto;
        }
        table {
          width: 100%;
          margin-top: 10px;
          border-collapse: collapse;
        }
        th, td {
          border-bottom: 1px dashed black;
          padding: 5px;
          text-align: left;
        }
        .total {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <h2>🛒 Inventory</h2>
        <p>Date: ${formattedDate}</p>
        <p>Time: ${formattedTime}</p>
        <hr>
        <table>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Status</th>
          </tr>`;

  document.querySelectorAll(".list table tbody tr").forEach((row) => {
    let id = row.querySelector(".item-id").textContent;
    let name = row.querySelector(".item-name").textContent;
    let quantity = row.querySelector(".item-quantity").textContent;
    let status = row.querySelector(".item-status").textContent;

    receiptContent += `
      <tr>
        <td>${id}</td>
        <td>${name}</td>
        <td>${quantity}</td>
        <td>${status}</td>
      </tr>`;
  });

  receiptContent += `
        </table>
        <p class="total">Total Items: ${document.querySelectorAll(".list table tbody tr").length}</p>
        <p>Thank you for using the system!</p>
      </div>
      <script>
        window.print();
      </script>
    </body>
    </html>`;

  receiptWindow.document.write(receiptContent);
  receiptWindow.document.close();
});

// Load inventory on page load
document.addEventListener("DOMContentLoaded", loadInventory);