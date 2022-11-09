// import { useEffect } from 'react';
// import { useReducer, createContext, useContext } from 'react';
// import { authenticationService } from "../Services/authenticationService";
// const StateContext = createContext({
//     scope: null,
//     user: null,
//     setUser: (userData) => {},
   
//   });
//   const stateReducer = (state, action) => {
//     switch (action.type) {
//       case 'SET_USER':
//         return {
//           ...state,
//           user: action.payload,
//         };
//         default:
//             return state;
//     };
//   };

//   export const StateProvider = ({ children }) => {
//     const [state, dispatch] = useReducer(stateReducer, {
//         scope: null,
//         user: null,
//       });
  
  
//     const setUser = () => {
//         const authenticationService.currentUserValue;
//        dispatch({
//         type: 'SET_USER',
//         payload:  ,
//       });
//     };

//     return (
//       <StateContext.Provider value={{ user: state.user, scope }}>
//         {children}
//       </StateContext.Provider>
//     );
//   };
  
//   export const useStateContext = () => useContext(StateContext);
  