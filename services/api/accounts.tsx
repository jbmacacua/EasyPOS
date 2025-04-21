import { supabase } from "@utils/supabase"; 
import { decode } from 'base64-arraybuffer'

export async function editProfile(
    firstName: string,
    lastName: string,
    contactNumber: string,
    address: string,
    userId: string,
) {
    try {
        if (!userId) {
            throw new Error("User is not logged in")
        }

        const { error: updateError } = await supabase
            .from('user_details')
            .update({
                first_name: firstName,
                last_name: lastName,
                contact_number: contactNumber,
                address: address,
            })
            .eq('user_id', userId);

        if (updateError) {
            throw updateError;
        }

        return { success: true };

    } catch (err) {
        return { success: false, error: err };
    }
}

export async function getUserDetails(userId: string) {
    try {
        if (!userId) {
            throw new Error("User is not logged in")
        }

        const { data: userDetails, error: userDetailsError } = await supabase
            .from("user_details")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (userDetailsError) {
            throw userDetailsError
        }

        return { success: true, userDetails };

    } catch (err) {
        return { success: false, error: err };
    }
}

export async function uploadProfileImage(
  file: { base64: string; type: string },
  userId: string
) {
  try {
    if (!userId) {
      throw new Error("User is not logged in");
    }

    const extension = file.type.split('/')[1];

    if (!extension) throw new Error ("file.type needs to be in a format of image/{extension} example image/png")

    const filePath = `public/${userId}/profile.${extension}`;

    // Decode base64 string into ArrayBuffer
    const arrayBuffer = decode(file.base64);

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(filePath);

    const imageUrl = data?.publicUrl;

    if (!imageUrl) throw new Error("Could not generate public image URL.");

    // Update user's profile image in the database
    const { error: updateError } = await supabase
      .from("user_details")
      .update({ profile_image: imageUrl })
      .eq("user_id", userId);

    if (updateError) throw updateError;

    return { success: true, url: imageUrl };

  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to upload profile image",
    };
  }
}

export async function changePassword(
  currentPassword: string,
  password: string,
  confirmPassword: string,
  userId: string,
) {
  try {
    if (!userId) {
      throw new Error("User is not logged in");
    }

    if (!currentPassword || !password || !confirmPassword) {
      throw new Error("All fields are required");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords must be the same");
    }

    // Fetch user email to reauthenticate
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      throw new Error("Failed to retrieve user information.");
    }

    // Reauthenticate user with current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      throw new Error("Current password is incorrect.");
    }

    // Proceed with password update
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      throw updateError;
    }

    return { success: true };

  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

// Helper
async function checkOwnership(userId: string, businessId: string): Promise<boolean> {
  try {
      const { data: businessMembership, error: businessMembershipError } = await supabase
          .from("business_members")
          .select('business_id')
          .eq("user_id", userId)
          .eq("business_id", businessId)
          .single();

      if (!businessMembership) {
          throw new Error("Unauthorized Access");
      }

      if (businessMembershipError) {
          throw businessMembershipError
      }

      const { data: userDetails, error: userDetailsError } = await supabase
          .from("user_details")
          .select('role')
          .eq("user_id", userId)
          .eq("role", "owner")
          .single();

      if (!userDetails) {
          throw new Error("Only owners can insert");
      }

      return true;

  } catch (error) {
      console.log("Unexpected error:", error);
      return false;
  }
}

// Account Management for Owners 
// Create Account this returns credentials -- role can be sales or inventory only
export async function createUserAccount(
  firstName: string,
  lastName: string,
  address: string,
  contactNumber: string,
  userRole: string,
  businessId: string,
  userId: string,
) {
  try {
    if (!userId) {
      throw new Error("User is not logged in");
    }

    if (userRole !== "sales" && userRole !== "inventory") throw new Error("User Role invalid choose sales or inventory only");
    
    const hasPermission = await checkOwnership(userId, businessId);
    if (!hasPermission) {
        throw new Error("Only owners can create new users.");
    }

    const { data: userDetails, error: userDetailsError } = await supabase
        .from("user_details")
        .select("*")
        .eq("first_name", firstName)
        .eq("last_name", lastName)
        .single();

    if (userDetails) {
        throw new Error("User already exist, choose a different firstName or lastName")
    }

    const defaultPassword = `EmployeePOS-${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    const employeeEmail = `${firstName.toLowerCase()}${lastName.toLowerCase()}@easyPOS.com`;

    const { data, error: signInError } = await supabase.auth.signUp({email: employeeEmail, password: defaultPassword});

    if (signInError) throw signInError

    const employeeId = data.session?.user?.id

    const { data: employeeData, error: detailsError } = await supabase.from("user_details").insert({
      user_id: employeeId,
      first_name: firstName,
      last_name: lastName,
      contact_number: contactNumber,
      address,
      email: employeeEmail,
      role: userRole,
    })
    .select()

    if (detailsError) throw detailsError

    const { data: membersData, error: membersError } = await supabase.from("business_members").insert({
      user_id: employeeId,
      business_id: businessId,
    })
    .select()

    if (membersError) throw membersError

    const employeeCredentials = {
      email: employeeEmail,
      password: defaultPassword
    }

    return { success: true, employeeCredentials };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

// Updates Employee Details
export async function updateEmployeeDetails(
  firstName: string,
  lastName: string,
  contactNumber: string,
  address: string,
  userId: string,
  employeeId: string, // auth Id of the user being edited
  businessId: string,
) {
  try {
      if (!userId) {
          throw new Error("User is not logged in")
      }

      const hasPermission = await checkOwnership(userId, businessId);
      if (!hasPermission) {
          throw new Error("Only owners can edit employee details.");
      }

      const { data, error: updateError } = await supabase
          .from('user_details')
          .update({
              first_name: firstName,
              last_name: lastName,
              contact_number: contactNumber,
              address: address,
          })
          .eq('user_id', employeeId);

      if (updateError) {
          throw updateError;
      }

      return { success: true };

  } catch (err) {
      return { success: false, error: err };
  }
}

// Updates employee role sales or inventory
export async function changeEmployeeRole(
  newRole: string,
  userId: string,
  employeeId: string, // auth Id of the user being edited
  businessId: string,
) {
  try {
      if (!userId) {
          throw new Error("User is not logged in")
      }

      if (newRole !== "sales" && newRole !== "inventory") throw new Error("User Role invalid choose sales or inventory only");

      const hasPermission = await checkOwnership(userId, businessId);
      if (!hasPermission) {
          throw new Error("Only owners can change employee role.");
      }

      const { data: userDetails, error: userDetailsError } = await supabase
        .from("user_details")
        .select("*")
        .eq("user_id", employeeId)
        .single();

      if (!userDetails) throw new Error("Employee does not exist");
      if (userDetailsError) throw userDetailsError

      const { error: userRoleError } = await supabase
        .from("user_details")
        .update({
          role: newRole
        })
        .eq("user_id", employeeId)

      if (userRoleError) throw userRoleError
      
      return { success: true };
  } catch (err) {
      return { success: false, error: err };
  }
}

// Updates employee role sales or inventory
export async function deleteEmployee(
  userId: string,
  employeeId: string, // auth Id of the user being edited
  businessId: string,
) {
  try {
      if (!userId) {
          throw new Error("User is not logged in")
      }

      const hasPermission = await checkOwnership(userId, businessId);
      if (!hasPermission) {
          throw new Error("Only owners can delete employee");
      }

      const { data: userDetails, error: userDetailsError } = await supabase
        .from("user_details")
        .select("*")
        .eq("user_id", employeeId)
        .single();

      if (!userDetails) throw new Error("Employee does not exist");
      if (userDetailsError) throw userDetailsError

      const { error: deleteError } = await supabase
        .from("user_details")
        .delete()
        .eq("user_id", employeeId)

      if (deleteError) throw deleteError
      
      return { success: true };
  } catch (err) {
      return { success: false, error: err };
  }
}

// Updates employee role sales or inventory
export async function getAllEmployees(
  userId: string,
  businessId: string,
  page = 1,
  limit = 10
) {
  try {
    if (!userId) {
      throw new Error("User is not logged in");
    }

    const hasPermission = await checkOwnership(userId, businessId);
    if (!hasPermission) {
      throw new Error("Only owners can view all employees");
    }

    const { data, error } = await supabase.rpc('get_business_employees', {
      b_id: businessId,
      page_num: page,
      page_limit: limit,
    });

    if (error) throw error;

    type BusinessEmployee = {
      user_id: string;
      first_name: string;
      last_name: string;
      contact_number: string;
      address: string;
      email: string;
      role: string;
    };

    type MappedEmployee = {
      id: string;
      firstName: string;
      lastName: string;
      contactNumber: string;
      address: string;
      email: string;
      role: string;
    };

    const result: MappedEmployee[] = data.map((user: BusinessEmployee) => ({
      id: user.user_id,
      firstName: user.first_name,
      lastName: user.last_name,
      contactNumber: user.contact_number,
      address: user.address,
      email: user.email,
      role: user.role,
    }));

    return { success: true, result };
  } catch (err) {
    return { success: false, error: err };
  }
}


