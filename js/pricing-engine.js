function calculateAvgPrice(price){
  return Math.round((price.min + price.max)/2);
}

function formatPrice(p,unit){
  return `₹${p.min} - ₹${p.max} / ${unit}`;
}
