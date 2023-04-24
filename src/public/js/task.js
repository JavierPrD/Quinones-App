import './task.css';
// Add a dropdown menu to the "About" item
const aboutItem = document.querySelector('.menu ul li:nth-child(2)');
const dropdown = document.createElement('div');
dropdown.classList.add('dropdown');
dropdown.innerHTML = 
  <ul>
    <li><a href="#">Our Team</a></li>
    <li><a href="#">Our Mission</a></li>
    <li><a href="#">Our History</a></li>
  </ul>
;
aboutItem.appendChild(dropdown);

// Add a hover effect to the menu items
const menuItems = document.querySelectorAll('.menu ul li');
menuItems.forEach(item => {
  item.addEventListener('mouseover', () => {
    item.style.backgroundColor = '#fff';
    item.style.color = '#333';
  });
  item.addEventListener('mouseout', () => {
    item.style.backgroundColor = 'transparent';
    item.style.color = '#fff';
  });
});



