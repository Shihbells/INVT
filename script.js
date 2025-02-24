// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-SjhRJLTW8CrrZiqk6GG7v-FkEm48x4Q",
  authDomain: "invt-64f41.firebaseapp.com",
  projectId: "invt-64f41",
  storageBucket: "invt-64f41.firebasestorage.app",
  messagingSenderId: "124044206587",
  appId: "1:124044206587:web:080a3c3abaa723b5c06b5e",
  measurementId: "G-4NV5B1VPWG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Function to save inventory to Firebase
async function saveInventoryToFirebase() {
  const inventory = [];
  document.querySelectorAll(".list table tbody tr").forEach((row) => {
    inventory.push({
      id: row.querySelector(".item-id").textContent,
      name: row.querySelector(".item-name").textContent,
      quantity: row.querySelector(".item-quantity").textContent,
      status: row.querySelector(".item-status").textContent,
    });
  });

  // Clear existing collection (optional, to prevent duplicates)
  const querySnapshot = await getDocs(collection(db, "inventory"));
  querySnapshot.forEach(async (docSnap) => {
    await deleteDoc(doc(db, "inventory", docSnap.id));
  });

  // Save new data
  for (const item of inventory) {
    await addDoc(collection(db, "inventory"), item);
  }
}

// Function to load inventory from Firebase
async function loadInventoryFromFirebase() {
  const querySnapshot = await getDocs(collection(db, "inventory"));
  tableBody.innerHTML = ""; // Clear table before loading
  querySnapshot.forEach((docSnap) => {
    const item = docSnap.data();
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
      saveInventoryToFirebase();
    });
    row.querySelector(".edit-row-button").addEventListener("click", function () {
      enableRowEditing(row);
    });
    tableBody.appendChild(row);
    updateStatus(row);
  });
}

// Modify event listeners to save to Firebase
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
  row.querySelector('.item-quantity').addEventListener('input', () => {
    updateStatus(row);
    saveInventoryToFirebase();
  });
  row.querySelector('.edit-row-button').addEventListener('click', function() {
    enableRowEditing(row);
  });
  tableBody.appendChild(row);
  saveInventoryToFirebase();
});

removeButton.addEventListener('click', async function() {
  const rows = tableBody.querySelectorAll('tr');
  if (rows.length > 0) {
    rows[rows.length - 1].remove();
    saveInventoryToFirebase();
  }
});

document.addEventListener("DOMContentLoaded", loadInventoryFromFirebase);
