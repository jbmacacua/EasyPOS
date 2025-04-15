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

    const filePath = `public/${userId}/profile.jpg`;

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

    console.log(data)
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

