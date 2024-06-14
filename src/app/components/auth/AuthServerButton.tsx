import { supabaseServer } from '@/lib/supabase/supabaseServer'
import React from 'react'
import AuthClientButton from './AuthClientButton';

/**
 * サーバーコンポーネント用認証ボタン
 * @returns JSX
 */
const AuthServerButton = async () => {
  const supabase = supabaseServer();
  const { data: {user} } = await supabase.auth.getUser();

  return (
    <AuthClientButton session={user ? { user } : null} />
  )
}

export default AuthServerButton