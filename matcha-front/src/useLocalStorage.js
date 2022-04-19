// import { useState, useEffect } from "react";

// const useLocalStorage = (key, defaultValue) => {
//   const hook = useState(() => {
//     const saved = localStorage.getItem(key);
//     try {
//       const initialValue = JSON.parse(saved);
//       return initialValue || defaultValue;
//     } catch (e) {
//       console.log(e);
//     }

//     return saved || defaultValue;
//   });

//   useEffect(() => {
//     localStorage.setItem(key, hook[0]);
//   }, [hook[0]]);

//   return hook;
// };

// export default useLocalStorage;
