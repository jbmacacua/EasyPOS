import React from "react";

import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from "@hooks/useStorageState";
import { supabase } from "@utils/supabase";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

interface AuthContextType {
  signIn: (credentials: { email: string; password: string }) => Promise<boolean>;
  signUp: (firstName: string, lastName: string, contactNumber: string, address: string, email: string, password: string, ) => Promise<void>;
  signOut: () => Promise<void>;
  session?: string | null;
  userRole?: string | null;
  businessId?: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    signIn: async () => false,
    signUp: async () => {},
    signOut: async () => {},
    session: null,
    userRole: null,
    businessId: null,
    isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [businessId, setBusinessId] = React.useState<string | null>(null);

  const router = useRouter()

  return (
    <AuthContext.Provider
      value={{
        signIn: async (credentials: { email: string; password: string }) => {
            try {
              const { data, error } = await supabase.auth.signInWithPassword(credentials);
          
              if (error || !data) {
                Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
                return false;
              }
          
              const userId = data.session?.user?.id;
          
              if (!userId) {
                Alert.alert('Login Failed', 'User ID is missing.');
                return false;
              }
          
              const { data: userDetails, error: userDetailsError } = await supabase
                .from("user_details")
                .select("role")
                .eq("user_id", userId)
                .single();
                
              if (userDetailsError || !userDetails) {
                Alert.alert('Login Failed', 'User record does not exist.');
                let { error } = await supabase.auth.signOut()
                if(error) throw error
                
                return false;
              }

              const { data: memberDetails, error: memberDetailsError } = await supabase
                .from("business_members")
                .select("business_id")
                .eq("user_id", userId)
                .single();
              
              if (memberDetailsError || !memberDetails) {
                Alert.alert('Login Failed', 'User is not a member of any business');
                return false;
              }
          
              setUserRole(userDetails?.role);
              setBusinessId(memberDetails?.business_id);
              setSession(JSON.stringify(data.session));
          
              return true;
          
            } catch (error) {
              Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
              return false;
            }
          },
        signUp: async (
            firstName: string,
            lastName: string,
            contactNumber: string,
            address: string,
            email: string,
            password: string
          ) => {
            try {
                const { error : signUpError } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                });

                if (signUpError) {
                    Alert.alert('Sign-up Failed', signUpError.message);
                    return;
                }

                const { error: signInError } = await supabase.auth.signInWithPassword({email, password});

                if (signInError) {
                    Alert.alert('Login Failed', signInError?.message || 'Unable to sign in after registration.');
                    return;
                }

                const { data } = await supabase.auth.getSession();
            
                if (!data) throw new Error("User not returned after sign-up");

                setSession(JSON.stringify(data.session));
            
                // Insert additional user details
                const { error: insertError } = await supabase.from('user_details').insert([
                    {
                    user_id: data?.session?.user?.id,
                    first_name: firstName,
                    last_name: lastName,
                    contact_number: contactNumber,
                    address: address,
                    email: email,
                    role:'owner'
                    }
                ]);

                if (insertError) {
                    console.log("Insert Error:", insertError);
                }

                const {error: businessInsertError } = await supabase.from('business_details').insert([
                  {
                    created_by: data?.session?.user?.id,
                  }
                ])
                .single();  

                if (businessInsertError) {
                  console.log("Business Insert Error:", businessInsertError);
                } 

                const { data: businessDetails, error: businessDetailsError } = await supabase
                  .from("business_details")
                  .select("id")
                  .eq("created_by", data?.session?.user?.id)
                  .single();

                if (businessDetailsError) {
                    throw businessDetailsError
                }
                
                const { error: memberInsertError } = await supabase.from('business_members').insert([
                  {
                    user_id: data?.session?.user?.id,
                    business_id: businessDetails.id
                  }
                ]);

                if (memberInsertError) {
                  console.log("Member Insert Error:", memberInsertError);
                }   
                
                setUserRole('owner');
                setBusinessId(businessDetails.id);
            
                setTimeout(() => {
                    router.push("/main/dashboard");
                }, 2000);
            } 
            catch (err) {
                Alert.alert('Sign-up Failed', 'There was an error creating your account. Please try again.');
                console.error("Sign-up error:", err);
            }
        },          
        signOut: async () => {
          try {
            let { error } = await supabase.auth.signOut()

            if(error) throw error
            
            setSession(null);
            setUserRole(null);
            setBusinessId(null);

            setTimeout(() => {
              router.push("/");
          }, 3000);

          } catch (error) {
            Alert.alert('Logout Failed', 'An error occurred while logging out. Please try again.');
          }
        },
        session,
        userRole,
        businessId,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
