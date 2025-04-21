import { supabase } from "@utils/supabase"; 
import { decode } from 'base64-arraybuffer'

// Get Products
export async function getProducts(
  userId: string,
  businessId: string,
  page: number,
  limit: number,
  sortBy: string,
  order: string,
  searchName: string
) {
  try {
    if (!userId) {
      throw new Error("User is not logged in");
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("business_id", businessId);

    if (searchName) {
      query = query.ilike("name", `%${searchName}%`);
    }

    if (sortBy && order) {
      query = query.order(sortBy, { ascending: order.toLowerCase() === "asc" });
    }

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return {
      success: true,
      data,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (err) {
    return { success: false, error: err };
  }
}

// Get Specific Product Data with productId
export async function getProductById(
  userId: string,
  productId: string,
) {
  try {
      if (!userId) {
          throw new Error("User is not logged in")
      }

      const { data: productDetails, error: productDetailsError } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

      if (productDetailsError) {
          throw productDetailsError
      }

      return { success: true, productDetails };

  } catch (err) {
      return { success: false, error: err };
  }
}

// Product conflict checking
// Check if product already exist --  Use this first before adding new product
export async function checkExistingProduct(
  userId: string,
  barCode: string,
  businessId: string,
) {
  try {
    if (!userId) {
      throw new Error("User is not logged in");
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("bar_code", barCode)
      .eq("business_id", businessId);

    if (error) {
      throw error;
    }

    const barcodeAvailable = data.length === 0;

    return { success: true, barcodeAvailable };
  } catch (err) {
    return { success: false, error: err };
  }
}

// Check if the productr is available -- Use during sale, check each time a bar code is scanned.
export async function checkProductAvailability(
  userId: string,
  barCode: string,
  businessId: string,
) {
  try {
    if (!userId) {
      throw new Error("User is not logged in");
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("bar_code", barCode)
      .eq("business_id", businessId)
      .gt('quantity', 0)

    if (error) {
      throw error;
    }

    const itemAvailable = data.length > 0;

    return { success: true, itemAvailable };
  } catch (err) {
    return { success: false, error: err };
  }
}

// Product Management
// Product Image
export async function uploadProductImage(
  file: { base64: string; type: string },
  userId: string,
  businessId: string,
  productId: string
) {
  try {
    if (!userId) {
      throw new Error("User is not logged in");
    }

    const { data: productDetails, error: productDetailsError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

    if (productDetailsError) {
        throw productDetailsError
    }

    const extension = file.type.split('/')[1];

    if (!extension) throw new Error ("file.type needs to be in a format of image/{extension} example image/png")

    const filePath = `public/${businessId}/${productDetails.name}.${extension}`;

    // Decode base64 string into ArrayBuffer
    const arrayBuffer = decode(file.base64);

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("product-image")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data } = supabase.storage
      .from("product-image")
      .getPublicUrl(filePath);

    const imageUrl = data?.publicUrl;

    if (!imageUrl) throw new Error("Could not generate public image URL.");

    // Update user's profile image in the database
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_file: imageUrl })
      .eq("id", productId);

    if (updateError) throw updateError;

    return { success: true, url: imageUrl };

  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to upload profile image",
    };
  }
}

export async function addProduct(
  userId: string,
  barCode: string,
  businessId: string,
  name: string,
  price: Number,
  basePrice: Number,
  quantity: Number,
  totalQuanitySinceRestock: Number,
) {
  try {
    if (!userId) {
      throw new Error("User is not logged in");
    }

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

    if (userDetailsError) {
      throw userDetailsError
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or(`bar_code.eq.${barCode},name.eq.${name}`)
      .eq("business_id", businessId)
    

    if (error) {
      throw error;
    }

    if(data.length>0) throw new Error ("Product code or name already exist")

    const { error: insertError } = await supabase.from('products').insert([
        {
        business_id: businessId,
        name: name,
        bar_code: barCode,
        price: price,
        quantity: quantity,
        base_price: basePrice,
        total_quantity_since_restock: totalQuanitySinceRestock,
        }
    ]);

    console.log(insertError)
        
    if (insertError) {
      throw insertError;
    }
    
    const { data: newProductData, error: fetchError } = await supabase
      .from("products")
      .select("*")  
      .eq("bar_code", barCode)
      .eq("name", name)
      .eq("business_id", businessId)
      .single()

    if (fetchError ) {
      throw fetchError ;  
    }

    return { success: true, newProductData};
  } catch (err) {
    return { success: false, error: err };
  }
}

// Change Product Details
// Requires all the fields here to be not empty
export async function editProduct(
  userId: string,
  productId: string,
  businessId: string,
  name: string,
  price: number,
  quantity: number,
  totalQuanitySinceRestock: number,
) {
  try {
    if (!userId) {
      throw new Error("User is not logged in");
    }

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

    if (userDetailsError) {
      throw userDetailsError
    }

    // Check if another product with the same barCode or name already exists in the business
    const { data: existingProducts, error: conflictError } = await supabase
      .from("products")
      .select("*")
      .eq("business_id", businessId)
      .eq("name", name)
      .neq("id", productId);

    if (conflictError) {
      throw conflictError;
    }

    if (existingProducts && existingProducts.length > 0) {
      throw new Error("Another product with name already exists.");
    }

    // Update the product
    const { error: updateError } = await supabase
      .from("products")
      .update({
        name, 
        price,
        quantity,
        total_quantity_since_restock: totalQuanitySinceRestock,
      })
      .eq("id", productId);

    if (updateError) {
      throw updateError;
    }

    return { success: true };

  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to edit product" };
  }
}

export async function deleteProduct(
  userId: string,
  productId: string,
  businessId: string
) {
  try {
    if (!userId) {
      throw new Error("User is not logged in");
    }

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

    if (userDetailsError) {
      throw userDetailsError
    }

    // Check if the product exists in the specified business
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("business_id", businessId)

    if (productError) {
      throw productError;
    }

    if (product.length == 0 ) {
      throw new Error("Product not found");
    }

    // Proceed with deleting the product
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteError) {
      throw deleteError;
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete product" };
  }
}





  