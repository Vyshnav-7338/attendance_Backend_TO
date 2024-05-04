document.getElementById('fetchAttendanceBtn').addEventListener('click', async function() {
  const date = document.getElementById('date').value;
  const token = localStorage.getItem("token");

  try {
      const response = await fetch(`http://68.178.163.246:3004/api/attendance?date=${date}`, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: token,

          }
      });
      
      if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
      }

      const data = await response.json();
      populateAttendanceTable(data);
  } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch attendance data. Please try again.');
  }
});

function populateAttendanceTable(data) {
  const tableBody = document.getElementById('attendanceTableBody');
  tableBody.innerHTML = '';

  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const indianOptions = { timeZone: 'Asia/Kolkata', ...options };

  data.forEach(entry => {
      const row = document.createElement('tr');

      const createdAt = new Date(entry.createdAt).toLocaleDateString('en-IN', options);
      const dateCell = document.createElement('td');
      dateCell.textContent = createdAt;
      row.appendChild(dateCell);

      const checkInTime = entry.checkInTime ? new Date(entry.checkInTime).toLocaleTimeString('en-IN', indianOptions) : 'Nill';
      const checkInTimeCell = document.createElement('td');
      checkInTimeCell.textContent = checkInTime;
      row.appendChild(checkInTimeCell);

      const checkOutTime = entry.checkOutTime ? new Date(entry.checkOutTime).toLocaleTimeString('en-IN', indianOptions) : 'Nill';
      const checkOutTimeCell = document.createElement('td');
      checkOutTimeCell.textContent = checkOutTime;
      row.appendChild(checkOutTimeCell);

      const checkInPhotoCell = document.createElement('td');
      if (entry.checkInPhoto) {
          const checkInPhotoLink = document.createElement('a');
          checkInPhotoLink.href = `http://68.178.163.246:3004/images/${entry.checkInPhoto}`;
          checkInPhotoLink.textContent = 'View Photo';
          checkInPhotoCell.appendChild(checkInPhotoLink);
      } else {
          checkInPhotoCell.textContent = 'Nill';
      }
      row.appendChild(checkInPhotoCell);

      // Create link for checkOutPhoto
      const checkOutPhotoCell = document.createElement('td');
      if (entry.checkOutPhoto) {
          const checkOutPhotoLink = document.createElement('a');
          checkOutPhotoLink.href = `http://68.178.163.246:3004/images/${entry.checkOutPhoto}`;
          checkOutPhotoLink.textContent = 'View Photo';
          checkOutPhotoCell.appendChild(checkOutPhotoLink);
      } else {
          checkOutPhotoCell.textContent = 'Nill';
      }
      row.appendChild(checkOutPhotoCell);

      tableBody.appendChild(row);
  });
}

