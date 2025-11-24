// helpers/generateAvatar.js

function generateAvatar(fullName) {
  const firstLetter = fullName?.charAt(0)?.toUpperCase() || "U";

  // Random light colors list
  const colors = [
    "FF5733", "FFC300", "8DFF33", "33FFBD",
    "3380FF", "8E33FF", "FF33EC", "FF3380"
  ];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // Placeholder avatar generator
  return `https://ui-avatars.com/api/?name=${firstLetter}&background=${randomColor}&color=fff&size=256&bold=true&font-size=0.5`;
}

module.exports = generateAvatar;
