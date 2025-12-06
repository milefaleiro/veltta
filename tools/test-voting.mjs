// Script para aplicar fix no Supabase via API
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('SUPA')));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testVoting() {
    console.log('Testing vote system...');
    
    // 1. Get a suggestion to test
    const { data: suggestions, error: sugError } = await supabase
        .from('cocreate_suggestions')
        .select('*')
        .limit(1);
    
    if (sugError) {
        console.error('Error fetching suggestions:', sugError);
        return;
    }
    
    console.log('Suggestions:', suggestions);
    
    if (suggestions.length === 0) {
        console.log('No suggestions found');
        return;
    }
    
    const testId = suggestions[0].id;
    const testVoterId = 'test_voter_' + Date.now();
    
    console.log('Testing with suggestion:', testId);
    console.log('Current votes:', suggestions[0].votes);
    
    // 2. Try to insert a vote
    const { data: voteData, error: voteError } = await supabase
        .from('cocreate_votes')
        .insert({ suggestion_id: testId, voter_identifier: testVoterId })
        .select();
    
    console.log('Vote insert result:', { voteData, voteError });
    
    // 3. Try to call RPC
    const { data: rpcData, error: rpcError } = await supabase
        .rpc('increment_suggestion_votes', { suggestion_uuid: testId });
    
    console.log('RPC result:', { rpcData, rpcError });
    
    // 4. Check new vote count
    const { data: updatedSuggestion, error: updateError } = await supabase
        .from('cocreate_suggestions')
        .select('votes')
        .eq('id', testId)
        .single();
    
    console.log('Updated votes:', updatedSuggestion?.votes, 'Error:', updateError);
    
    // 5. Clean up test vote
    await supabase
        .from('cocreate_votes')
        .delete()
        .eq('voter_identifier', testVoterId);
    
    // Decrement the vote back
    await supabase
        .from('cocreate_suggestions')
        .update({ votes: suggestions[0].votes })
        .eq('id', testId);
    
    console.log('Cleanup done');
}

testVoting();
