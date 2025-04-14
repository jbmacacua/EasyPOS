// import { supabase } from "@utils/supabase"; 

// export async function completeProfile(
//     firstName: string,
//     lastName: string,
//     contactNumber: string,
//     address: string,
// ) {
//     try {
//         const { error: insertError } = await supabase.from('user_details').insert([
//             {
//                 user_id: user.id,
//                 first_name: firstName,
//                 last_name: lastName,
//                 contact_number: contactNumber,
//                 address: address,
//             }
//         ]);

//         if (insertError) {
//             return {insertError};
//         }

//         return

//     } catch (err) {
//         return { error: new Error("Unexpected error during sign-up") };
//     }
// }