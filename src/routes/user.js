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
