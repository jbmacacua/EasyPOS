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
export async function uploadProductImage(
  file: { base64: string; type: string },
  userId: string,
  businessId: string,
  productName: string,
  productId: string
) {
  try {
    if (!userId) {
      throw new Error("User is not logged in");
    }

    const filePath = `public/${businessId}/${productName}.jpg`;

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

    console.log(data)
    if (!imageUrl) throw new Error("Could not generate public image URL.");

    // Update user's profile image in the database
    const { error: updateError } = await supabase
      .from("products")
      .update({ image: imageUrl })
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
  quantity: Number,
  totalQuanitySinceRestock: Number,
) {
  try {
    if (!userId) {
      throw new Error("User is not logged in");
    }

    const { data: userDetails, error: userDetailsError } = await supabase
      .from("user_details")
      .select(
        `
          role,
          business_members (
            user_id,
            business_id
          )
        `
      )
      .eq("user_id", userId)
      .or(`role.eq.owner, role.eq.inventory`)
      .filter("business_members.business_id", "eq", businessId)
      .single();

    if (!userDetails || !userDetails.business_members || userDetails.business_members.length === 0) {
      throw new Error("Only owners or inventory can insert");
    }

    if (userDetailsError) {
      throw userDetailsError
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")  
      .or(`bar_code.eq.${barCode}, name.eq.${name}`)
      .eq("business_id", businessId)
      .single();

    if (error) {
      throw error;
    }

    if(data) throw new Error ("Product code or name already exist")

    const { error: insertError } = await supabase
      .from('products')
      .insert([
        { name, bar_code: barCode, price, quantity, total_quantity_since_restock :totalQuanitySinceRestock, business_id: businessId},
      ])
      .select()
    
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

    // Check if the user is an owner in the business
    const { data: userDetails, error: userDetailsError } = await supabase
      .from("user_details")
      .select(
        `
          role,
          business_members (
            user_id,
            business_id
          )
        `
      )
      .eq("user_id", userId)
      .or(`role.eq.owner, role.eq.inventory`)
      .filter("business_members.business_id", "eq", businessId)
      .single();

    if (!userDetails || !userDetails.business_members || userDetails.business_members.length === 0) {
      throw new Error("Only owners or inventory can edit products");
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

    const { data: userDetails, error: userDetailsError } = await supabase
      .from("user_details")
      .select(`
        role,
        business_members (
          user_id,
          business_id
        )
      `)
      .eq("user_id", userId)
      .or(`role.eq.owner, role.eq.inventory`)
      .filter("business_members.business_id", "eq", businessId)
      .single();

    if (userDetailsError) {
      throw userDetailsError;
    }

    if (!userDetails || !userDetails.business_members || userDetails.business_members.length === 0) {
      throw new Error("Only owners or inventory can delete products");
    }

    // Check if the product exists in the specified business
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("business_id", businessId)
      .single();

    if (productError) {
      throw productError;
    }

    if (!product) {
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





  