const fs = require('fs');

// Функція для генерації масиву об'єктів
const generateArray = (num) => {
  const array = [];
  for (let i = 1; i <= num; i++) {
    array.push({
      id: i,
      name: `Name${i}`,
      hasAccess: i % 2 === 0 ? false : true, // Пример умовного доступу
    });
  }
  return array;
};

// Генерація масиву з 10000 елементів
const data = generateArray(100);

// Запис масиву у новий файл JSON
fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('File has been saved!');
  }
});
