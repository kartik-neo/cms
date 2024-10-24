// import { faker } from "@faker-js/faker";

// const range = (len) => {
//   const arr = [];
//   for (let i = 0; i < len; i++) {
//     arr.push(i);
//   }
//   return arr;
// };

// const newRecord = () => {
//   return {
//     bookingId: `#${faker.datatype.number({ min: 10000, max: 99999 })}`,
//     codeType: faker.helpers.arrayElement(["Red", "Blue", "Pink", "Gray"]),
//     codeActivationDateTime: faker.date.soon().toLocaleString(),
//     reportedBy: faker.name.firstName() + " " + faker.name.lastName(),
//     location: `${faker.address.city()}, OT Desk ${faker.datatype.number({
//       min: 1,
//       max: 5,
//     })}`,
//     codeDeactivationDateTime: faker.date.soon().toLocaleString(),
//     timeOfCompletion: `${faker.datatype.number({
//       min: 1,
//       max: 3,
//     })} hr ${faker.datatype.number({ min: 1, max: 59 })} Min`,
//     deactivationStatus: faker.datatype.boolean(),
//     postEventAnalysis: faker.datatype.boolean(),
//     verification: faker.datatype.boolean(),
//     actionItem: faker.datatype.boolean(),
//   };
// };

// export function makeData(...lens) {
//   const makeDataLevel = (depth = 0) => {
//     const len = lens[depth];
//     return range(len).map(() => {
//       return {
//         ...newRecord(),
//         subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
//       };
//     });
//   };

//   return makeDataLevel();
// }
