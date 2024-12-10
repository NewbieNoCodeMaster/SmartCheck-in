alert('test')

let students = JSON.parse(localStorage.getItem('students')) || [];
let selectedStudentIndex = null;

// Save data to localStorage
function saveToLocalStorage() {
  localStorage.setItem('students', JSON.stringify(students));
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
    addStudent(name, category);
    const modal = bootstrap.Modal.getInstance(document.getElementById('addStudentModal'));
    modal.hide();
  }
});

// Initialize the table render
renderTable();

