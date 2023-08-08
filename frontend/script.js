const tableBody = document.querySelector('tbody');

// fetch('https://quadb-zknk.onrender.com/api/data')
fetch('http://localhost:3000/api/data')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        data.forEach((item, i) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style='text-transform: capitalize;' >${item.name}</td>
                <td>${item.last}</td>
                <td>Rs ${item.buy}</td>
                <td>Rs ${item.sell}</td>
                <td>${item.volume} %</td>
                <td>${item.base_unit}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
