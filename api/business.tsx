import { supabase } from "@utils/supabase"; 

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
            .or(`role.eq.owner, role.eq.inventory`)
            .single();

        if (!userDetails) {
            throw new Error("Only owners or inventory can insert");
        }

        return true;

    } catch (error) {
        console.log("Unexpected error:", error);
        return false;
    }
}

//Edit Business Information, all details are required
export async function editBusinessInformation(
    storeName: string,
    contactNumber: string,
    emailAddress: string,
    address: string,
    userId: string,
    businessId: string,
) {
    try {
        if (!userId) {
            throw new Error("User is not logged in")
        }   

        const hasPermission = await checkOwnership(userId, businessId);
        if (!hasPermission) {
            throw new Error("Only owners or inventory can edit business information.");
        }

        const { error: updateError } = await supabase
            .from('business_details')
            .update({
                store_name: storeName,
                contact_number: contactNumber,
                email_address: emailAddress,
                address: address,
            })
            .eq('id', businessId);

        if (updateError) {
            throw updateError;
        }

        return { success: true };

    } catch (err) {
        return { success: false, error: err };
    }
}

//Get Business Information
export async function getBusinessDetails(userId: string, businessId: string,) {
    try {
        if (!userId) {
            throw new Error("User is not logged in")
        }

        const { data: businessDetails, error: businessDetailsError } = await supabase
            .from("business_details")
            .select("*")
            .eq("id", businessId)
            .single();

        if (businessDetailsError) {
            throw businessDetailsError
        }

        return { success: true, businessDetails };

    } catch (err) {
        return { success: false, error: err };
    }
}