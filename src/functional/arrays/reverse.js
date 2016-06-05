import composable from "./../composable";

// Slice to clone array before reverse for immutability
export default composable(array => array.slice().reverse()); 
