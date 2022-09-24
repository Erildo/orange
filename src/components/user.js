import { supabase } from '$lib/supabaseClient';

export async function getUser(userid){
    try {
        let { data, error, status } = await supabase
            .from('profiles')
            .select('*')
            .eq('p_id', userid);

        if (error) throw error;
        return data
    } catch (error) {
        console.log(error);
    }
}
export async function getUser2(username){
    try {
        let { data, error, status } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_name', username);

        if (error) throw error;
        return data
    } catch (error) {
        console.log(error);
    }
}