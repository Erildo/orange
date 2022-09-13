import { writable } from 'svelte/store';

export const suser = writable(supabase.auth.session());