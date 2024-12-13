let students = JSON.parse(localStorage.getItem('students')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || ['Default Category']; // Initialize with a default category
let selectedStudentIndex = null;

// Save data to localStorage
function saveToLocalStorage() {
  localStorage.setItem('students', JSON.stringify(students));
  localStorage.setItem('categories', JSON.stringify(categories)); // Save categories
}

// Render student table with filtering and search functionality
function renderTable(filteredStudents = students) {
  const studentList = document.getElementById('studentList');
  studentList.innerHTML = '';

  filteredStudents.forEach((student, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.name}</td>
      <td>${student.category}</td>
      <td>${student.status}</td>
      <td>${student.timestamp || 'N/A'}</td>
      <td class="action-buttons">
        <button class="btn btn-success btn-sm" onclick="markPresent(${index})">
          <i class="bi bi-check-circle"></i> Present
        </button>
        <button class="btn btn-warning btn-sm" onclick="markAbsent(${index})">
          <i class="bi bi-x-circle"></i> Absent
        </button>
        <button class="btn btn-info btn-sm" onclick="viewHistory(${index})" data-bs-toggle="modal" data-bs-target="#historyModal">
          <i class="bi bi-clock-history"></i> History
        </button>
        <button class="btn btn-danger btn-sm" onclick="deleteStudent(${index})">
          <i class="bi bi-trash"></i> Delete
        </button>
      </td>
    `;
    studentList.appendChild(row);
  });
}

// Search and filter functionality
function searchAndFilterStudents() {
  const searchQuery = document.getElementById('searchStudent').value.toLowerCase();
  const categoryFilter = document.getElementById('filterCategory').value;

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery);
    const matchesCategory = categoryFilter ? student.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  renderTable(filteredStudents);
}

// Event listeners for search and filter
document.getElementById('searchStudent').addEventListener('input', searchAndFilterStudents);
document.getElementById('filterCategory').addEventListener('change', searchAndFilterStudents);

// Add student functionality
function addStudent(name, category) {
  students.push({
    name,
    category,
    status: 'Absent',
    timestamp: null,
    history: [],
  });
  saveToLocalStorage();
  renderTable();
  updateCategoryDropdown(); // Update category dropdown in the modal
}

// Mark attendance as present
function markPresent(index) {
  updateStatus(index, 'Present');
}

// Mark attendance as absent
function markAbsent(index) {
  updateStatus(index, 'Absent');
}

// Update attendance status
function updateStatus(index, status) {
  const student = students[index];
  if (student.status !== status) {
    const timestamp = new Date().toLocaleString();
    student.history.push(`${student.status} ➡️ ${status} at ${timestamp}`);
    student.status = status;
    student.timestamp = timestamp;
    saveToLocalStorage();
    renderTable();
  }
}

// View attendance history
function viewHistory(index) {
  const historyList = document.getElementById('historyList');
  const student = students[index];
  selectedStudentIndex = index;

  historyList.innerHTML = '';
  student.history.forEach((record) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.textContent = record;
    historyList.appendChild(listItem);
  });
}

// Delete student
function deleteStudent(index) {
  students.splice(index, 1);
  saveToLocalStorage();
  renderTable();
}

// Handle saving new student
document.getElementById('saveStudent').addEventListener('click', () => {
  const name = document.getElementById('modalStudentName').value.trim();
  const category = document.getElementById('modalCategory').value;

  if (name && category) {
    // Add category if it doesn't exist
    if (!categories.includes(category)) {
      categories.push(category);
      saveToLocalStorage();
      updateTableCategoryDropdown(); // Update the table dropdown
    }
    addStudent(name, category);
    const modal = bootstrap.Modal.getInstance(document.getElementById('addStudentModal'));
    modal.hide();
  }
});

// Add category functionality
function addCategory() {
  const newCategory = document.getElementById('newCategory').value.trim();
  if (newCategory) {
    if (!categories.includes(newCategory)) {
      categories.push(newCategory);
      saveToLocalStorage();
      updateCategoryDropdown();
      updateTableCategoryDropdown();
      document.getElementById('newCategory').value = ''; // Clear the input field
    } else {
      // Show a modal or alert for duplicate category
      const modal = new bootstrap.Modal(document.getElementById('duplicateCategoryModal'));
      modal.show();
    }
  }
}

// Event listener for the "Add Category" button
document.getElementById('addCategoryButton').addEventListener('click', addCategory);

// Delete category functionality
function deleteCategory() {
  const selectedCategory = document.getElementById('modalCategory').value;
  if (selectedCategory) {
    // Update the modal category dropdown before showing the modal
    updateCategoryDropdown(); 
    // Show the confirmation modal
    const confirmModal = new bootstrap.Modal(document.getElementById('deleteCategoryConfirmModal'));
    document.getElementById('confirmCategory').textContent = selectedCategory; // Set category in the modal
    confirmModal.show(); // Display the modal
  }
}

// Event listener for the "Confirm Delete" button in the modal
document.getElementById('confirmDeleteCategory').addEventListener('click', () => {
  const selectedCategory = document.getElementById('modalCategory').value; // Get category from dropdown again
  const index = categories.indexOf(selectedCategory);
  if (index > -1) {
    categories.splice(index, 1); // Remove the category from the array
    saveToLocalStorage();
    updateCategoryDropdown();
    updateTableCategoryDropdown();
    // Optionally, reset the dropdown to the default value
    
    showNotification('Category deleted successfully!', 'success'); // Notify user
  }
  // Hide the confirmation modal
  const confirmModal = bootstrap.Modal.getInstance(document.getElementById('deleteCategoryConfirmModal'));
  confirmModal.hide();
  document.getElementById('modalCategory').value = ''; // Reset dropdown after modal closes
});



// Update category dropdown in the modal
function updateCategoryDropdown() {
  const categoryDropdown = document.getElementById('modalCategory');
  const currentSelection = categoryDropdown.value; // Store the current selection
  categoryDropdown.innerHTML = ''; // Clear existing options

  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.text = 'Select a category';
  categoryDropdown.appendChild(defaultOption);

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.text = category;
    categoryDropdown.appendChild(option);
  });

  categoryDropdown.value = currentSelection; // Restore the previously selected value
}

// Update category dropdown in the table
function updateTableCategoryDropdown() {
  const categoryDropdown = document.getElementById('filterCategory');
  categoryDropdown.innerHTML = ''; // Clear existing options

  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.text = 'All Categories';
  categoryDropdown.appendChild(defaultOption);

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.text = category;
    categoryDropdown.appendChild(option);
  });
}

// Initialize the table render and category dropdowns
renderTable();
updateCategoryDropdown();
updateTableCategoryDropdown();
