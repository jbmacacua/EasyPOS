import { supabase } from "@utils/supabase"; 
import { startOfWeek, formatISO, parseISO, getDate} from "date-fns";

// Helpers
async function supabaseDate(): Promise<string | null> {
    try {
        const { data, error } = await supabase.rpc('get_current_date');

        if (error) {
            console.error('Error fetching current date from Supabase:', error.message);
            return null;
        }

        return data ? data : null;
    } catch (error) {
        console.error('Error fetching current date from Supabase:', error);
        return null;
    }
}

function normalizeTime(date: string, time: string): Date {
    // Trim microseconds to milliseconds and ensure proper timezone format
    const cleanedTime = time
        .replace(/(\.\d{3})\d+/, '$1') // keep only 3 decimal places for milliseconds
        .replace(/([+-]\d{2})(?!:)/, '$1:00'); // convert +08 to +08:00

    return new Date(`${date}T${cleanedTime}`);
}

function getStartDateOfWeek(year: number, month: number, weekNumber: number): string {
    const startDate = new Date(year, month, (weekNumber - 1) * 7 + 1); // First day of the week
    return startDate.toISOString().split("T")[0];
}

function getEndDateOfWeek(year: number, month: number, weekNumber: number): string {
    const startDate = new Date(year, month, (weekNumber - 1) * 7 + 1);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6); // The end date is 6 days after the start of the week
    return endDate.toISOString().split("T")[0];
}

async function checkMembership(userId: string, businessId: string): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from("business_members")
            .select("business_id")
            .eq("user_id", userId)
            .eq("business_id", businessId)
            .single();

        if (error) {
            console.log("Membership error:", error.message);
            return false;
        }

        if (!data) {
            console.log("User is not a member of the business");
            return false;
        }

        return true;

    } catch (error) {
        console.log("Unexpected error:", error);
        return false;
    }
}

//APIS
// Check if the product is available -- Use during sale, check each time a bar code is scanned. Returns product data if available and null if not
export async function checkProductAvailability(
    userId: string,
    barCode: string,
    businessId: string,
    productQuantity: number
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
        .gte('quantity', productQuantity)

    if (error) {
        throw error;
    }

    return { success: true, data };
    } catch (err) {
    return { success: false, error: err };
    }
}

type SaleItem = {
    productId: string;
    quantity: number;
};

// Sheesh Online function create sales. 
// Items should be in this form: 
// "items": [
//         { "6f1d7c4c-db8f-44f5-b157-a131dc30d38f": "uuid-product-1", "quantity": 2 },
//         { "de5ae752-980e-46b6-86cb-6c1818e52abf": "uuid-product-2", "quantity": 1 }
//     ], 
export async function createSales(
    userId: string,
    businessId: string,
    items: SaleItem[]
): Promise<{ success: boolean; error?: any; data?:any}> {
    try {
        if (!userId) throw new Error("User is not logged in");
        if (items.length === 0) throw new Error("Items cannot be empty");

        const memberShip = await checkMembership(userId, businessId);

        if (!memberShip) {
            throw new Error("Not a member")
        }

        const { data, error } = await supabase.rpc("create_sale_transaction", {
            p_user_id: userId,
            p_business_id: businessId,
            p_items: items
        });

        console.log(data)

        if (error) {
            console.error("Supabase RPC error:", error);
            return { success: false, error };
        }

        if (data) {
            return {
                success: data.success,
                error: data.error,
            };
        }

        console.log("RPC Response:", data);
        return { success: true, data };
    } catch (error) {
        console.error("createSales error:", error);
        return { success: false, error };
    }
}

// Get restock Items +
export async function getItemsNeededToRestock(
    userId: string,
    businessId: string,
) {
    try {
        if (!userId) {
            throw new Error("User is not logged in");
        }

        const memberShip = await checkMembership(userId, businessId);

        if (!memberShip) {
            throw new Error("Not a member")
        }

        const { data, error } = await supabase.rpc("get_items_needed_restock", {
            business_id: businessId
          });

        console.log(data)

        if (error) {
            throw error;
        }

        return { success: true, data };

    } catch (err) {
        return { success: false, error: err };
    }
}

// Get Total Sales by employee for the current day
export async function getTotalSalesByEmployee(
    userId: string,
    businessId: string,
) {
    try {
        if (!userId) {
            throw new Error("User is not logged in");
        }

        const memberShip = await checkMembership(userId, businessId);

        if (!memberShip) {
            throw new Error("Not a member")
        }

        const date = await supabaseDate();

        const { data, error } = await supabase
            .from("sales")
            .select("total_amount")
            .eq("date", date)
            .eq("sold_by", userId)
            .eq("business_id", businessId);
        if (error) {
            throw error;
        }

        const total = data?.reduce((sum, row) => sum + (row.total_amount || 0), 0) || 0;

        return { success: true, total };

    } catch (err) {
        return { success: false, error: err };
    }
}


// Day Owner
// Get Total Sales business owners -- date format: 2025-04-18
export async function getTotalSalesForDay(
    userId: string,
    businessId: string,
    date: string
) {
    try {
        if (!userId) {
            throw new Error("User is not logged in");
        }

        const memberShip = await checkMembership(userId, businessId);

        if (!memberShip) {
            throw new Error("Not a member");
        }

        const { data, error } = await supabase
            .from("sales_amount_per_day")
            .select("total_income")
            .eq("date", date)
            .eq("business_id", businessId);

        if (error) {
            throw error;
        }

        const { data: salesData, error: dataPerDayError } = await supabase
            .from("sales")
            .select("total_amount, time")
            .eq("date", date)
            .eq("business_id", businessId);
            
        if (dataPerDayError) {
            throw dataPerDayError;
        }

        const salesBy4Hr: { [key: string]: number } = {};

        salesData?.forEach(({ total_amount, time }) => {
            const saleTime = normalizeTime(date, time);
            const hour = saleTime.getHours();
            const groupStart = Math.floor(hour / 4) * 4;
            const intervalKey = `${groupStart}hrs`;

            if (!salesBy4Hr[intervalKey]) {
                salesBy4Hr[intervalKey] = 0;
            }

            salesBy4Hr[intervalKey] += total_amount;
        });

        const salesByInterval = Object.entries(salesBy4Hr)
            .map(([interval, total]) => ({ interval, total }))
            .sort((a, b) => parseInt(a.interval.split(":")[0]) - parseInt(b.interval.split(":")[0]));
        

        const total = data && data[0] ? data[0].total_income : 0;

        return { success: true, total, salesByInterval};

    } catch (err) {
        return { success: false, error: err };
    }
}

// Get Total Sales for Business Owners -- date format: 2025-04-18
export async function getProfitForDay(
    userId: string,
    businessId: string,
    date: string
) {
    try {
        if (!userId) {
            throw new Error("User is not logged in");
        }

        const memberShip = await checkMembership(userId, businessId);

        if (!memberShip) {
            throw new Error("Not a member");
        }

        const { data, error } = await supabase
            .from("sales_amount_per_day")
            .select("total_income, total_investment")
            .eq("date", date)
            .eq("business_id", businessId);

        if (error) {
            throw error;
        }

        const { data: salesData, error: dataPerDayError } = await supabase
            .from("sales")
            .select("total_amount, time, total_base_cost")
            .eq("date", date)
            .eq("business_id", businessId);
            
        if (dataPerDayError) {
            throw dataPerDayError;
        }

        const salesWithProfit = salesData?.map((sale) => {
            const profit = (sale.total_amount || 0) - (sale.total_base_cost || 0);
            return {
                time: sale.time,
                profit
            };
        }) || [];

        // Group profit by 4-hour intervals
        const profitBy4Hr: { [key: string]: number } = {};

        salesWithProfit.forEach(({ time, profit }) => {
            const saleTime = normalizeTime(date, time);
            const hour = saleTime.getHours();
            const groupStart = Math.floor(hour / 4) * 4;
            const intervalKey = `${groupStart}hrs`;
            
            if (!profitBy4Hr[intervalKey]) {
                profitBy4Hr[intervalKey] = 0;
            }

            profitBy4Hr[intervalKey] += profit;
        });

        const profitByInterval = Object.entries(profitBy4Hr)
            .map(([interval, total]) => ({ interval, total }))
            .sort((a, b) => parseInt(a.interval.split(":")[0]) - parseInt(b.interval.split(":")[0]));

        // Sum both total_income and total_investment
        const total = data?.reduce((sum, row) => 
            sum + (row.total_income || 0) - (row.total_investment || 0), 0) || 0;

        console.log("results: ", total, profitByInterval)

        return { success: true, total, profitByInterval};

    } catch (err) {
        return { success: false, error: err}
    }
}

// Get Most Sold Items for a day -- date format: 2025-04-18
export async function getMostSoldItemsForDay(
    userId: string,
    businessId: string,
    date: string // Takes date as a parameter
) {
    try {
        if (!userId) {
            throw new Error("User is not logged in");
        }

        const memberShip = await checkMembership(userId, businessId);

        if (!memberShip) {
            throw new Error("Not a member");
        }

        const { data, error } = await supabase
            .rpc("get_most_sold_items_for_day", {

                p_business_id: businessId,  
                p_date: date
            });

        if (error) {
            throw error;
        }

        return { success: true, data };

    } catch (err) {
        return { success: false, error: err };
    }
}


// Week Owner
// Get Total Sales Week RPC
export async function getTotalSalesForWeek(
    userId: string,
    businessId: string,
    weekNumber: number // Takes week number (1 to 4)
) {
    try {
        if (!userId) {
            throw new Error("User is not logged in");
        }

        const memberShip = await checkMembership(userId, businessId);

        if (!memberShip) {
            throw new Error("Not a member");
        }

        // Fetch the current date based on Philippine timezone
        const date = await supabaseDate();
        if (!date) {
            throw new Error("Failed to fetch the current date");
        }

        const currentDate = new Date(date); // Use the fetched date
        console.log(currentDate)
        const month = currentDate.getMonth();  // 0 to 11 (January is 0)
        const year = currentDate.getFullYear();

        // Calculate start and end dates of the week based on weekNumber
        const startDate = getStartDateOfWeek(year, month, weekNumber);
        const endDate = getEndDateOfWeek(year, month, weekNumber);

        // Call the RPC function to get total sales for the given date range
        const { data, error } = await supabase.rpc("get_total_sales", {
            business_id: businessId,
            start_date: startDate,
            end_date: endDate
        });

        if (error) {
            throw error;
        }
        const result = {
            dailySales: data[0]?.daily_sales,
            totalSales: data[0]?.total_sales
        };

        console.log('weekly sale result',result)

        return { success: true, result };
    } catch (err) {
        return { success: false, error: err };
    }
}

// Get Profit for Week (Income - Investment)
export async function getProfitForWeek(
    userId: string,
    businessId: string,
    weekNumber: number
) {
    try {
        if (!userId) {
            throw new Error("User is not logged in");
        }

        const memberShip = await checkMembership(userId, businessId);

        if (!memberShip) {
            throw new Error("Not a member");
        }

        // Fetch the current date based on Philippine timezone
        const date = await supabaseDate();
        if (!date) {
            throw new Error("Failed to fetch the current date");
        }

        const currentDate = new Date(date); // Use the fetched date
        const month = currentDate.getMonth();  // 0 to 11 (January is 0)
        const year = currentDate.getFullYear();

        // Calculate start and end dates of the week based on weekNumber
        const startDate = getStartDateOfWeek(year, month, weekNumber);
        const endDate = getEndDateOfWeek(year, month, weekNumber);

        const { data, error } = await supabase.rpc("get_total_income", {
            p_business_id: businessId,
            p_start_date: startDate,
            p_end_date: endDate
        });

        if (error) {
            throw error;
        }

        const result = {
            profit: data?.profit,
            dailyProfit: data?.daily_profit || null 
        }

        return { success: true, result };
    } catch (err) {
        return { success: false, error: err };
    }
}

// Get Most Sold Items Week RPC
export async function getMostSoldItemsForWeek(
    userId: string,
    businessId: string,
    weekNumber: number
) {
    try {
        if (!userId) {
            throw new Error("User is not logged in");
        }

        const memberShip = await checkMembership(userId, businessId);

        if (!memberShip) {
            throw new Error("Not a member");
        }

        // Fetch the current date based on Philippine timezone
        const date = await supabaseDate();
        if (!date) {
            throw new Error("Failed to fetch the current date");
        }

        const currentDate = new Date(date); // Use the fetched date
        const month = currentDate.getMonth();  // 0 to 11 (January is 0)
        const year = currentDate.getFullYear();

        // Calculate start and end dates of the week based on weekNumber
        const startDate = getStartDateOfWeek(year, month, weekNumber);
        const endDate = getEndDateOfWeek(year, month, weekNumber);

        const { data, error } = await supabase
        .rpc('get_top_selling_products', {
            p_business_id: businessId,
            p_start_date: startDate,
            p_end_date: endDate
        });

        if (error) {
            throw error;
        }

        return { success: true, data };

    } catch (err) {
        return { success: false, error: err };
    }
}   


// Month Owner
// Get Total Sales for the Current Month RPC
export async function getTotalSalesForMonth(
    userId: string,
    businessId: string
) {
    try {
        if (!userId) {
            throw new Error("User is not logged in");
        }

        const memberShip = await checkMembership(userId, businessId);

        if (!memberShip) {
            throw new Error("Not a member");
        }

        // Fetch the current date in Philippine timezone
        const date = await supabaseDate();
        if (!date) {
            throw new Error("Failed to fetch the current date");
        }

        const currentDate = new Date(date);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-based (January = 0)

        // Get first day of the month
        const startDate = new Date(year, month, 1).toISOString().split('T')[0];

        // Get last day of the month
        const lastDay = new Date(year, month + 1, 0).getDate(); // gets last date of current month
        const endDate = new Date(year, month, lastDay).toISOString().split('T')[0];

        // Call the RPC function to get total sales for the given date range
        const { data, error } = await supabase.rpc("get_total_sales", {
            business_id: businessId,
            start_date: startDate,
            end_date: endDate
        });

        if (error) {
            throw error;
        }

        const dailySales = data[0]?.daily_sales || [];

        // 🧠 Grouping by week
        const weeklySalesMap: Record<string, number> = {};

        for (const day of dailySales) {
        const dateObj = parseISO(day.date);
        const dayOfMonth = getDate(dateObj);
        const weekNumber = Math.ceil(dayOfMonth / 7);
        const weekLabel = `Week ${weekNumber}`;

        weeklySalesMap[weekLabel] = (weeklySalesMap[weekLabel] || 0) + day.total_income;}

        const weeklySales = Object.entries(weeklySalesMap).map(([week, total_income]) => ({
            week,
            total_income,
        }));

        const result = {
            weeklySales,
            totalSales: data[0]?.total_sales,
        };

        return { success: true, result};

    } catch (err) {
        return { success: false, error: err };
    }
}

// Get Profit for Week (Income - Investment)
export async function getProfitForMonth(
    userId: string,
    businessId: string,
) {
    try {
        if (!userId) {
            throw new Error("User is not logged in");
        }

        const memberShip = await checkMembership(userId, businessId);

        if (!memberShip) {
            throw new Error("Not a member");
        }

        // Fetch the current date in Philippine timezone
        const date = await supabaseDate();
        if (!date) {
            throw new Error("Failed to fetch the current date");
        }

        const currentDate = new Date(date);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-based (January = 0)

        // Get first day of the month
        const startDate = new Date(year, month, 1).toISOString().split('T')[0];

        // Get last day of the month
        const lastDay = new Date(year, month + 1, 0).getDate(); // gets last date of current month
        const endDate = new Date(year, month, lastDay).toISOString().split('T')[0];

        const { data, error } = await supabase.rpc("get_total_income", {
            p_business_id: businessId,
            p_start_date: startDate,
            p_end_date: endDate
        });

        if (error) {
            throw error;
        }

        const dailyProfit = data?.daily_profit || [];

        const weeklyProfitMap: Record<string, number> = {};

        for (const day of dailyProfit) {
            console.log(day)
            const dateObj = parseISO(day.date);
            const dayOfMonth = getDate(dateObj);
            const weekNumber = Math.ceil(dayOfMonth / 7);
            const weekLabel = `Week ${weekNumber}`;

            weeklyProfitMap[weekLabel] = (weeklyProfitMap[weekLabel] || 0) + day.daily_profit;
        }

        const weeklyProfit = Object.entries(weeklyProfitMap).map(([week, total_profit]) => ({
            week,
            total_profit,
        }));

        const result = {
            profit: data?.profit,
            weeklyProfit,
        };

        return { success: true, result };
    } catch (err) {
        return { success: false, error: err };
    }
}

// Get Most Sold Items Month RPC
export async function getMostSoldItemsForMonth(
    userId: string,
    businessId: string,
) {
    try {
        if (!userId) {
            throw new Error("User is not logged in");
        }

        const memberShip = await checkMembership(userId, businessId);

        if (!memberShip) {
            throw new Error("Not a member");
        }

        // Fetch the current date based on Philippine timezone
        const date = await supabaseDate();
        if (!date) {
            throw new Error("Failed to fetch the current date");
        }

        const currentDate = new Date(date);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-based (January = 0)

        // Get first day of the month
        const startDate = new Date(year, month, 1).toISOString().split('T')[0];

        // Get last day of the month
        const lastDay = new Date(year, month + 1, 0).getDate(); // gets last date of current month
        const endDate = new Date(year, month, lastDay).toISOString().split('T')[0];

        const { data, error } = await supabase.rpc("get_top_selling_products", {
            p_business_id: businessId,
            p_start_date: startDate,
            p_end_date: endDate
          });

          console.log(data)

        if (error) {
            throw error;
        }

        return { success: true, data };

    } catch (err) {
        return { success: false, error: err };
    }
}   
