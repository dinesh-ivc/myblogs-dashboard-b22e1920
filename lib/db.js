import { createAdminClient } from '@/lib/supabase/server';

/**
 * Database utility functions for common operations
 */

/**
 * Execute a raw SQL query (use with caution)
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
export async function executeQuery(query, params = []) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc('exec_sql', {
      query_text: query,
      params: params
    });

    if (error) {
      console.error('Database query error:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error executing query:', error);
    return { data: null, error };
  }
}

/**
 * Get a single record by ID
 * @param {string} table - Table name
 * @param {string} id - Record ID
 * @returns {Promise<Object>} Record or null
 */
export async function getById(table, id) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching ${table} by ID:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getById:', error);
    return null;
  }
}

/**
 * Get all records from a table with optional filtering
 * @param {string} table - Table name
 * @param {Object} filters - Filter conditions
 * @param {Object} options - Query options (limit, order)
 * @returns {Promise<Array>} Array of records
 */
export async function getAll(table, filters = {}, options = {}) {
  try {
    const supabase = createAdminClient();
    let query = supabase.from(table).select('*');

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    // Apply limit
    if (options.limit) {
      query = query.limit(options.limit);
    }

    // Apply ordering
    if (options.orderBy) {
      query = query.order(options.orderBy, {
        ascending: options.ascending !== false
      });
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching ${table}:`, error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAll:', error);
    return [];
  }
}

/**
 * Insert a new record
 * @param {string} table - Table name
 * @param {Object} data - Record data
 * @returns {Promise<Object>} Inserted record or null
 */
export async function insert(table, data) {
  try {
    const supabase = createAdminClient();
    const { data: record, error } = await supabase
      .from(table)
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error(`Error inserting into ${table}:`, error);
      throw error;
    }

    return record;
  } catch (error) {
    console.error('Error in insert:', error);
    throw error;
  }
}

/**
 * Update a record by ID
 * @param {string} table - Table name
 * @param {string} id - Record ID
 * @param {Object} data - Updated data
 * @returns {Promise<Object>} Updated record or null
 */
export async function update(table, id, data) {
  try {
    const supabase = createAdminClient();
    const { data: record, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating ${table}:`, error);
      throw error;
    }

    return record;
  } catch (error) {
    console.error('Error in update:', error);
    throw error;
  }
}

/**
 * Delete a record by ID
 * @param {string} table - Table name
 * @param {string} id - Record ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteById(table, id) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting from ${table}:`, error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteById:', error);
    throw error;
  }
}

/**
 * Count records in a table with optional filtering
 * @param {string} table - Table name
 * @param {Object} filters - Filter conditions
 * @returns {Promise<number>} Record count
 */
export async function count(table, filters = {}) {
  try {
    const supabase = createAdminClient();
    let query = supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { count, error } = await query;

    if (error) {
      console.error(`Error counting ${table}:`, error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error in count:', error);
    return 0;
  }
}